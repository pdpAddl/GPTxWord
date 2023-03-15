/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office, Word */

//require("./keyhandling.js");
require("./GPT_API.js");

var keyExists;
const KEYITEM_NAME = "GPTAPI_Key";

Office.onReady((info) => {
  if (info.host === Office.HostType.Word) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";

    document.getElementById("BtnAddText").onclick = addTextToSelection;
    document.getElementById("BtnCorrectText").onclick = validateGPTKey; //correctSelection;
    //document.getElementById("BtnApiKeyConfirm").onclick = addGPTKey;
    //document.getElementById("BtnHelp").onclick = removeGPTKey;
    document.getElementById("BtnConfig").onclick = toggleConfigPageVisibility;
    document.getElementById("configPage").contentWindow.document.getElementById("BtnApiKeyReset").onclick = addTextToSelection;
  }
});

function toggleConfigPageVisibility() {
  var element = document.getElementById("configPage");
  var style = window.getComputedStyle( element, null );
  style.visibility === "visible" ? element.style.visibility = "hidden" : element.style.visibility = "visible";
}

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
    addedText = " Test ";

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
    await context.sync();

    context.document.properties.customProperties.add(KEYITEM_NAME, "test");
    await context.sync();
    console.log(context.document.properties.customProperties.items);
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

        if (gpt_key.value == "test") console.log("Success");
        else console.log("No success");
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
    console.log(keyExists);
  });
}
