/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

import {
  key_validation,
  set_key,
  text_completion_Davinci,
  text_completion_GPT3,
  text_correction_Davinci,
  text_correction_GPT3,
} from "./GPT_API.js";

/* global document, Office, Word */

//require("./keyhandling.js");
require("./GPT_API.js");

const KEYITEM_NAME = "GPTAPI_Key";

Office.onReady(async (info) => {
  if (info.host === Office.HostType.Word) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";

    document.getElementById("BtnAddText").onclick = addTextToSelection;
    document.getElementById("BtnCorrectText").onclick = correctSelection;

    document.getElementById("BtnApiKeyReset").onclick = removeGPTKey;
    document.getElementById("BtnApiKeyConfirm").onclick = addGPTKey;
    document.getElementById("BtnApiKeyVerify").onclick = verifyGPTKey;

    await verifyGPTKey();
  }
});

function setApiKeyStatusIcon(makeVisible) {
  document.getElementById("ApiKeyLoading").style.display = "none";
  document.getElementById("IconApiKeyVerified").style.display = makeVisible ? "inline" : "none";
  document.getElementById("IconApiKeyFalse").style.display = makeVisible ? "none" : "inline";
}

function setApiKeyStatusLoading() {
  document.getElementById("IconApiKeyVerified").style.display = "none";
  document.getElementById("IconApiKeyFalse").style.display = "none";
  document.getElementById("ApiKeyLoading").style.display = "inline";
}

function showApiCallLoadingGif(makeVisible) {
  document.getElementById("ApiCallLoading").style.display = makeVisible ? "inline" : "none";
}

export async function addTextToSelection() {
  return Word.run(async (context) => {
    /**
     * Insert your Word code here
     */

    var rangeSelected, rangeSpace;
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
      generatedText = await text_completion_Davinci(selectedText); //.data.choices[0].message.content;

      // Process text to fit into the document
      processedText = removeWhiteSpaces(generatedText);

      // Insert string at the end of the selected area
      rangeSelected.insertText(processedText, Word.InsertLocation.end);

      // Insert footnote with the same font as the selected text
      if (document.getElementById("FootnotesBox").checked)
        rangeSelected.insertFootnote("Parts of that text were added by the GPT AI");

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
      correctedText = await text_correction_Davinci(selectedText);

      // Delete previous selected text
      rangeSelected.clear();

      // Process text to fit into the document
      processedText = removeWhiteSpaces(correctedText);

      // Insert corrected text with foot note
      rangeSelected.insertText(processedText, Word.InsertLocation.start);
      if (document.getElementById("FootnotesBox").checked)
        rangeSelected.insertFootnote("This text was corrected by the GPT AI");

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
      setApiKeyStatusIcon(true);
      console.log("Key applied");
    } else {
      // Error message, wrong key
      console.log("Key denied");
      setApiKeyStatusIcon(false);
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
      setApiKeyStatusIcon(false);
    } else {
      console.log("No key to remove");
    }
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
    setApiKeyStatusIcon(keyValid);
    await context.sync();
  });
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
