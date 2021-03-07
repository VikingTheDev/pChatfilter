const { webhookUrl, staffRole, lists } = require('./config.chatfilter.json');
const https = require("https");

const options = {
    //settings for the discord post request
    hostname: "discord.com",
    port: 443,
    path:
      webhookUrl,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
};

onNet("chatMessage", (src: string, author, text: string) => {
    checkMsg(src, text);
});

interface obj {
    src: string;
    name: string;
    msg: string;
    tier: string;
    identifiers: string;
}

function checkMsg (src: string, msg: string): void {
    for(const tier in lists) {
        for(const i in lists[tier]) {
            if(msg.includes(lists[tier][i])) {
                if(tier === "kick") {
                    CancelEvent();
                    let name = GetPlayerName(src);
                    let identifiers: string = getIdentifiers(src);
                    DropPlayer(src, "Sending a message containing a prohibited word")
                    dNotif({ src, name, msg, tier, identifiers});

                } else if (tier === "warn") {
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
                    dNotif({ src, name, msg, tier, identifiers: getIdentifiers(src)});
                }
            } 
        }
    }
}

function dNotif(obj: obj): void {
    var embed = {
      title: `A user sent a message containing a prohibited word!`,
      description: `Username: ${obj.src} | ${obj.name} \n Message: ${obj.msg} \n Automatic action taken: ${obj.tier} \n`,
      color: 15158332,
      fields: [
          {
            name: "Identifiers",
            value: obj.identifiers,
          }
      ],
      footer: {
        text: "pChatfilter | Made by Petrikov",
        timestamp: Date.now(),
      },
    };
    var params = {
      username: "SSRP | Chat Filter",
      avatar_url:
        "https://cdn.discordapp.com/attachments/741017756291301431/818265837827129404/nx4jf8ry1fy51.png",
      content: `<@&${staffRole}>`,
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

function getIdentifiers(src:string): string {
  let test: string;
  for(let i = 0; i < GetNumPlayerIdentifiers(src); i++) {
    if(i === 0) {
      test = GetPlayerIdentifier(src, i);
    } else {
      test = test + `\n${GetPlayerIdentifier(src, i)}`
    }
  }
  return test;
}
