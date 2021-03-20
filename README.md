# discord-send-embed-code-to-webhook
A customizable atom package used to easily send code extracts in an embed message to Discord using webhooks. Originally made by KyStolos.

![image](https://user-images.githubusercontent.com/61242573/111846640-88ede300-8907-11eb-9826-8f8c403e9adc.png)

**Note:** This package requires Discord.js and Node installed. First make sure you have installed Node (test by typing `node -v` in the terminal), if not - download it from [the website](https://nodejs.org/en/download/) To install Discord.js type in the following command in the terminal:
```
npm install discord.js
```

## How to use the package

### Setup your webhook(s)

1. Go to your package settings `Packages` -> `Settings View` -> `Manage package`
2. Find the `discord-send-embed-code-to-webhook` package, click on `Settings`
3. Paste your webhook URL in the config field, you can have up to 3 webhooks at once, but only the first has a Keybinding for it
4. Modify the embed title, color, footer text and image to your liking.


### Post your code to your Discord

1. Select the code you want to share on Discord in your editor
2. Press `ctrl+q` to send it to your first webhook
