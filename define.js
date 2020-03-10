const utils = require('./utils');
const settings = require('./settings');
const request = require('request');

function getRapidApiHeader(apiName) {
  return {
    'x-rapidapi-host': settings.rapidApi[apiName].host,
    'x-rapidapi-key': settings.rapidApi[apiName].key
  }
}

module.exports = function(message) {
  let command = utils.getCommand(message)
  if (command._.length != 2) return utils.reply(message, "invalid number of words to define");

  let options = {
    method: 'GET',
    url: `https://wordsapiv1.p.rapidapi.com/words/${command._[1]}/definitions`,
    headers: getRapidApiHeader("wordsApi")
  }
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    body = JSON.parse(body)
    console.log(body)
    let out = `**${body.word}**\n`;

    if(body.definitions == undefined) return reply(message, body.message)
    body.definitions.forEach(def => {
      out += `_${def.partOfSpeech}_:\t${def.definition}\n`
    })
    utils.reply(message, out);
  });
}