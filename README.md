# Discord bot command framework/handler


This framework can be used with any node discord library.

## Example

```javascript
const CommandHandler = require('discord-bot-command-framework');

class About extends CommandHandler.Command
{
    constructor(message, prefix, args)
    {
        super(message, prefix, args);
    }
 
    static getUsage()
    {
        return 'This command shows information about the bot.';
    }
 
    async run()
    {
        return this.message.reply('Bot made by Souper.');
    }
}
 
class Help extends CommandHandler.Command
{
    constructor(message, prefix, args)
    {
        super(message, prefix, args);
    }
 
    static getUsage()
    {
        return 'help';
    }
 
    async run()
    {
        let msg = "--Help--\n\n";
 
        this.getCommandRegistry().forEach((value, key, map) =>
        {
            msg += this.prefix + key + " - " + value.getUsage() + "\n";
        });

        return this.message.channel.send(msg);
    }
}
 
class Default extends CommandHandler.Command
{
    constructor(message, prefix, args)
    {
        super(message, prefix, args);
    }
 
    async run()
    {
        console.log("Default command called with prefix " + this.prefix + " and with args: " + this.args.join(' '));
    }
}
 
CommandHandler.setDefaultCommand(Default); // Default command handler gets called if the command is not found.
CommandHandler.registerCommand('about', About); // commandName => Class
CommandHandler.registerCommand('help', Help); // help => Class

CommandHandler.registerAlias('a', 'about'); // a => about
CommandHandler.registerAlias('h', 'help'); // h => help

const myPrefix = '!';

async function onMessage(message)
{
    if(message.content.startsWith(myPrefix))
    {
        commandHandler.runCommand(myPrefix, message.content, message);
    }
}
```