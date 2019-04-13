import json
import smtplib
from email.header import Header
from email.mime.text import MIMEText
from random import Random  # 用于生成随机码

from django.conf import settings
from django.http import HttpResponse

from rateMyCourse.models import *
import rateMyCourse.views.authentication as auth

def sign_up(request):
    """
    注册用户。传入POST，应至少包含 username, password, mail 三个键 \n
    对于正常合法传入，新建用户并返回成功信息（status=1） \n
    其他非法情况返回错误信息（status=-1） 错误信息保存在errMsg中 \n
    """
    try:
        username = request.POST['username']
        mail = request.POST['mail']
        password = request.POST['password']
    except Exception:
        return HttpResponse(json.dumps({
            'status': -1,
            'errMsg': '未能获取到用户名，邮箱或密码',
        }), content_type="application/json")
    try:
        User(username=username, mail=mail, password=password).save()
    except Exception as err:
        errmsg = str(err)
        if "mail" in errmsg:
            return HttpResponse(json.dumps({
                'status': -1,
                'errMsg': '此邮箱已经被注册过',
            }), content_type="application/json")
        elif "username" in errmsg:
            return HttpResponse(json.dumps({
                'status': -1,
                'errMsg': '此用户名已经被注册过',
            }), content_type="application/json")
        else:
            return HttpResponse(json.dumps({
                'status': -1,
                'errMsg': '邮箱或用户名已经被注册过',
            }), content_type="application/json")
    else:
        return HttpResponse(json.dumps({
            'status': 1,
            'length': 1,
            'body': {
                'message': "新建用户{0}成功".format(username)
            }
        }), content_type="application/json")


def update_user(request):
    """
    注册用户。传入POST，应至少包含 username, 其他可选项是role, gender, self introduction。 \n
    对于正常合法传入，更新用户信息并返回成功信息（status=1） \n
    其他非法情况返回错误信息（status=-1） 错误信息保存在errMsg中 \n
    """
    try:
        if not auth.auth_with_user(request,request.POST['username']):
            return HttpResponse(json.dumps({
                'status': -100,
                'errMsg': 'cookies 错误',
            }), content_type="application/json")
        username = request.POST['username']
        user = User.objects.get(username=username)
    except Exception:
        return HttpResponse(json.dumps({
            'status': -1,
            'errMsg': '不存在此用户',
        }), content_type="application/json")
    else:
        try:
            user.gender = request.POST['gender']
            user.role = request.POST['role']
            user.self_introduction = request.POST['self_introduction']
            user.save()
        except Exception:
            return HttpResponse(json.dumps({
                'status': -1,
                'errMsg': '保存失败，请检查内容正确性',
            }), content_type="application/json")
        else:
            return HttpResponse(json.dumps({
                'status': 1,
                'length': 1,
                'body': {
                    'message': "用户{0}信息更新成功".format(username)
                }
            }), content_type="application/json")


def sign_in(request):
    '''
    用户登录：提供username或mail信息，password信息
    :param request:
    :return: 'status','length','body','errMsg'
    '''
    try:
        username = request.POST['username']
        password = request.POST['password']
    except Exception:
        try:
            mail = request.POST['mail']
        except Exception:
            return HttpResponse(json.dumps({
                'status': -1,
                'errMsg': '未能获取到用户名，邮箱或密码',
            }), content_type="application/json")
    try:
        u = User.objects.get(username=username)
    except Exception:
        try:
            u = User.objects.get(mail=mail)
        except Exception:
            return HttpResponse(json.dumps({
                'status': -2,
                'errMsg': '用户名或邮箱不存在',
            }), content_type="application/json")
    if (password != u.password):
        return HttpResponse(json.dumps({
            'status': -3,
            'errMsg': '密码错误',
        }), content_type="application/json")
    else:
        # set cookies and sessions
        request.session['auth_sess']=username
        response=HttpResponse(json.dumps({
            'status': 1,
            'length': 1,
            'body': {
                'username': username
            }
        }), content_type="application/json")
        response.set_cookie('username',username,max_age=3600*24) # 1day
        response.set_cookie('password',password,max_age=3600*24) # 1day
        return response

def logout(request):
    '''
    用户登出：提供username
    '''
    try:
        if not auth.auth_with_user(request, request.POST['username']):
            return HttpResponse(json.dumps({
                'status': -100,
                'errMsg': 'cookies 错误',
            }), content_type="application/json")
        del request.session['auth_sess']
        response = HttpResponse(json.dumps({
            'status': 1,
            'length': 1,
            'body': {
                'message': '登出成功'
            }
        }), content_type="application/json")
        response.delete_cookie('username')
        response.delete_cookie('password')

    except:
        return HttpResponse(json.dumps({
            'status': -1,
            'errMsg': '登出失败',
        }), content_type="application/json")
    else:
        return response
