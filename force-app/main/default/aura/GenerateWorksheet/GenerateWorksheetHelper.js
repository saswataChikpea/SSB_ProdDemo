({
    onLoad: function (component, event) {
        //call apex class method
        var recID = component.get("v.recordId");
        //alert(recID);
        var action = component.get("c.fetchContact");

        action.setParams({
            recoId: recID
        });
        //var action = component.get('c.fetchContact');
        action.setCallback(this, function (response) {
            //store state of response
            var state = response.getState();
            if (state === "SUCCESS") {
                //set response value in ListOfContact attribute on component.
                component.set('v.ListOfprojects', response.getReturnValue());
            }
        });

        $A.enqueueAction(action);

    },

    convertArrayOfObjectsToCSV: function (component, objectRecords) {
        // declare variables
        var csvStringResult, counter, keys, columnDivider, lineDivider;

        // check if "objectRecords" parameter is null, then return from function
        if (objectRecords == null || !objectRecords.length) {
            return null;
        }
        // store ,[comma] in columnDivider variabel for sparate CSV values and 
        // for start next line use '\n' [new line] in lineDivider varaible  
        columnDivider = ',';
        lineDivider = '\n';

        // in the keys valirable store fields API Names as a key 
        // this labels use in CSV file header  
        // keys = ['Project__r.Id','Project__r.Name','Id','Name','Resources__r.Id','Resources__r.name'];
        // parentKeys=['AccountNumber', 'Name', 'Id']; // Add what ever fields you want

        debugger
        keys = ['ChikPeaSSB__Project_Name__c', 'ChikPeaSSB__Phase_Name__c', 'Name', 'ChikPeaSSB__Role__c', 'ChikPeaSSB__Actual_Hours__c', 'Task__c', 'ChikPeaSSB__Date__c'];

        var Columnkeys = ['Project', 'Phase', 'Resource', 'Role', 'Actualhours', 'Task', 'UploadDate'];

        csvStringResult = '';

        // csvStringResult += keys.join(columnDivider);
        csvStringResult += Columnkeys.join(columnDivider);
        csvStringResult += lineDivider;

        // Genarate Current Date in mm/dd/yyyy
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const year = today.getFullYear();
        const currentDate = month + '/' + day + '/' + year; // Type String

        console.log('currentDate');
        console.log(currentDate); // Output: mm/dd/yyyy format of current date

        for (var i = 0; i < objectRecords.length; i++) {
            counter = 0;
            for (var sTempkey in keys) {
                var skey = keys[sTempkey];
                // add , [comma] after every String value,. [except first]
                if (counter > 0) {
                    csvStringResult += columnDivider;
                }
                if (objectRecords[i][skey]) {
                    csvStringResult += '"' + objectRecords[i][skey] + '"';
                } else if(skey == 'ChikPeaSSB__Actual_Hours__c') {
                    csvStringResult += '"0"';                       // Make Actual Hours field 0 by default
                }else if(skey == 'ChikPeaSSB__Date__c') {
                    csvStringResult += currentDate;                 // Addes current date with mm/dd/yyyy formate by default
                }else{
                    csvStringResult += '';
                }
                counter++;

            } // inner for loop close 
            csvStringResult += lineDivider;
        }// outer main for loop close 

        // return the CSV formate String 
        return csvStringResult;
    }


})