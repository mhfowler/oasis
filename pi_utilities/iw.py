from slack_helper import slack_notify_message
from printer_helper import rprint
import time
import re

from hello_settings import SECRETS_DICT
from pi_utilities.twitter_helper import TwitterHelper


IW_CHANNEL = 'C0ZBDJK7V'
SCREEN_NAME = 'infinitewishing'
SLEEP_CONSTANT = 60


tw = TwitterHelper(access_token_key=SECRETS_DICT['TWITTER_ACCESS_TOKEN'],
                   access_token_secret=SECRETS_DICT['TWITTER_ACCESS_TOKEN_SECRET'],
                   consumer_key=SECRETS_DICT['TWITTER_CONSUMER_KEY'],
                   consumer_secret=SECRETS_DICT['TWITTER_CONSUMER_SECRET'])


def _slack(message):
    message = message.encode('ascii', 'ignore')
    slack_notify_message(message=message, channel_id=IW_CHANNEL)


def get_new_tweets(since_id):
    return tw.get_latest_tweets(screen_name=SCREEN_NAME, count=10, since_id=since_id)


def printer_print(message, screen_name):
    rprint(msg=message, screen_name=screen_name)
    _slack(message)


def iw():
    since_id = None
    while True:
        _slack('++ looking for new tweets')
        tweets = get_new_tweets(since_id=since_id)
        for tweet in reversed(tweets):
            since_id = tweet['id_str']
            tweet_text = tweet.get('text')
            if tweet_text:
                rt_match = re.match('RT \@(\S+)\:', tweet_text.encode('ascii', 'ignore'))
                if rt_match:
                    screen_name = rt_match.group(1)
                else:
                    screen_name = None
                # now print
                printer_print(message=tweet_text, screen_name=screen_name)
        time.sleep(SLEEP_CONSTANT)


if __name__ == '__main__':
    iw()