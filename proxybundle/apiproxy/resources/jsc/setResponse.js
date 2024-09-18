var youtubeResp = context.getVariable("youtube.items") || "{}";
var resp = {};

if ( youtubeResp === "{}"){
    
    // do nothing
    
}else{
    
    resp["items"] = JSON.parse(youtubeResp);
    
    var geminiResp = context.getVariable("response.content");
    var geminiRespJson = JSON.parse(geminiResp);
    
    resp["gemini"] = geminiRespJson.candidates[0].content.parts[0].text;
    resp["metadata"] = geminiRespJson.usageMetadata;
    
    context.setVariable("response.header.content-type", "applciation/json")
    context.setVariable("response.content", JSON.stringify(resp) );

}  