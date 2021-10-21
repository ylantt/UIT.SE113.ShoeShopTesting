const request = require("request");

let sendTypingOn = (sender_psid) => {
  return new Promise((resolve, reject) => {
      try {
          let request_body = {
              "recipient": {
                  "id": sender_psid
              },
              "sender_action": "typing_on"
          };

          let url = `https://graph.facebook.com/v6.0/me/messages?access_token=${process.env.FB_PAGE_TOKEN}`;
          request({
              "uri": url,
              "method": "POST",
              "json": request_body

          }, (err, res, body) => {
              if (!err) {
                  resolve("done!");
              } else {
                  reject("Unable to send message:" + err);
              }
          });

      } catch (e) {
          reject(e);
      }
  });
};

let markMessageRead = (sender_psid) => {
  return new Promise((resolve, reject) => {
      try {
          let request_body = {
              "recipient": {
                  "id": sender_psid
              },
              "sender_action": "mark_seen"
          };

          let url = `https://graph.facebook.com/v6.0/me/messages?access_token=${process.env.FB_PAGE_TOKEN}`;
          request({
              "uri": url,
              "method": "POST",
              "json": request_body

          }, (err, res, body) => {
              if (!err) {
                  resolve("done!");
              } else {
                  reject("Unable to send message:" + err);
              }
          });
      } catch (e) {
          reject(e);
      }
  })
};

module.exports = {
  markMessageRead: markMessageRead,
  sendTypingOn: sendTypingOn
};
