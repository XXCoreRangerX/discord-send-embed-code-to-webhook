'use babel';

const Discord = require('discord.js');
const hastebin = require('hastebin-gen')
import DiscordSendEmbedCodeToWebhookView from './discord-send-embed-code-to-webhook-view';
import { CompositeDisposable } from 'atom';

export default {
  config: {
    "webhook-url": {
      "label": "Webhook URL",
      "description": "URL of the webhook.",
      "type": "string",
      "default": ""
    },
    "webhook-username": {
      "description": "Bot account's username.",
      "type": "string",
      "default": "Atom"
    },
    "webhook-avatar": {
      "description": "Bot account's avatar.",
      "type": "string",
      "default": "https://avatars.githubusercontent.com/u/1089146?s=200&v=4"
    },
    "webhook-title": {
      "description": "The title of the webhook.",
      "type": "string",
      "default": "A code snippet from Atom"
    },
    "webhook-author": {
      "description": "Name of the webhook's author (useful for larger teams).",
      "type": "string",
      "default": ""
    },
    "webhook-author-avatar": {
      "description": "Avatar of the webhook's author (useful for larger teams).",
      "type": "string",
      "default": ""
    },
    "webhook-author-url": {
      "description": "URL of the webhook's author.",
      "type": "string",
      "default": ""
    },
    "webhook-color": {
      "description": "The color of the embed.",
      "type": "string",
      "default": "#5fb57d"
    },
    "webhook-footer-text": {
      "description": "Footer text of the embed.",
      "type": "string",
      "default": "Sent from Atom"
    },
    "webhook-footer-image": {
      "description": "Footer image of the embed.",
      "type": "string",
      "default": "https://avatars.githubusercontent.com/u/1089146?s=200&v=4"
    },
    "hastebin-url": {
      "description": "Hastebin server URL.",
      "type": "string",
      "default": "https://hastebin.com"
    }
  },

  discordCharLimit: 2048,

  discordSendEmbedCodeToWebhookView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.discordSendEmbedCodeToWebhookView = new DiscordSendEmbedCodeToWebhookView(state.discordSendEmbedCodeToWebhookViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.discordSendEmbedCodeToWebhookView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'discord-send-embed-code-to-webhook:toggle': () => this.toggle()
    }));

    //Register send code to discord command
    this.subscriptions.add(atom.commands.add('atom-text-editor', {
      'discord-send-embed-code-to-webhook:sendSelectionToDiscord': () => this.sendSelectionToDiscord(1)
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.discordEmbedSendCodeToWebhookView.destroy();
  },

  serialize() {
    return {
      discordSendEmbedCodeToWebhookViewState: this.discordSendEmbedCodeToWebhookView.serialize()
    };
  },

  toggle() {
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  },

  sendSelectionToDiscord(webhookConfigToUse) {
    let editor;
    if(editor = atom.workspace.getActiveTextEditor()) {
      const selection = editor.getSelectedText();
      const selectionHastebin = selection
      if(selection && selection != "") {
        const grammar = editor.getGrammar().name;
        const fileName = editor.getPath();
        let webhookURL = atom.config.get('discord-send-embed-code-to-webhook.webhook-url');
        let webhookID = webhookURL.substring(33, 51)
        let webhookToken = webhookURL.substring(52, 120)
        let webhookUsername = atom.config.get('discord-send-embed-code-to-webhook.webhook-username');
        let webhookAvatar = atom.config.get('discord-send-embed-code-to-webhook.webhook-avatar');
        let webhookTitle = atom.config.get('discord-send-embed-code-to-webhook.webhook-title');
        let webhookAuthor = atom.config.get('discord-send-embed-code-to-webhook.webhook-author');
        let webhookAuthorAvatar = atom.config.get('discord-send-embed-code-to-webhook.webhook-author-avatar');
        let webhookAuthorURL = atom.config.get('discord-send-embed-code-to-webhook.webhook-author-url');
        let webhookColor = atom.config.get('discord-send-embed-code-to-webhook.webhook-color');
        let webhookFooterText = atom.config.get('discord-send-embed-code-to-webhook.webhook-footer-text');
        let webhookFooterImage = atom.config.get('discord-send-embed-code-to-webhook.webhook-footer-image');
        let hastebinURL = atom.config.get('discord-send-embed-code-to-webhook.hastebin-url');
        if(webhookURL) { // The user has set his webhook URL in the config
          if(selection.length > this.discordCharLimit) { // If content has more chars than discord char limit
            let sendFunction = this.sendtowebhook;
            let discordCharLimit = this.discordCharLimit;
            let charLimit = this.discordCharLimit-(grammar.length)-(21);
            atom.beep()
            notification = atom.notifications.addWarning(
              "Your selection has more characters than discord's max limit ("+discordCharLimit+" chars)!", {
              dismissable: true,
              buttons: [
                {
                  onDidClick: function() {
                    sendFunction(selection.substring(0, charLimit), selectionHastebin, grammar, fileName, webhookID, webhookToken, webhookUsername, webhookAvatar, webhookTitle, webhookAuthor, webhookAuthorAvatar, webhookAuthorURL, webhookColor, webhookFooterText, webhookFooterImage, hastebinURL),
                    notification.dismiss()
                  },
                  text: "Send only the first "+discordCharLimit+" chars (Hastebin will be sent the whole code)"
                },
                {
                  onDidClick: function() {
                    notification.dismiss()
                  },
                  text: "Close"
                }
              ]
            });
          } else {
            this.sendtowebhook(selection, selectionHastebin, grammar, fileName, webhookID, webhookToken, webhookUsername, webhookAvatar, webhookTitle, webhookAuthor, webhookAuthorAvatar, webhookAuthorURL, webhookColor, webhookFooterText, webhookFooterImage, hastebinURL);
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

sendtowebhook(selection, selectionHastebin, grammar, fileName, webhookID, webhookToken, webhookUsername, webhookAvatar, webhookTitle, webhookAuthor, webhookAuthorAvatar, webhookAuthorURL, webhookColor, webhookFooterText, webhookFooterImage, hastebinURL) {
  const webhookClient = new Discord.WebhookClient(webhookID, webhookToken);
  async function asyncCall() {
    const fileExtension = fileName.split('.').pop();
    const hastebinLink = await hastebin(selectionHastebin, { url: hastebinURL, extension: fileExtension });
    const embed = new Discord.MessageEmbed()
      .setTitle(webhookTitle)
      .setURL(hastebinLink)
      .setAuthor(webhookAuthor, webhookAuthorAvatar, webhookAuthorURL)
      .setDescription("**Code:**\n" + "```" + `${grammar}\n` + `${selection}\n` + "```")
      .addFields(
        { name: '**Language:**', value: "`" + `${grammar}` + "`"}
      )
      .setColor(webhookColor)
      .setTimestamp()
      .setFooter(webhookFooterText, webhookFooterImage);

      try {
    		webhookClient.send('', {
    	  	username: webhookUsername,
    	  	avatarURL: webhookAvatar,
    	  	embeds: [embed],
    	  });
    		atom.notifications.addSuccess("Success: your code has been sent to Discord!")
    	} catch (error) {
    		atom.notifications.addError("An error occured!")
    	}
  }
  asyncCall()
}
};
