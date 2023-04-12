/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

import {
  Chatbot,
  image_generation,
  set_key,
  text_completion_Davinci,
  text_completion_GPT3,
  text_correction_Davinci,
  text_correction_GPT3,
  text_translation_GPT3,
} from "./GPT_API.js";

/* global document, Office, Word */

//require("./keyhandling.js");
require("./GPT_API.js");
//require(fetch);

const KEYITEM_NAME = "GPTAPI_Key";

const GPT_MODEL_DAVINCI = "davinci";
const GPT_MODEL_GPT3_5_TURBO = "gpt-3.5-turbo";

Office.onReady(async (info) => {
  if (info.host === Office.HostType.Word) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";

    document.getElementById("BtnAddText").onclick = addTextToSelection;
    document.getElementById("BtnCorrectText").onclick = correctSelection;
    document.getElementById("BtnTranslate").onclick = translateSelection;

    document.getElementById("btnQuestion").onclick = answerQuestion;

    document.getElementById("BtnApiKeyReset").onclick = removeGPTKey;
    document.getElementById("BtnApiKeyConfirm").onclick = addGPTKey;
    document.getElementById("BtnApiKeyVerify").onclick = verifyGPTKey;

    await verifyGPTKey();
  }
});

function setApiKeyStatus(makeVisible) {
  document.getElementById("ApiKeyLoading").style.display = "none";
  document.getElementById("IconApiKeyVerified").style.display = makeVisible ? "inline" : "none";
  document.getElementById("IconApiKeyFalse").style.display = makeVisible ? "none" : "inline";

  // display warning text
  document.getElementById("WarningNoKey").style.display = makeVisible ? "none" : "inline";
}

function setApiKeyStatusLoading() {
  document.getElementById("IconApiKeyVerified").style.display = "none";
  document.getElementById("IconApiKeyFalse").style.display = "none";
  document.getElementById("ApiKeyLoading").style.display = "inline";
}

function showApiCallLoadingGif(makeVisible) {
  document.getElementById("ApiCallLoading").style.display = makeVisible ? "inline" : "none";
}

// --------------------- Selected Text Conversion ---------------------

export async function addTextToSelection() {
  return Word.run(async (context) => {
    /**
     * Insert your Word code here
     */

    var rangeSelected;
    var selectedText;
    var generatedText, processedText;

    showApiCallLoadingGif(true);

    if (await verifyGPTKey()) {
      // Get Selected Range
      rangeSelected = context.document.getSelection();

      // Load selected string
      rangeSelected.load("text");
      rangeSelected.load("font");

      // Wait until everything is synced
      await context.sync();

      // Extract string to variable for further processing
      selectedText = rangeSelected.text;

      // Add Text via GPT API
      switch (document.getElementById("ApiModel").value) {
        case GPT_MODEL_DAVINCI:
          generatedText = await text_completion_Davinci(selectedText, "automatic");
          break;
        case GPT_MODEL_GPT3_5_TURBO:
          generatedText = await text_completion_GPT3(selectedText, "automatic");
          break;
        default:
          console.log("No API Model selected");
      }

      // Process text to fit into the document
      processedText = removeWhiteSpaces(generatedText);

      // Insert string at the end of the selected area
      rangeSelected.insertText(processedText, Word.InsertLocation.end);

      // Insert footnote with the same font as the selected text
      if (document.getElementById("FootnotesBox").checked)
        rangeSelected.insertFootnote("Parts of that text were added by the GPT AI");

      await context.sync();

      // Insert space at the end of the inserted text
      await insertSpace(rangeSelected);
    } else {
      console.log("Key not verified");
    }
    showApiCallLoadingGif(false);
  });
}

