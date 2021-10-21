const request = require("request");

const chatbotService = require("../services/chatbotService")

let postWebhook = (req, res) => {
  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      if (entry.standby) {
        //if user's message is "back" or "exit", return the conversation to the bot
        let webhook_standby = entry.standby[0];
        if (webhook_standby && webhook_standby.message) {
            if (webhook_standby.message.text === "back" || webhook_standby.message.text === "exit") {
                // call function to return the conversation to the primary app
                chatbotService.takeControlConversation(webhook_standby.sender.id);
            }
        }

        return;
      }

      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);


      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);        
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
        
  });

    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
}

let getWebhook = (req, res) => {
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = process.env.MY_VERIFY_FB_TOKEN;
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
}

// Handles messages events
// function handleMessage(sender_psid, received_message) {
//   let response;

//   // Check if the message contains text
//   if (received_message.text) {    

//     // Create the payload for a basic text message
//     response = {
//       "text": `You sent the message: "${received_message.text}". Now send me an image!`
//     }
//   } else if (received_message.attachments) {
  
//     // Get the URL of the message attachment
//     let attachment_url = received_message.attachments[0].payload.url;
//     response = {
//       "attachment": {
//         "type": "template",
//         "payload": {
//           "template_type": "generic",
//           "elements": [{
//             "title": "Is this the right picture?",
//             "subtitle": "Tap a button to answer.",
//             "image_url": attachment_url,
//             "buttons": [
//               {
//                 "type": "postback",
//                 "title": "Yes!",
//                 "payload": "yes",
//               },
//               {
//                 "type": "postback",
//                 "title": "No!",
//                 "payload": "no",
//               }
//             ],
//           }]
//         }
//       }
//     }
//   } 
  
//   // Sends the response message
//   callSendAPI(sender_psid, response);    
// }

// Handles messaging_postbacks events
let handlePostback = async (sender_psid, received_postback) => {
  let response;
  
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  switch (payload) {
    case "GET_STARTED":
    case "TALK_AGENT":
        await chatbotService.requestTalkToAgent(sender_psid);
        break;
    default:
        console.log("run default switch case")

  }
}

function firstTrait(nlp, name) {
  return nlp && nlp.entities && nlp.traits[name] && nlp.traits[name][0];
}

let handleMessage = async (sender_psid, message) => {
  try {
    //check the incoming message is a quick reply?
    if (message && message.quick_reply && message.quick_reply.payload) {
      let payload = message.quick_reply.payload;
      
      if (payload.startsWith("PICK_BY_PRICE")) {
        const payloadArr = payload.split("_");
        const payloadValue = payloadArr[payloadArr.length - 1];
        await chatbotService.sendLinkProducts(sender_psid, payloadValue);
      } else if (payload === "CATEGORIES") {
        await chatbotService.sendCategories(sender_psid);

      } else if (payload === "TALK_AGENT") {
          await chatbotService.requestTalkToAgent(sender_psid);
      } else if (payload === "PICK_ITEMS") {
        await chatbotService.sendProductsByPrice(sender_psid);
      }

      console.log("saiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");

      return;
    }


    // check greeting is here and is confident
    let entityArr = ["wit$greetings", "wit$thanks", "wit$bye", "wit$amount_of_money:amount_of_money", "wit$sentiment"];
    
    let entityChosen = "";
    let sentimentStatus = "";

    entityArr.forEach(name => {
      const entity = firstTrait(message.nlp, name);

      if (entity && entity.confidence > 0.8) {
        entityChosen = name;

        sentimentStatus = entityChosen == "wit$sentiment" ? entity["value"] : "";
      } 
    });

    console.log(entityChosen);

    switch(entityChosen) {
      case "wit$greetings":
        callSendAPI(sender_psid, 'Hi, how can I help you?');
        break;
      case "wit$thanks":
        callSendAPI(sender_psid, 'You are welcome!');
        break;
      case "wit$bye":
        callSendAPI(sender_psid, 'Thank you!');
        break;
      case "wit$sentiment":
        sentimentStatus == "positive"
          ? callSendAPI(
              sender_psid,
              "Thank you for believing in me! Bringing satisfaction to you is my mission ^_<"
            )
          : callSendAPI(
              sender_psid,
              "Sorry for any inconvenience! You can contact with us for more detail via (+84)123456789. Sorry again :("
            );
        break;
      default:
        console.log('default nlp ==============================================');
        await chatbotService.sendMessageOptions(sender_psid);
    }
  } catch (err) {
    console.log(err);
  }
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
   // Construct the message body
   let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": { "text": response }
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v6.0/me/messages",
    "qs": { "access_token": process.env.FB_PAGE_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!');
      console.log(`My messenger: ${response}`);
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}

module.exports = {
  postWebhook: postWebhook,
  getWebhook: getWebhook
};