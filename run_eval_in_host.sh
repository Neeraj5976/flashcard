#!/bin/bash
docker build -t rollers_app2 .
docker container prune -f
docker run --rm -p 3001:3001 rollers_app2
