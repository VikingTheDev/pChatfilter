const config = require ("./src/config.json");
const https = require("https");

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
  checkMsg(src, text);
});

function checkMsg (src, text, callb) {
  checkLists(text, cb => {
    switch (true) {
      case cb[1] == 0: {
        if (cb[0] == true) {
          kickUser(src, text);
          callb(true)
          break;
        }
      }
      case cb[1] == 1: {
        if (cb[0] == true) {
          warnUser(src, text);
          callb(true)
          break;
        }
      }
      default: {
        callb(false)
      }
    }
  })
}

function checkLists (msg, cb) {
  for (let i = 0; i < config.lists.length; i++) {
      cb([checkArray(msg, config.lists[i]), i])
  }
}

function checkArray (msg, array) {
  for (let i = 0; i < array.length; i++) {
      if (msg.toLowerCase().includes(array[i])) {
          return true
      }
  }
  return false
}

function warnUser(src, text) {
  CancelEvent();
  let name = GetPlayerName(src);
  setImmediate(() => {
      emitNet("chat:addMessage", src, {
      color: [255, 0, 0],
      args: [
          "Server",
          "^1Please ensure your choice of words abide by our server rules. Thank you!",
      ],
      });
  });
  dNotif(src, name, text, "Warning");
}
  
function kickUser(src, text) {
  CancelEvent();
  let name = GetPlayerName(src);
  DropPlayer(src, "Sending a message containing a prohibited word");
  dNotif(src, name, text, "Kick, might require a manual ban");
}
  
function dNotif(src, name, message, tier) {
  var embed = {
    title: `A user sent a message containing a prohibited word!`,
    description: `Username: ${src} | ${name} \n Message: ${message} \n Automatic action taken: ${tier} \n`,
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
    content: `<@&${config.settings.staff_role_id}>`,
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
exports("execFilter", (src, text) => {
  checkMsg(src, text, callb => {
    return callb;
  });
});