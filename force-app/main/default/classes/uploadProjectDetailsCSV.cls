public with sharing class uploadProjectDetailsCSV {
    @AuraEnabled
    public static List<ChikPeaSSB__Resource_Staging__c> csvFileRead(Id contentDocumentId){
        list<ChikPeaSSB__Resource_Staging__c> resourceStagingList = new list<ChikPeaSSB__Resource_Staging__c>();
        
        try {
            if(contentDocumentId != null) {
            
                // Fetch File Data based on the basic of document id 
                ContentVersion contentVersionObj = [SELECT Id, VersionData FROM ContentVersion WHERE ContentDocumentId =:contentDocumentId];
                System.debug('contentVersionObj=> '+contentVersionObj);

                // split the file data
                list<String> csvRecordsList = contentVersionObj.VersionData.toString().split('\n');
                System.debug('csvRecordsList=> '+csvRecordsList);

                map<string,id> projectResourcesMap = new map<string,id>();
                map<id,String> projectResourcesHourseMap = new map<id,String>();

                // List<ChikPeaSSB__Resource__c> resourcesList = [select id, Name,ChikPeaSSB__Actual_Hours__c from ChikPeaSSB__Resource__c];   // Can be used in loop
                // Storing 
                for(ChikPeaSSB__Resource__c resource : [select Id, Name, ChikPeaSSB__Actual_Hours__c from ChikPeaSSB__Resource__c]){
                    // Resource name as key, Id as value
                    projectResourcesMap.put(resource.Name, resource.Id);

                    // Resource Id as key, Hours as value
                    projectResourcesHourseMap.put(resource.Id, resource.ChikPeaSSB__Actual_Hours__c);
                }
    
                if(projectResourcesMap != null && projectResourcesMap.size() > 0){
                    for(Integer i = 1; i < csvRecordsList.size(); i++){
                        list<String> csvRowData = csvRecordsList[i].split(',');
                        System.debug('Project	ResourceId	Phase	Resource	Role	Actualhours	Task	UploadDate ');
                        System.debug(csvRowData[0]+' '+csvRowData[1]+' '+csvRowData[2]+' '+csvRowData[3]+' '+csvRowData[4]+' '+csvRowData[5]);
                        
                        ChikPeaSSB__Resource_Staging__c resourceStaging = new ChikPeaSSB__Resource_Staging__c();
                        resourceStaging.ChikPeaSSB__Resource__c = csvRowData[1];
                        resourceStaging.ChikPeaSSB__Actual_Hours__c = decimal.valueOf(csvRowData[5].replaceAll('[^0-9]', '')) ;
                        resourceStaging.Date__c = System.today();

                        
                        if(resourceStaging.ChikPeaSSB__Actual_Hours__c > 0)
                            resourceStagingList.add(resourceStaging);

                        System.debug('resourceStagingList => '+ resourceStagingList);
                    }
                    
                    try{  
                        Database.SaveResult[] saveResultList = Database.insert(resourceStagingList, false);

                        // Iterate through saveResultList based on isSuccess capture the failed records
                        for (Database.SaveResult sr : saveResultList) {
                            if (sr.isSuccess()) {
                                // Operation was successful, so get the ID of the record that was processed
                                System.debug('Successfully inserted Resource Staging. Resource Staging ID: ' + sr.getId());
                            }
                            else {
                                // Operation failed, so get all errors                
                                for(Database.Error err : sr.getErrors()) {
                                    System.debug('The following error has occurred.');                    
                                    System.debug(err.getStatusCode() + ': ' + err.getMessage());
                                    System.debug('Resource Staging fields that affected this error: ' + err.getFields());
                                }
                            }
                        }  
                        // if(!resourceStagingList.isEmpty()) {
                        //     insert resourceStagingList;
                        // }
                    }
                    catch (Exception ex) {
                        System.debug('Exception inner ==>>'+ex.getMessage()+' '+ex.getStackTraceString());
                        throw new AuraHandledException(ex.getMessage());
                    }
                } 
            }
        } catch (Exception e) {
            System.debug('Exception outer ==> '+e.getMessage()+' '+e.getStackTraceString());
            throw new AuraHandledException(e.getMessage());
        }  
        return resourceStagingList;
    }
}