const { Configuration, OpenAIApi } = require("openai");

var key = "";

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

export async function text_completion(text) {
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

export async function text_correction(text) {
  const response = await currentOPENAIApi.createChatCompletion({
    model: "gpt-3.5-turbo", //es existieren verschieden Modelle des GPT davinci003 max request 4000 tokens, beste Qualität
    messages: [
      { role: "system", content: "du antwortest sachlich" },
      { role: "user", content: "Correct this text and keep the original Language: " + text },
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

async function key_validation(API) {
  try {
    const response = await API.createCompletion({
      model: "ada",
      prompt: "hi",
      max_tokens: 1,
    });
    console.log("Kein Error");
    console.log(response.data.choices[0].text);
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
  image_url = await response.data.data[0].url;
  console.log(image_url);
}

//set_key(key);

//text_completion(TEXT);
//text_correction(TEXT);
//text_translation(TEXT1,"deutsch")
//key_validation();
//image_generation(null);
