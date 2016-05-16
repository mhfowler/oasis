#!/usr/bin/env bash
command -v occi >/dev/null 2>&1
found_occi=$?
if [ $found_occi = 1 ]; then
   sudo curl -SLs https://apt.adafruit.com/install | sudo bash
   echo '{"changed": true, "msg": "installed occi"}'
else
   echo '{"changed": false, "msg": "occi already installed", "contents": "none"}'
fi
