# 部署说明

本文档将简单介绍如何部署我们的网站。部署过程比较简单，并已在多个系统上经过测试。

## 系统需求

系统无特殊限制，已知可以在以下系统正常部署

* Ubuntu 1804

* Debian 9

* CentOS 7

* Win10 1809

## 环境需求

### 后端需求

* Python 3.5+

* Django 2.0+

* sqlite3

### Web server

* Nginx 1.10.3/1.14.0

* Apache 2.4.25

## 详细部署指南

本文以 Debian 9 + Python 3.5 + Nginx 环境描述

首先更新系统环境

```bash
sudo apt update
sudo apt upgrade
```

安装Python3, Python3-pip, sqlite3, Nginx, git
```bash
sudo apt install python3 python3-pip sqlite3 Nginx git
```

pip安装Django, gitpython, Django, Django-test, Django-extensions, django-cors-headers, pandas。其他依赖库请一并安装。
```bash
pip3 install Django gitpython Django Django-test Django-extensions django-cors-headers pandas
```

之后就可以部署了！ 首先要 clone 我们的仓库并切换到 ```release/alpha``` 分支。
```bash
git clone https://github.com/noenergysoftware/rateMyCourse.git
cd rateMyCourse
git checkout release/alpha
```

然后处理migrations，导入数据库并运行。这里我们内置了一份不完全的数据库在 ```static\courseInfo``` 文件夹下，你也可以仿照该文件自行爬取，创建自己的课程数据表。

```bash
python3 manage.py makemigrations
python3 manage.py migrate
python3 toDatabase.py
python3 manage.py runserver 1234
```

接着我们处理一下前端配置。我们将前端页面放到 ```/var/www/```文件夹下。

```bash
cd /var/www/
git clone https://github.com/noenergysoftware/rateMyCourse.git
cd rateMyCourse
git checkout front_end
cd ..
sudo chown -R www-data rateMyCourse
```

然后我们配置Nginx，假设后台运行在1234端口，直接使用Nginx转发，前后端网站分别为 ```back.example.com``` 和 ```front.example.com```，Nginx的配置可以参考官方教程与博客，这里仅仅提供一个例子。网站也可以配置ssl，具体可参阅其他教程。

```Nginx
server {
        listen 80;
        listen [::]:80;

        server_name back.example.com;

        location / {
                proxy_pass http://127.0.0.1:1234;
                proxy_redirect default;
        }
}
```

```Nginx
server {
        listen 80;
        listen [::]:80;
        charset utf-8;
        root /var/www/rateMyCourse/front_end/;
        server_name front.example.com;
        location / {
            try_files $uri $uri/ =404;
        }
}
```

接着重启Nginx服务即可。