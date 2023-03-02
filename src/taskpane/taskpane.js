/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office, Word */

Office.onReady((info) => {
  if (info.host === Office.HostType.Word) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
    document.getElementById("run1").onclick = run1;
    document.getElementById("run2").onclick = run2;
  }
});

export async function run1() {
  return Word.run(async (context) => {
    /**
     * Insert your Word code here
     */

    var rangeSelected;
    var strSelected;

    // Get Selected Range
    rangeSelected = context.document.getSelection();

    // Load selected string
    rangeSelected.load("text");

    // Wait until everything is synced
    await context.sync();

    // extract string to variable for further processing
    strSelected = rangeSelected.text;

    // Insert string at the end of the paragraph
    const paragraph = context.document.body.insertParagraph(strSelected, Word.InsertLocation.end);

    // change the paragraph color to blue.
    paragraph.font.color = "blue";

    await context.sync();
  });
}

export async function run2() {
  return Word.run(async (context) => {
    /**
     * Insert your Word code here
     */

    var rangeSelected;
    var strSelected;

    // Get Selected Range
    rangeSelected = context.document.getSelection();

    // Load selected string
    rangeSelected.load("text");

    // Wait until everything is synced
    await context.sync();

    // extract string to variable for further processing
    strSelected = rangeSelected.text;

    // Insert string at the end of the paragraph
    const paragraph = context.document.body.insertParagraph(strSelected, Word.InsertLocation.start);

    // change the paragraph color to blue.
    paragraph.font.color = "blue";

    await context.sync();
  });
}
