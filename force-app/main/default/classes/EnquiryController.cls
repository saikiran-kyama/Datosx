public with sharing class EnquiryController {

    @AuraEnabled(cacheable=true)
    public static List<EnquiryWrapper> getEnquiriesForCurrentSponsor(){
        Sponsor__c sponsor = getCurrentSponsor();
        if(sponsor == null) return new List<EnquiryWrapper>();
        List<Enquiry__c> eList = [SELECT Id, Name, Status__c, Product__c, Details__c, Req_Specialities__c, Interested_HS__c, Sponsor__c, Sponsor__r.Name, LastModifiedDate
                                   FROM Enquiry__c WHERE Sponsor__c = :sponsor.Id ORDER BY LastModifiedDate DESC];
        return toWrappers(eList);
    }

    @AuraEnabled(cacheable=true)
    public static List<EnquiryWrapper> getAllActiveEnquiries(){
        // Include enquiries that are 'Active' or already marked 'Interested' so
        // Health Systems see possibilities they have previously flagged.
        List<Enquiry__c> eList = [SELECT Id, Name, Status__c, Product__c, Details__c, Req_Specialities__c, Interested_HS__c, Sponsor__c, Sponsor__r.Name, LastModifiedDate
                                   FROM Enquiry__c WHERE Status__c IN ('Active','Interested') ORDER BY LastModifiedDate DESC LIMIT 1000];
        return toWrappers(eList);
    }

    @AuraEnabled
    public static EnquiryWrapper upsertEnquiry(Map<String, Object> payload){
        try{
            if(payload == null) throw new AuraHandledException('Missing enquiry payload');
            Sponsor__c sponsor = getCurrentSponsor();
            if(sponsor == null) throw new AuraHandledException('No Sponsor record is linked to the current user.');

            Enquiry__c e = new Enquiry__c();
            if(payload.containsKey('id') && payload.get('id') != null){
                Object idVal = payload.get('id');
                if(idVal instanceof String && String.valueOf(idVal).trim().length() > 0) e.Id = (Id) idVal;
            }
            e.Sponsor__c = sponsor.Id;
            String statusVal = (String) payload.get('status');
            e.Status__c = statusVal != null ? statusVal : 'Active';
            if(payload.containsKey('product')) e.Product__c = (String) payload.get('product');
            if(payload.containsKey('details')) e.Details__c = (String) payload.get('details');
            if(payload.containsKey('req')){
                e.Req_Specialities__c = normalizeListOrString(payload.get('req'));
            }
            if(payload.containsKey('interested')){
                e.Interested_HS__c = normalizeListOrString(payload.get('interested'));
            }

            upsert e;

            Enquiry__c saved = [SELECT Id, Name, Status__c, Product__c, Details__c, Req_Specialities__c, Interested_HS__c, Sponsor__c, Sponsor__r.Name, LastModifiedDate FROM Enquiry__c WHERE Id = :e.Id LIMIT 1];
            return toWrapper(saved);
        }catch(Exception ex){
            // provide clearer error to the client
            System.debug('upsertEnquiry failed: ' + ex);
            throw new AuraHandledException('upsertEnquiry failed: ' + ex.getMessage());
        }
    }

    @AuraEnabled
    public static void deleteEnquiry(Id enquiryId){
        if(enquiryId == null) return;
        delete new Enquiry__c(Id = enquiryId);
    }

    private static Sponsor__c getCurrentSponsor(){
        List<Sponsor__c> s = [SELECT Id FROM Sponsor__c WHERE User__c = :System.UserInfo.getUserId() LIMIT 1];
        return s.isEmpty() ? null : s[0];
    }

    private static List<EnquiryWrapper> toWrappers(List<Enquiry__c> records){
        List<EnquiryWrapper> out = new List<EnquiryWrapper>();
        for(Enquiry__c e : records){
            out.add(toWrapper(e));
        }
        return out;
    }

    private static EnquiryWrapper toWrapper(Enquiry__c e){
        EnquiryWrapper w = new EnquiryWrapper();
        w.id = e.Id;
        w.name = e.Name;
        w.status = e.Status__c;
        w.product = e.Product__c;
        w.details = e.Details__c;
        w.sponsorId = e.Sponsor__c;
        w.sponsorName = (e.Sponsor__r != null) ? e.Sponsor__r.Name : null;
        w.req = splitValues(e.Req_Specialities__c);
        w.interested = splitValues(e.Interested_HS__c);
        w.lastUpdated = e.LastModifiedDate != null ? String.valueOf(e.LastModifiedDate.date()) : null;
        return w;
    }

    private static List<String> splitValues(String val){
        if(String.isBlank(val)) return new List<String>();
        List<String> out = new List<String>();
        for(String p : val.split(',')){
            if(p != null && p.trim().length() > 0) out.add(p.trim());
        }
        return out;
    }

    private static String normalizeListOrString(Object obj){
        if(obj == null) return null;
        if(obj instanceof List<Object>){
            List<String> sList = new List<String>();
            for(Object o : (List<Object>) obj) sList.add(String.valueOf(o));
            return sList.isEmpty() ? null : String.join(sList, ', ');
        }
        if(obj instanceof String){
            return (String) obj;
        }
        return String.valueOf(obj);
    }

    public class EnquiryWrapper{
        @AuraEnabled public Id id;
        @AuraEnabled public String name;
        @AuraEnabled public String status;
        @AuraEnabled public String product;
        @AuraEnabled public String details;
        @AuraEnabled public List<String> req;
        @AuraEnabled public List<String> interested;
        @AuraEnabled public Id sponsorId;
        @AuraEnabled public String sponsorName;
        @AuraEnabled public String lastUpdated;
    }

    public class InterestedMatchWrapper{
        @AuraEnabled public String name;
        @AuraEnabled public Integer matchingPct;
    }

    @AuraEnabled(cacheable=true)
    public static List<InterestedMatchWrapper> getInterestedMatches(Id enquiryId){
        if(enquiryId == null) throw new AuraHandledException('Missing enquiry id');

        Enquiry__c e = [SELECT Req_Specialities__c, Interested_HS__c FROM Enquiry__c WHERE Id = :enquiryId LIMIT 1];
        List<String> reqList = splitValues(e.Req_Specialities__c);
        List<String> interestedRaw = splitValues(e.Interested_HS__c);
        if(interestedRaw.isEmpty()) return new List<InterestedMatchWrapper>();

        // Normalize interested names by stripping stored matching pct suffixes like "(72%)"
        Set<String> hsNames = new Set<String>();
        for(String s : interestedRaw){
            if(String.isBlank(s)) continue;
            String cleaned = s.replaceAll('\\s*\\(\\d+%\\)\\s*', '').trim();
            if(cleaned.length() > 0) hsNames.add(cleaned);
        }
        if(hsNames.isEmpty()) return new List<InterestedMatchWrapper>();

        Map<String, List<String>> hsToSpecs = new Map<String, List<String>>();
        for(Health_System__c hs : [SELECT Name, Specialities__c FROM Health_System__c WHERE Name IN :hsNames]){
            hsToSpecs.put(hs.Name, splitValues(hs.Specialities__c));
        }

        List<InterestedMatchWrapper> out = new List<InterestedMatchWrapper>();
        for(String name : hsNames){
            List<String> hsSpecs = hsToSpecs.containsKey(name) ? hsToSpecs.get(name) : new List<String>();
            Integer pct = 0;
            if(!reqList.isEmpty()){
                Set<String> reqSet = new Set<String>();
                for(String r : reqList) reqSet.add(r.toLowerCase());
                Integer matchCount = 0;
                for(String sp : hsSpecs){
                    if(reqSet.contains(sp.toLowerCase())) matchCount++;
                }
                Double ratio = reqList.isEmpty() ? 0 : ((Double) matchCount) / reqList.size();
                pct = Integer.valueOf(Math.round(ratio * 100));
            }
            InterestedMatchWrapper row = new InterestedMatchWrapper();
            row.name = name;
            row.matchingPct = pct;
            out.add(row);
        }
        return out;
    }

    @AuraEnabled
    public static EnquiryWrapper markInterest(Id enquiryId, String hsName, Integer matchingPct, Boolean markInterested){
        if(enquiryId == null) throw new AuraHandledException('Missing enquiry id');
        Enquiry__c e = [SELECT Id, Interested_HS__c, Status__c FROM Enquiry__c WHERE Id = :enquiryId LIMIT 1];
        List<String> current = splitValues(e.Interested_HS__c);
        String entry = hsName + ' (' + String.valueOf(matchingPct) + '%)';
        if(markInterested){
            if(!current.contains(entry)) current.add(entry);
            e.Interested_HS__c = current.isEmpty() ? null : String.join(current, ', ');
            // Do NOT modify Enquiry.Status__c here — HS interest is a view-level possibility state only.
        } else {
            List<String> newList = new List<String>();
            for(String s : current){
                if(!s.startsWith(hsName + ' ')) newList.add(s);
            }
            e.Interested_HS__c = newList.isEmpty() ? null : String.join(newList, ', ');
            // Leave Enquiry.Status__c unchanged when removing interest.
        }
        update e;
        // re-query full record including related fields and return wrapper
        Enquiry__c saved = [SELECT Id, Name, Status__c, Product__c, Details__c, Req_Specialities__c, Interested_HS__c, Sponsor__c, Sponsor__r.Name, LastModifiedDate FROM Enquiry__c WHERE Id = :e.Id LIMIT 1];
        return toWrapper(saved);
    }
}
