#!/bin/bash

compose_config_path=./docker-compose.yml

printf "Docker copmose file at %s" $compose_config_path;

docker compose \
  -f $compose_config_path \
  up \
  --detach \
  db
