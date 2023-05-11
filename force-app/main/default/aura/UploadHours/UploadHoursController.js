({
    CreateRecord: function (component, event, helper) {
        
        // var msg ='Are you sure you want to Generate Worksheet ?';
        // if (confirm(msg)) {
        
        var recID = component.get("v.recordId");
        //   alert(recID);
        
        var action = component.get('c.PrjStatus');
        action.setParams({
            "recoId":recID
        });
        action.setCallback(this, function(response){
            
            var state = response.getState();
            if (state == "SUCCESS") {
                
                var data = response.getReturnValue();
                var pjStatus = data[0].ChikPeaSSB__Status__c;
                //alert(pjStatus);
                var allowedExtensions=/(\.csv)$/i;

                if(pjStatus == "In Process"){
                    
                    var fileInput = component.find("file").getElement();
                    var file = fileInput.files[0];
                    //alert(file);
                    var filePath=fileInput.value;

                    if(!allowedExtensions.exec(filePath)){
                        // alert('Please upload file having extensions .csv only.');

                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            message: 'Please upload file having extensions .csv only.',
                            messageTemplate: 'Record {0} created! See it {1}!',
                            duration:' 5000',
                            key: 'info_alt',
                            type: 'Error',
                            mode: 'pester'
                        });
                        toastEvent.fire();

                        // fileInput.value='';
                        // return false;
                    }else{
                        if (file) {
                            // console.log("File");
                            var reader = new FileReader();

                            
                            reader.readAsText(file, "UTF-8");
                            
                            reader.onload = function (evt) {             
                                console.log("EVT FN");
                                var csv = evt.target.result;
                                //console.log('@@@ csv file contains'+ csv);
                                var result = helper.CSV2JSON(component,csv);
                                // console.log('@@@ result = ' + result);

                                if(result.length>0){
                                    let keys=Object.keys(result[0]);
                                    for(let k=0;k<keys.length;k++){

                                    }
                                    for(let i=0;i<result.length;i++){
                                        for(let j=0;j<keys.length;j++){
                                            if(result[i][keys[j]]==""){
                                                if(keys[j]=='Task'){
                                                    // Its under development
                                                    let tsk=result[i][keys[j]];
                                                    console.log(tsk);
                                                    if(typeof tsk === "string"){

                                                    }
                                                    else{
                                                        var toastEvent = $A.get("e.force:showToast");
                                                        toastEvent.setParams({
                                                            message: "Please fill the integer value "+keys[j]+" columns",
                                                            messageTemplate: 'Record {0} created! See it {1}!',
                                                            duration:' 5000',
                                                            key: 'info_alt',
                                                            type: 'error',
                                                            mode: 'pester'
                                                        });
                                                        toastEvent.fire();
                                                        return; 
                                                    }


                                                }
                                                else{
                                                    // console.log("Please fill the value "+keys[j]+" columns");

                                                    var toastEvent = $A.get("e.force:showToast");
                                                    toastEvent.setParams({
                                                        message: "Please fill the value "+keys[j]+" columns",
                                                        messageTemplate: 'Record {0} created! See it {1}!',
                                                        duration:' 5000',
                                                        key: 'info_alt',
                                                        type: 'error',
                                                        mode: 'pester'
                                                    });
                                                    toastEvent.fire();
                                                    return;
                                                    
                                                }
                                                // Its under development end here
                                            }
                                            else{
                                                if(keys[j]=='Actualhours'){
                                                    let hr=result[i][keys[j]];
                                                    if(helper.isInteger(hr)==true){

                                                    }
                                                    else{
                                                        var toastEvent = $A.get("e.force:showToast");
                                                        toastEvent.setParams({
                                                            message: "Please fill the integer value "+keys[j]+" columns",
                                                            messageTemplate: 'Record {0} created! See it {1}!',
                                                            duration:' 5000',
                                                            key: 'info_alt',
                                                            type: 'error',
                                                            mode: 'pester'
                                                        });
                                                        toastEvent.fire();
                                                        return; 
                                                    }
                                                }
                                                else if(keys[j]=='UploadDate'){
                                                    let dateStr=result[i][keys[j]];
                                                    let sl='/';
                                                    let ds='-';
                                                    let t;
                                                    if(dateStr.indexOf(sl)>0){
                                                        t=sl;
                                                    }
                                                    else if(dateStr.indexOf(ds)>0){
                                                        t=ds;
                                                    }
                                                    else{
                                                        var toastEvent = $A.get("e.force:showToast");
                                                        toastEvent.setParams({
                                                            message: "Please put MM/DD/YYYY format only",
                                                            messageTemplate: 'Record {0} created! See it {1}!',
                                                            duration:' 5000',
                                                            key: 'info_alt',
                                                            type: 'error',
                                                            mode: 'pester'
                                                        });
                                                        toastEvent.fire();
                                                        return;
                                                    }
                                                    let dateArr=dateStr.split(t);
                                                    // let dateArr2=dateStr.split("-");
                                                    if(helper.isInteger(dateArr[0])==true){
                                                        if(dateArr[0]>12){
                                                            // console.log("Please put MM/DD/YYYY format only");
                                                            var toastEvent = $A.get("e.force:showToast");
                                                            toastEvent.setParams({
                                                                message: "Please put MM/DD/YYYY format only",
                                                                messageTemplate: 'Record {0} created! See it {1}!',
                                                                duration:' 5000',
                                                                key: 'info_alt',
                                                                type: 'error',
                                                                mode: 'pester'
                                                            });
                                                            toastEvent.fire();
                                                            return;
                                                        }
                                                        else if(dateArr[1]>31){
                                                            // console.log("Please put MM/DD/YYYY format only");
                                                            var toastEvent = $A.get("e.force:showToast");
                                                            toastEvent.setParams({
                                                                message: "Please put MM/DD/YYYY format only",
                                                                messageTemplate: 'Record {0} created! See it {1}!',
                                                                duration:' 5000',
                                                                key: 'info_alt',
                                                                type: 'error',
                                                                mode: 'pester'
                                                            });
                                                            toastEvent.fire();
                                                            return;
                                                        }
                                                        else{
                                                            console.log(dateStr);
                                                            
                                                        }
                                                    }
                                                    else{
                                                        helper.successmessage();
                                                    }
                                                    
                                                }
                                                else{
                                                    console.log(keys[j]);
                                                    console.log(result[i][keys[j]]);
                                                    // helper.successmessage();
                                                }
                                            }
                                        }
                                    }
                                }

                                //console.log('@@@ Result = '+JSON.parse(result));
                                var jsn=JSON.stringify(result);

                                helper.CreateAccount(component,jsn);            
                                
                            }
                            reader.onloadend=e=>{
                                let r=reader.result;
                                // console.log("------------------------------------------oneadi---------------------------");
                                // console.log(r);
                            }
                            
                            
                            reader.onerror = function (evt) {
                                console.log("error reading file");
                            }
                        }
                    }

                    
                    component.set("v.Likedisable",true);
                    
                }else{
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        message: 'Please make sure the project Status is In Process',
                        messageTemplate: 'Record {0} created! See it {1}!',
                        duration:' 5000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'pester'
                    });
                    toastEvent.fire();
                    
                    var prjId = component.get('v.recordId');
                    var navEvt = $A.get("e.force:navigateToSObject");
                    navEvt.setParams({
                        
                        "recordId": prjId,
                        "slideDevName": "detail"
                        
                    });
                    navEvt.fire();
                }
                
            }
        });
        $A.enqueueAction(action); 
        
       
    }
    
    
    
})