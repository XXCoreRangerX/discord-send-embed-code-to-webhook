# discord-send-embed-code-to-webhook
A customizable atom package used to easily send code extracts in an embed message to Discord using webhooks. Originally made by KyStolos.

<p align="center">
  <a href="https://github.com/XXCoreRangerX/discord-send-embed-code-to-webhook/tags">
    <img src="https://user-images.githubusercontent.com/61242573/111846640-88ede300-8907-11eb-9826-8f8c403e9adc.png">
  </a>
<p/>

<p align="center">
  <a href="https://github.com/XXCoreRangerX/discord-send-embed-code-to-webhook/tags">
    <img src="https://img.shields.io/github/v/tag/XXCoreRangerX/discord-send-embed-code-to-webhook?label=LATEST%20VERSION&style=for-the-badge" alt="GitHub tag (latest by date)">
  </a>

  <a href="https://atom.io/packages/discord-send-embed-code-to-webhook">
    <img src="https://img.shields.io/apm/dm/discord-send-embed-code-to-webhook?style=for-the-badge" alt="APM downloads">
  </a>

  <a href="https://github.com/XXCoreRangerX/discord-send-embed-code-to-webhook/blob/master/LICENSE">
    <img src="https://img.shields.io/apm/l/discord-send-embed-code-to-webhook?style=for-the-badge" alt="APM license">
  </a>
<p/>

**Note:** This package requires Discord.js, hastebin-gen and Node installed. First make sure you have installed Node (test by typing `node -v` in the terminal), if not - download it from [the website](https://nodejs.org/en/download/) To install Discord.js and hastebin-gen type in the following command in the terminal:
```console
npm install discord.js
npm install hastebin-gen
```

## How to use the package

### Setup your webhook(s)

1. Go to your package settings `Packages` -> `Settings View` -> `Manage package`
2. Find the `discord-send-embed-code-to-webhook` package, click on `Settings`
3. Paste your webhook URL in the config field
4. Modify the embed title, color, footer text and image to your liking.


### Post your code to your Discord

1. Select the code you want to share on Discord in your editor
2. Press `ctrl+q` to send it to your first webhook
