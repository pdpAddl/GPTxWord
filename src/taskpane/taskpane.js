/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office, Word */

Office.onReady((info) => {
  if (info.host === Office.HostType.Word) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
    //document.getElementById("BtnAddText").onclick = addTextToSelection;
    document.getElementById("BtnCorrectText").onclick = correctSelection;
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
    addedText = " TEST ";

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

