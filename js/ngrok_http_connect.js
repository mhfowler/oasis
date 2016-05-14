var ngrok = require('ngrok');
var secrets = require('../ansible-pi/secret_files/secret.json');


console.log('++ attempting to connect with ngrok: %s', secrets['NGROK_TOKEN']);


ngrok.connect({
	proto: 'http', // http|tcp|tls
	addr: 3000, // port or network address
	auth: 'user:pwd', // http basic authentication for tunnel
	authtoken: secrets['NGROK_TOKEN']
	//subdomain: 'alex', // reserved tunnel name https://alex.ngrok.io,
	//authtoken: '12345' // your authtoken from ngrok.com
}, function (err, url) {
	console.log('++ ngrok connected');
	  debugger;
	console.log('++ error: %j', err);
	console.log('++ url: %s', url);
});
