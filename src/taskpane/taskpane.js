/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office, Word */

import { getGPTString } from "./gpt.js";

//require("./keyhandling.js");
require("./gpt.js");

var keyExists;
const KEYITEM_NAME = "GPTAPI_Key";

Office.onReady((info) => {
  if (info.host === Office.HostType.Word) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";

    //document.getElementById("BtnAddText").onclick = addTextToSelection;
    document.getElementById("BtnCorrectText").onclick = addTextToSelection; //correctSelection;
    document.getElementById("BtnApiKeyConfirm").onclick = addGPTKey;
    document.getElementById("BtnHelp").onclick = removeGPTKey;
  }
});

export async function addTextToSelection() {
  return Word.run(async (context) => {
    /**
     * Insert your Word code here
     */

    var rangeSelected;
    var selectedText;
    var addedText;

    // Get Selected Range
    rangeSelected = context.document.getSelection();

    // Load selected string
    rangeSelected.load("text");

    // Wait until everything is synced
    await context.sync();

    // extract string to variable for further processing
    selectedText = rangeSelected.text;

    // TODO: Add Text via GPT API
    addedText = await getGPTString(selectedText);

    // Insert string at the end of the selected area
    rangeSelected.insertText(addedText, Word.InsertLocation.end);
    rangeSelected.insertFootnote("Parts of that text were added by the GPT AI");

    // Insert added text with foot note

    await context.sync();
  });
}

export async function correctSelection() {
  return Word.run(async (context) => {
    /**
     * Insert your Word code here
     */

    var rangeSelected;
    var correctedText;

    // Get Selected Range
    rangeSelected = context.document.getSelection();
    rangeSelected.clear();

    // Wait until everything is synced
    await context.sync();

    // Correct Text via GPT API - TODO
    correctedText = "abcdefg 12345 doijdas dasadssd asdafsds";

    // Insert corrected text with foot note
    rangeSelected.insertText(correctedText, Word.InsertLocation.start);
    rangeSelected.insertFootnote("This text was corrected by the GPT AI");

    await context.sync();
  });
}

export async function addGPTKey() {
  return Word.run(async (context) => {
    context.document.properties.customProperties.load("items");
    var keyString = document.getElementById("ApiKey").value;
    await context.sync();

    context.document.properties.customProperties.add(KEYITEM_NAME, keyString);
    await context.sync();
    console.log("Added key with value: " + keyString);
  });
}

export async function validateGPTKey() {
  return Word.run(async (context) => {
    checkGPTKeyExists().then(async function () {
      if (keyExists) {
        const properties = context.document.properties.customProperties;

        var gpt_key = properties.getItem(KEYITEM_NAME);

        gpt_key.load("value");
        await context.sync();

        console.log("Key with value: " + gpt_key.value + " was found!");

        /*
        if (gpt_key.value == "test") console.log("Success");
        else console.log("No success");
        */
      } else {
        console.log("No key available");
      }
    });
  });
}

export async function removeGPTKey() {
  return Word.run(async (context) => {
    checkGPTKeyExists().then(async function () {
      if (keyExists) {
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
    });
  });
}

export async function checkGPTKeyExists() {
  return Word.run(async (context) => {
    const properties = context.document.properties.customProperties;

    context.document.properties.customProperties.load("items");
    properties.load("key");

    await context.sync();

    keyExists = false;
    for (let i = 0; i < properties.items.length; i++) if (properties.items[i].key == KEYITEM_NAME) keyExists = true;
    console.log(keyExists ? "Key already exists" : "Key does not exist");
  });
}
