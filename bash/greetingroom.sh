#!/usr/bin/env bash
chgrp -R oasis /greetingroom/
find /greetingroom/ -type f -exec chmod 666 {} +
find /greetingroom/ -type d -exec chmod 775 {} +

chgrp -R oasis /home/
find /home/ -type f -exec chmod 644 {} +
find /home/ -type d -exec chmod 755 {} +