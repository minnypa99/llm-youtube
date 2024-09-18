var youtubeResp = context.getVariable("youtubeResponse.content") || "{}";
var lang_code = context.getVariable("youtube.lang");

var resp = {};

if ( resp === "{}"){
    
    // do nothing
    
}else{
    
    var jsonResponse = JSON.parse(youtubeResp);
    var items = jsonResponse.items;
    
    context.setVariable("youtube.items", JSON.stringify(items));
    
    //var query = '당신은 현재 가장 인기있는유투브 동영상의 트렌드를 요약해주는 어시스턴트입니다. ';
    //query += '트렌드 요약은 <context> 내에 있는 정보를 참고해서 다음과 같이 최대한 상세하게 요약해주세요. ';
    //query += '요약결과는 <lang> 내에 있는 언어로 만들어주세요. ';
    //query += '1. 트렌드 요약 ';
    //query += '2. 주요 관심사 ';
    //query += '3. 추론 결과 ';
    
    
    var query = 'You are an assistant who summarizes trends in YouTube videos. ';
    query += 'Please summarize the trend in as much detail as possible, referring to the information in <context>. ';
    query += 'Please write in the language contained within <lang>. ';
    query += '1. Trend Summary ';
    query += '2. Main Interests ';
    query += '3. Inference Results ';
    
    var info ='<context>';
    
    for(var i =0; i< items.length; i++){
        var obj = items[i];
        info += 'channel title: '+ obj.snippet.channelTitle;
        info += ' contents title: ' + obj.snippet.title;        
    }
    
    info += '</context>';
    
    var lang = '<lang>';
    lang += lang_code;
    lang +='</lang>';
    
    //query += info;
    
    context.setVariable("llm.query", query);
    context.setVariable("llm.info", info);
    context.setVariable("llm.lang", lang)

}  
