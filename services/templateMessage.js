let sendCategoriesTemplate = () =>{
  return {
      "attachment": {
          "type": "template",
          "payload": {
              "template_type": "generic",
              "elements": [
                  {
                      "title": "Vans",
                      "image_url": "https://i.postimg.cc/9fv7Jr7M/vans.jpg",
                      "default_action": {
                          "type": "web_url",
                          "url": "https://glacial-reef-79728.herokuapp.com/products/vans",
                          "webview_height_ratio": "tall",
                      },
                      "buttons": [
                          {
                              "type": "web_url",
                              "url": "https://glacial-reef-79728.herokuapp.com/products/vans",
                              "title": "View on Website"
                          }
                      ]
                  },
                  {
                      "title": "Converse",
                      "image_url": "https://i.postimg.cc/vTCLn3tP/converse.jpg",
                      "default_action": {
                          "type": "web_url",
                          "url": "https://glacial-reef-79728.herokuapp.com/products/converse",
                          "webview_height_ratio": "tall",
                      },
                      "buttons": [
                          {
                              "type": "web_url",
                              "url": "https://glacial-reef-79728.herokuapp.com/products/converse",
                              "title": "View on Website"
                          }
                      ]
                  },
                  {
                      "title": "Palladium",
                      "image_url": "https://i.postimg.cc/mDnR4s8P/palla.jpg",
                      "default_action": {
                          "type": "web_url",
                          "url": "https://glacial-reef-79728.herokuapp.com/products/palladium",
                          "webview_height_ratio": "tall",
                      },
                      "buttons": [
                          {
                              "type": "web_url",
                              "url": "https://glacial-reef-79728.herokuapp.com/products/palladium",
                              "title": "View on Website"
                          }
                      ]
                  },
              ]
          }
      }
  };
};

let sendProductTemplate = (budget) =>{
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": "Products based on your budget.",
                        "subtitle": "View all products have the price less than or equal your budget",
                        "image_url": "https://i.postimg.cc/SQ3b2ngt/166313511-113666040813941-2904191884045020774-n.jpg",
                        "default_action": {
                            "type": "web_url",
                            "url": `https://glacial-reef-79728.herokuapp.com/products?price=${budget}`,
                            "webview_height_ratio": "tall",
                        },
                        "buttons": [
                            {
                                "type": "web_url",
                                "url": `https://glacial-reef-79728.herokuapp.com/products?price=${budget}`,
                                "title": "View on Website"
                            }
                        ]
                    }
                ]
            }
        }
    };
};

module.exports = {
  sendCategoriesTemplate: sendCategoriesTemplate,
  sendProductTemplate: sendProductTemplate
};