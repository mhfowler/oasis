import sys

from oasis_python.create_new_users import process_dm


if __name__ == '__main__':
    # dm_text = 'username/password'
    # dm_sender_screen_name = 'notplants'
    process_dm(dm_text=sys.argv[1], dm_sender_screen_name=sys.argv[2])