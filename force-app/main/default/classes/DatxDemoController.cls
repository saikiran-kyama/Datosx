public with sharing class DatxDemoController {
    @AuraEnabled(cacheable=true)
    public static String getCurrentUserProfileName() {
        User u = [SELECT Id, Profile.Name FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];
        return u.Profile.Name;
    }

    @AuraEnabled(cacheable=true)
    public static String getCurrentUserName() {
        User u = [SELECT Id, Name FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];
        return u.Name;
    }
}