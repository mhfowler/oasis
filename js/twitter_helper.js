
var secrets = require('../ansible-pi/secret_files/secret.json');
var util = require('util');
var Twitter = require('twitter');

// credentials
var consumer_key = secrets['TWITTER_CONSUMER_KEY'];
var consumer_secret = secrets['TWITTER_CONSUMER_SECRET'];
var access_token_key = secrets['TWITTER_ACCESS_TOKEN_KEY'];
var access_token_secret = secrets['TWITTER_ACCESS_TOKEN_SECRET'];

//console.log('consumer_key: %s', consumer_key);
//console.log('consumer_secret: %s', consumer_secret);
//console.log('access_token_key: %s', access_token_key);
//console.log('access_token_secret: %s', access_token_secret);

var client = new Twitter({
  consumer_key: consumer_key,
  consumer_secret: consumer_secret,
  access_token_key: access_token_key,
  access_token_secret: access_token_secret
});


exports.post_tweet = function(msg) {
  client.post('statuses/update', {status: msg},  function(error, tweet, response){
    if(error) {
      console.log(util.format('error: %j', error));
    };
  });
}


if (require.main === module) {
    post_tweet('++ hello');
}


