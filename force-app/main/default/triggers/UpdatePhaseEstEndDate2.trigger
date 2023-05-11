trigger UpdatePhaseEstEndDate2 on ChikPeaSSB__Resource__c (after insert , after update) {
    for(ChikPeaSSB__Resource__c res : Trigger.new){
        Id phsId = res.ChikPeaSSB__Phase__c;
        System.debug('PhaseId: ' + phsId);
        List<ChikPeaSSB__Resource__c> resList = [Select Id, ChikPeaSSB__Phase__c, name , ChikPeaSSB__Estimated_Hours__c from ChikPeaSSB__Resource__c 
                                                Where ChikPeaSSB__Phase__c = :phsId ORDER BY ChikPeaSSB__Estimated_Hours__c DESC];
        System.debug('resMap>>'+resList[0].ChikPeaSSB__Estimated_Hours__c);
        System.debug('resList: ' + resList);
        Decimal maxHrs = resList[0].ChikPeaSSB__Estimated_Hours__c != Null ? resList[0].ChikPeaSSB__Estimated_Hours__c : 0; // Null checking
        Integer myintval = Integer.valueOf(maxHrs);
        Integer daysNumber = myintval/8;
        	
        ChikPeaSSB__Project_Phase__c phs = [Select Id, name , ChikPeaSSB__Est_Start_date__c,ChikPeaSSB__Est_End_Date__c from ChikPeaSSB__Project_Phase__c where Id = :phsId LIMIT 1];
        System.debug('phs>>'+phs);
		Date startdate = Date.Today();
  		Date estEnd = startdate.addDays(daysNumber);
      	phs.ChikPeaSSB__Est_End_Date__c = estEnd;
        update phs;
		System.debug('updated Phase'+phs);
    }
}