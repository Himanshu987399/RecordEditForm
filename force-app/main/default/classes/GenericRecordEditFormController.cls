/**
* @Author       Himanshu Sharma
* @description ISS-000673  Class for getting apinames of fields behalf of fieldsetname and object api name.
*
*/
public class GenericRecordEditFormController {
    /**
    * @Author       Himanshu Sharma
    * @description ISS-000673  : Class for getting apinames of fields behalf of fieldsetname and object api name.
    * @return : it will return response (message,success,fieldsApiname)
    */
    @AuraEnabled(cacheable=false)
    public static Response getAllFieldApiName(String fieldSetName,String objectApiName){
        try{
            List<FieldData> fieldDataList = new List<FieldData>();
            Map<String, Schema.SObjectType> globalDescribeMap = Schema.getGlobalDescribe();
            Schema.SObjectType sObjectTypeObj = globalDescribeMap.get(objectApiName);
            Schema.DescribeSObjectResult describeSObjectResultObj = sObjectTypeObj.getDescribe();
            Schema.FieldSet fieldSetObj = describeSObjectResultObj.FieldSets.getMap().get(fieldsetName);
            for(Schema.FieldSetMember fieldSetMemberObj : fieldSetObj.getFields()) {
                FieldData fieldDataInstance = new FieldData(fieldSetMemberObj.getFieldPath(),fieldSetMemberObj.getLabel(),String.valueOf(fieldSetMemberObj.getType()),fieldSetMemberObj.getRequired());
                fieldDataList.add(fieldDataInstance);
            }
            return (new Response('',true,fieldDataList)); 
            
        }catch(Exception ex){
            return (new Response(ex.getMessage(),false,new List<FieldData>())); 
        }
    }
    public class Response{
        @AuraEnabled
        public String message {get;set;}
        @AuraEnabled
        public Boolean isSuccess {get;set;}
        @AuraEnabled
        public List<FieldData> fieldData {get;set;}
        public Response(String messageP,Boolean isSuccessP,List<FieldData> fieldDataP){
            message = messageP;
            isSuccess = isSuccessP;
            fieldData = fieldDataP;
        }
    }
    public class FieldData{
        @AuraEnabled
        public String apiName {get;set;}
        @AuraEnabled
        public String label {get;set;}
        @AuraEnabled 
        public String dataType {get;set;}
        @AuraEnabled 
        public Boolean isRequired {get;set;}
        public FieldData(String apiNameP,String labelP,String dataTypeP,Boolean isRequiredp){
            apiName = apiNameP;
            label = labelP;
            dataType = dataTypeP;
            isRequired = isRequiredP;
        }
    }
}