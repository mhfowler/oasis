import subprocess
import time

from pi_utilities.slack_helper import slack_notify_message


def get_online_users():
    try:
        cmd = 'who'
        found = subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT)
        if not found:
            return []
        else:
            lines = found.split('\n')
            who = set([])
            for line in lines:
                splitted = line.split(' ')
                username = splitted[0]
                who.add(username)
            return who
    except subprocess.CalledProcessError as e:
        sub_output = e.output
        raise Exception('XX: subprocess command failure: {}'.format(str(sub_output)))


def check_for_new_who():
    previous_users = []
    while True:
        current_users = get_online_users()
        new_users = filter(lambda user: user not in previous_users, current_users)
        if new_users:
            for user in new_users:
                slack_notify_message('++ @channel: {user} just logged into oasis'.format(
                    user=user
                ))
        previous_users = current_users
        time.sleep(5)


if __name__ == '__main__':
    check_for_new_who()