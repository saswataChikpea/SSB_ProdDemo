import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import csvFileRead from '@salesforce/apex/uploadProjectDetailsCSV.csvFileRead';

export default class ExportUploadProjects extends NavigationMixin(LightningElement) {


    acceptedCSVFormats = ['.csv']

    downloadProjects(){
        // Download all the projects (only projects with status in process, with only phases that are open and not pending or closed.)
        // Updated (with only phases that are In Process and not pending or closed.)
        console.log('downloadProjects called.');

        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/apex/downloadProjectDetailsCSV'
            }
        })

    }
    uploadFileHandler(event){
        console.log('uploadFileHandler called');

        const uploadedFiles = event.detail.files;
        console.log('file uploaded == ', JSON.stringify(uploadedFiles));

        csvFileRead({contentDocumentId : uploadedFiles[0].documentId})
        .then(result => {
            window.console.log('result ===> '+result);
            this.data = result;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success!!',
                    message: 'Project details are updated according to the CSV file upload!!!',
                    variant: 'Success',
                }),
            );
        })
        .catch(error => {
            this.error = error;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error!!',
                    message: JSON.stringify(error),
                    variant: 'error',
                }),
            );     
        })
    }
    

}