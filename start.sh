#!/bin/bash
tmux -2 new -d -n 'scratch' -s watchr
tmux neww -t watchr:1 -n 'git'
tmux neww -t watchr:2 -n 'grunt' 'grunt dev;bash -i'
tmux neww -t watchr:3 -n 'node' 'npm start;bash -i'
tmux neww -t watchr:4 -n 'redis' 'redis-cli monitor;bash -i'
tmux neww -t watchr:5 -n 'splunk' -c /opt/splunk/bin './splunk start;bash -i'
tmux neww -t watchr:6 -n 'mysql'
tmux neww -t watchr:7 -n 'ws' -c /opt/WebStorm-129.664/bin/ './webstorm.sh;bash -i'
tmux send-keys -t watchr:7 '\n' C-m
tmux select-window -t watchr:3
tmux -2 attach-session -t watchr
