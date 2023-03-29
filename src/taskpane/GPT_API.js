const { Configuration, OpenAIApi } = require("openai");

const GPTAPI_Commands_Automatic_Language = {
  Completion: `Complete this text and keep the original Language: `,
  Correction: `Correct Spelling and Grammar of the following Text and keep the original Language of the following text, if there are no mistakes return Original text: `,
  Translation: `Translate the following text to `,
};
const GPTAPI_Commands_English = {
  Completion: `Complete this text in english: `,
  Correction: `Correct Spelling and Grammar of the following Text in English, if there are no mistakes return Original text: `,
  Translation: `Translate the following text from english to `,
};
const GPTAPI_Commands_German = {
  Completion: `Verfolständige diesen Text in Deutsch: `,
  Correction: `Verbessere Rechtschreibung und Grammatik auf deutsch in dem folgenden Text: `,
  Translation: `Überstze den folgenden Text von Deutsch nach `,
};
const GPTAPI_Commands_Role_System_English = "You are a helpful assistant.";
const GPTAPI_Commands_Role_System_German = "Du bist ein Hilfsbereiter Assistent.";

const configuration = new Configuration({
  apiKey: null,
});
var currentOPENAIApi = new OpenAIApi(configuration);

var request_template, assistant_behavior;

//set_key(key);

/**set_key
 * Description.     A function to set a key for the OpenAIAPI and verify it
 *                  (If given same text multiple times it returns different answers)
 * @param in {string}           newKey          Key you want to validate
 * @param out{bool}                             True if Key is Valid, False if key is Invalid
 */
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

/**text_completion_GPT3
 * Description.     A function to let the GPT3.5 API from OpenAI complete a given text
 *                  (If given same text multiple times it returns different answers)
 * @param in {string}           text            Text you want the GPTAI to complete
 * @param in {string}           language        Language in wich you want the GPTAI to answer. Currently supporting "english","german" and "automatic"
 * @param out{string}                           The text the GPTAI returned.
 */
export async function text_completion_GPT3(text, language) {
  switch (language) {
    case "english":
      request_template = GPTAPI_Commands_English.Completion;
      assistant_behavior = GPTAPI_Commands_Role_System_English;
      break;
    case "german":
      request_template = GPTAPI_Commands_German.Completion;
      assistant_behavior = GPTAPI_Commands_Role_System_German;
      break;
    case "automatic":
      request_template = GPTAPI_Commands_Automatic_Language.Completion;
      assistant_behavior = GPTAPI_Commands_Role_System_English;
      break;
  }

  const response = await currentOPENAIApi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: assistant_behavior },
      { role: "user", content: request_template + text },
    ],
  });

  console.log("Antwort: " + response.data.choices[0].message.content);
  return response.data.choices[0].message.content; //für den Text des Ergebnisses: response.data.choices[0].message.content
}

/**text_completion_Davinci
 * Description.     A function to let the Davinci API from OpenAI complete a given text
 *                  (If given same text multiple times it returns the same answer)
 * @param in {string}           text            Text you want the GPTAI to complete
 * @param in {string}           language        Language in wich you want the GPTAI to answer. Currently supporting "english","german" and "automatic"
 * @param out{string}                           The text the GPTAI returned.
 */
export async function text_completion_Davinci(text, language) {
  switch (language) {
    case "english":
      request_template = GPTAPI_Commands_English.Completion;
      break;
    case "german":
      request_template = GPTAPI_Commands_German.Completion;
      break;
    case "automatic":
      request_template = GPTAPI_Commands_Automatic_Language.Completion;
      break;
  }
  const response = await currentOPENAIApi.createCompletion({
    model: "text-davinci-003",
    prompt: request_template + text,
    temperature: 0,
    max_tokens: 100,
  });

  console.log("Antwort: " + response.data.choices[0].text);
  return response.data.choices[0].text;
}

/**text_correction_GPT3
 * Description.     A function to let the Davinci API from OpenAI correct a given text
 *                  (If given same text multiple times it returns the same answer)
 * @param in {string}           text            Text you want the GPTAI to correct
 * @param in {string}           language        Language in wich you want the GPTAI to answer. Currently supporting "english","german" and "automatic"
 * @param out{string}                           The text the GPTAI returned.
 */
