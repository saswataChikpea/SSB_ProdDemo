public class InvoicePDFController {
    
    Public String recordID {get;set;}
    public ChikPeaO2B__Invoice__c invoiceDetails{get;set;}
    Public String contactName {get;set;}
    Public String contactPhone {get;set;}
    Public String accountName {get;set;}
    Public String contactEmail {get;set;}
    public Account accList {get;set;}
    public String contactAddress {get;set;}
    Public List<ChikPeaO2B__Invoice_Line__c> invoiceLineDetail{get;set;} 
    public List<String> phaseL{get;set;}
    public ChikPeaO2B__Invoice_Line__c countRe{get;set;}
    public List<String> phaseList{get;set;}
    public Decimal sum{get;set;}

    public class WrapperInvLine{
        public Boolean isRepeated{get;set;}
        public Integer counter{get;set;}
        public String phase{get;set;}
        public String resource{get;set;}
        public Integer c{get;set;}
        public Decimal t{get;set;}
        public Decimal hrs{get;set;}
        public Decimal rate{get;set;}
        public Decimal total{get;set;}
    }
    public List<WrapperInvLine> tableList{get;set;}

    public InvoicePDFController(Apexpages.StandardController controller){
        recordID = controller.getid();
        invoiceDetails = [SELECT Id, name, ChikPeaO2B__Billing_Contact__r.name, ChikPeaO2B__Account__r.name,
                            ChikPeaO2B__Billing_Contact__r.MailingStreet, ChikPeaO2B__Billing_Contact__r.MailingCity, ChikPeaO2B__Billing_Contact__r.MailingState, ChikPeaO2B__Billing_Contact__r.MailingPostalCode, ChikPeaO2B__Billing_Contact__r.MailingCountry,ChikPeaO2B__Billing_Contact__r.phone,ChikPeaO2B__Billing_Contact__r.Email,
                          (SELECT Id, name,ChikPeaSSB__Phase__c from ChikPeaO2B__Invoice_Lines__r)
                          FROM ChikPeaO2B__Invoice__c WHERE Id =:recordID];
        contactName = invoiceDetails.ChikPeaO2B__Billing_Contact__r.name;
        accountName = invoiceDetails.ChikPeaO2B__Account__r.name;
        contactPhone = invoiceDetails.ChikPeaO2B__Billing_Contact__r.phone;
        contactAddress = invoiceDetails.ChikPeaO2B__Billing_Contact__r.MailingStreet+', '+invoiceDetails.ChikPeaO2B__Billing_Contact__r.MailingCity+', '+invoiceDetails.ChikPeaO2B__Billing_Contact__r.MailingCity+', '+invoiceDetails.ChikPeaO2B__Billing_Contact__r.MailingPostalCode;
        contactEmail = invoiceDetails.ChikPeaO2B__Billing_Contact__r.Email;

        

        invoiceLineDetail = new List<ChikPeaO2B__Invoice_Line__c>();
        invoiceLineDetail = [SELECT ChikPeaSSB__Phase__c, ChikPeaSSB__Resource__c,ChikPeaSSB__Consumed_Hrs_Resource__c, ChikPeaSSB__Rate__c, ChikPeaSSB__Total_for_the_phase__c 
                            FROM ChikPeaO2B__Invoice_Line__c  WHERE ChikPeaO2B__Invoice__c=:recordID ORDER BY ChikPeaSSB__Phase__c];

        Map<String,Integer> phaseVsCounterMap = new Map<String,Integer>();
        Map<String,Decimal> pTotalMap = new Map<String,Decimal>();
        
        for(ChikPeaO2B__Invoice_Line__c invline : [SELECT ChikPeaSSB__Phase__c, ChikPeaSSB__Resource__c,ChikPeaSSB__Consumed_Hrs_Resource__c, ChikPeaSSB__Rate__c, ChikPeaSSB__Total_for_the_phase__c 
                FROM ChikPeaO2B__Invoice_Line__c  WHERE ChikPeaO2B__Invoice__c=:recordID ORDER BY ChikPeaSSB__Phase__c]){
            if(phaseVsCounterMap.containsKey(invline.ChikPeaSSB__Phase__c)){
                Integer c = phaseVsCounterMap.get(invline.ChikPeaSSB__Phase__c);
                phaseVsCounterMap.put(invline.ChikPeaSSB__Phase__c,(c+1));
            }else{
                phaseVsCounterMap.put(invline.ChikPeaSSB__Phase__c,1);
            }
            Decimal t=0.0;
            Decimal tFormat;
            if(pTotalMap.containsKey(invline.ChikPeaSSB__Phase__c)){
                t = pTotalMap.get(invline.ChikPeaSSB__Phase__c) + invline.ChikPeaSSB__Consumed_Hrs_Resource__c*((Decimal)invline.ChikPeaSSB__Rate__c);
                tFormat=t.setScale(2);
                pTotalMap.put(invline.ChikPeaSSB__Phase__c,tFormat);
            }else{
                t = invline.ChikPeaSSB__Consumed_Hrs_Resource__c*((Decimal)invline.ChikPeaSSB__Rate__c);
                tFormat=t.setScale(2);
                pTotalMap.put(invline.ChikPeaSSB__Phase__c,tFormat);
            }
        }
                           
        
        Map<String,Boolean> checkPhaseMap = new Map<String,Boolean>();
        Map<String,Integer> phaseCounterMap = new Map<String,Integer>();
        tableList = new List<WrapperInvLine>();
        for(ChikPeaO2B__Invoice_Line__c inv : invoiceLineDetail){
            WrapperInvLine obj = new WrapperInvLine();
            if(checkPhaseMap.containsKey(inv.ChikPeaSSB__Phase__c)){
                obj.isRepeated=true;
                
            }else{
                checkPhaseMap.put(inv.ChikPeaSSB__Phase__c,true);
            }
            obj.phase = inv.ChikPeaSSB__Phase__c;
            obj.resource = inv.ChikPeaSSB__Resource__c;
            obj.hrs=inv.ChikPeaSSB__Consumed_Hrs_Resource__c;
            obj.rate=(Decimal)inv.ChikPeaSSB__Rate__c;

            // obj.total=inv.ChikPeaSSB__Total_for_the_phase__c;
            if(phaseVsCounterMap!=null && phaseVsCounterMap.containsKey(inv.ChikPeaSSB__Phase__c)){
                obj.counter = phaseVsCounterMap.get(inv.ChikPeaSSB__Phase__c);
                obj.total = pTotalMap.get(inv.ChikPeaSSB__Phase__c);
                // obj.total=(inv.ChikPeaSSB__Consumed_Hrs_Resource__c)*(inv.ChikPeaSSB__Rate__c);
            }
            
            tableList.add(obj);
        }
        // Integer totalcounterFunction(){
        //     Map<String, Integer> totalPhaseCounts = new Map<String, Integer>();
        //     public Integer tpc;
        //     for(ChikPeaO2B__Invoice_Line__c cnt : invoiceLineDetail){
        //         if (totalPhaseCounts.containsKey(cnt.ChikPeaSSB__Phase__c)) {
        //             totalPhaseCounts.put(cnt.ChikPeaSSB__Phase__c, totalPhaseCounts.get(cnt.totalPhaseCounts) + 1);
        //             tpc++;
        //         } 
        //         // else {
        //         //     industryCounts.put(a.Industry, 1);
        //         // }
        //         return tpc;
        //     }
        // }
        System.debug('tableList =>'+tableList);















        // invoiceLineDetail = [SELECT ChikPeaSSB__Phase__c, ChikPeaSSB__Resource__c,ChikPeaSSB__Consumed_Hrs_Resource__c, ChikPeaSSB__Rate__c, ChikPeaSSB__Total_for_the_phase__c 
        //                     FROM ChikPeaO2B__Invoice_Line__c
        //                     WHERE ChikPeaO2B__Invoice__c=:recordID AND ChikPeaSSB__Phase__c='Data Migration'];

        
        // countRe=[SELECT COUNT(ChikPeaSSB__Resource__c), ChikPeaSSB__Phase__c FROM ChikPeaO2B__Invoice_Line__c GROUP BY ChikPeaSSB__Phase__c];
        
        
        
        // List<String> phaseL = new List<String>();
        // for(ChikPeaO2B__Invoice_Line__c phlist : [SELECT ChikPeaSSB__Phase__c, ChikPeaSSB__Resource__c,ChikPeaSSB__Consumed_Hrs_Resource__c, ChikPeaSSB__Rate__c, ChikPeaSSB__Total_for_the_phase__c 
        //                                           FROM ChikPeaO2B__Invoice_Line__c  
        //                                           WHERE ChikPeaO2B__Invoice__c=:recordID ORDER BY ChikPeaSSB__Phase__c])
        // {
        //     phaseL.add(phlist.ChikPeaSSB__Phase__c);
        // }
        // for(Integer i=0;i<phaseL.size();i++){
        //     String phaseN=phaseL.get(i);
        //     for(Integer j=0;j<phaseL.size();j++){
        //         if(phaseN==phaseL.get(j)){
        //             count++;
        //         }
        //     }
        // }
        // phaseList = new List<String>();
        // // phaseList = [SELECT]

        // List<Id> phaseIds = new List<Id>();
        // //List<ChikPeaSSB__Phase__c> phaseList = new List<ChikPeaSSB__Phase__c>();
        // if (invoiceLineDetail.size()>0) {
        //     for (ChikPeaO2B__Invoice_Line__c phase : invoiceLineDetail ) {
        //         phaseIds.add(phase.id);
        //     }
        // }

        // List<String> phaseL = new List<String>();
        // for(ChikPeaO2B__Invoice_Line__c phlist : invoiceLineDetail){
        //     phaseL.add(phlist.ChikPeaSSB__Phase__c);  
        // } 

        sum=0.0;
        for(ChikPeaO2B__Invoice_Line__c invLine : invoiceLineDetail){
            sum+=(Decimal)invLine.ChikPeaSSB__Total_for_the_phase__c;
        }
        
        
    }
}