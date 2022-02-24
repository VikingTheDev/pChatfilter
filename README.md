# pChatfilter
FiveM chatfilter to filter out vulgar language. With two word "categories", one that triggers a warning and one that triggers a kick, both of these actions will be logged in Discord using a webhook.

# Installation

Clone or download the repository to your resources folder (or any subfolder within the resources folder) and add ``ensure pChatfilter``

# Config

The config file can be found here ``src/config.js``

``webhookurl`` - Make a new Webhook and paste the URL here (IMPORTANT! Remove https://discord.com from the URL, example of a correct URL: ``/api/webhooks/818264982672113768/VbP8y0As6i3YBKv04wVB0vOKiaYRmf8G_qqZ3lZfeE4UPtSX_vzyOYF6ZZNX92naby_7``

``staffRole`` - The role ID of the role you want to be alerted when the chatfilter is triggered

Then you just have to add all the words you want to filter out.
