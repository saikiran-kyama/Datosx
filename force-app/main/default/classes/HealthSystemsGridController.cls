public with sharing class HealthSystemsGridController {

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
                if(nm.contains('content')){
                    profileRequiresContent.put(ps.ProfileId, true);
                }
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
            pi.requiresContent = profileRequiresContent.containsKey(p.Id) ? true : false;
            out.add(pi);
        }
        return out;
    }

    @AuraEnabled(cacheable=true)
    public static List<UserRole> getRoles(){
        return [SELECT Id, Name FROM UserRole ORDER BY Name];
    }

    @AuraEnabled(cacheable=false)
    public static List<HealthSystemWrapper> getHealthSystems(){
        List<Health_System__c> hsList = [SELECT Id, Name, User__c, User__r.Id, User__r.Username, User__r.Email, User__r.Alias, User__r.FirstName, User__r.LastName, Profile__c, Role__c, License__c, Status__c, City__c, State__c, Phone__c, Contact_Person__c, Specialities__c FROM Health_System__c ORDER BY Name];
        List<HealthSystemWrapper> out = new List<HealthSystemWrapper>();
        for(Health_System__c h : hsList){
            HealthSystemWrapper w = new HealthSystemWrapper();
            w.id = h.Id;
            w.name = h.Name;
            w.userId = h.User__c;
            w.username = h.User__r != null ? h.User__r.Username : null;
            w.email = h.User__r != null ? h.User__r.Email : null;
            w.alias = h.User__r != null ? h.User__r.Alias : null;
            w.firstName = h.User__r != null ? h.User__r.FirstName : null;
            w.lastName = h.User__r != null ? h.User__r.LastName : null;
            w.profileName = h.Profile__c;
            w.roleName = h.Role__c;
            w.licenseName = h.License__c;
            w.status = h.Status__c;
            w.city = h.City__c;
            w.state = h.State__c;
            w.phone = h.Phone__c;
            w.contact = h.Contact_Person__c;
            // map specialities (comma-separated stored on the record) into a list
            if(h.Specialities__c != null){
                List<String> parts = new List<String>();
                for(String p : h.Specialities__c.split(',')){
                    if(p != null) parts.add(p.trim());
                }
                w.specialities = parts;
            } else {
                w.specialities = new List<String>();
            }
            out.add(w);
        }
        return out;
    }

        @AuraEnabled(cacheable=true)
        public static HealthSystemWrapper getCurrentHealthSystem(){
            List<Health_System__c> hsList = [SELECT Id, Name, User__c, User__r.Id, User__r.Username, User__r.Email, User__r.Alias, User__r.FirstName, User__r.LastName, Profile__c, Role__c, License__c, Status__c, City__c, State__c, Phone__c, Contact_Person__c, Specialities__c
                                               FROM Health_System__c WHERE User__c = :System.UserInfo.getUserId() LIMIT 1];
            if(hsList.isEmpty()) return null;
            Health_System__c h = hsList[0];
            HealthSystemWrapper w = new HealthSystemWrapper();
            w.id = h.Id;
            w.name = h.Name;
            w.userId = h.User__c;
            w.username = h.User__r != null ? h.User__r.Username : null;
            w.email = h.User__r != null ? h.User__r.Email : null;
            w.alias = h.User__r != null ? h.User__r.Alias : null;
            w.firstName = h.User__r != null ? h.User__r.FirstName : null;
            w.lastName = h.User__r != null ? h.User__r.LastName : null;
            w.profileName = h.Profile__c;
            w.roleName = h.Role__c;
            w.licenseName = h.License__c;
            w.status = h.Status__c;
            w.city = h.City__c;
            w.state = h.State__c;
            w.phone = h.Phone__c;
            w.contact = h.Contact_Person__c;
            if(h.Specialities__c != null){
                List<String> parts = new List<String>();
                for(String p : h.Specialities__c.split(',')){
                    if(p != null) parts.add(p.trim());
                }
                w.specialities = parts;
            } else {
                w.specialities = new List<String>();
            }
            return w;
        }

    public class HealthSystemWrapper{
        @AuraEnabled public Id id;
        @AuraEnabled public String name;
        @AuraEnabled public Id userId;
        @AuraEnabled public String username;
        @AuraEnabled public String email;
        @AuraEnabled public String alias;
        @AuraEnabled public String firstName;
        @AuraEnabled public String lastName;
        @AuraEnabled public String profileName;
        @AuraEnabled public String roleName;
        @AuraEnabled public String licenseName;
        @AuraEnabled public String status;
        @AuraEnabled public String city;
        @AuraEnabled public String state;
        @AuraEnabled public String phone;
        @AuraEnabled public String contact;
        @AuraEnabled public List<String> specialities;
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
        if(userInput.containsKey('roleId') && userInput.get('roleId') != null){
            u.UserRoleId = (String) userInput.get('roleId');
        }

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

    // Create User and queue Health_System__c creation to avoid mixed DML
    @AuraEnabled
    public static CreateResult createUserWithHealthSystem(Map<String, Object> userInput, Map<String, Object> hsInput){
        if(userInput == null) userInput = new Map<String, Object>();
        if(hsInput == null) hsInput = new Map<String, Object>();
        // Enforce FirstName blank and LastName derived from Health System name
        String hsName = (String) hsInput.get('name');
        if(hsName == null || hsName.trim().length() == 0){
            hsName = 'HealthSystem';
        }
        userInput.put('firstName', null);
        userInput.put('lastName', hsName);

        Id userId = createUser(userInput);

        // Queue the creation of non-setup Health_System__c in a separate transaction to avoid MIXED_DML_OPERATION
        System.enqueueJob(new CreateHealthSystemJob(userId, hsInput));

        CreateResult res = new CreateResult();
        res.userId = userId;
        // healthSystemId will be created asynchronously
        res.healthSystemId = null;
        return res;
    }

    // Queueable job to create Health_System__c after user is inserted
    public class CreateHealthSystemJob implements Queueable, Database.AllowsCallouts {
        private Id userId;
        private Map<String, Object> hsInput;
        public CreateHealthSystemJob(Id userId, Map<String, Object> hsInput){
            this.userId = userId;
            this.hsInput = hsInput;
        }
        public void execute(QueueableContext ctx){
            try{
                Health_System__c hs = new Health_System__c();
                hs.Name = (String) hsInput.get('name') != null ? (String) hsInput.get('name') : ('HS ' + Datetime.now().getTime());
                hs.User__c = this.userId;
                hs.Profile__c = (String) hsInput.get('profileName');
                hs.Role__c = (String) hsInput.get('roleName');
                hs.License__c = (String) hsInput.get('licenseName');
                String status = (String) hsInput.get('status');
                if(status != null) hs.Status__c = status;
                hs.City__c = (String) hsInput.get('city');
                hs.State__c = (String) hsInput.get('state');
                hs.Phone__c = (String) hsInput.get('phone');
                hs.Contact_Person__c = (String) hsInput.get('contact');
                // accept specialities as a list or a single string
                Object spObj = hsInput.get('specialities');
                if(spObj != null){
                    if(spObj instanceof List<Object>){
                        List<Object> oList = (List<Object>) spObj;
                        List<String> sList = new List<String>();
                        for(Object o : oList) sList.add(String.valueOf(o));
                        if(!sList.isEmpty()) hs.Specialities__c = String.join(sList, ', ');
                    } else if(spObj instanceof String){
                        hs.Specialities__c = (String) spObj;
                    }
                }
                insert hs;
            }catch(Exception e){
                // swallow or log; we cannot surface back to original caller
                System.debug('CreateHealthSystemJob failed: ' + e.getMessage());
            }
        }
    }

    @AuraEnabled
    public static void updateUserStatus(Id userId, Boolean isActive, Id healthSystemId, String status){
        // If both User (setup) and Health_System__c (non-setup) must be updated,
        // perform the User update synchronously and queue the Health_System__c update
        // to avoid MIXED_DML_OPERATION.
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

        if(healthSystemId != null && status != null){
            if(userId != null){
                // queue the Health System update to avoid mixed DML
                try{
                    System.enqueueJob(new UpdateHealthSystemJob(healthSystemId, status));
                }catch(Exception e){
                    // cannot surface queued job errors reliably to caller; log and throw a friendly message
                    System.debug('Failed to enqueue UpdateHealthSystemJob: ' + e.getMessage());
                    throw new AuraHandledException('Failed to schedule Health System status update.');
                }
            } else {
                try{
                    Health_System__c hs = new Health_System__c(Id = healthSystemId, Status__c = status);
                    update hs;
                }catch(Exception e){
                    throw new AuraHandledException('Failed to update Health System status: ' + e.getMessage());
                }
            }
        }
    }

    @AuraEnabled
    public static void updateUserAndHealthSystem(Map<String, Object> payload){
        if(payload == null) throw new AuraHandledException('Missing payload');

        Id userId = payload.containsKey('userId') && payload.get('userId') != null ? (Id) payload.get('userId') : null;
        Id hsId = payload.containsKey('healthSystemId') && payload.get('healthSystemId') != null ? (Id) payload.get('healthSystemId') : null;

        // Update User synchronously (setup object)
        if(userId != null){
            try{
                User u = [SELECT Id, FirstName, LastName, Email FROM User WHERE Id = :userId LIMIT 1];
                Boolean needsUpdate = false;
                String enforcedLastName = null;
                if(payload.containsKey('name') && payload.get('name') != null){
                    enforcedLastName = (String) payload.get('name');
                } else if(payload.containsKey('lastName')){
                    enforcedLastName = (String) payload.get('lastName');
                }
                // Always keep FirstName blank for Health System users
                if(u.FirstName != null){ u.FirstName = null; needsUpdate = true; }
                if(enforcedLastName != null && enforcedLastName != u.LastName){ u.LastName = enforcedLastName; needsUpdate = true; }
                if(payload.containsKey('email')){
                    String em = (String) payload.get('email');
                    if(em != null && em != u.Email){ u.Email = em; needsUpdate = true; }
                }
                if(needsUpdate){ update u; }
            }catch(Exception e){
                throw new AuraHandledException('Failed to update User: ' + e.getMessage());
            }
        }

        // Queue Health_System__c update for non-setup fields to avoid mixed DML
        if(hsId != null){
            try{
                System.enqueueJob(new UpdateHealthSystemFullJob(hsId, payload));
            }catch(Exception e){
                throw new AuraHandledException('Failed to schedule Health System update: ' + e.getMessage());
            }
        }
    }

    // Queueable job to update multiple Health_System__c fields
    public class UpdateHealthSystemFullJob implements Queueable, Database.AllowsCallouts {
        private Id hsId;
        private Map<String, Object> payload;
        public UpdateHealthSystemFullJob(Id hsId, Map<String, Object> payload){
            this.hsId = hsId;
            this.payload = payload;
        }
        public void execute(QueueableContext ctx){
            try{
                if(this.hsId == null) return;
                Health_System__c hs = new Health_System__c(Id = this.hsId);
                if(payload.containsKey('name') && payload.get('name') != null) hs.Name = (String) payload.get('name');
                if(payload.containsKey('status') && payload.get('status') != null) hs.Status__c = (String) payload.get('status');
                if(payload.containsKey('city') && payload.get('city') != null) hs.City__c = (String) payload.get('city');
                if(payload.containsKey('state') && payload.get('state') != null) hs.State__c = (String) payload.get('state');
                if(payload.containsKey('phone') && payload.get('phone') != null) hs.Phone__c = (String) payload.get('phone');
                if(payload.containsKey('contact') && payload.get('contact') != null) hs.Contact_Person__c = (String) payload.get('contact');
                if(payload.containsKey('profileName') && payload.get('profileName') != null) hs.Profile__c = (String) payload.get('profileName');
                if(payload.containsKey('roleName') && payload.get('roleName') != null) hs.Role__c = (String) payload.get('roleName');
                if(payload.containsKey('licenseName') && payload.get('licenseName') != null) hs.License__c = (String) payload.get('licenseName');
                if(payload.containsKey('specialities') && payload.get('specialities') != null){
                    Object spObj = payload.get('specialities');
                    if(spObj instanceof List<Object>){
                        List<Object> oList = (List<Object>) spObj;
                        List<String> sList = new List<String>();
                        for(Object o : oList) sList.add(String.valueOf(o));
                        if(!sList.isEmpty()) hs.Specialities__c = String.join(sList, ', ');
                    } else if(spObj instanceof String){
                        hs.Specialities__c = (String) spObj;
                    }
                }
                update hs;
            }catch(Exception e){
                System.debug('UpdateHealthSystemFullJob failed: ' + e.getMessage());
            }
        }
    }

    public class CreateResult{
        @AuraEnabled public Id userId;
        @AuraEnabled public Id healthSystemId;
    }

    // Queueable job to update Health_System__c in a separate transaction
    public class UpdateHealthSystemJob implements Queueable {
        private Id hsId;
        private String status;
        public UpdateHealthSystemJob(Id hsId, String status){
            this.hsId = hsId;
            this.status = status;
        }
        public void execute(QueueableContext ctx){
            try{
                if(this.hsId != null){
                    Health_System__c hs = new Health_System__c(Id = this.hsId, Status__c = this.status);
                    update hs;
                }
            }catch(Exception e){
                System.debug('UpdateHealthSystemJob failed: ' + e.getMessage());
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

}
