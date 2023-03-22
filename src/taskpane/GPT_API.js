const { Configuration, OpenAIApi } = require("openai");

var key;

const configuration = new Configuration({
  apiKey: key,
});
var currentOPENAIApi = new OpenAIApi(configuration);

//set_key(key);

export async function set_key(newKey) {
  var OldOpenAIApi = currentOPENAIApi;
  var NewConfiguration = new Configuration({
    apiKey: newKey,
  });

  const NewOpenAIApi = new OpenAIApi(NewConfiguration);

  if (await key_validation(NewOpenAIApi)) {
    console.log("Key correct");
    currentOPENAIApi = NewOpenAIApi;
    return true;
  } else {
    console.log("Key incorrect");
    currentOPENAIApi = OldOpenAIApi;
    return false;
  }
}

// const openai = new OpenAIApi(configuration);

export async function text_completion_GPT3(text) {
  const response = await currentOPENAIApi.createChatCompletion({
    model: "gpt-3.5-turbo", //es existieren verschieden Modelle des GPT davinci003 max request 4000 tokens, beste Qualität
    messages: [
      { role: "system", content: "du antwortest sachlich" },
      { role: "user", content: "Complete this text and keep the original Language: " + text },
    ],
  });

  // console.log("Anfrage: Complete this Text and keep the original Language: "+ text)
  console.log("Antwort: " + response.data.choices[0].message.content);
  // console.log("Anfrage ID: "+response.data.id);
  // console.log("Tokens für Anfrage: "+response.data.usage.prompt_tokens);
  // console.log("Tokens für Antwort: "+response.data.usage.completion_tokens);
  // console.log("Insgesamt verwendete Token: "+response.data.usage.total_tokens);

  return response.data.choices[0].message.content; //für den Text des Ergebnisses: response.data.choices[0].message.content
}

export async function text_completion_Davinci (text){
  const response = await currentOPENAIApi.createCompletion({
    model: "text-davinci-003",     //es existieren verschieden Modelle des GPT davinci003 max request 4000 tokens, beste Qualität
    prompt: "Complete this text and keep the original language: " + text,
    temperature: 0,
    max_tokens: 100,
  });

  console.log("Antwort: "+response.data.choices[0].text);
  return response.data.choices[0].text;
}

export async function text_correction_GPT3(text) {
  const response = await currentOPENAIApi.createChatCompletion({
    model: "gpt-3.5-turbo", //es existieren verschieden Modelle des GPT davinci003 max request 4000 tokens, beste Qualität
    messages: [
      { role: "system", content: "du antwortest sachlich" },
      { role: "user", content: "Correct Spelling and Grammar of the following Text and keep the original Languageof the following text: " + text },
    ],
  });

  /*  console.log("Anfrage: Correct Spelling and Grammar of the following Text and keep the original Language: " + text);*/
  console.log("Antwort: " + response.data.choices[0].message.content);
  /* console.log("Anfrage ID: " + response.data.id);
  console.log("Tokens für Anfrage: " + response.data.usage.prompt_tokens);
  console.log("Tokens für Antwort: " + response.data.usage.completion_tokens);
  console.log("Insgesamt verwendete Token: " + response.data.usage.total_tokens);
  console.log("Kosten: " + ((response.data.usage.total_tokens / 1000) * 0, 2) + " cent");*/

  return response.data.choices[0].message.content; //für den Text des Ergebnisses: response.data.choices[0].message.content
}

export async function text_correction_Davinci (text){
  const response = await currentOPENAIApi.createCompletion({
    model: "text-davinci-003",     //es existieren verschieden Modelle des GPT davinci003 max request 4000 tokens, beste Qualität
    prompt: "Correct Spelling and Grammar of the following text and keep the original Language of the following text: " + text,
    temperature: 0,
    max_tokens: 100,
  });

  console.log("Antwort: "+response.data.choices[0].text);
  return  response.data.choices[0].text;
}

export async function text_translation(text, Language) {
  const response = await currentOPENAIApi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant that translates to" + Language },
      { role: "user", content: "Translate the following text to" + Language + ": " + text },
    ],
  });

  //console.log("Anfrage: Correct Spelling and Grammar of the following Text and keep the original Language: " + text);
  console.log("Antwort: " + response.data.choices[0].message.content);
  //console.log("Anfrage ID: " + response.data.id);
  //console.log("Tokens für Anfrage: " + response.data.usage.prompt_tokens);
  //console.log("Tokens für Antwort: " + response.data.usage.completion_tokens);
  //console.log("Insgesamt verwendete Token: " + response.data.usage.total_tokens);
  //console.log("Kosten: " + ((response.data.usage.total_tokens / 1000) * 0, 2) + " cent");

  return response; //für den Text des Ergebnisses: response.data.choices[0].message.content
}

export async function key_validation(API) {
  try {
    const response = await API.createCompletion({
      model: "ada",
      prompt: "hi",
      max_tokens: 1,
    });
    console.log("Kein Error");
    return true;
  } catch (error) {
    console.error(error);
    console.log("Error");
    return false;
  }
}

export async function image_generation(description) {
  const response = await currentOPENAIApi.createImage({
    prompt: description,
    n: 1,
    size: "1024x1024",
  });
  var image_url = await response.data.data[0].url;
  console.log(image_url);
}

//TextMitFehlern = "falls du bis morgen noch Zeit/Lust hast köntest du eventül noch ne Funktion implementieren, in der der API Key angewandt/überschrieben wird. ";
//TextZumFortführen = "George washington war der";

//set_key(key);

//text_completion_Davinci(TextZumFortführen);

//text_completion_GPT3(TextZumFortführen);

//text_correction_Davinci(TextMitFehlern);

//text_correction_GPT3(TextMitFehlern);

//text_translation(TEXT1,"deutsch")
//key_validation();
//image_generation(null);
