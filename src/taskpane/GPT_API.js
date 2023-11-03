const { Configuration, OpenAIApi } = require("openai");

const GptApiCommandsSystemRole = {
  Automatic: `You are a helpful assistant.`,
  English: `You are a helpful assistant.`,
  German: `Du bist ein hilfsbereiter Assistent.`,
};

const GptApiCommandsCompletion = {
  Automatic: `Complete this text and keep the original Language: `,
  English: `Complete this text in english: `,
  German: `Vervollständige diesen Text auf Deutsch: `,
};

const GptApiCommandsCorrection = {
  Automatic: `Correct spelling and grammar of the following text and keep the original language of the text, if there are no mistakes return the original text: `,
  English: `Correct spelling and grammar of the following text in English, if there are no mistakes return the original text: `,
  German: `Verbessere Rechtschreibung und Grammatik auf deutsch in dem folgenden Text, gibt es keine Fehler, gib den Originaltext zurück: `,
};

const GptApiCommandsTranslation = {
  Automatic: `Translate the following text to `,
  English: `Translate the following text from english to `,
  German: `Übersetze den folgenden Text von Deutsch auf `,
};

const GptApiCommandsSummary = {
  Automatic: `Summarize the follwoing text in the original language, including all important aspects of the text: `,
  English: `Summarize the follwoing text in english, including all important aspects of the text: `,
  German: `Fasse den folgenden Text in deutsch zusammen, übernehme alle wichtigen Aspekte des Textes: `,
};

const GptApiCommandsRewriteSimplify = {
  Automatic: `Rewrite the following text and use simpler language and keep the original language:`,
  English: `Rewrite the following text in english and use simpler language:`,
  German: `Überarbeite den folgenden Text in deutsch mit simplen Ausdrücken, so dass er leichter zu verstehen ist: `,
};

const GptApiCommandsRewriteComplicate = {
  Automatic: `Enhance the level of professionalism in your writing and incorporate technical terminology as appropriate in the original language:`,
  English: `Enhance the level of professionalism in your writing and incorporate technical terminology as appropriate in english:`,
  German: `Schreibe den Text professioneller und benutze Fachwörter falls angebracht, auf deutsch:`,
};

const configuration = new Configuration({
  apiKey: null,
});
var currentOPENAIApi = new OpenAIApi(configuration);

var request_template;

/**setKey
 * Description:     A function to set a key for the OpenAIAPI and verify it
 * @param in {string}           newKey          Key to validate
 * @param out{bool}                             True if Key is Valid, False if key is Invalid
 */
export async function setKey(newKey) {
  var OldOpenAIApi = currentOPENAIApi;
  var NewConfiguration = new Configuration({
    apiKey: newKey,
  });

  const NewOpenAIApi = new OpenAIApi(NewConfiguration);

  if (await keyValidation(NewOpenAIApi)) {
    currentOPENAIApi = NewOpenAIApi;
    return true;
  } else {
    currentOPENAIApi = OldOpenAIApi;
    return false;
  }
}

/**textCompletionGpt3
 * Description:     A function to let gpt-3.5-turbo from OpenAI complete a given text
 * @param in {string}           text            Text to complete
 * @param in {string}           language        Language in wich the GPTAI should answer. Currently supporting "english","german" and "automatic"
 * @param out{string}                           Text returned by GPTAI
 */
export async function textCompletionGpt3(text, language) {
  const response = await currentOPENAIApi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: GptApiCommandsSystemRole[language] },
      { role: "user", content: GptApiCommandsCompletion[language] + text },
    ],
  });
  return response.data.choices[0].message.content; //für den Text des Ergebnisses: response.data.choices[0].message.content
}

/**textCompletionDavinci
 * Description:     A function to let text-davinci-003 from OpenAI complete a given text
 * @param in {string}           text            Text to complete
 * @param in {string}           language        Language in wich the GPTAI should answer. Currently supporting "english","german" and "automatic"
 * @param out{string}                           Text returned by GPTAI
 */
export async function textCompletionDavinci(text, language) {
  const response = await currentOPENAIApi.createCompletion({
    model: "text-davinci-003",
    prompt: GptApiCommandsCompletion[language] + text,
    temperature: 0.6,
    max_tokens: 1000,
  });
  return response.data.choices[0].text;
}

/**textCorrectionGpt3
 * Description:     A function to let gpt-3.5-turbo from OpenAI correct a given text
 * @param in {string}           text            Text to correct
 * @param in {string}           language        Language in wich the GPTAI should answer. Currently supporting "english","german" and "automatic"
 * @param out{string}                           Text returned by GPTAI
 */
