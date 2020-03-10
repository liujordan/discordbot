const nwordRequest = require('./nword_count_request');
const settings = require('./settings');
const ES_NODE = settings.es.host;
const request = require('request');

module.exports = function(message) {
  request.post(`${ES_NODE}/discord_read/_search/`, {
    json: nwordRequest,
    headers: { 'Authorization': 'Basic ' + Buffer.from(`${settings.es.auth.username}:${settings.es.auth.password}`).toString('base64')},
    agentOptions: {rejectUnauthorized: false}
  },(err, res, body) => {
    if (err) return console.log(err)
    let output = ""
    body.aggregations.counts.buckets.forEach((bucket) => {
      output += `${bucket.key} said the n-word ${bucket.doc_count} time${bucket.doc_count > 1 ? 's' : ''}\n`
    })
    message.channel.send(output)
  })
}
