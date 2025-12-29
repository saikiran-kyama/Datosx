public with sharing class ProjectsController {
    @AuraEnabled
    public static List<Project__c> getProjects(String searchKey, List<String> statuses, List<String> industries, String sortField, String sortOrder) {
        String query = 'SELECT Id, Name, Project_Id__c, Status__c, Start_Date__c, ETA__c, End_Date__c, Project_Details__c, Industry__c, Sponsor_Name__c, Health_System_Name__c, Contact_Name__c, Contact_Email__c, Contact_Phone__c, Last_Updated__c FROM Project__c';
        List<String> filters = new List<String>();

        if (!String.isBlank(searchKey)) {
            String key = '%' + String.escapeSingleQuotes(searchKey.trim()) + '%';
            String quotedKey = '\'' + key + '\'';
            String likeFilter = '(Name LIKE {0} OR Project_Id__c LIKE {0} OR Sponsor_Name__c LIKE {0} OR ' +
                'Health_System_Name__c LIKE {0} OR Contact_Name__c LIKE {0} OR Contact_Email__c LIKE {0})';
            filters.add(String.format(likeFilter, new List<String>{ quotedKey }));
        }

        if (statuses != null && !statuses.isEmpty()) {
            filters.add('Status__c IN ' + toSoqlList(statuses));
        }

        if (industries != null && !industries.isEmpty()) {
            filters.add('Industry__c IN ' + toSoqlList(industries));
        }

        if (!filters.isEmpty()) {
            query += ' WHERE ' + String.join(filters, ' AND ');
        }

        String safeSortField = sanitizeSortField(sortField);
        String safeSortOrder = (sortOrder != null && sortOrder.toLowerCase() == 'asc') ? 'ASC' : 'DESC';
        query += ' ORDER BY ' + safeSortField + ' ' + safeSortOrder + ' NULLS LAST LIMIT 500';

        return Database.query(query);
    }

    @AuraEnabled
    public static Project__c upsertProject(Project__c project) {
        if (project == null) {
            throw new AuraHandledException('Project payload was empty.');
        }

        if (project.Last_Updated__c == null) {
            project.Last_Updated__c = Date.today();
        }

        if (String.isBlank(project.Name)) {
            project.Name = String.isNotBlank(project.Project_Id__c) ? project.Project_Id__c : 'New Project';
        }

        // Ensure Project_Id__c is generated when not provided - numeric timestamp ensures uniqueness
        if (String.isBlank(project.Project_Id__c)) {
            try {
                project.Project_Id__c = String.valueOf(Datetime.now().getTime());
                if (String.isBlank(project.Name)) {
                    project.Name = project.Project_Id__c;
                }
            } catch (Exception ex) {
                // fallback: keep it null
            }
        }

        upsert project;

        return [SELECT Id, Name, Project_Id__c, Status__c, Start_Date__c, ETA__c, End_Date__c, Project_Details__c, Industry__c, Sponsor_Name__c, Health_System_Name__c, Contact_Name__c, Contact_Email__c, Contact_Phone__c, Last_Updated__c FROM Project__c WHERE Id = :project.Id];
    }

    private static String sanitizeSortField(String sortField) {
        Set<String> allowed = new Set<String>{
            'Name', 'Project_Id__c', 'Status__c', 'Start_Date__c', 'End_Date__c', 'Industry__c',
            'Contact_Name__c', 'Contact_Email__c', 'Contact_Phone__c', 'Last_Updated__c'
        };
        if (String.isBlank(sortField) || !allowed.contains(sortField)) {
            return 'Last_Updated__c';
        }
        return sortField;
    }

    private static String toSoqlList(List<String> values) {
        List<String> escaped = new List<String>();
        for (String val : values) {
            if (String.isBlank(val)) {
                continue;
            }
            escaped.add('\'' + String.escapeSingleQuotes(val) + '\'');
        }
        if (escaped.isEmpty()) {
            return '(NULL)';
        }
        return '(' + String.join(escaped, ',') + ')';
    }

    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getMonthlyTrend(Integer year) {
        if (year == null) {
            year = Date.today().year();
        }

        List<Integer> seriesNew = new List<Integer>{0,0,0,0,0,0,0,0,0,0,0,0};
        List<Integer> seriesCompleted = new List<Integer>{0,0,0,0,0,0,0,0,0,0,0,0};
        List<String> months = new List<String>{'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'};

        // Aggregate 'New' projects by Start_Date__c month/year
        List<AggregateResult> arNew = [
            SELECT CALENDAR_MONTH(Start_Date__c) month, COUNT(Id) cnt
            FROM Project__c
            WHERE Status__c = 'New' AND Start_Date__c != NULL AND CALENDAR_YEAR(Start_Date__c) = :year
            GROUP BY CALENDAR_MONTH(Start_Date__c)
        ];

        for (AggregateResult r : arNew) {
            Integer m = (Integer) r.get('month');
            Integer cnt = (Integer) r.get('cnt');
            if (m == null || cnt == null) continue;
            Integer idx = m - 1;
            if (idx < 0 || idx > 11) continue;
            seriesNew[idx] = seriesNew[idx] + cnt;
        }

        // Aggregate 'Completed' projects by End_Date__c month/year
        List<AggregateResult> arCompleted = [
            SELECT CALENDAR_MONTH(End_Date__c) month, COUNT(Id) cnt
            FROM Project__c
            WHERE Status__c = 'Completed' AND End_Date__c != NULL AND CALENDAR_YEAR(End_Date__c) = :year
            GROUP BY CALENDAR_MONTH(End_Date__c)
        ];

        for (AggregateResult r : arCompleted) {
            Integer m = (Integer) r.get('month');
            Integer cnt = (Integer) r.get('cnt');
            if (m == null || cnt == null) continue;
            Integer idx = m - 1;
            if (idx < 0 || idx > 11) continue;
            seriesCompleted[idx] = seriesCompleted[idx] + cnt;
        }

        Map<String, Object> result = new Map<String, Object>{
            'months' => months,
            'seriesNew' => seriesNew,
            'seriesCompleted' => seriesCompleted
        };
        return result;
    }

    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> getStatusCounts() {
        List<Map<String, Object>> out = new List<Map<String, Object>>();
        List<AggregateResult> ar = [SELECT Status__c status, COUNT(Id) cnt FROM Project__c GROUP BY Status__c];
        for (AggregateResult r : ar) {
            String st = (String) r.get('status');
            Integer cnt = (Integer) r.get('cnt');
            Map<String, Object> m = new Map<String, Object>{'name' => st, 'y' => (cnt==null?0:cnt)};
            out.add(m);
        }
        return out;
    }

    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getIndustryCounts() {
        List<String> labels = new List<String>();
        List<Integer> series = new List<Integer>();
        List<AggregateResult> ar = [SELECT Industry__c industry, COUNT(Id) cnt FROM Project__c GROUP BY Industry__c ORDER BY COUNT(Id) DESC NULLS LAST LIMIT 20];
        for (AggregateResult r : ar) {
            String ind = (String) r.get('industry');
            Integer cnt = (Integer) r.get('cnt');
            labels.add(ind == null ? 'Unknown' : ind);
            series.add(cnt == null ? 0 : cnt);
        }
        Map<String, Object> resp = new Map<String, Object>{'labels' => labels, 'series' => series};
        return resp;
    }

    @AuraEnabled
    public static void deleteProject(Id projectId) {
        if (projectId == null) {
            throw new AuraHandledException('Project id is required for delete.');
        }
        try {
            Project__c p = [SELECT Id FROM Project__c WHERE Id = :projectId LIMIT 1];
            delete p;
        } catch (Exception ex) {
            throw new AuraHandledException('Unable to delete project: ' + ex.getMessage());
        }
    }
}
