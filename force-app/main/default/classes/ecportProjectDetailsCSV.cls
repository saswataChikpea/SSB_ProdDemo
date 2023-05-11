public with sharing class ecportProjectDetailsCSV {
    public transient String input { public get; private set; }
    public transient String fileName { public get; private set; }
    public  List<ChikPeaSSB__Resource__c> resources { public get; private set; }

    public ecportProjectDetailsCSV() {
        Map<String,String> params = ApexPages.currentPage().getParameters();
    
        resources = [Select Id, Name, ChikPeaSSB__Role__c, ChikPeaSSB__Project__r.Name, ChikPeaSSB__Phase__r.name  from ChikPeaSSB__Resource__c where ChikPeaSSB__Project__r.Status__c = 'In process' and ChikPeaSSB__Phase__r.ChikPeaSSB__Phase_Status__c = 'In Process'];
        
        fileName = params.get('filename');
        if (fileName == null) fileName = 'Data';    
        
        if (input == null) input = 'No data provided.';
    }
}