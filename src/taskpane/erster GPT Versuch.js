const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

async function f ( API){
  const response = await API.createCompletion({
    model: "text-davinci-003",     //es existieren verschieden Modelle des GPT davinci003 max request 4000 tokens, beste Qualität
    prompt: "Say HI",
    temperature: 0,
    max_tokens: 7,
  });

  Antwort = response.data.choices[0].text;
  console.log(response.data.choices[0].text);

  console.log(response.data.id); 
  console.log("Tokens für Anfrage: "+response.data.usage.prompt_tokens);
  console.log("Tokens für Antwort: "+response.data.usage.completion_tokens);
  console.log("Insgesamt verwendete Token: "+response.data.usage.total_tokens);
  return  Antwort;
}
//f(openai).then();

Antwort = f(openai);


