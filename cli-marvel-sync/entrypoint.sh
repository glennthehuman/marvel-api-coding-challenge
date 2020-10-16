#!/bin/bash

# Start the run once job.
echo "Docker container has been started"

echo "Installing project dependencies"
npm install

echo "Initializing DB..."
node /home/node/app/app sync
echo "...DB Initialized!"

# Because the cron cannot read the environment variables from the container
declare -p | grep -Ev 'BASHOPTS|BASH_VERSINFO|EUID|PPID|SHELLOPTS|UID' > /container.env

# Setup a cron schedule for subsequent sync calls
echo "SHELL=/bin/bash
BASH_ENV=/container.env
0 22 * * * /run.sh >> /var/log/cron.log 2>&1
# This extra line makes it a valid cron" > scheduler.txt

crontab scheduler.txt
cron -f