var twitter_helper = require ('./twitter_helper.js');
var _log = require('./log_helper.js')._log;
var child_process = require('child_process');
var util = require('util');

var exec_cmd = function(cmd, success_msg) {
    _log(util.format('cmd: %s', cmd));
    child_process.exec(cmd, function(error, stdout, stderr) {
        _log(util.format('stdout: %s', stdout));
        _log(util.format('stderr: %s', stderr));
        _log(util.format('error: %j', error));
        if (error == null && success_msg != null) {
            _log(success_msg);
        }
    });
}

var create_user = function(username, password) {
    var useradd_cmd = util.format('useradd -m %s', username);
    _log(util.format('++ adding user: %s', username));
    exec_cmd(useradd_cmd, null);
    var chpasswd_cmd = util.format('sudo echo "%s:%s" | sudo chpasswd', username, password);
    _log(util.format('++ chpasswd'));
    exec_cmd(chpasswd_cmd, util.format('++ @channel: successfully created user: %s', username));
}

if (require.main === module) {
    create_user('test_cron', 'passwordpassword');
}