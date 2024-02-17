import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Kindly_choose_the_field_set_name from '@salesforce/label/c.Kindly_choose_the_field_set_name';
import Provide_api_name from '@salesforce/label/c.provide_api_name';
import You_have_the_option_to_either_edit_the_record_or_view_it from '@salesforce/label/c.You_have_the_option_to_either_edit_the_record_or_view_it';
import You_can_either_view_the_record_or_clone_it from '@salesforce/label/c.You_can_either_view_the_record_or_clone_it';
import You_have_the_choice_to_either_edit_the_record_or_clone_it from '@salesforce/label/c.You_have_the_choice_to_either_edit_the_record_or_clone_it';
import For_view_only_record_record_id_is_required from '@salesforce/label/c.For_view_only_record_record_id_is_required';
import To_clone_a_record_the_record_ID_is_required from '@salesforce/label/c.To_clone_a_record_the_record_ID_is_required';
import To_edit_a_record_the_record_ID_is_required from '@salesforce/label/c.To_edit_a_record_the_record_ID_is_required';
import Provide_api_name_or_field_set from '@salesforce/label/c.Provide_api_name_or_field_set';
import Please_choose_the_checkbox_for_the_field_set from '@salesforce/label/c.Please_choose_the_checkbox_for_the_field_set';
import Please_choose_either_the_field_set_presence_or_provide_the_API_names_for_the_fie from '@salesforce/label/c.Please_choose_either_the_field_set_presence_or_provide_the_API_names_for_the_fie';
import Successfully_submit from '@salesforce/label/c.Successfully_submit';
import getAllFieldApiNameAndData from '@salesforce/apex/GenericRecordEditFormController.getAllFieldApiName';
import { NavigationMixin } from 'lightning/navigation';
import { createRecord } from 'lightning/uiRecordApi';

export default class GenericRecordEditForm extends NavigationMixin(LightningElement) {

    @api isFeildSetPresent;
    @api displayLog;
    @api objectApiName;
    @api fieldSetName;
    @api coloumns;
    @api headerOfRecordForm;
    @api navigateRecord;
    @api recordId;
    @api viewOnly;
    @api cloneRecord;
    @api editRecord;
    isLoading = true;
    isError = false;
    errorMessage = '';
    isDisable = false;
    displayData = [];

