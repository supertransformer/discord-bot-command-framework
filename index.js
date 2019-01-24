'use strict'

const commandRegistry = new Map();
const aliasRegistry = new Map();

var defaultCommand;

function getCommandRegistry()
{
    return commandRegistry;
}

class Command
{
    constructor(message, prefix, args)
    {
        this.message = message;
        this.prefix = prefix;
        this.args = args;
        this.getCommandRegistry = getCommandRegistry;
    }

     /**
     * Implementation required.
     */
    static getUsage()
    {
        throw new Error('You have to implement the method getUsage!');
    }

     /**
     * Implementation required.
     */
    async run() 
    {
        throw new Error('You have to implement the method run! (Preferably async)');
    }
}

function isCommandRegistered(command)
{
    return commandRegistry.has(command);
}

function registerCommand(command, commandClass)
{
    if(isCommandRegistered(command))
    {
        throw new Error('Tried to register the same command twice!');   
    }

    if(!commandClass instanceof Command)
    {
        throw new Error('Supplied commandClass is not an instance of Command.');
    }

    commandRegistry.set(command, commandClass);
}

function registerAlias(alias, command)
{
    if(!isCommandRegistered(command))
    {
        throw new Error('Tried to add an alias to a command that does not exist!');   
    }

    if(aliasRegistry.has(alias))
    {
        throw new Error(`Alias ${alias} is already registered.`);   
    }

    aliasRegistry.set(alias, command);
}

function setDefaultCommand(command)
{
    if(!command instanceof Command)
    {
        throw new Error('Supplied command is not an instance of Command.');
    }

    defaultCommand = command;
}

async function run(prefix, command, args, message)
{
    let cmdInst = commandRegistry.get(command);

    return new cmdInst(message, prefix, args).run();
}

async function runCommand(prefix, text, message)
{
    const args = text.slice(prefix.length).trim().split(/ +/g);
    let command = args.shift().toLowerCase();

    if(aliasRegistry.has(command))
    {
        command = aliasRegistry.get(command);
    }

    if(!isCommandRegistered(command))
    {
        if(defaultCommand)
        {
            return new defaultCommand(message, prefix, args).run(); 
        } else
        {
            throw new Error('Attempted to run an unknown command without registering a default command first.');
        }
    }

    return run(prefix, command, args, message);
}

module.exports =
{
    Command: Command, 
    registerCommand: registerCommand, 
    registerAlias: registerAlias, 
    setDefaultCommand: setDefaultCommand, 
    runCommand: runCommand,
    isCommandRegistered: isCommandRegistered, 
    getDefaultCommand: function(){ return defaultCommand; }
};