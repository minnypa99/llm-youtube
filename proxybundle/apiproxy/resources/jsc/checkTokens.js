var respData = context.getVariable("response.content") || "{}";

context.setVariable("req_token_count", 0);
context.setVariable("res_token_count", 0);    
    
if ( respData === "{}"){
    
    // do nothing
    
}else{
    
    var jsonData = JSON.parse(respData);
    var basepath = context.getVariable("proxy.basepath");
    
    var reqTokens = 0;
    var resTokens = 0;
    

    reqTokens = parseInt(reqTokens);
    resTokens = parseInt(resTokens);
    
    if( basepath == "/llm-demo-query"){
        reqTokens = reqTokens + parseInt(jsonData.usageMetadata.promptTokenCount);
        resTokens = resTokens + parseInt(jsonData.usageMetadata.candidatesTokenCount);
        
        context.setVariable("req_token_count", reqTokens);
        context.setVariable("res_token_count", resTokens);   
    
        var kst = crypto.dateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ",'GMT+9', context.getVariable("client.received.start.timestamp"));
        context.setVariable("llm.kstimestamp", kst);
        
        context.setVariable("llm.cachehit", false);
        context.setVariable("llm.result", 'Success');
    
        context.setVariable("llm.response", JSON.stringify(jsonData.candidates[0].content.parts[0].text));
        context.setVariable("response.header.content-type", "application/json");        
    }else{
        reqTokens = reqTokens + parseInt(jsonData.metadata.promptTokenCount);
        resTokens = resTokens + parseInt(jsonData.metadata.candidatesTokenCount);
        
        context.setVariable("req_token_count", reqTokens);
        context.setVariable("res_token_count", resTokens);   
    
        var kst = crypto.dateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ",'GMT+9', context.getVariable("client.received.start.timestamp"));
        context.setVariable("llm.kstimestamp", kst);
        
        context.setVariable("llm.cachehit", context.getVariable("responsecache.RC-geminiResponse.cachehit"));
        context.setVariable("llm.result", 'Success');
    
        context.setVariable("llm.response", JSON.stringify(jsonData.gemini));
        context.setVariable("response.header.content-type", "application/json");
    }
}  