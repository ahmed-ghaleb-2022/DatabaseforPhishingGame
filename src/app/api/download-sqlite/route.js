import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import groq from "@/utils/openai";





async function getDialogeClone() {
    return groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `make a simple dialogue between player and NPC it is a serious game about phishing to increase the player skill, the player is the cybersecurity expert and the NPC is the victim
                as following shape:
                player: ""
                NPC: ""
                player: ""
                NPC: ""
                and so on
                `,
        },
      ],
      model: "gemma-7b-it",
    });
  }

  async function getDialogeSMS() {
    return groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `make a simple dialogue between player and NPC it is a serious game about SMS phishing to increase the player skill, the player is the cybersecurity expert and the NPC is the victim
                as following shape:
                player: ""
                NPC: ""
                player: ""
                NPC: ""
                and so on
                `,
        },
      ],
      model: "gemma-7b-it",
    });
  }

  async function getDialogeSpear() {
    return groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `make a simple dialogue between player and NPC it is a serious game about spear phishing to increase the player skill, the player is the cybersecurity expert and the NPC is the victim
                as following shape:
                player: ""
                NPC: ""
                player: ""
                NPC: ""
                and so on
                `,
        },
      ],
      model: "gemma-7b-it",
    });
  }

  async function getQuestionOfDialogue(dialogue) {
    return groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `without explanation from the following dialogue between player and NPC give me a question that to test the player if he learn from the dialogue and give the player 3 shorts options with random order one of them should be correct and write correct after the option number as following shape: 
              question: "question"
              option1 (correct / incorrect) : "the option" 
              option2 (correct / incorrect) : "the option" 
              option3 (correct / incorrect): "the option". 
              the dialogue : ${dialogue}`,
        },
      ],
      model: "gemma-7b-it",
    });
  }


  
  async function prepareTheResponse(response) {
    const dialogueText = response.choices[0]?.message?.content || "";
    const dialogueWithSpace = dialogueText.split("\n");
    const dialogueWithStars = removeEmptyStrings(dialogueWithSpace);
    return dialogueWithStars;
  }



  async function main() {

    // Open a connection to your SQLite database file
    const db = await open({
      filename: "./database.db",
      driver: sqlite3.Database,
    });

    const tableExists = await doesTableExist(db, "Dialogue");
    deleteTable(db, tableExists);
/*********************************** Start Clone Dialogue *************************************/
    await makeSeparator(db, "CloneDialogue");
    let responseDialogue = await getDialogeClone();
    let dialogueText = await prepareTheResponse(responseDialogue);
    await insertIntoTable(db, dialogueText);

    await makeSeparator(db, "CloneQuestion");

    let responseQuestion = await getQuestionOfDialogue(dialogueText);
    let questionText = await prepareTheResponse(responseQuestion);
    await insertQuestionIntoTable(db, questionText);
     //  // console.log(questionText);

    /********************************** End Clone Dialogue **************************************/


   

    /*********************************** Start SMS Dialogue *************************************/
    await makeSeparator(db, "SMSDialogue");
     responseDialogue = await getDialogeSMS();
     dialogueText = await prepareTheResponse(responseDialogue);
    await insertIntoTable(db, dialogueText);

    await makeSeparator(db, "SMSQuestion");

     responseQuestion = await getQuestionOfDialogue(dialogueText);
     questionText = await prepareTheResponse(responseQuestion);
    await insertQuestionIntoTable(db, questionText);
     // console.log(questionText);

    /********************************** End SMS Dialogue **************************************/

    /*********************************** Start Spear Dialogue *************************************/
    await makeSeparator(db, "SpearDialogue");
     responseDialogue = await getDialogeSpear();
     dialogueText = await prepareTheResponse(responseDialogue);
    await insertIntoTable(db, dialogueText);

    await makeSeparator(db, "SpearQuestion");

     responseQuestion = await getQuestionOfDialogue(dialogueText);
     questionText = await prepareTheResponse(responseQuestion);
    await insertQuestionIntoTable(db, questionText);
     // console.log(questionText);

    /********************************** End Spear Dialogue **************************************/

    /*********************************** Start Clone Test *************************************/
    const res = await fetch('https://phishinggame.ahmedghaleb.com/api/random-urls');
    const data = await res.json();
    const actualURL = data.map(item => item.actualURL);
    const showURL = data.map(item => item.showURL);
    const cloneStatus = data.map(item => item.clone_status);


    await makeSeparator(db, "CloneTest");

    for (let i = 0; i < actualURL.length; i++) {
      await insertDirectIntoTable(db, actualURL[i]);
      await insertDirectIntoTable(db, showURL[i]);
      await insertDirectIntoTable(db, cloneStatus[i]);
    }
    // let actualURl = ["https://google.com/","https://facebook.com/","https://youtube.com/"];
    // let ShowURl = ["https://gooogle.com/","https://faceboook.com/","https://yooutube.com/"];
    // let clone_status = ["safe", "safe", "not safe"]
    // await insertDirectIntoTable(db, actualURl[0]);
    // await insertDirectIntoTable(db, ShowURl[0]);
    // await insertDirectIntoTable(db, clone_status[0]);
    // await insertDirectIntoTable(db, actualURl[1]);
    // await insertDirectIntoTable(db, ShowURl[1]);
    // await insertDirectIntoTable(db, clone_status[1]);
    // await insertDirectIntoTable(db, actualURl[2]);
    // await insertDirectIntoTable(db, ShowURl[2]);
    // await insertDirectIntoTable(db, clone_status[2]);

    /*********************************** End Clone Test *************************************/
    /*********************************** Start SMS Test *************************************/
    
    const res_sms = await fetch('https://phishinggame.ahmedghaleb.com/api/random-sms');
    const data_sms = await res_sms.json();
    const sms_from = data_sms.map(item => item.sms_from);
    const sms_message = data_sms.map(item => item.sms_message);
    const sms_status = data_sms.map(item => item.sms_status);

    await makeSeparator(db, "SMSTest");

    for (let i = 0; i < sms_from.length; i++) {
      await insertDirectIntoTable(db, sms_from[i]);
      await insertDirectIntoTable(db, sms_message[i]);
      await insertDirectIntoTable(db, sms_status[i]);
    }


    // let from = "1-800-123-4567";
    // let message = "URGENT: Your bank account has been temporarily suspended due to suspicious activity. Please verify your identity to restore access. Visit: fake-website.com or call 1-800-987-6543 immediately.";

    // let SMS_status = "safe"
    // await insertDirectIntoTable(db, from);
    // await insertDirectIntoTable(db, message);
    // await insertDirectIntoTable(db, SMS_status);


    /*********************************** End SMS Test *************************************/
    /*********************************** Start Spear Test *************************************/
    
    const res_emails = await fetch('https://phishinggame.ahmedghaleb.com/api/random-emails');
    const data_emails = await res_emails.json();
    const email_from = data_emails.map(item => item.email_from);
    const email_message = data_emails.map(item => item.email_message);
    const email_status = data_emails.map(item => item.email_status);

    await makeSeparator(db, "SpearTest");

    for (let i = 0; i < email_from.length; i++) {
      await insertDirectIntoTable(db, email_from[i]);
      await insertDirectIntoTable(db, email_message[i]);
      await insertDirectIntoTable(db, email_status[i]);
    }

    // let from_Email = "john.smith@rockandrollcompany.com";
    // let message_email = `Hi Sarah,

    // I hope you're doing well. We are in the final stages of closing a crucial deal with a new client, and I need your assistance with the payment processing. Could you please provide the updated account details so that we can ensure the payment is processed without any delays?
    
    // Please find the invoice attached for your reference. Kindly reply with the necessary information at your earliest convenience.
    
    // Best regards,
    
    // John Smith
    // Senior Financial Officer
    // Rock and Roll Company`;

    // let spear_status = "not safe"

    // await insertDirectIntoTable(db, from_Email);
    // await insertDirectIntoTable(db, message_email);
    // await insertDirectIntoTable(db, spear_status);

    /*********************************** End Spear Test *************************************/



  }

  async function insertIntoTable(db, dialogueText) {
    try {
      for (const sentence of dialogueText) {
        if (!sentence) continue;
        const DialogueSentence = removeCharsFromString(sentence);
         // console.log(DialogueSentence);
        let player = "-";
        let npc = "-";
        if (DialogueSentence.startsWith("Player:")) {
          player = DialogueSentence.replace("Player:", "");
        }
        if (DialogueSentence.startsWith("NPC:")) {
          npc = DialogueSentence.replace("NPC:", "");
        }
        await db.run(
          `INSERT INTO Dialogue (Player, NPC) VALUES (?, ?)`,
          player,
          npc
        );
      }
       // console.log("Lines added to database successfully.");
    } catch (error) {
      console.error("Error adding lines to database:", error);
    } finally {
      // Close the database connection
    }
  }

  async function insertQuestionIntoTable(db, questionText) {
    try {
      // Insert each line into the database
      for (const Question of questionText) {
        if (!Question) continue;
        const QuestionOfDialogue = removeCharsFromString(Question);
        const originalString = QuestionOfDialogue;
        const [title, question] = splitQuestion(originalString);
        await db.run(
          `INSERT INTO Dialogue (Player, NPC) VALUES (?, ?)`,
          title,
          question
        );
      }
       // console.log("Lines added to database successfully.");
    } catch (error) {
      console.error("Error adding lines to database:", error);
    } finally {
      // Close the database connection
    }
  }

  async function insertDirectIntoTable(db, text) {
    try {
      // Insert each line into the database
    
        await db.run(
          `INSERT INTO Dialogue (Player, NPC) VALUES (?, ?)`,
          text,
          "-"
        );
      
       // console.log("Lines added to database successfully.");
    } catch (error) {
      console.error("Error adding lines to database:", error);
    } finally {
      // Close the database connection
    }
  }
  async function doesTableExist(db, tableName) {
    const result = await db.get(
      `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
      tableName
    );
    return !!result;
  }

  async function deleteTable(db, tableExists) {
    if (tableExists) {
      await db.run(`DELETE FROM Dialogue`);
    } else {
      // If the table doesn't exist, create it
      await db.exec(
        `CREATE TABLE IF NOT EXISTS Dialogue (id INTEGER PRIMARY KEY, Player TEXT, NPC TEXT);`
      );
    }
  }

  function removeEmptyStrings(lines) {
    return lines.filter((line) => line.trim() !== "");
  }

  function removeCharsFromString(string) {
    return string.replace(/\*\*|"/g, "");
  }

  function splitQuestion(string) {
    const parts = string.split(": ");
    return [parts[0], parts.slice(1).join(": ")];
  }

  async function makeSeparator(db, separatorString) {
    try {
      await db.run(
        `INSERT INTO Dialogue (Player, NPC) VALUES (?, ?)`,
        separatorString,
        "*"
      );

       // console.log(" Separator added to the table successfully.");
    } catch (error) {
      console.error("Error adding Separator to table:", error);
    }
  }








export async function GET() {

   await main();
    
  const filePath = path.resolve('.', './database.db');
  
  // Check if the file exists
  if (fs.existsSync(filePath)) {
    const fileStream = fs.createReadStream(filePath);

    // Set headers
    const headers = new Headers();
    headers.append('Content-Disposition', 'attachment; filename=database.sqlite');
    headers.append('Content-Type', 'application/octet-stream');

    return new NextResponse(fileStream, { headers });
  } else {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
