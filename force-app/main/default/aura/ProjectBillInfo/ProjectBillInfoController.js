({
	 doInit : function(component, event, helper){
        var recID = component.get("v.recordId");
        var action = component.get("c.getPrjdetails");
        action.setParams({
            recordId: recID
        });
        action.setCallback(this, function(response){
            var data = response.getReturnValue();
            component.set("v.ProjectList", data);
             if(data[0].ChikPeaSSB__Project_Model__c === 'Agile')
           {
            component.set('v.hide' , "true");
           }

        });
        $A.enqueueAction(action);   
    },
  /*  PhaseCard : function(component, event, helper) {
        var recID = component.get("v.recordId");
        var action = component.get('c.getPrjdetails');
        action.setParams({
            recordId : recID
            
        });
        action.setCallback(this, function(response){
            var response= response.getReturnValue();    
            console.log('response',response);
            component.set('v.Phaselist',response)
            
         
        });
        
        $A.enqueueAction(action,false);
    },
    */
    doneRendering: function(cmp, event, helper) {
        // if(!cmp.get("v.editVisible")){
        //   cmp.set("v.showSpinner2", false);
        // }
        console.log('Loded....');
        cmp.set("v.showSpinner", false);
      },
    ERecord : function (component, event, helper){
        
        component.set('v.editVisible',true);
        component.set('v.hide',false);
        component.set('v.showSpinner', !component.get('v.showSpinner'));
    },
     cancelPhase : function(component, event, helper)
    {
       
        component.set('v.editVisible',false);
        component.set('v.hide',true);
        
     
        
    },
	  UpdateProject : function(component, event, helper)
    {
        var Phaseidx = component.get("v.recordId");
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": Phaseidx,
            "slideDevName": "detail"
        });
        navEvt.fire();
        
     var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            message: 'Phase Updated succesfully',
            messageTemplate: 'Record {0} created! See it {1}!',
            duration:' 5000',
            key: 'info_alt',
            type: 'success',
            mode: 'pester'
        });
       toastEvent.fire();
        
        
        component.set('v.editVisible',false);
        component.set('v.hide',true);
        
                     
    }
})