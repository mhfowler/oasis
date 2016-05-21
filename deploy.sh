#!/usr/bin/env bash
#ansible-playbook ansible-pi/playbook.yml -i ansible-pi/hosts --ask-pass --sudo -c paramiko
#ansible -i ansible-pi/hosts pis -m ping --ask-pass --sudo
#ansible-playbook ansible-pi/playbook.yml -i ansible-pi/hosts --ask-pass --sudo
ansible-playbook ansible-pi/playbook.yml -i ansible-pi/hosts --ask-pass --sudo --tags code
