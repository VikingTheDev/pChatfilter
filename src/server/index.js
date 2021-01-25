const config = require ("./src/config.json");
const https = require("https");
const { emit } = require("process");


const msg = "this message contains Word3"

const options = {
    //settings for the discord post request
    hostname: "discordapp.com",
    port: 443,
    path:
      config.settings.log_channel_webhookurl,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  
onNet("chatMessage", (src, author, text) => {
  checkLists(text, cb => {
    console.log(cb)
  })
});

on("pChatfilter:messageSent", (src, author, msg) => {
  checkLists(msg, cb => {
    console.log(cb)
  })
})

function checkLists (msg, cb) {
  for (let i = 0; i < config.lists.length; i++) {
      let logMsg;
      cb([checkArray(msg, config.lists[i], callback => {
          logMsg = callback;
      }), i, logMsg])
  }
}

function checkArray (msg, array, callback) {
  for (let i = 1; i < array.length; i++) {
      if (msg.toLowerCase().includes(array[i])) {
          callback(array[0])
          return true
      }
  }
  return false
}

function warnUser(src, author, text) {
  CancelEvent();
  setImmediate(() => {
      emitNet("chat:addMessage", src, {
      color: [255, 0, 0],
      args: [
          "Server",
          "^1Please ensure your choice of words abide by our server rules. Thank you!",
      ],
      });
  });
  dNotif(src, author, text, "Warning");
}
  
function kickUser(src, author, text) {
  CancelEvent();
  DropPlayer(src, "Sending a message containing a prohibited word");
  dNotif(src, author, text, "Kick, might require a manual ban");
}
  
function dNotif(src, user, message, tier) {
  var embed = {
    title: `A user sent a message containing a prohibited word!`,
    description: `Username: ${src} | ${user} \n Message: ${message} \n Automatic action taken: ${tier} \n`,
    color: 15158332,
    fields: [
      /*  name: "Identifiers",
        value: "Might be added in the future",
      },*/
    ],
    footer: {
      text: "pChatfilter | Made by Petrikov",
      timestamp: Date.now(),
    },
  };
  var params = {
    username: "SSRP | Chat Filter",
    avatar_url:
      "https://media.discordapp.net/attachments/562656258415525898/571040114277613598/officialssrplogo.png?width=677&height=677",
    content: "<@&508886727297859587>",
    embeds: [embed],
  };
  var data = JSON.stringify(params);

  const req = https.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`);

    res.on("data", (d) => {
      process.stdout.write(d);
    });
  });
  req.on("error", (error) => {
    console.error(error);
  });
  req.write(data);
  req.end();
}
exports("execFilter", (src, author, text) => {
  text = text.toLowerCase();
  CancelEvent();
  switch (true) {
    case text.includes(filterList.kickList1):
      kickUser(src, author, text);
      return 1;
    case text.includes(filterList.kickList2):
      kickUser(src, author, text);
      return 1;
    case text.includes(filterList.warnList1):
      warnUser(src, author, text);
      return 1;
    case text.includes(filterList.warnList2):
      warnUser(src, author, text);
      return 1;
    case text.includes(filterList.warnList3):
      warnUser(src, author, text);
      return 1;
    case text.includes(filterList.warnList4):
      warnUser(src, author, text);
      return 1;
    default:
      return 0;
  }

  function warnUser(src, author, text) {
    setImmediate(() => {
      emitNet("chat:addMessage", src, {
        color: [255, 0, 0],
        args: [
          "Server",
          "^1Please ensure your choice of words abide by our server rules. Thank you!",
        ],
      });
    });
    dNotif(src, author, text, "Warning");
  }

  function kickUser(src, author, text) {
    DropPlayer(src, "Sending a message containing a prohibited word");
    dNotif(src, author, text, "Kick, might require a manual ban");
  }

  function dNotif(src, user, message) {
    var embed = {
      title: `A user sent a message containing a prohibited word!`,
      description: `Username: ${src} | ${user} \n Message: ${message} \n Automatic action taken: ${tier} \n`,
      color: 15158332,
      fields: [
        /*  name: "Identifiers",
          value: "Might be added in the future",
        },*/
      ],
      footer: {
        text: "pChatfilter | Made by Petrikov",
        timestamp: Date.now(),
      },
    };
    var params = {
      username: "SSRP | Chat Filter",
      avatar_url:
        "https://media.discordapp.net/attachments/562656258415525898/571040114277613598/officialssrplogo.png?width=677&height=677",
      content: "<@&508886727297859587>",
      embeds: [embed],
    };
    var data = JSON.stringify(params);

    const req = https.request(options, (res) => {
      console.log(`statusCode: ${res.statusCode}`);

      res.on("data", (d) => {
        process.stdout.write(d);
      });
    });
    req.on("error", (error) => {
      console.error(error);
    });
    req.write(data);
    req.end();
  }
});