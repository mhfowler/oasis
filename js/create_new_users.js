var twitter_helper = require ('./twitter_helper.js');
var _log = require('./log_helper.js')._log;
var child_process = require('child_process');
var util = require('util');

var exec_cmd = function(cmd) {
    _log(util.format('cmd: %s', cmd));
    child_process.exec(cmd, function(error, stdout, stderr) {
        _log(util.format('stdout: %s', stdout));
        _log(util.format('stderr: %s', stderr));
        _log(util.format('error: %j', error));
    });
}

var create_user = function(username, password) {
    var useradd_cmd = util.format('useradd -m %s', username);
    _log(util.format('++ adding user: %s', username));
    exec_cmd(useradd_cmd);
    var chpasswd_cmd = util.format('echo %s:%s | chpasswd', username, password);
    _log(util.format('++ chpasswd'));
    exec_cmd(chpasswd_cmd);
}

if (require.main === module) {
    create_user('test', 'passwordpassword');
}