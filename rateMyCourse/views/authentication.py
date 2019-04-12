import json
import smtplib
from email.header import Header
from email.mime.text import MIMEText
from random import Random  # 用于生成随机码

from django.conf import settings
from django.http import HttpResponse

from rateMyCourse.models import *

def auth(request):
    try:
        username=request.COOKIES.get('username')
        password=request.COOKIES.get('password')
        u = User.objects.get(username=username)
        if u.password!=password:
            # auth failed
            return False
    except:
        return False
    try:
        sess=request.session.get('auth_sess',None)
        if sess!=username:
            return False
    except:
        return False
    else:
        return True
    finally:
        pass
