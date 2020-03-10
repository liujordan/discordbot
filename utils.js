const settings = require('./settings');
const yargs = require('yargs');
const parser = yargs
    .command('top', 'Shows the 5 people who say the n-word the most')
    .exitProcess(false)
    .help(false);
    
module.exports = {
  getCommand: function(message) {
    const withoutPrefix = message.content.slice(settings.bot.prefix.length);
    const split = withoutPrefix.split(/ +/);
    command = parser.parse(split);

    return command
  },
  reply: function(source, message) {
    source.channel.send(message)
  }
}