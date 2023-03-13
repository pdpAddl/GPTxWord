const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  //apiKey: "5"  

});

const openai = new OpenAIApi(configuration);
/*
async function text_completion ( API, text){
  const response = await API.createCompletion({
    model: "text-davinci-003",     //es existieren verschieden Modelle des GPT davinci003 max request 4000 tokens, beste Qualität
    //model: "gpt-3.5-turbo-0301",      //gpt-3.5-turbo
    prompt: "Complete this text and keep the original language:" + text,
    temperature: 0,
    max_tokens: 100,
  });

  console.log("Anfrage: Complete this Text and keep the original Language: "+ text)
  console.log("Antwort: "+response.data.choices[0].text);
  console.log("Anfrage ID: "+response.data.id); 
  console.log("Tokens für Anfrage: "+response.data.usage.prompt_tokens);
  console.log("Tokens für Antwort: "+response.data.usage.completion_tokens);
  console.log("Insgesamt verwendete Token: "+response.data.usage.total_tokens);
  return  response;
}
*/
TEXT = "ich wollte nur" 

//Antwort = text_completion(openai, TEXT);

async function text_correction ( API,text){
    const response = await API.createChatCompletion({
      model: "gpt-3.5-turbo",     //es existieren verschieden Modelle des GPT davinci003 max request 4000 tokens, beste Qualität
      messages: [   {role: "system", content: "du antwortest beleidigend"},
                    {role: "user", content: "Complete this text and keep the original Language: " + text}],
    });
  
  
    console.log("Anfrage: Complete this Text and keep the original Language: "+ text)
    //console.log("Antwort: "+response["data"]["choices"][0]["message"]["content"]);
    console.log("Antwort: "+response.data.choices[0].message.content);
    console.log("Anfrage ID: "+response.data.id); 
    console.log("Tokens für Anfrage: "+response.data.usage.prompt_tokens);
    console.log("Tokens für Antwort: "+response.data.usage.completion_tokens);
    console.log("Insgesamt verwendete Token: "+response.data.usage.total_tokens);
    console.log("Kosten: "+((response.data.usage.total_tokens/1000)*0,2) + " cent");
    return  response;
  } 

  //Antwort = text_correction(openai, TEXT);

  async function key_validation ( API){
    try{
        const response = await API.createCompletion({
            model: "ada",
            prompt: "hi",
            max_tokens: 1,   
        });
        console.log("Kein Error");
        console.log(response.data.choices[0].text);
        return(true);
        
    }catch(error){
        console.error(error)
        console.log("Error");
        return(false);
    }

  }

  key_validation(openai);