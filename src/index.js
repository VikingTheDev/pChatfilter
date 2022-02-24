const {webhookUrl, staffRole, blacklistedWords} = require('./src/config.js');
const https = require('https');

const options = {
    hostname: "discord.com",
    port: 443,
    path: webhookUrl,
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    }
};

onNet("chatMessage", (src, author, text) => {
    let msg = text.toLowerCase();

    if (blacklistedWords.kick.some( i => {
        const regex = new RegExp('\\b'+i+'(\\b|s)\\b', 'gi')
        return regex.test(msg);
    })) {
        CancelEvent();
        let name = GetPlayerName(src);
        let identifiers = getIdentifiers(src);
        DropPlayer(src, "Sending a message containing a prohibited word");
        dNotif({ src, name, msg, tier: 'Kick', identifiers});
    };

    if (blacklistedWords.warn.some( i => {
        const regex = new RegExp('\\b'+i+'(\\b|s)\\b', 'gi')
        return regex.test(msg);
    })) {
        CancelEvent();
        let name = GetPlayerName(src);
        let identifiers = getIdentifiers(src);
        setImmediate(() => {
            emitNet("chat:addMessage", src, {
                color: [255, 0, 0],
                args: [
                    "Server",
                    "^1Please ensure your choice of words abide by our server rules. Thank you!",
                ],
            });
        });
        dNotif({ src, name, msg, tier: 'Warn', identifiers});
    };
});

const dNotif = (obj) => {
    const params = {
        username: "SSRP | Chat Filter",
        avatar_url:
            "https://cdn.discordapp.com/attachments/741017756291301431/818265837827129404/nx4jf8ry1fy51.png",
        content: `<@&${staffRole}>`,
        embeds: [
            {
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
            }
        ],
    };

    const data = JSON.stringify(params);

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
};


const getIdentifiers = (src) => {
    let x;
    for(let i = 0; i < GetNumPlayerIdentifiers(src); i++) {
        if(i === 0) {
            x = GetPlayerIdentifier(src, i);
        } else {
            x = x + `\n${GetPlayerIdentifier(src, i)}`
        };
    };
    return x;
};