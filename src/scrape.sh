#!/bin/bash

# Start 
docker container run -d -p 9222:9222 zenika/alpine-chrome --no-sandbox --remote-debugging-address=0.0.0.0 --remote-debugging-port=9222 https://www.chromestatus.com/

start_time=$(date +%s)
deno task scrape:terms 
deno task scrape:subjects 
deno task scrape:courses 

end_time=$(date +%s)
execution_time=$((end_time - start_time))
echo "Total Scraping Time: $execution_time seconds"

# Shutdown docker
docker stop $(docker ps -q)
docker container prune -f
