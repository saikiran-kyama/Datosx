public with sharing class StaffUserController {

    @AuraEnabled(cacheable=true)
    public static List<ProfileInfo> getProfiles(){
        List<Profile> profs = [SELECT Id, Name, UserLicense.Name, UserLicense.TotalLicenses, UserLicense.UsedLicenses, UserLicenseId FROM Profile ORDER BY Name];
        List<ProfileInfo> out = new List<ProfileInfo>();
        // prefetch PermissionSets that are owned by profiles to heuristically detect Content-related permissions
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
            // mark if profile brings Content permissions (heuristic)
            pi.requiresContent = profileRequiresContent.containsKey(p.Id) ? true : false;
            out.add(pi);
        }
        return out;
    }

    @AuraEnabled(cacheable=true)
    public static List<UserRole> getRoles(){
        return [SELECT Id, Name FROM UserRole ORDER BY Name];
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

        // server-side license availability check
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
    public static String sendPasswordReset(Id userId){
        if(userId == null) throw new AuraHandledException('Missing userId');
        try{
            // send email to user to reset their password
            System.resetPassword(userId, true);
            return 'Password reset email sent to the new user.';
        }catch(Exception e){
            String msg = e.getMessage();
            throw new AuraHandledException('Failed to send password reset email: ' + msg);
        }
    }
    // Inner wrapper type returned to LWC with license availability info
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
