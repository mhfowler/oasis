var Promise = require('promise');
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


exports.get_dms = function(since_id) {
    var params = {};
    if (since_id != null) {
        params = {'since_id': since_id}
    }
    return new Promise(function (fulfill, reject) {
        client.get('direct_messages', params,  function(error, tweet, response){
            if(error) {
                console.log(util.format('error: %j', error));
                reject(error);
            }
            else {
                fulfill(response);
            }
        });
    });
}


exports.get_timeline = function() {
    var params = {
        exclude_replies: true,
        screen_name: 'ss022001',
        count: 100
    };
    return new Promise(function (fulfill, reject) {
        client.get('statuses/user_timeline', params,  function(error, tweet, response){
            if(error) {
                console.log(util.format('error: %j', error));
                reject(error);
            }
            else {
                fulfill(response);
            }
        });
    });
}


exports.post_dm = function(msg, send_to) {
    client.post('/direct_messages/new', {screen_name: send_to, text: msg},  function(error, tweet, response){
        if(error) {
            console.log(util.format('error: %j', error));
        };
    });
}


function readJSON(filename){
    return new Promise(function (fulfill, reject){
        readFile(filename, 'utf8').done(function (res){
            try {
                fulfill(JSON.parse(res));
            } catch (ex) {
                reject(ex);
            }
        }, reject);
    });
}


if (require.main === module) {
    var dms_promise = exports.get_dms(null);
    console.log('dms_promise: %j', dms_promise);
    dms_promise.done(function(response) {
        var dms = JSON.parse(response['body']);
        console.log(util.format('dm: %j', Object.keys(dms[0])));
        for (i = 0; i < dms.length; i++) {
            var dm = dms[i];
            console.log(util.format('screen_name: %s', dm['sender_screen_name']));
            console.log(util.format('message: %s', dm['text']));
            console.log(util.format('id: %s', dm['id']));
        }
    });
}


