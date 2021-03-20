'use babel';

const Discord = require('discord.js');
import DiscordSendEmbedCodeToWebhookView from './discord-send-embed-code-to-webhook-view';
import { CompositeDisposable } from 'atom';

export default {
  config: {
    "webhook-url": {
      "description": "The URL of the webhook.",
      "type": "string",
      "default": ""
    },
    "webhook-username": {
      "description": "The bot account's username.",
      "type": "string",
      "default": "Atom Code Snippet"
    },
    "webhook-avatar": {
      "description": "The bot account's avatar.",
      "type": "string",
      "default": "https://avatars.githubusercontent.com/u/1089146?s=200&v=4"
    },
    "webhook-title": {
      "description": "The title of the webhook.",
      "type": "string",
      "default": "A code snippet from Atom"
    },
    "webhook-color": {
      "description": "The color of the embed.",
      "type": "string",
      "default": "#5fb57d"
    },
    "webhook-footer-text": {
      "description": "The text in the footer of the embed.",
      "type": "string",
      "default": "Sent from Atom"
    },
    "webhook-footer-image": {
      "description": "The image in the footer of the embed.",
      "type": "string",
      "default": "https://avatars.githubusercontent.com/u/1089146?s=200&v=4"
    }
  },

  discordCharLimit: 2000,

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
      if(selection && selection != "") {
        const grammar = editor.getGrammar().name;
        let webhookURL = atom.config.get('discord-send-embed-code-to-webhook.webhook-url');
        let webhookID = webhookURL.substring(33, 51)
        let webhookToken = webhookURL.substring(52, 120)
        let webhookUsername = atom.config.get('discord-send-embed-code-to-webhook.webhook-username');
        let webhookAvatar = atom.config.get('discord-send-embed-code-to-webhook.webhook-avatar');
        let webhookTitle = atom.config.get('discord-send-embed-code-to-webhook.webhook-title');
        let webhookColor = atom.config.get('discord-send-embed-code-to-webhook.webhook-color');
        let webhookFooterText = atom.config.get('discord-send-embed-code-to-webhook.webhook-footer-text');
        let webhookFooterImage = atom.config.get('discord-send-embed-code-to-webhook.webhook-footer-image');
        if(webhookURL) { // The user has set his webhook URL in the config
          if(selection.length > this.discordCharLimit) { // If content has more chars than discord char limit
            let sendFunction = this.sendtowebhook;
            let discordCharLimit = this.discordCharLimit;
            let charLimit = this.discordCharLimit-(selection.length);
            atom.beep()
            notification = atom.notifications.addWarning(
              "Your selection has more characters than discord's max limit ("+discordCharLimit+" chars)!", {
              dismissable: true,
              buttons: [
                {
                  onDidClick: function() {
                    sendFunction(selection.substring(0, charLimit), grammar, webhookID, webhookToken, webhookUsername, webhookAvatar, webhookTitle, webhookColor, webhookFooterText, webhookFooterImage),
                    notification.dismiss()
                  },
                  text: "Send only the first "+discordCharLimit+" chars (currently broken feature)"
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
            this.sendtowebhook(selection, grammar, webhookID, webhookToken, webhookUsername, webhookAvatar, webhookTitle, webhookColor, webhookFooterText, webhookFooterImage);
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

sendtowebhook(selection, grammar, webhookID, webhookToken, webhookUsername, webhookAvatar, webhookTitle, webhookColor, webhookFooterText, webhookFooterImage) {
  const webhookClient = new Discord.WebhookClient(webhookID, webhookToken);
	const embed = new Discord.MessageEmbed()
		.setTitle(webhookTitle)
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

};
