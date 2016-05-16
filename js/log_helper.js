var util = require('util');
var secrets = require('../ansible-pi/secret_files/secret.json');
var Slack = require('slack-node');

// set up slack
apiToken = secrets['CITIGROUP_SLACKBOT_TOKEN'];
slack = new Slack(apiToken);

exports._log = function(msg) {
	console.log(msg);
	slack.api('chat.postMessage', {
		text: msg,
		channel: '#oasis',
		username: "oasis",
		link_names: 1
	}, function (err, response) {
	});
}