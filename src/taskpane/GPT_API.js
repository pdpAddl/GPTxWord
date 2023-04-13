const { Configuration, OpenAIApi } = require("openai");

const SupportedLanguages = {
  Automatic: `Automatic`,
  English: `English`,
  German: `German`,
};

const GptApiCommandsSystemRole = {
  Automatic: `You are a helpful assistant.`,
  English: `You are a helpful assistant.`,
  German: `Du bist ein Hilfsbereiter Assistent.`,
};

const GptApiCommandsCompletion = {
  Automatic: `Complete this text and keep the original Language: `,
  English: `Complete this text in english: `,
  German: `Verfolständige diesen Text in Deutsch: `,
};

const GptApiCommandsCorrection = {
  Automatic: `Correct Spelling and Grammar of the following Text and keep the original Language of the following text, if there are no mistakes return Original text: `,
  English: `Correct Spelling and Grammar of the following Text in English, if there are no mistakes return Original text: `,
  German: `Verbessere Rechtschreibung und Grammatik auf deutsch in dem folgenden Text: `,
};

const GptApiCommandsTranslation = {
  Automatic: `Translate the following text to `,
  English: `Translate the following text from english to `,
  German: `Überstze den folgenden Text von Deutsch nach `,
};

const GptApiCommandsSummary = {
  Automatic: `Summarize the follwoing text in the original Language, including all important aspects of the text: `,
  English: `Summarize the follwoing text in english, including all important aspects of the text: `,
  German: `Fasse den folgenden text in deutsch zusammen: `,
};

const GptApiCommandsRewriteSimplify = {
  Automatic: `Rewrite the following and use simpler language and keep the original language:`,
  English: `Rewrite the following and use simpler language in english:`,
  German: `Überarbeite den folgenden Text in deutsch mit simplen Ausdrücken, so dass er leicht zu verstehen ist: `,
};

const GptApiCommandsRewriteComplicate = {
  Automatic: `Please enhance the level of professionalism in your writing and incorporate technical terminology as appropriate in the original language:`,
  English: `Please enhance the level of professionalism in your writing and incorporate technical terminology as appropriate in English:`,
  German: `Schreibe den Text professioneller und benutze benutze fachwörter falls angebracht in deutsch:`,
};

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
  const response = await currentOPENAIApi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: GptApiCommandsSystemRole[language] },
      { role: "user", content: GptApiCommandsCompletion[language] + text },
    ],
  });

  console.log("GPTAntwort: " + response.data.choices[0].message.content);
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
  const response = await currentOPENAIApi.createCompletion({
    model: "text-davinci-003",
    prompt: GptApiCommandsCompletion[language] + text,
    temperature: 0,
    max_tokens: 100,
  });

  console.log("DavainciAntwort: " + response.data.choices[0].text);
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
  const response = await currentOPENAIApi.createChatCompletion({
    model: "gpt-3.5-turbo", //es existieren verschieden Modelle des GPT davinci003 max request 4000 tokens, beste Qualität
    messages: [
      { role: "system", content: GptApiCommandsSystemRole[language] },
      { role: "user", content: GptApiCommandsCorrection[language] + text },
    ],
  });

  console.log("GPTAntwort: " + response.data.choices[0].message.content);
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
  const response = await currentOPENAIApi.createCompletion({
    model: "text-davinci-003", //es existieren verschieden Modelle des GPT davinci003 max request 4000 tokens, beste Qualität
    prompt: GptApiCommandsCorrection[language] + text,
    temperature: 0,
    max_tokens: 100,
  });

  console.log("DavinciAntwort: " + response.data.choices[0].text);
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
export async function text_translation(text, language, resultLanguage) {
  const response = await currentOPENAIApi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: GptApiCommandsSystemRole[language] },
      { role: "user", content: GptApiCommandsTranslation[language] + resultLanguage + ":" + text },
    ],
  });
  console.log("Antwort: " + response.data.choices[0].message.content);
  return response.data.choices[0].message.content;
}

export async function textSummaryGpt3(text, language) {
  const response = await currentOPENAIApi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: GptApiCommandsSystemRole[language] },
      { role: "user", content: GptApiCommandsSummary[language] + text },
    ],
  });
  console.log(response.data.choices[0].message.content);
  return response.data.choices[0].message.content;
}

export async function textSummaryDavinci(text, language) {
  const response = await currentOPENAIApi.createCompletion({
    model: "text-davinci-003", //es existieren verschieden Modelle des GPT davinci003 max request 4000 tokens, beste Qualität
    prompt: GptApiCommandsSummary[language] + text,
    temperature: 0,
    max_tokens: 100,
  });

  console.log(response.data.choices[0].text);
  return response.data.choices[0].text;
}

export async function rewriteTextGpt3(text, language, TextStyle) {
  switch (TextStyle) {
    case "Simplify":
      request_template = GptApiCommandsRewriteSimplify[language];
      break;
    case "Professionalize":
      request_template = GptApiCommandsRewriteComplicate[language];
      break;
    default:
      request_template = GptApiCommandsRewriteSimplify[language];
      break;
  }

  const response = await currentOPENAIApi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: GptApiCommandsSystemRole[language] },
      { role: "user", content: request_template + text },
    ],
  });
  console.log(response.data.choices[0].message.content);
  return response.data.choices[0].message.content;
}

export async function rewriteTextDavinci(text, language, TextStyle) {
  switch (TextStyle) {
    case "Simplify":
      request_template = GptApiCommandsRewriteSimplify[language] + text;
      break;
    case "Professionalize":
      request_template = GptApiCommandsRewriteComplicate[language] + text;
      break;
    default:
      request_template = GptApiCommandsRewriteSimplify[language] + text;
      break;
  }

  const response = await currentOPENAIApi.createCompletion({
    model: "text-davinci-003", //es existieren verschieden Modelle des GPT davinci003 max request 4000 tokens, beste Qualität
    prompt: request_template + text,
    temperature: 0,
    max_tokens: 100,
  });

  console.log(response.data.choices[0].text);
  return response.data.choices[0].text;
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
