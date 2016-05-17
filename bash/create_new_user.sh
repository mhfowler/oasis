#!/usr/bin/env bash

set -e

USERNAME=$1
PASSWORD=$2

/usr/sbin/useradd -G oasis -m $USERNAME
/bin/echo "$USERNAME:$PASSWORD" | /usr/sbin/chpasswd

# give correct permission
/bin/chgrp oasis /home/$USERNAME
/bin/chown $USERNAME /home/$USERNAME
/bin/chmod 770 /home/$USERNAME
ln -s  /greetingroom /home/$USERNAME/greetingroom
