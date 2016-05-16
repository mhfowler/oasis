#!/usr/bin/env bash

set -e

USERNAME=$1
PASSWORD=$2

sudo /usr/sbin/useradd -G oasis -m $USERNAME
sudo /bin/echo "$USERNAME:$PASSWORD" | sudo /usr/sbin/chpasswd
