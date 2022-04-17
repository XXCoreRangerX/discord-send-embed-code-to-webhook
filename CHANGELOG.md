## v3.3.1
* Added an option to disable upload to Hastebin.

## v3.3.0
* **HUGE** code cleanup. **VASTLY** reduced startup time.
* Beautified the code.
* Removed `toggle` function, which was useless.
* Removed `discord-send-embed-code-to-webhook-view.js` because it's no longer needed.

## v3.2.1
* Fixed the embed not properly showing code contents when file has no extension (Null Grammar error).

## v3.2.0
* Make settings menu more clear and display in a selected order.
* Sending more than Discord's max characters will now have a "cancel" button instead of "close". Why? Because yes, thats's why.
* Switch to `https://hastebin.com` as the default Hastebin server.
* Make Hastebin automatically assign file extensions to code snippets (fixes not being able to send code from an untitled file).
* Dependencies (discord.js and hastebin-gen) will be (hopefully) installed automatically from now on.
* Make the menu and context menu toggle a little bit better.
* Default bot username is now Atom.
* README update

## v3.1.0
* Even if the code is more than 2048 characters, it will be fully uploaded to Hastebin.

## v3.0.0
* Sending code to Hastebin is now possible, along with language highlighting!
* README update

## v2.2.0
* Added more options (Author settings, title URL)

## v2.1.0
* Fixed sending over 2048 characters crashing the package

## v2.0.0
* A lot of bug fixes (locally)

## v0.1.0
* Modified the entire discord-send-code-to-webhook package to use Discord.js, pre-release
