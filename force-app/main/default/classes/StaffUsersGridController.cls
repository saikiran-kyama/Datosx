public with sharing class StaffUsersGridController {

    @AuraEnabled(cacheable=true)
    public static List<ProfileInfo> getProfiles(){
        List<Profile> profs = [SELECT Id, Name, UserLicense.Name, UserLicense.TotalLicenses, UserLicense.UsedLicenses, UserLicenseId FROM Profile ORDER BY Name];
        List<ProfileInfo> out = new List<ProfileInfo>();
        Set<Id> profileIds = new Set<Id>();
        for(Profile p : profs) profileIds.add(p.Id);

        Map<Id, Boolean> profileRequiresContent = new Map<Id, Boolean>();
        if(!profileIds.isEmpty()){
            for(PermissionSet ps : [SELECT Id, Name, Label, IsOwnedByProfile, ProfileId FROM PermissionSet WHERE IsOwnedByProfile = true AND ProfileId IN :profileIds]){
                String nm = (ps.Name != null ? ps.Name.toLowerCase() : '') + ' ' + (ps.Label != null ? ps.Label.toLowerCase() : '');
                if(nm.contains('content')) profileRequiresContent.put(ps.ProfileId, true);
            }
        }

        for(Profile p : profs){
            ProfileInfo pi = new ProfileInfo();
            pi.id = p.Id;
            pi.name = p.Name;
            if(p.UserLicenseId != null){
                pi.licenseName = p.UserLicense != null ? p.UserLicense.Name : null;
                Integer total = p.UserLicense != null ? (Integer)p.UserLicense.TotalLicenses : null;
                Integer used = p.UserLicense != null ? (Integer)p.UserLicense.UsedLicenses : null;
                if(total != null && used != null){
                    pi.totalLicenses = total;
                    pi.usedLicenses = used;
                    pi.availableCount = Math.max(0, total - used);
                    pi.available = (pi.availableCount > 0);
                }
            }
            pi.requiresContent = profileRequiresContent.containsKey(p.Id);
            out.add(pi);
        }
        return out;
    }

    @AuraEnabled(cacheable=true)
    public static List<UserRole> getRoles(){
        return [SELECT Id, Name FROM UserRole ORDER BY Name];
    }

    @AuraEnabled(cacheable=true)
    public static List<LicenseInfo> getLicenses(){
        List<UserLicense> lics = [SELECT Id, Name, TotalLicenses, UsedLicenses FROM UserLicense ORDER BY Name];
        List<LicenseInfo> out = new List<LicenseInfo>();
        for(UserLicense ul : lics){
            LicenseInfo li = new LicenseInfo();
            li.id = ul.Id;
            li.name = ul.Name;
            li.totalLicenses = ul.TotalLicenses;
            li.usedLicenses = ul.UsedLicenses;
            if(ul.TotalLicenses != null && ul.UsedLicenses != null){
                li.availableCount = Math.max(0, ul.TotalLicenses - ul.UsedLicenses);
            }
            li.available = li.availableCount > 0;
            out.add(li);
        }
        return out;
    }

    @AuraEnabled(cacheable=false)
    public static List<StaffUserWrapper> getStaffUsers(){
        List<Staff_User__c> suList = [SELECT Id, Name, User__c, User__r.Id, User__r.Username, User__r.Email, User__r.Alias, User__r.FirstName, User__r.LastName, User__r.Phone, Profile__c, Role__c, License__c, Status__c, Phone__c FROM Staff_User__c ORDER BY Name];
        List<StaffUserWrapper> out = new List<StaffUserWrapper>();
        for(Staff_User__c s : suList){
            StaffUserWrapper w = new StaffUserWrapper();
            w.id = s.Id;
            w.name = s.Name;
            w.userId = s.User__c;
            w.username = s.User__r != null ? s.User__r.Username : null;
            w.email = s.User__r != null ? s.User__r.Email : null;
            w.alias = s.User__r != null ? s.User__r.Alias : null;
            w.firstName = s.User__r != null ? s.User__r.FirstName : null;
            w.lastName = s.User__r != null ? s.User__r.LastName : null;
            w.phone = s.User__r != null ? s.User__r.Phone : s.Phone__c;
            w.profileName = s.Profile__c;
            w.roleName = s.Role__c;
            w.licenseName = s.License__c;
            w.status = s.Status__c;
            out.add(w);
        }
        return out;
    }

    @AuraEnabled
    public static void updateUserAndStaff(Map<String, Object> payload){
        if(payload == null) throw new AuraHandledException('Missing payload');

        Id userId = payload.containsKey('userId') && payload.get('userId') != null ? (Id) payload.get('userId') : null;
        Id staffId = payload.containsKey('staffUserId') && payload.get('staffUserId') != null ? (Id) payload.get('staffUserId') : null;

        // Update User synchronously
        if(userId != null){
            try{
                User u = [SELECT Id, FirstName, LastName, Email, Phone FROM User WHERE Id = :userId LIMIT 1];
                Boolean needsUpdate = false;
                if(payload.containsKey('firstName')){
                    String fn = (String) payload.get('firstName');
                    if(fn != null && fn != u.FirstName){ u.FirstName = fn; needsUpdate = true; }
                }
                if(payload.containsKey('lastName')){
                    String ln = (String) payload.get('lastName');
                    if(ln != null && ln != u.LastName){ u.LastName = ln; needsUpdate = true; }
                }
                if(payload.containsKey('email')){
                    String em = (String) payload.get('email');
                    if(em != null && em != u.Email){ u.Email = em; needsUpdate = true; }
                }
                if(payload.containsKey('phone')){
                    String ph = (String) payload.get('phone');
                    if(ph != null && ph != u.Phone){ u.Phone = ph; needsUpdate = true; }
                }
                if(needsUpdate) update u;
            }catch(Exception e){
                throw new AuraHandledException('Failed to update User: ' + e.getMessage());
            }
        }

        // Queue Staff_User__c update
        if(staffId != null){
            try{
                System.enqueueJob(new UpdateStaffUserFullJob(staffId, payload));
            }catch(Exception e){
                throw new AuraHandledException('Failed to schedule Staff User update: ' + e.getMessage());
            }
        }
    }

    // Queueable to update Staff_User__c fields
    public class UpdateStaffUserFullJob implements Queueable, Database.AllowsCallouts {
        private Id staffId;
        private Map<String, Object> payload;
        public UpdateStaffUserFullJob(Id staffId, Map<String, Object> payload){
            this.staffId = staffId;
            this.payload = payload;
        }
        public void execute(QueueableContext ctx){
            try{
                if(this.staffId == null) return;
                Staff_User__c su = new Staff_User__c(Id = this.staffId);
                if(payload.containsKey('name') && payload.get('name') != null) su.Name = (String) payload.get('name');
                if(payload.containsKey('status') && payload.get('status') != null) su.Status__c = (String) payload.get('status');
                if(payload.containsKey('phone') && payload.get('phone') != null) su.Phone__c = (String) payload.get('phone');
                if(payload.containsKey('email') && payload.get('email') != null) su.Email__c = (String) payload.get('email');
                if(payload.containsKey('alias') && payload.get('alias') != null) su.Alias__c = (String) payload.get('alias');
                if(payload.containsKey('profileName') && payload.get('profileName') != null) su.Profile__c = (String) payload.get('profileName');
                if(payload.containsKey('roleName') && payload.get('roleName') != null) su.Role__c = (String) payload.get('roleName');
                if(payload.containsKey('licenseName') && payload.get('licenseName') != null) su.License__c = (String) payload.get('licenseName');
                update su;
            }catch(Exception e){
                System.debug('UpdateStaffUserFullJob failed: ' + e.getMessage());
            }
        }
    }

    public class StaffUserWrapper{
        @AuraEnabled public Id id;
        @AuraEnabled public String name;
        @AuraEnabled public Id userId;
        @AuraEnabled public String username;
        @AuraEnabled public String email;
        @AuraEnabled public String alias;
        @AuraEnabled public String firstName;
        @AuraEnabled public String lastName;
        @AuraEnabled public String phone;
        @AuraEnabled public String profileName;
        @AuraEnabled public String roleName;
        @AuraEnabled public String licenseName;
        @AuraEnabled public String status;
    }

    @AuraEnabled
    public static Id createUser(Map<String, Object> userInput){
        if (userInput == null) throw new AuraHandledException('Missing user data');

        User u = new User();
        u.FirstName = (String) userInput.get('firstName');
        u.LastName = (String) userInput.get('lastName');
        u.Email = (String) userInput.get('email');
        u.Username = (String) userInput.get('username');
        u.Alias = (String) userInput.get('alias');
        u.CommunityNickname = (String) userInput.get('communityNickname');
        u.ProfileId = (String) userInput.get('profileId');
        u.UserRoleId = (String) userInput.get('roleId');

        u.TimeZoneSidKey = (String) userInput.get('timeZone') != null ? (String) userInput.get('timeZone') : 'America/Los_Angeles';
        u.LocaleSidKey = (String) userInput.get('locale') != null ? (String) userInput.get('locale') : 'en_US';
        u.EmailEncodingKey = (String) userInput.get('emailEncoding') != null ? (String) userInput.get('emailEncoding') : 'UTF-8';
        u.LanguageLocaleKey = (String) userInput.get('language') != null ? (String) userInput.get('language') : 'en_US';

        Object activeObj = userInput.get('isActive');
        if (activeObj instanceof Boolean) u.IsActive = (Boolean) activeObj;
        else if (activeObj != null) u.IsActive = Boolean.valueOf(String.valueOf(activeObj));

        if (u.Alias == null || u.Alias.trim().length() == 0){
            String ln = u.LastName != null ? u.LastName.replaceAll('\\s','') : 'staff';
            u.Alias = ln.substring(0, Math.min(8, ln.length()));
        }

        if (u.ProfileId != null){
            Profile p = [SELECT Id, Name, UserLicense.Name, UserLicense.TotalLicenses, UserLicense.UsedLicenses FROM Profile WHERE Id = :u.ProfileId LIMIT 1];
            if(p.UserLicense != null){
                Integer total = p.UserLicense.TotalLicenses;
                Integer used = p.UserLicense.UsedLicenses;
                Integer available = (total != null && used != null) ? (total - used) : null;
                if(available != null && available <= 0){
                    String msg = 'No available licenses for profile "' + p.Name + '" (' + p.UserLicense.Name + '). Free up a license or choose another profile.';
                    throw new AuraHandledException(msg);
                }
            }
        }

        try{
            insert u;
            return u.Id;
        }catch(DmlException e){
            String err = e.getMessage();
            String lower = err != null ? err.toLowerCase() : '';
            if(lower.contains('content feature license limit exceeded') || lower.contains('content feature')){
                String friendly = 'Feature license limit exceeded for Salesforce Content.\n'
                    + 'Action: free up a Content feature license or remove Content-related permissions from the selected profile.\n'
                    + 'Check Setup → Company Information → Feature Licenses or contact Salesforce support.';
                throw new AuraHandledException(friendly + ' Original: ' + err);
            }
            if(err != null && err.contains('LICENSE_LIMIT_EXCEEDED')){
                throw new AuraHandledException('License limit exceeded for the selected profile. ' + err);
            }
            throw new AuraHandledException(err);
        }
    }

    @AuraEnabled
    public static CreateResult createUserWithStaff(Map<String, Object> userInput, Map<String, Object> staffInput){
        Id userId = createUser(userInput);
        System.enqueueJob(new CreateStaffUserJob(userId, staffInput));

        CreateResult res = new CreateResult();
        res.userId = userId;
        res.staffUserId = null;
        return res;
    }

    public class CreateStaffUserJob implements Queueable, Database.AllowsCallouts {
        private Id userId;
        private Map<String, Object> staffInput;
        public CreateStaffUserJob(Id userId, Map<String, Object> staffInput){
            this.userId = userId;
            this.staffInput = staffInput;
        }
        public void execute(QueueableContext ctx){
            try{
                Staff_User__c su = new Staff_User__c();
                su.Name = (String) staffInput.get('name') != null ? (String) staffInput.get('name') : ('Staff ' + Datetime.now().getTime());
                su.User__c = this.userId;
                su.Profile__c = (String) staffInput.get('profileName');
                su.Role__c = (String) staffInput.get('roleName');
                su.License__c = (String) staffInput.get('licenseName');
                String status = (String) staffInput.get('status');
                if(status != null) su.Status__c = status;
                su.Phone__c = (String) staffInput.get('phone');
                su.Email__c = (String) staffInput.get('email');
                su.Alias__c = (String) staffInput.get('alias');
                insert su;
            }catch(Exception e){
                System.debug('CreateStaffUserJob failed: ' + e.getMessage());
            }
        }
    }

    @AuraEnabled
    public static void updateUserStatus(Id userId, Boolean isActive, Id staffUserId, String status){
        if(userId != null){
            try{
                User u = [SELECT Id, IsActive FROM User WHERE Id = :userId LIMIT 1];
                if(u != null){
                    u.IsActive = isActive;
                    update u;
                }
            }catch(Exception e){
                throw new AuraHandledException('Failed to update User status: ' + e.getMessage());
            }
        }

        if(staffUserId != null && status != null){
            if(userId != null){
                try{
                    System.enqueueJob(new UpdateStaffUserJob(staffUserId, status));
                }catch(Exception e){
                    System.debug('Failed to enqueue UpdateStaffUserJob: ' + e.getMessage());
                    throw new AuraHandledException('Failed to schedule Staff User status update.');
                }
            } else {
                try{
                    Staff_User__c su = new Staff_User__c(Id = staffUserId, Status__c = status);
                    update su;
                }catch(Exception e){
                    throw new AuraHandledException('Failed to update Staff User status: ' + e.getMessage());
                }
            }
        }
    }

    public class CreateResult{
        @AuraEnabled public Id userId;
        @AuraEnabled public Id staffUserId;
    }

    public class UpdateStaffUserJob implements Queueable {
        private Id staffId;
        private String status;
        public UpdateStaffUserJob(Id staffId, String status){
            this.staffId = staffId;
            this.status = status;
        }
        public void execute(QueueableContext ctx){
            try{
                if(this.staffId != null){
                    Staff_User__c su = new Staff_User__c(Id = this.staffId, Status__c = this.status);
                    update su;
                }
            }catch(Exception e){
                System.debug('UpdateStaffUserJob failed: ' + e.getMessage());
            }
        }
    }

    @AuraEnabled
    public static String sendPasswordReset(Id userId){
        if(userId == null) throw new AuraHandledException('Missing userId');
        try{
            System.resetPassword(userId, true);
            return 'Password reset email sent to the new user.';
        }catch(Exception e){
            String msg = e.getMessage();
            throw new AuraHandledException('Failed to send password reset email: ' + msg);
        }
    }

    public class ProfileInfo{
        @AuraEnabled public Id id;
        @AuraEnabled public String name;
        @AuraEnabled public String licenseName;
        @AuraEnabled public Integer totalLicenses;
        @AuraEnabled public Integer usedLicenses;
        @AuraEnabled public Integer availableCount;
        @AuraEnabled public Boolean available;
        @AuraEnabled public Boolean requiresContent;
    }

    public class LicenseInfo{
        @AuraEnabled public Id id;
        @AuraEnabled public String name;
        @AuraEnabled public Integer totalLicenses;
        @AuraEnabled public Integer usedLicenses;
        @AuraEnabled public Integer availableCount;
        @AuraEnabled public Boolean available;
    }
}