export async function correctSelection() {
  return Word.run(async (context) => {
    /**
     * Insert your Word code here
     */

    var rangeSelected;
    var correctedText, processedText, selectedText;

    showApiCallLoadingGif(true);

    await checkGPTKeyExists();
    await verifyGPTKey();

    if (await verifyGPTKey()) {
      // Get Selected Range
      rangeSelected = context.document.getSelection();

      // Load selected string
      rangeSelected.load("text");

      // Wait until everything is synced
      await context.sync();

      // extract string to variable for further processing
      selectedText = rangeSelected.text;

      // Correct Text via GPT API
      switch (document.getElementById("ApiModel").value) {
        case GPT_MODEL_DAVINCI:
          correctedText = await text_correction_Davinci(selectedText, "automatic");
          break;
        case GPT_MODEL_GPT3_5_TURBO:
          correctedText = await text_correction_GPT3(selectedText, "automatic");
          break;
        default:
          console.log("No API Model selected");
      }

      // Delete previous selected text
      rangeSelected.clear();
      await context.sync();

      // Process text to fit into the document
      processedText = removeWhiteSpaces(correctedText);

      // Insert corrected text with foot note
      rangeSelected.insertText(processedText, Word.InsertLocation.end);
      if (document.getElementById("FootnotesBox").checked)
        rangeSelected.insertFootnote("This text was corrected by the GPT AI");

      await context.sync();

      // Insert space at the end of the inserted text
      await insertSpace(rangeSelected);

      // Insert comment displaying original text
      rangeSelected.insertComment("Original text:\n" + selectedText);

      await context.sync();
    } else {
      console.log("Key not verified");
    }
    showApiCallLoadingGif(false);
  });
}

export async function translateSelection() {
  return Word.run(async (context) => {
    /**
     * Insert your Word code here
     */

    var rangeSelected;
    var translatedText, processedText, selectedText;

    showApiCallLoadingGif(true);

    if (await verifyGPTKey()) {
      // Get Selected Range
      rangeSelected = context.document.getSelection();

      // Load selected string
      rangeSelected.load("text");

      // Wait until everything is synced
      await context.sync();

      // extract string to variable for further processing
      selectedText = rangeSelected.text;

      // Translate Text via GPT API depending on chosen model
      switch (document.getElementById("ApiModel").value) {
        case GPT_MODEL_DAVINCI:
          translatedText = await text_translation_GPT3(
            selectedText,
            "automatic",
            document.getElementById("LanguageTo").value
          );
          break;
        case GPT_MODEL_GPT3_5_TURBO:
          translatedText = await text_translation_GPT3(
            selectedText,
            "automatic",
            document.getElementById("LanguageTo").value
          );
          break;
        default:
          translatedText = await text_translation_GPT3(
            selectedText,
            "automatic",
            document.getElementById("LanguageTo").value
          );
          break;
      }

      // Delete previous selected text
      rangeSelected.clear();

      // Process text to fit into the document
      processedText = removeWhiteSpaces(translatedText);

      // Insert corrected text with foot note
      rangeSelected.insertText(processedText, Word.InsertLocation.end);
      await context.sync();
      rangeSelected.insertFootnote("This text was translated by the GPT AI");
      await context.sync();

      // Insert comment displaying original text
      rangeSelected.insertComment("Original text:\n" + selectedText);
      await context.sync();
    } else {
      console.log("Key not verified");
    }
    showApiCallLoadingGif(false);
  });
}

// export async function generateImageFromSelection() {
//   if (Office.context.requirements.isSetSupported("WordApi", "1.2")) {
//     Word.run(async (context) => {
//       var rangeSelected;
//       var imageURL, selectedText;

//       showApiCallLoadingGif(true);

//       if (await verifyGPTKey()) {
//         // Get Selected Range
//         rangeSelected = context.document.getSelection();

//         // Load selected string
//         rangeSelected.load("text");

//         // Wait until everything is synced
//         await context.sync();

//         // extract string to variable for further processing
//         selectedText = rangeSelected.text;

//         //Generate Image via GPT API depending on chosen model
//         // switch (document.getElementById("ApiModel").value) {
//         //   case GPT_MODEL_DAVINCI:
//         //     imageURL = await image_generation(selectedText);
//         //     break;
//         //   case GPT_MODEL_GPT3_5_TURBO:
//         //     imageURL = await image_generation(selectedText);
//         //     break;
//         //   default:
//         //     imageURL = await image_generation(selectedText);
//         //     break;
//         // }