    get showHeader() {
        return this.headerOfRecordForm == undefined ? false : true;
    }
    get showFooter() {
        return this.isError || this.viewOnly ? false : true;
    }
    connectedCallback() {
        try {
            this.validateTargetConfigData();
            if (this.isError) {
                this.isLoading = false;
            } else {
                if (this.isFeildSetPresent) {
                    this.getFieldsFormFieldSet()
                } else {
                    this.createFields();
                }
            }
        } catch (error) {
            this.consoleMessageShow(true, error);
        }
    }
    validateTargetConfigData() {
        try {
            this.isError = false;
            this.errorMessage = '';
            if (this.isFeildSetPresent && (this.fieldSetName == '' || this.fieldSetName == null || this.fieldSetName == undefined)) {
                this.isError = true;
                this.errorMessage = Kindly_choose_the_field_set_name;
            } else if (!this.isFeildSetPresent && (this.coloumns == '' || this.coloumns == null || this.coloumns == undefined) && (this.fieldSetName == '' || this.fieldSetName == null || this.fieldSetName == undefined)) {
                this.isError = true;
                this.errorMessage = Provide_api_name;
            } else if (this.coloumns != undefined && this.fieldSetName != undefined) {
                this.isError = true;
                this.errorMessage = Provide_api_name_or_field_set;
            } else if (!this.isFeildSetPresent && this.fieldSetData != undefined) {
                this.isError = true;
                this.errorMessage = Please_choose_the_checkbox_for_the_field_set;
            } else if (this.isFeildSetPresent && this.coloumns != undefined) {
                this.isError = true;
                this.errorMessage = Please_choose_either_the_field_set_presence_or_provide_the_API_names_for_the_fie;
            } else if (this.viewOnly && this.editRecord) {
                this.isError = true;
                this.errorMessage = You_have_the_option_to_either_edit_the_record_or_view_it;
            }
            else if (this.viewOnly && this.cloneRecord) {
                this.isError = true;
                this.errorMessage = You_can_either_view_the_record_or_clone_it;
            } else if (this.editRecord && this.cloneRecord) {
                this.isError = true;
                this.errorMessage = You_have_the_choice_to_either_edit_the_record_or_clone_it;

            }
            else if (this.viewOnly && this.recordId == undefined) {
                this.isError = true;
                this.errorMessage = For_view_only_record_record_id_is_required;
            }
            else if (this.cloneRecord && this.recordId == undefined) {
                this.isError = true;
                this.errorMessage = To_clone_a_record_the_record_ID_is_required;
            }
            else if (this.editRecord && this.recordId == undefined) {
                this.isError = true;
                this.errorMessage = To_edit_a_record_the_record_ID_is_required;
            }
            else {
                this.isError = false;
                this.errorMessage = '';
            }
        } catch (error) {
            this.consoleMessageShow(true, error);
        }
    }
    getFieldsFormFieldSet() {
        try {
            getAllFieldApiNameAndData({ fieldSetName: this.fieldSetName, objectApiName: this.objectApiName }).then((result) => {
                if (result.isSuccess) {
                    this.displayData = result.fieldData;
                } else {
                    this.isError = true;
                    this.errorMessage = result.message;
                    this.isLoading = false;
                }
            }).catch((err) => {
                this.showMessage(err, 'error', 'Error');
                this.consoleMessageShow(true, err);
            });
        } catch (error) {
            this.consoleMessageShow(true, error);
        }
    }
    createFields() {
        try {
            let columnsData = this.coloumns.split(',');
            columnsData.forEach(currentItem => {
                let required = currentItem.startsWith('(') && currentItem.endsWith(')') ? true : false;
                let apiNames = required ? currentItem.replace(/[()]/g, '') : currentItem;
                this.displayData.push({
                    apiName: apiNames,
                    isRequired: required
                })
            });
        } catch (error) {
            this.isError = true;
            this.errorMessage = error;
            this.consoleMessageShow(true, error);
        }
    }
    handleLoad() {
        this.isLoading = false;
    }
    handleClick() {
        try {
            this.isLoading = true;
            const fields = {};
            let isRequiredMissing = false;
            const inputFields = this.template.querySelectorAll(
                'lightning-input-field'
            );
            inputFields.forEach(element => {
                fields[element.fieldName] = element.value;
                if (element.required && (element.value === '' || element.value === null || element.value === undefined) && element.value !== true && element.value !== false) {
                    isRequiredMissing = true;
                }
            });
            if (!isRequiredMissing) {
                if (this.cloneRecord) {
                    this.createCloneRecord(fields);
                } else {
                    this.template.querySelector('lightning-record-edit-form').submit();
                }
            } else {
                this.template.querySelectorAll('lightning-input-field').forEach(element => {
                    element.reportValidity();
                });
                this.isLoading = false;
            }
        } catch (error) {
            this.consoleMessageShow(true, error);
        }
    }
    createCloneRecord(fields) {
        try {
            const recordInput = { apiName: this.objectApiName, fields };
            createRecord(recordInput)
                .then(response => {
                    this.showMessage(Successfully_submit, 'success', 'success');
                    if (this.navigateRecord) {
                        this.navigateToRecord(response.id);
                    }
                    this.isLoading = false;
                })
                .catch(error => {
                    this.consoleMessageShow(false, error);
                    this.showMessage(error.body.message, 'Error', 'Error');
                    this.isLoading = false;
                });
        } catch (error) {
            this.consoleMessageShow(true, error);
        }

    }
    handleError(event) {
        try {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.showMessage(event.detail.detail, 'Error', 'Error');
            this.isLoading = false;
        } catch (error) {
            this.consoleMessageShow(true, error);
        }
    }
    handleSuccess(event) {
        try {
            this.showMessage(Successfully_submit, 'success', 'success');
            if (this.navigateRecord) {
                this.navigateToRecord(event.detail.id);
            } else {
                this.isLoading = false;
            }
        } catch (error) {
            this.consoleMessageShow(true, error);
        }
    }
    navigateToRecord(recordId) {
        try {
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: recordId,
                    actionName: 'view'
                }
            });
        } catch (error) {
            this.consoleMessageShow(true, error);
        }

    }
    showMessage(message, variant, title) {
        try {
            const event = new ShowToastEvent({
                title: title,
                variant: variant,
                mode: 'dismissable',
                message: message
            });
            this.dispatchEvent(event);
        } catch (error) {
            this.consoleMessageShow(true, error);
        }
    }
    consoleMessageShow(isError, message) {
        try {
            if (isError && this.displayLog) {
                console.error(message);
            }
            if (this.displayLog && !isError) {
                console.log(message);
            }
        } catch (error) {
            if (this.displayLog) {
                console.error(error);
            }
        }
    }
}