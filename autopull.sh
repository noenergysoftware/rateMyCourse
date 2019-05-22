#!/bin/sh
cd /home/canuse/mctest/
git pull
cd ..
python3 /home/canuse/mctest/manage.py makemigrations
python3 /home/canuse/mctest/manage.py migrate
python3 /home/canuse/mctest/manage.py runserver 17171


