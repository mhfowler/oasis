#!/usr/bin/env bash

set -e

USERNAME=$1
PASSWORD=$2

/usr/sbin/useradd -G oasis -m $USERNAME
/bin/echo "$USERNAME:$PASSWORD" | /usr/sbin/chpasswd
