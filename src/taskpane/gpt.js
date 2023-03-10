const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

async function getResponse(API, request) {
  const response = await API.createCompletion({
    model: "text-davinci-003", //es existieren verschieden Modelle des GPT davinci003 max request 4000 tokens, beste Qualität
    //model: "gpt-3.5-turbo",
    prompt: "Continue the following text: " + request,
    temperature: 0,
    max_tokens: 20,
  });

  var Antwort = response.data.choices[0].text;
  console.log(response.data.choices[0].text);

  console.log(response.data.id);
  console.log("Tokens für Anfrage: " + response.data.usage.prompt_tokens);
  console.log("Tokens für Antwort: " + response.data.usage.completion_tokens);
  console.log("Insgesamt verwendete Token: " + response.data.usage.total_tokens);
  return Antwort;
}
//f(openai).then();

export async function getGPTString(request) {
  return await getResponse(openai, request);
}

  /*
  var answer = f(openai).then((result) => {
    return result;
  });
  return answer;
  */


//Antwort = returnAIString();