//         // eslint-disable-next-line no-undef
//         var base64Image;
//         //imageURL = "https://oaidalleapiprodscus.blob.core.windows.net/private/org-SjySFVsK7RJxHGjrVtHMwBCI/user-pqXuCE4LoJoByePxOs6VNTx0/img-ewHVIZF3mQCVUqwlLVEOPD2y.png?st=2023-03-31T16%3A58%3A44Z&se=2023-03-31T18%3A58%3A44Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-03-30T18%3A04%3A48Z&ske=2023-03-31T18%3A04%3A48Z&sks=b&skv=2021-08-06&sig=mPj58eB3XQ0sJ1GbyJlJ5k8kEu52jKtsj91FEXRB4KY%3D";
//         imageURL =
//           "https://images.unsplash.com/photo-1661956600684-97d3a4320e45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80";
//         // fetch(imageURL)
//         //   .then(function (response) {
//         //     return response.blob();
//         //   })
//         //   .then(function (blob) {
//         //     return blobToBase64(blob);
//         //   })
//         //   .then(function (base64) {
//         //     base64Image = trimBase64(base64);
//         //     return base64Image;
//         //   });
//         var response = await fetch(imageURL);
//         var blob = await response.blob();
//         base64Image = await blobToBase64(blob);
//         base64Image = trimBase64(base64Image);

//         // Insert Image
//         rangeSelected.insertInlinePictureFromBase64(base64Image, "End");
//         await context.sync();

//         // Insert Image
//       } else {
//         console.log("Key not verified");
//       }

//       showApiCallLoadingGif(false);
//     });
//   } else {
//     //if you reach this code it means that the Word executing this code does not yet support the 1.2 requirement set. in this case you can also insert a paragraph and then insert the document on the paragraph.

//     console.log("Error. This functionality requires Word with at least January update!! (check  builds 6568+)");
//   }
// }

function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

function trimBase64(base64) {
  return base64.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
}

// ------------------CHATBOT-----------------------

export async function answerQuestion() {
  var question, answer;

  question = document.getElementById("QuestionText").value;

  // Answer Question via GPT API
  answer = await Chatbot(question);

  document.getElementById("QuestionAnswer").value = answer;
}

// ----------------TEXT-ALIGNMENT--------------------

function removeWhiteSpaces(text) {
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

async function insertSpace(range) {
  return Word.run(async (context) => {
    var rangeSpace = range.insertText(" ", Word.InsertLocation.end);

    rangeSpace.load("font");
    await context.sync();

    rangeSpace.font.superscript = false;
  });
}

// ------------------KEY--------------------------
export async function addGPTKey() {
  return Word.run(async (context) => {
    setApiKeyStatusLoading();
    var valid, newKey;
    context.document.properties.customProperties.load("items");
    await context.sync();

    newKey = document.getElementById("ApiKey").value;

    valid = await set_key(newKey);
    if (valid) {
      // Key is correct and was applied
      context.document.properties.customProperties.add(KEYITEM_NAME, newKey);
      setApiKeyStatus(true);
      console.log("Key applied");
    } else {
      // Error message, wrong key
      console.log("Key denied");
      setApiKeyStatus(false);
    }

    await context.sync();
    console.log(context.document.properties.customProperties.items);
  });
}

export async function removeGPTKey() {
  return Word.run(async (context) => {
    setApiKeyStatusLoading();
    if (await checkGPTKeyExists()) {
      const properties = context.document.properties.customProperties;

      context.document.properties.customProperties.load("items");
      await context.sync();

      properties.getItem(KEYITEM_NAME).delete();
      //gpt_key.delete();

      await context.sync();
      console.log(context.document.properties.customProperties.items);
    } else {
      console.log("No key to remove");
    }
    await verifyGPTKey();
  });
}

export async function verifyGPTKey() {
  setApiKeyStatusLoading();
  var keyValid = false;
  await Word.run(async (context) => {
    var keyExists = await checkGPTKeyExists();

    if (keyExists) {
      const properties = context.document.properties.customProperties;

      var gpt_key = properties.getItem(KEYITEM_NAME);

      gpt_key.load("value");
      await context.sync();

      var chosen_key = gpt_key.value;
      //chosen_key = "test";

      console.log("read key: " + chosen_key);
      if (await set_key(chosen_key)) {
        console.log("Key is valid");
        keyValid = true;
        document.getElementById("ApiKey").value = chosen_key;
      } else {
        console.log("Key is not valid");
      }
    } else {
      console.log("No key available");
    }
    await context.sync();
  });
  setApiKeyStatus(keyValid);
  return keyValid;
}

// return true/false if key exists
export async function checkGPTKeyExists() {
  var keyExists = false;
  await Word.run(async (context) => {
    const properties = context.document.properties.customProperties;

    context.document.properties.customProperties.load("items");
    properties.load("key");
    await context.sync();

    for (let i = 0; i < properties.items.length; i++) {
      if (properties.items[i].key === KEYITEM_NAME) {
        keyExists = true;
        break;
      }
    }
  });
  return keyExists;
}