export async function text_correction_GPT3(text, language) {
  switch (language) {
    case "english":
      request_template = GPTAPI_Commands_English.Correction;
      assistant_behavior = GPTAPI_Commands_Role_System_English;
      break;
    case "german":
      request_template = GPTAPI_Commands_German.Correction;
      assistant_behavior = GPTAPI_Commands_Role_System_German;
      break;
    case "automatic":
      request_template = GPTAPI_Commands_Automatic_Language.Correction;
      assistant_behavior = GPTAPI_Commands_Role_System_English;
      break;
  }

  const response = await currentOPENAIApi.createChatCompletion({
    model: "gpt-3.5-turbo", //es existieren verschieden Modelle des GPT davinci003 max request 4000 tokens, beste Qualität
    messages: [
      { role: "system", content: assistant_behavior },
      { role: "user", content: request_template + text },
    ],
  });

  console.log("Antwort: " + response.data.choices[0].message.content);
  return response.data.choices[0].message.content; //für den Text des Ergebnisses: response.data.choices[0].message.content
}

/**text_correction_Davinci
 * Description.     A function to let the Davinci API from OpenAI correct a given text
 *                  (If given same text multiple times it returns the same answer)
 * @param in {string}           text            Text you want the GPTAI to correct
 * @param in {string}           language        Language in wich you want the GPTAI to answer. Currently supporting "english","german" and "automatic"
 * @param out{string}                           The text the GPTAI returned.
 */
export async function text_correction_Davinci(text, language) {
  switch (language) {
    case "english":
      request_template = GPTAPI_Commands_English.Correction;
      break;
    case "german":
      request_template = GPTAPI_Commands_German.Correction;
      break;
    case "automatic":
      request_template = GPTAPI_Commands_Automatic_Language.Correction;
      break;
  }

  const response = await currentOPENAIApi.createCompletion({
    model: "text-davinci-003", //es existieren verschieden Modelle des GPT davinci003 max request 4000 tokens, beste Qualität
    prompt: request_template + text,
    temperature: 0,
    max_tokens: 100,
  });

  console.log("Antwort: " + response.data.choices[0].text);
  return response.data.choices[0].text;
}

/**text_translation
 * Description.     A function to let the Davinci API from OpenAI translate a given text
 *                  (If given same text multiple times it returns the same answer)
 * @param in {string}           text            Text you want the GPTAI to translate
 * @param in {string}           originallanguageLanguage in wich you want the GPTAI to answer. Currently supporting "english","german" and "automatic"
 * @param in {string}           resultLanguage  Language you want the result text in. All Languages are supported
 * @param out{string}                           The text the GPTAI returned.
 */
export async function text_translation(text, originallanguage, resultLanguage) {
  switch (originallanguage) {
    case "english":
      request_template = GPTAPI_Commands_English.Translation + resultLanguage + ":";
      assistant_behavior = GPTAPI_Commands_Role_System_English;
      break;
    case "german":
      request_template = GPTAPI_Commands_German.Translation + resultLanguage + ":";
      assistant_behavior = GPTAPI_Commands_Role_System_German;
      break;
    case "automatic":
      request_template = GPTAPI_Commands_Automatic_Language.Translation + resultLanguage + ":";
      assistant_behavior = GPTAPI_Commands_Role_System_English;
      break;
  }

  const response = await currentOPENAIApi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: assistant_behavior },
      { role: "user", content: request_template + text },
    ],
  });
  console.log("Antwort: " + response.data.choices[0].message.content);
  return response.data.choices[0].message.content; //für den Text des Ergebnisses: response.data.choices[0].message.content
}

/**key_validation
 * Description.     A function to validate a key for the OpenAIAPI
 *                  (If given same text multiple times it returns different answers)
 * @param in {string}           API             API you want to validate
 * @param out{bool}                             True if Key is Valid, False if key is Invalid
 */
export async function key_validation(API) {
  try {
    await API.createCompletion({
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

/**Chatbot
 * Description.     A function to use the OpenAIAPI as Chatbot
 *                  (If given same text multiple times it returns different answers)
 * @param in {string}           request         API you want to validate
 * @param out{string}                           The text the GPTAI returned.
 */
export async function Chatbot(request) {
  const response = await currentOPENAIApi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant" },
      { role: "user", content: request },
    ],
  });

  return response.data.choices[0].message.content;
}

/**image_generation
 * Description.     A function to use the OpenAIAPI as Chatbot
 *                  (If given same text multiple times it returns different answers)
 * @param in {string}           description     Description of the Picture you want
 * @param out{string}                           Image URL
 */
export async function image_generation(description) {
  const response = await currentOPENAIApi.createImage({
    prompt: description,
    n: 1,
    size: "1024x1024",
  });
  var image_url = await response.data.data[0].url;
  console.log(image_url);
}
