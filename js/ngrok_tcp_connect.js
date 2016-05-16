var ngrok = require('ngrok');
var util = require('util');
var secrets = require('../ansible-pi/secret_files/secret.json');
var Slack = require('slack-node');


apiToken = secrets['CITIGROUP_SLACKBOT_TOKEN'];
slack = new Slack(apiToken);

clToken = secrets['COMPUTERLAB_SLACKBOT_TOKEN'];
clSlack = new Slack(clToken);

var send_slack_message = function(msg) {
	console.log(msg);
	//slack.api('chat.postMessage', {
	//	text: msg,
	//	channel: '#oasis',
	//	username: "oasis",
	//	link_names: 1
	//}, function (err, response) {
	//});
	clSlack.api('chat.postMessage', {
		text: msg,
		channel: '#general',
		username: "oasis_bot",
		link_names: 1
	}, function (err, response) {
	});
}

// log console messages
var console_msg = util.format('++ attempting to connect with ngrok');
send_slack_message(console_msg);

ngrok.connect({
	proto: 'tcp', // http|tcp|tls
	addr: 22, // port or network address
	auth: 'user:pwd', // http basic authentication for tunnel
	authtoken: secrets['NGROK_TOKEN']
	//subdomain: 'alex', // reserved tunnel name https://alex.ngrok.io,
	//authtoken: '12345' // your authtoken from ngrok.com
}, function (err, url) {
	send_slack_message('++ ngrok connected');
	send_slack_message(util.format('++ error: %j', err));
	send_slack_message(util.format('++ url: %s', url));
	// tcp://0.tcp.ngrok.io:12747
	var myRegexp = /tcp:\/\/(\d+\.tcp\.ngrok\.io)\:(\d+?)$/g;
	var match = myRegexp.exec(url);
	var cmd_str = util.format('++ @channel: ssh pi@%s -p%s', match[1], match[2]);
	send_slack_message(cmd_str);
});
