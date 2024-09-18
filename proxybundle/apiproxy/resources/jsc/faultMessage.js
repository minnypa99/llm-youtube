
context.setVariable("error.header.Content-Type", "application/json" );

var err = context.getVariable("error.content") || "{}";
var errJson, fault_name, fault_message, fault_code, fault_reason;

fault_name = context.getVariable("fault.name");

if( err == "{}"){
    fault_code = fault_name;
    fault_reason = "Error on calling Backend";
}else{
    errJson = JSON.parse(err);
    
    if( errJson.fault && errJson.fault.detail ){
        fault_code = errJson.fault.detail.errorcode;
        fault_reason = errJson.fault.faultstring;
        
    }else{
        fault_code = fault_name;
        fault_reason = errJson;
    }
}



switch( fault_code){
    case "policies.ratelimit.QuotaViolation" :
        //fault_message = "Quota exceeded. Ask Administrator!";
        fault_message = "Quota exceeded. Please try again later.";
        break;
    case "steps.regexprotection.ThreatDetected" :
        fault_message = "Disallowd words exist. Please try again!";
        break;
    case "steps.extractvariables.InvalidJSONPath" :
        fault_message = "Error in Request Data. model, prompt, apikey required!";
        context.setVariable("llm.model", "Error");
        context.setVariable("llm.query", "Error");
        break;
    case "steps.extractvariables.ExecutionFailed" :
        fault_message = "Syntax error on Request JSON";
        context.setVariable("llm.model", "Error");
        context.setVariable("llm.query", "Error");
        break;
    case "steps.extractvariables.UnableToCast" :
        fault_message = "Error in Request Data. model, prompt, apikey required!";
        context.setVariable("llm.model", "Error");
        context.setVariable("llm.query", "Error");
        break;        
    case "oauth.v2.InvalidApiKey" :
        fault_message = "Unregistered API Key!";
        break;      
    case "steps.oauth.v2.FailedToResolveAPIKey" :
        fault_message = "Unable to resolve API Key!";
        break;           
    case "oauth.v2.InvalidApiKeyForGivenResource" :
        fault_message = "API Key No permission on the given resources";
        break;          
    case "steps.servicecallout.ExecutionFailed" :
        fault_message = "Error executing ServiceCallout"
        break;
    case "ErrorResponseCode" :
        fault_message = "Error response from Backend";
        break;        
    case "messaging.adaptors.http.flow.ErrorResponseCode" :
        fault_message = "Error on calling Backend";
        break;           
    case "steps.javascript.ScriptExecutionFailed" :
        fault_message = "Error executing Javascript";
        break;        
    default :
        fault_message = "Internal Error happened. Ask Administrator!";
}


//print("faultname : " + faultname);
//print("err_payload : " + JSON.stringify(err_payload));

var kst = crypto.dateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ",'GMT+9', context.getVariable("client.received.start.timestamp"));
context.setVariable("llm.kstimestamp", kst);

var err_response = {};
err_response["fault"] = {};
err_response["fault"]["message"] = fault_message;
err_response["fault"]["code"] = fault_code
err_response["fault"]["detail"] = fault_reason;

context.setVariable("error.content", JSON.stringify(err_response));    
context.setVariable("llm.response", JSON.stringify(err_response));   
context.setVariable("error.status.code", 200 );
 
context.setVariable("llm.cachehit", false);  
context.setVariable("req_token_count", 0);
context.setVariable("res_token_count", 0);

   