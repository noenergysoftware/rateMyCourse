import json
import os
import smtplib
from email.header import Header
from email.mime.text import MIMEText

from django.http import HttpResponse

import rateMyCourse.views.authentication as auth
from rateMyCourse.models import *


def sendmail(dest, message):
    message['from'] = os.environ['MAILNAME']
    message['to'] = dest
    smtpObj = smtplib.SMTP()
    smtpObj.connect('smtp.126.com', 25)
    smtpObj.login(os.environ['MAILNAME'], os.environ['MAILPASS'])
    b = smtpObj.sendmail(os.environ['MAILNAME'], dest, message.as_string())
    if len(b) == 0:
        return True
    else:
        return False


def find_password(request):
    if not auth.auth_with_user(request, request.POST['username']):
        return HttpResponse(json.dumps({
            'status': -100,
            'errMsg': 'cookies 错误',
        }), content_type="application/json")
    username = request.POST['username']
    user = User.objects.filter(username=username)
    mail = user.mail
    content = '用户{0}，请于2小时内访问以下链接并输入新的密码，将返回的内容作为正文回复本邮件，谢谢'.format(username)
    message = MIMEText(content, 'plain', 'utf-8')
    subject = '找回密码 / find password'
    message['Subject'] = Header(subject, 'utf-8')
