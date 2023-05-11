public class getNoOfBusinessDaysBetweenDates {
    
public void calculateBusinessDaysBetweenDates(Date startDate, Date endDate){
    Integer count = 0;
    
    BusinessHours bHours = [SELECT Id FROM BusinessHours WHERE IsDefault = true limit 1];
     
    while(startDate <= endDate){
        if(BusinessHours.isWithin(bHours.Id, startDate)){
            count++;
        }
        startDate = startDate.addDays(1);
    }
    
    System.Debug('Date'+count);
System.Debug('s'+startDate);
System.Debug('e'+endDate);    
}
}