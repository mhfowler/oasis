var ngrok = require('ngrok');
var util = require('util');
var secrets = require('../ansible-pi/secret_files/secret.json');
var Slack = require('slack-node');
var twitter_helper = require('./twitter_helper.js');


apiToken = secrets['CITIGROUP_SLACKBOT_TOKEN'];
slack = new Slack(apiToken);

var send_slack_message = function(msg) {
	console.log(msg);
	slack.api('chat.postMessage', {
		text: msg,
		channel: '#oasis',
		username: "oasis",
		link_names: 1
	}, function (err, response) {
	});
}

// log console messages
var console_msg = util.format('++ @channel attempting to connect with ngrok: %s', secrets['NGROK_TOKEN']);
send_slack_message(console_msg);

ngrok.connect({
	proto: 'http', // http|tcp|tls
	addr: 3000, // port or network address
	auth: 'user:pwd', // http basic authentication for tunnel
	authtoken: secrets['NGROK_TOKEN']
	//subdomain: 'alex', // reserved tunnel name https://alex.ngrok.io,
	//authtoken: '12345' // your authtoken from ngrok.com
}, function (err, url) {
	twitter_helper.post_tweet('test');
	send_slack_message('++ ngrok connected');
	//send_slack_message(util.format('++ error: %j', err));
	//send_slack_message(util.format('++ url: %s', url));
});
