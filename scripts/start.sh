#!/bin/bash

if [ ! -x /usr/sbin/nginx ]; then
  echo "Nginx not installed"
  echo "Installing Nginx"

  sudo apt -y upgrade 
  sudo apt -y update
  sudo apt install -y nginx

  sudo systemctl start nginx
  sudo systemctl enable nginx
fi