export async function textCorrectionGpt3(text, language) {
  const response = await currentOPENAIApi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: GptApiCommandsSystemRole[language] },
      { role: "user", content: GptApiCommandsCorrection[language] + text },
    ],
  });
  return response.data.choices[0].message.content;
}

/**textCorrectionDavinci
 * Description:     A function to let text-davinci-003 from OpenAI correct a given text
 * @param in {string}           text            Text to correct
 * @param in {string}           language        Language in wich the GPTAI should answer. Currently supporting "english","german" and "automatic"
 * @param out{string}                           Text returned by GPTAI
 */
export async function textCorrectionDavinci(text, language) {
  const response = await currentOPENAIApi.createCompletion({
    model: "text-davinci-003", 
    prompt: GptApiCommandsCorrection[language] + text,
    temperature: 0,
    max_tokens: 1000,
  });
  return response.data.choices[0].text;
}

/**textTranslation
 * Description:     A function to let gpt-3.5-turbo from OpenAI translate a given text
 * @param in {string}           text            Text to translate
 * @param in {string}           language        Language in wich the GPTAI should answer. Currently supporting "english","german" and "automatic"
 * @param in {string}           resultLanguage  Language you want the result text in. All Languages are supported
 * @param out{string}                           Text returned by GPTAI
 */
export async function textTranslation(text, language, resultLanguage) {
  const response = await currentOPENAIApi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: GptApiCommandsSystemRole[language] },
      { role: "user", content: GptApiCommandsTranslation[language] + resultLanguage + ":" + text },
    ],
  });
  return response.data.choices[0].message.content;
}

/**textSummaryGpt3
 * Description.     A function to let gpt-3.5-turbo from OpenAI summarize a given text
 * @param in {string}           text            Text to summarize
 * @param in {string}           language        Language in wich the GPTAI should answer. Currently supporting "english","german" and "automatic"
 * @param out{string}                           Text returned by GPTAI
 */
export async function textSummaryGpt3(text, language) {
  const response = await currentOPENAIApi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: GptApiCommandsSystemRole[language] },
      { role: "user", content: GptApiCommandsSummary[language] + text },
    ],
  });
  return response.data.choices[0].message.content;
}

/**textSummaryDavinci
 * Description.     A function to let text-davinci-003 from OpenAI summarize a given text
 * @param in {string}           text            Text to summarize
 * @param in {string}           language        Language in wich the GPTAI should answer. Currently supporting "english","german" and "automatic"
 * @param out{string}                           Text returned by GPTAI
 */
export async function textSummaryDavinci(text, language) {
  const response = await currentOPENAIApi.createCompletion({
    model: "text-davinci-003", //es existieren verschieden Modelle des GPT davinci003 max request 4000 tokens, beste Qualität
    prompt: GptApiCommandsSummary[language] + text,
    temperature: 0.3,
    max_tokens: 1000,
  });
  return response.data.choices[0].text;
}

/**rewriteTextGpt3
 * Description.     A function to let gpt-3.5-turbo from OpenAI rewrite a given text
 * @param in {string}           text            Text to rewrite
 * @param in {string}           language        Language in wich the GPTAI should answer. Currently supporting "english","german" and "automatic"
 * @param in {string}           textstyle       Style the text should be rewritten in. Choice between "simplify" and "complicate"
 * @param out{string}                           Text returned by GPTAI
 */
export async function rewriteTextGpt3(text, language, textStyle) {
  switch (textStyle) {
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
  return response.data.choices[0].message.content;
}

/**rewriteTextDavinci
 * Description.     A function to let text-davinci-003 from OpenAI rewrite a given text
 * @param in {string}           text            Text to rewrite
 * @param in {string}           language        Language in wich the GPTAI should answer. Currently supporting "english","german" and "automatic"
 * @param in {string}           textstyle       Style the text should be rewritten in. Choice between "simplify" and "complicate"
 * @param out{string}                           Text returned by GPTAI
 */
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
    model: "text-davinci-003", 
    prompt: request_template + text,
    temperature: 0.6,
    max_tokens: 1000,
  });
  return response.data.choices[0].text;
}

/**keyValidation
 * Description.     A function to validate a key for the OpenAIAPI
 * @param in {string}           API             OpenAIApi to validate
 * @param out{bool}                             True if Key is Valid, False if key is Invalid
 */
export async function keyValidation(API) {
  try {
    await API.createCompletion({
      model: "ada",
      prompt: "hi",
      max_tokens: 1,
    });
    return true;
  } catch (error) {
    return false;
  }
}

/**Chatbot
 * Description.     A function to use the OpenAIAPI as Chatbot
 * @param in {string}           request         Request to be answered by the API
 * @param out{string}                           Text returned by GPTAI
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
