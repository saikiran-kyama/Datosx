public with sharing class SponsorsGridController {

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
    public static List<SponsorWrapper> getSponsors(){
        Map<Id, Integer> enquiryCounts = new Map<Id, Integer>();
        for(AggregateResult ar : [SELECT Sponsor__c sId, COUNT(Id) cnt FROM Enquiry__c WHERE Status__c = 'Active' GROUP BY Sponsor__c]){
            Id sid = (Id) ar.get('sId');
            Integer cnt = (Integer) ar.get('cnt');
            if(sid != null && cnt != null) enquiryCounts.put(sid, cnt);
        }
        List<Sponsor__c> sList = [SELECT Id, Name, User__c, User__r.Id, User__r.Username, User__r.Email, User__r.Alias, User__r.FirstName, User__r.LastName, Profile__c, Role__c, License__c, Status__c, City__c, State__c, Phone__c, Specialities__c, Contact_Person__c FROM Sponsor__c ORDER BY Name];
        List<SponsorWrapper> out = new List<SponsorWrapper>();
        for(Sponsor__c s : sList){
            SponsorWrapper w = new SponsorWrapper();
            w.id = s.Id;
            w.name = s.Name;
            w.userId = s.User__c;
            w.username = s.User__r != null ? s.User__r.Username : null;
            w.email = s.User__r != null ? s.User__r.Email : null;
            w.alias = s.User__r != null ? s.User__r.Alias : null;
            w.firstName = s.User__r != null ? s.User__r.FirstName : null;
            w.lastName = s.User__r != null ? s.User__r.LastName : null;
            w.contact = s.Contact_Person__c;
            w.profileName = s.Profile__c;
            w.roleName = s.Role__c;
            w.licenseName = s.License__c;
            w.status = s.Status__c;
            w.city = s.City__c;
            w.state = s.State__c;
            w.phone = s.Phone__c;
            w.enquiries = enquiryCounts.containsKey(s.Id) ? enquiryCounts.get(s.Id) : 0;
            if(s.Specialities__c != null){
                List<String> parts = new List<String>();
                for(String p : s.Specialities__c.split(',')){
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
    public static SponsorWrapper getCurrentSponsor(){
        List<Sponsor__c> sList = [SELECT Id, Name, User__c, User__r.Id, User__r.Username, User__r.Email, User__r.Alias, User__r.FirstName, User__r.LastName, Profile__c, Role__c, License__c, Status__c, City__c, State__c, Phone__c, Specialities__c, Contact_Person__c
                       FROM Sponsor__c WHERE User__c = :System.UserInfo.getUserId() LIMIT 1];
        if(sList.isEmpty()) return null;
        Sponsor__c s = sList[0];
        SponsorWrapper w = new SponsorWrapper();
        w.id = s.Id;
        w.name = s.Name;
        w.userId = s.User__c;
        w.username = s.User__r != null ? s.User__r.Username : null;
        w.email = s.User__r != null ? s.User__r.Email : null;
        w.alias = s.User__r != null ? s.User__r.Alias : null;
        w.firstName = s.User__r != null ? s.User__r.FirstName : null;
        w.lastName = s.User__r != null ? s.User__r.LastName : null;
        w.contact = s.Contact_Person__c;
        w.profileName = s.Profile__c;
        w.roleName = s.Role__c;
        w.licenseName = s.License__c;
        w.status = s.Status__c;
        w.city = s.City__c;
        w.state = s.State__c;
        w.phone = s.Phone__c;
        if(s.Specialities__c != null){
            List<String> parts = new List<String>();
            for(String p : s.Specialities__c.split(',')){
                if(p != null) parts.add(p.trim());
            }
            w.specialities = parts;
        } else {
            w.specialities = new List<String>();
        }
        return w;
    }

    public class SponsorWrapper{
        @AuraEnabled public Id id;
        @AuraEnabled public String name;
        @AuraEnabled public Id userId;
        @AuraEnabled public String username;
        @AuraEnabled public String email;
        @AuraEnabled public String alias;
        @AuraEnabled public String firstName;
        @AuraEnabled public String lastName;
        @AuraEnabled public String contact;
        @AuraEnabled public String profileName;
        @AuraEnabled public String roleName;
        @AuraEnabled public String licenseName;
        @AuraEnabled public String status;
        @AuraEnabled public String city;
        @AuraEnabled public String state;
        @AuraEnabled public String phone;
        @AuraEnabled public Integer enquiries;
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
            String ln = u.LastName != null ? u.LastName.replaceAll('\\s','') : 'sponsor';
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

    // Create User and queue Sponsor__c creation to avoid mixed DML
    @AuraEnabled
    public static CreateResult createUserWithSponsor(Map<String, Object> userInput, Map<String, Object> sInput){
        if(userInput == null) userInput = new Map<String, Object>();
        if(sInput == null) sInput = new Map<String, Object>();
        // Enforce FirstName blank and LastName from Sponsor Name
        String sponsorName = (String) sInput.get('name');
        if(sponsorName == null || sponsorName.trim().length() == 0){
            sponsorName = 'Sponsor';
        }
        userInput.put('firstName', null);
        userInput.put('lastName', sponsorName);

        Id userId = createUser(userInput);

        System.enqueueJob(new CreateSponsorJob(userId, sInput));

        CreateResult res = new CreateResult();
        res.userId = userId;
        res.sponsorId = null;
        return res;
    }

    // Queueable job to create Sponsor__c after user is inserted
    public class CreateSponsorJob implements Queueable, Database.AllowsCallouts {
        private Id userId;
        private Map<String, Object> sInput;
        public CreateSponsorJob(Id userId, Map<String, Object> sInput){
            this.userId = userId;
            this.sInput = sInput;
        }
        public void execute(QueueableContext ctx){
            try{
                Sponsor__c s = new Sponsor__c();
                s.Name = (String) sInput.get('name') != null ? (String) sInput.get('name') : ('Sponsor ' + Datetime.now().getTime());
                s.User__c = this.userId;
                s.Profile__c = (String) sInput.get('profileName');
                s.Role__c = (String) sInput.get('roleName');
                s.License__c = (String) sInput.get('licenseName');
                String status = (String) sInput.get('status');
                if(status != null) s.Status__c = status;
                s.City__c = (String) sInput.get('city');
                s.State__c = (String) sInput.get('state');
                s.Phone__c = (String) sInput.get('phone');
                s.Contact_Person__c = (String) sInput.get('contact');
                Object spObj = sInput.get('specialities');
                if(spObj != null){
                    if(spObj instanceof List<Object>){
                        List<Object> oList = (List<Object>) spObj;
                        List<String> sList = new List<String>();
                        for(Object o : oList) sList.add(String.valueOf(o));
                        if(!sList.isEmpty()) s.Specialities__c = String.join(sList, ', ');
                    } else if(spObj instanceof String){
                        s.Specialities__c = (String) spObj;
                    }
                }
                insert s;
            }catch(Exception e){
                System.debug('CreateSponsorJob failed: ' + e.getMessage());
            }
        }
    }

    @AuraEnabled
    public static void updateUserAndSponsor(Map<String, Object> payload){
        if(payload == null) throw new AuraHandledException('Missing payload');

        Id userId = payload.containsKey('userId') && payload.get('userId') != null ? (Id) payload.get('userId') : null;
        Id sId = payload.containsKey('sponsorId') && payload.get('sponsorId') != null ? (Id) payload.get('sponsorId') : null;

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
                // Keep FirstName blank for Sponsors
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

        if(sId != null){
            try{
                System.enqueueJob(new UpdateSponsorFullJob(sId, payload));
            }catch(Exception e){
                throw new AuraHandledException('Failed to schedule Sponsor update: ' + e.getMessage());
            }
        }
    }

    public class UpdateSponsorFullJob implements Queueable, Database.AllowsCallouts {
        private Id sId;
        private Map<String, Object> payload;
        public UpdateSponsorFullJob(Id sId, Map<String, Object> payload){
            this.sId = sId;
            this.payload = payload;
        }
        public void execute(QueueableContext ctx){
            try{
                if(this.sId == null) return;
                Sponsor__c s = new Sponsor__c(Id = this.sId);
                if(payload.containsKey('name') && payload.get('name') != null) s.Name = (String) payload.get('name');
                if(payload.containsKey('status') && payload.get('status') != null) s.Status__c = (String) payload.get('status');
                if(payload.containsKey('city') && payload.get('city') != null) s.City__c = (String) payload.get('city');
                if(payload.containsKey('state') && payload.get('state') != null) s.State__c = (String) payload.get('state');
                if(payload.containsKey('phone') && payload.get('phone') != null) s.Phone__c = (String) payload.get('phone');
                if(payload.containsKey('profileName') && payload.get('profileName') != null) s.Profile__c = (String) payload.get('profileName');
                if(payload.containsKey('roleName') && payload.get('roleName') != null) s.Role__c = (String) payload.get('roleName');
                if(payload.containsKey('licenseName') && payload.get('licenseName') != null) s.License__c = (String) payload.get('licenseName');
                if(payload.containsKey('specialities') && payload.get('specialities') != null){
                    Object spObj = payload.get('specialities');
                    if(spObj instanceof List<Object>){
                        List<Object> oList = (List<Object>) spObj;
                        List<String> sList = new List<String>();
                        for(Object o : oList) sList.add(String.valueOf(o));
                        if(!sList.isEmpty()) s.Specialities__c = String.join(sList, ', ');
                    } else if(spObj instanceof String){
                        s.Specialities__c = (String) spObj;
                    }
                }
                if(payload.containsKey('contact') && payload.get('contact') != null){
                    s.Contact_Person__c = (String) payload.get('contact');
                }
                update s;
            }catch(Exception e){
                System.debug('UpdateSponsorFullJob failed: ' + e.getMessage());
            }
        }
    }

    @AuraEnabled
    public static void updateUserStatus(Id userId, Boolean isActive, Id sponsorId, String status){
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

        if(sponsorId != null && status != null){
            if(userId != null){
                try{
                    System.enqueueJob(new UpdateSponsorJob(sponsorId, status));
                }catch(Exception e){
                    System.debug('Failed to enqueue UpdateSponsorJob: ' + e.getMessage());
                    throw new AuraHandledException('Failed to schedule Sponsor status update.');
                }
            } else {
                try{
                    Sponsor__c s = new Sponsor__c(Id = sponsorId, Status__c = status);
                    update s;
                }catch(Exception e){
                    throw new AuraHandledException('Failed to update Sponsor status: ' + e.getMessage());
                }
            }
        }
    }

    public class CreateResult{
        @AuraEnabled public Id userId;
        @AuraEnabled public Id sponsorId;
    }

    @AuraEnabled(cacheable=true)
    public static UserInfo getUserInfo(Id userId){
        if(userId == null) return null;
        try{
            User u = [SELECT Id, Username, Email, Alias, FirstName, LastName FROM User WHERE Id = :userId LIMIT 1];
            UserInfo ui = new UserInfo();
            ui.id = u.Id;
            ui.username = u.Username;
            ui.email = u.Email;
            ui.alias = u.Alias;
            ui.firstName = u.FirstName;
            ui.lastName = u.LastName;
            return ui;
        }catch(Exception e){
            return null;
        }
    }

    public class UserInfo{
        @AuraEnabled public Id id;
        @AuraEnabled public String username;
        @AuraEnabled public String email;
        @AuraEnabled public String alias;
        @AuraEnabled public String firstName;
        @AuraEnabled public String lastName;
    }

    // Queueable job to update Sponsor__c
    public class UpdateSponsorJob implements Queueable {
        private Id sId;
        private String status;
        public UpdateSponsorJob(Id sId, String status){
            this.sId = sId;
            this.status = status;
        }
        public void execute(QueueableContext ctx){
            try{
                if(this.sId != null){
                    Sponsor__c s = new Sponsor__c(Id = this.sId, Status__c = this.status);
                    update s;
                }
            }catch(Exception e){
                System.debug('UpdateSponsorJob failed: ' + e.getMessage());
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
