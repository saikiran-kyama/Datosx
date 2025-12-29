public with sharing class MasterDataController {

    // STATES
    @AuraEnabled(cacheable=true)
    public static List<State__c> getStates(){
        return [SELECT Id, Name, Code__c FROM State__c ORDER BY Name];
    }

    @AuraEnabled
    public static State__c createState(String name, String code){
        State__c s = new State__c(Name = name);
        if(code != null) s.Code__c = code;
        insert s;
        return s;
    }

    @AuraEnabled
    public static State__c updateState(Id id, String name, String code){
        State__c s = new State__c(Id = id, Name = name, Code__c = code);
        update s;
        return s;
    }

    @AuraEnabled
    public static void deleteState(Id id){
        if(id == null) return;
        delete new State__c(Id = id);
    }

    // CITIES
    @AuraEnabled(cacheable=true)
    public static List<City__c> getCities(){
        return [SELECT Id, Name, State__c, State__r.Name FROM City__c ORDER BY Name];
    }

    @AuraEnabled
    public static City__c createCity(String name, Id stateId){
        City__c c = new City__c(Name = name);
        if(stateId != null) c.State__c = stateId;
        insert c;
        return c;
    }

    @AuraEnabled
    public static City__c updateCity(Id id, String name, Id stateId){
        City__c c = new City__c(Id = id, Name = name, State__c = stateId);
        update c;
        return c;
    }

    @AuraEnabled
    public static void deleteCity(Id id){
        if(id == null) return;
        delete new City__c(Id = id);
    }

    // SPECIALITIES
    @AuraEnabled(cacheable=true)
    public static List<Speciality__c> getSpecialities(){
        return [SELECT Id, Name FROM Speciality__c ORDER BY Name];
    }

    @AuraEnabled
    public static Speciality__c createSpeciality(String name){
        Speciality__c s = new Speciality__c(Name = name);
        insert s;
        return s;
    }

    @AuraEnabled
    public static Speciality__c updateSpeciality(Id id, String name){
        Speciality__c s = new Speciality__c(Id = id, Name = name);
        update s;
        return s;
    }

    @AuraEnabled
    public static void deleteSpeciality(Id id){
        if(id == null) return;
        delete new Speciality__c(Id = id);
    }
}
