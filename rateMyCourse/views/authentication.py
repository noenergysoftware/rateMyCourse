import json
import os
import urllib
import urllib.request
from urllib.parse import urlencode

from rateMyCourse.models import *

"""
认证服务，验证请求的合法性，包括简单认证（只看cookie），完全认证（看cookie和session）以及腾讯验证码服务。
"""


def auth(request) -> bool:
    """
    simple auth, checks if the request has right cookie.
    如果cookie是合法的返回True，否则返回False
    这里储存的password是加密过的，下同。
    """
    try:
        username = request.COOKIES.get('username')
        password = request.COOKIES.get('password')
        u = User.objects.get(username=username)
        if u.password != password:
            # auth failed
            return False
    except BaseException:
        return False
    try:
        # check session
        sess = request.session.get('auth_sess', None)
        if sess != username:
            return False
    except BaseException:
        return False
    else:
        return True
    finally:
        pass


def auth_with_user(request, usernamein) -> bool:
    """
    Full auth, checks if the request has a correct cookie and if the user corresponds with the cookie.
    在检验Cookie的合法性外检验Session的合法性。
    同时要求保证用户操作的username和cookie，session中的username的一致性（防止用户操作其他用户）
    """
    try:
        username = request.COOKIES.get('username')
        password = request.COOKIES.get('password')
        u = User.objects.get(username=username)
        if u.password != password:
            # auth failed
            return False
    except BaseException:
        return False
    try:
        # check session
        sess = request.session.get('auth_sess', None)
        if sess != username:
            return False
        if usernamein != request.COOKIES.get('username'):
            return False
        if usernamein != request.session.get('auth_sess', None):
            return False
    except BaseException:
        return False
    else:
        return True
    finally:
        pass


def txrequest(Ticket, Randstr, UserIP) -> (int,):
    """
    腾讯验证码服务，其中aid和appsecretkey为关键项，保存在环境变量中。
    验证码服务信息（使用方式，接口）可以参考腾讯防水墙，月免费额度为2000次
    环境变量储存隐私信息请自行Google，实在搞不清怎么配置请开issue联系开发者。
    """
    params = urlencode({'aid': os.environ['DJANGOAID'],
                        "AppSecretKey": os.environ['DJANGOASK'],
                        'Ticket': Ticket,
                        'Randstr': Randstr,
                        'UserIP': UserIP})
    url = "https://ssl.captcha.qq.com/ticket/verify"
    f = urllib.request.urlopen("%s?%s" % (url, params))
    # check request, using tencent api, see more on https://007.qq.com or contract us
    content = f.read()
    res = json.loads(content.decode())
    print(res)
    if res:
        error_code = res["response"]
        if error_code == '1':
            return 1, 'success'
        else:
            return -1, res
    else:
        return -1, res
