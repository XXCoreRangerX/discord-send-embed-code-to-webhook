'use babel';

import { CompositeDisposable } from 'atom';

export default {
  config: {
    "webhook-url": {
      "title": "Webhook URL",
      "description": "URL of the webhook.",
      "type": "string",
      "default": "",
      "order": 1
    },
    "webhook-title": {
      "title": "Webhook Title",
      "description": "The title of the webhook.",
      "type": "string",
      "default": "A code snippet from Atom",
      "order": 2
    },
    "webhook-username": {
      "title": "Webhook Bot's Username",
      "description": "Bot account's username.",
      "type": "string",
      "default": "Atom",
      "order": 3
    },
    "webhook-color": {
      "title": "Webhook Color",
      "description": "The color of the embed.",
      "type": "string",
      "default": "#5fb57d",
      "order": 4
    },
    "webhook-avatar": {
      "title": "Webhook Bot's avatar",
      "description": "Bot account's avatar.",
      "type": "string",
      "default": "https://avatars.githubusercontent.com/u/1089146?s=200&v=4",
      "order": 5
    },
    "webhook-author": {
      "title": "Webhook Author",
      "description": "Name of the webhook's author (useful for larger teams).",
      "type": "string",
      "default": "",
      "order": 6
    },
    "webhook-author-avatar": {
      "title": "Webhook Author Avatar",
      "description": "Avatar of the webhook's author (useful for larger teams).",
      "type": "string",
      "default": "",
      "order": 7
    },
    "webhook-author-url": {
      "title": "Webhook Author URL",
      "description": "URL of the webhook's author.",
      "type": "string",
      "default": "",
      "order": 8
    },
    "webhook-footer-text": {
      "title": "Webhook Footer Text",
      "description": "Footer text of the embed.",
      "type": "string",
      "default": "Sent from Atom",
      "order": 9
    },
    "webhook-footer-image": {
      "title": "Webhook Footer Image",
      "description": "Footer image of the embed.",
      "type": "string",
      "default": "https://avatars.githubusercontent.com/u/1089146?s=200&v=4",
      "order": 10
    },
    "hastebin-url": {
      "title": "Hastebin URL",
      "description": "Hastebin server URL.",
      "type": "string",
      "default": "https://hastebin.com",
      "order": 11
    }
  },

  discordCharLimit: 2048,

  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    //Register send code to discord command
    this.subscriptions.add(atom.commands.add('atom-text-editor', {
      'discord-send-embed-code-to-webhook:sendSelectionToDiscord': () => this.sendSelectionToDiscord(1)
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  sendSelectionToDiscord(webhookConfigToUse) {
    let editor;
    if (editor = atom.workspace.getActiveTextEditor()) {
      const selection = editor.getSelectedText();
      const selectionHastebin = selection
      if (selection && selection != "") {
        let grammar = editor.getGrammar().name;
        let properties = {
          webhookURL: atom.config.get('discord-send-embed-code-to-webhook.webhook-url'),
          webhookUsername: atom.config.get('discord-send-embed-code-to-webhook.webhook-username'),
          webhookAvatar: atom.config.get('discord-send-embed-code-to-webhook.webhook-avatar'),
          webhookTitle: atom.config.get('discord-send-embed-code-to-webhook.webhook-title'),
          webhookAuthor: atom.config.get('discord-send-embed-code-to-webhook.webhook-author'),
          webhookAuthorAvatar: atom.config.get('discord-send-embed-code-to-webhook.webhook-author-avatar'),
          webhookAuthorURL: atom.config.get('discord-send-embed-code-to-webhook.webhook-author-url'),
          webhookColor: atom.config.get('discord-send-embed-code-to-webhook.webhook-color'),
          webhookFooterText: atom.config.get('discord-send-embed-code-to-webhook.webhook-footer-text'),
          webhookFooterImage: atom.config.get('discord-send-embed-code-to-webhook.webhook-footer-image'),
          hastebinURL: atom.config.get('discord-send-embed-code-to-webhook.hastebin-url')
        };
        if (properties.webhookURL) { // The user has set his webhook URL in the config
          if (selection.length > this.discordCharLimit) { // If content has more chars than discord char limit
            let sendFunction = this.sendtowebhook;
            let discordCharLimit = this.discordCharLimit;
            let charLimit = this.discordCharLimit - (grammar.length) - (21);
            atom.beep()
            notification = atom.notifications.addWarning(
              "Your selection has more characters than discord's max limit (" + discordCharLimit + " chars)!", {
                dismissable: true,
                buttons: [{
                    onDidClick: function() {
                      sendFunction(selection.substring(0, charLimit), selectionHastebin, grammar, properties),
                        notification.dismiss()
                    },
                    text: "Send only the first " + discordCharLimit + " chars (Hastebin will be sent the whole code)"
                  },
                  {
                    onDidClick: function() {
                      notification.dismiss()
                    },
                    text: "Cancel"
                  }
                ]
              });
          } else {
            this.sendtowebhook(selection, selectionHastebin, grammar, properties);
          }
        } else {
          atom.beep()
          atom.notifications.addError("You must set your Discord webhook URL in the package config!")
        }
      } else {
        atom.beep()
        atom.notifications.addWarning("Your selection is empty!");
      }
    }
  },

  sendtowebhook(selection, selectionHastebin, grammar, properties) {
    const Discord = require('discord.js');
    const Hastebin = require('hastebin-gen');
    webhookID = properties.webhookURL.substring(33, 51)
    webhookToken = properties.webhookURL.substring(52, 120)
    const webhookClient = new Discord.WebhookClient(webhookID, webhookToken);
    async function asyncCall(grammar) {
      const hastebinLink = await Hastebin(selectionHastebin, {
        url: properties.hastebinURL
      });
      const embed = new Discord.MessageEmbed()
        .setTitle(properties.webhookTitle)
        .setURL(hastebinLink)
        .setAuthor(properties.webhookAuthor, properties.webhookAuthorAvatar, properties.webhookAuthorURL)
        .setDescription("**Code:**\n" + "```" + `${grammar}\n` + `${selection}\n` + "```")
        .addFields({
          name: '**Language:**',
          value: "`" + `${grammar}` + "`"
        })
        .setColor(properties.webhookColor)
        .setTimestamp()
        .setFooter(properties.webhookFooterText, properties.webhookFooterImage);

      try {
        webhookClient.send('', {
          username: properties.webhookUsername,
          avatarURL: properties.webhookAvatar,
          embeds: [embed],
        }).catch(console.error);
        atom.notifications.addSuccess("Success: your code has been sent to Discord!")
      } catch (error) {
        atom.notifications.addError("An error occured!")
      }
    }
    if (grammar === "Null Grammar") {
      let grammar = "Unknown"
      asyncCall(grammar)
    } else {
      asyncCall(grammar)
    }
  }
};
