import re
import os
import subprocess
import sys
import traceback

from pi_utilities.slack_helper import slack_notify_message
from pi_utilities.twitter_helper import TwitterHelper
from hello_settings import SECRETS_DICT, PROJECT_PATH

# initialize twitter
tw = TwitterHelper(access_token_key=SECRETS_DICT['TWITTER_ACCESS_TOKEN_KEY'],
                   access_token_secret=SECRETS_DICT['TWITTER_ACCESS_TOKEN_SECRET'],
                   consumer_key=SECRETS_DICT['TWITTER_CONSUMER_KEY'],
                   consumer_secret=SECRETS_DICT['TWITTER_CONSUMER_SECRET'])


# constants
DM_FILE_PATH = os.path.abspath(os.path.join(PROJECT_PATH, '../data/dm_id.txt'))
BOT_SCREEN_NAME = 'ss022001'


def get_last_dm_id():
    if not os.path.exists(DM_FILE_PATH):
        return 0
    with open(DM_FILE_PATH, 'r') as dm_file:
        dm_id = dm_file.read()
    return dm_id


def save_last_dm_id(dm_id):
    with open(DM_FILE_PATH, 'w') as dm_file:
        dm_file.write(str(dm_id))


def create_new_user(username, password):
    username = re.sub('[\W_]+', '', username)
    password = re.sub('[\W_]+', '', password)
    script_path = os.path.join(PROJECT_PATH, 'bash/create_new_user.sh')
    cmd = '{script} {username} {password}'.format(
        script=script_path,
        username=username,
        password=password
    )
    try:
        subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT)
        return username
    except subprocess.CalledProcessError as e:
        sub_output = e.output
        raise Exception('XX: subprocess command failure: {}'.format(str(sub_output)))


def get_latest_host_and_port():
    tweets = tw.get_latest_tweets(screen_name=BOT_SCREEN_NAME, count=20)
    tweets.sort(key=lambda tweet: tweet['id'], reverse=True)
    for tweet in tweets:
        tweet_match = re.match('ssh \S+@(\S+) -p(\S+)', tweet['text'])
        if tweet_match:
            return {
                'host': tweet_match.group(1),
                'port': tweet_match.group(2)
            }


def process_dm(dm_text, dm_sender_screen_name, dm_id=''):
    dm_match = re.match('(\S+)\s*\/\s*(\S+)', dm_text)
    if not dm_match:
        raise Exception('dm message in invalid format')
    username = dm_match.group(1)
    password = dm_match.group(2)
    # check if there are any special characters in username or password
    if re.match('^[\w_]+$', username) is None:
        raise Exception('no special characters allowed in username')
    if re.match('^[\w_]+$', password) is None:
        raise Exception('no special characters allowed in password')
    # now create user
    create_new_user(username=username, password=password)
    # now dm user and tweet to them
    tw.send_dm(msg='OK', recipient=dm_sender_screen_name)
    # get the latest host and port
    latest_dict = get_latest_host_and_port()
    ssh_cmd = 'ssh {username}@{host} -p{port}'.format(
        username=username,
        host=latest_dict['host'],
        port=latest_dict['port']
    )
    tweet_text = '@{screen_name} {ssh_cmd}'.format(
        screen_name=dm_sender_screen_name,
        ssh_cmd=ssh_cmd
    )
    tw.post_tweet(tweet_text)
    tw.send_dm(msg=ssh_cmd, recipient=dm_sender_screen_name)
    slack_notify_message('++ @channel: created user {username} for screen name '
                         '@{screen_name} based on dm {dm_id}'.format(
        username=username,
        screen_name=dm_sender_screen_name,
        dm_id=dm_id
    ))


def create_new_users():
    slack_notify_message(message='++ looking for new users', channel_id='C19FPTANB')
    last_dm_id = get_last_dm_id()
    dms = tw.get_dms(since_id=last_dm_id)
    dms.sort(key=lambda dm: dm['id'])
    for dm in dms:
        save_last_dm_id(dm_id=dm['id'])
        try:
            process_dm(dm_text=dm['text'], dm_sender_screen_name=dm['sender_screen_name'], dm_id=dm['id'])
        except Exception as e:
            slack_notify_message('++ @channel: failed to process dm {dm_id} for user @{screen_name}: {error}'.format(
                dm_id=dm['id'],
                screen_name=dm['sender_screen_name'],
                error=e.message
            ))
            exc_type, exc_value, exc_traceback = sys.exc_info()
            formatted_lines = traceback.format_exc()
            slack_notify_message(formatted_lines)
            # send invalid username dm
            tw.send_dm(msg='500: {}'.format(e.message), recipient=dm['sender_screen_name'])


if __name__ == '__main__':
    create_new_users()
