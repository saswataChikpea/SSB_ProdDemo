({
    fetchAccounts: function (component, event, helper) {
        var ShowRecid = event.getParam("ResrecordId");
        //alert('ShowRecid = '+ShowRecid)
        component.set('v.paramsvalue', ShowRecid);
        //component.set('v.containerSubj',ShowRecid);

        var recID = component.get("v.recordId");

        var action = component.get("c.IsAuditDisableBillable");
        action.setParams({
            recordId: recID
        });
        action.setCallback(this, function (response) {
            var data = response.getReturnValue();

            var Isaudit = data[0].ChikPeaSSB__Is_Audit__c;
            //alert('1',Isaudit);

            // Updated With & Labels
            component.set('v.Columns', [
                { label: 'Res Stg', fieldName: 'Name', type: 'text', fixedWidth: 108},
                { label: 'Role', fieldName: 'ChikPeaSSB__Item_Name__c', type: 'text', fixedWidth: 120},
                { label: 'Date', fieldName: 'ChikPeaSSB__Date__c', type: 'Date', fixedWidth: 86 },
                { label: 'AH', fieldName: 'ChikPeaSSB__Actual_Hours__c', type: 'Number', initialWidth: 60 },
                { label: 'BH', fieldName: 'ChikPeaSSB__Billable_Hours__c', type: 'Number', editable: Isaudit , initialWidth: 60},
                { label: 'Task', fieldName: 'ChikPeaSSB__Task__c', type: 'text', initialWidth: 67 },
                { label: 'Posted', fieldName: 'ChikPeaSSB__Post__c', type: 'boolean', initialWidth: 58 }

            ]);
            helper.getStagings(component, event, helper, ShowRecid);
        });
        $A.enqueueAction(action);

    },


    handleSaveEdition: function (component, event, helper) {
        debugger
        // var drafts = event.getParam('draftValues');
        var action = component.get("c.updateStagingsApx");

        var updatedRecords = component.find("StagingsTable").get("v.draftValues");
        console.log(updatedRecords);
        //system.debug(updatedRecords);
        action.setParams({
            'updatedSatgings': updatedRecords
        });
        console.log('records' + updatedRecords);
        action.setCallback(this, function (response) {

            var state = response.getState();
            if (state === "SUCCESS") {
                debugger
                component.find("StagingsTable").set("v.draftValues", null);
                helper.getStagings(component, event, helper, component.get('v.paramsvalue'));

                var toastEvent = $A.get("e.force:showToast");
                //helper.fetchData(component);
                toastEvent.setParams({
                    title: 'Success',
                    message: 'Resource Stagings updated Successfully',
                    duration: 5000,
                    key: 'info_alt',
                    type: 'success',
                    mode: 'dismissible'
                });
                toastEvent.fire();
                $A.get('e.force:refreshView').fire();
                location.reload();

                //  var action = component.get('c.fetchAccounts');
                //$A.enqueueAction(action);

            } else {
                var toastEvent = $A.get("e.force:showToast");

                toastEvent.setParams({
                    title: 'Success',
                    message: 'Some thing went Wrong!',
                    duration: 5000,
                    key: 'info_alt',
                    type: 'success',
                    mode: 'dismissible'
                });
                toastEvent.fire();
            }
        });
        //var action = component.get('c.fetchAccounts');
        //$A.enqueueAction(action,false);  
        $A.enqueueAction(action);

    }
})