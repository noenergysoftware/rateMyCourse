import json
import os
import urllib
import urllib.request
from urllib.parse import urlencode

from rateMyCourse.models import *


def auth(request) -> bool:
    """
    simple auth, checks if the request has right cookie.
    """
    try:
        username = request.COOKIES.get('username')
        password = request.COOKIES.get('password')
        u = User.objects.get(username=username)
        if u.password != password:
            # auth failed
            return False
    except:
        return False
    try:
        # check session
        sess = request.session.get('auth_sess', None)
        if sess != username:
            return False
    except:
        return False
    else:
        return True
    finally:
        pass


def auth_with_user(request, usernamein) -> bool:
    """
    Full auth, checks if the request has a correct cookie and if the user corresponds with the cookie.
    """
    try:
        username = request.COOKIES.get('username')
        password = request.COOKIES.get('password')
        u = User.objects.get(username=username)
        if u.password != password:
            # auth failed
            return False
    except:
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
    except:
        return False
    else:
        return True
    finally:
        pass


def txrequest(Ticket, Randstr, UserIP) -> (int,):
    """
    Tencent Verification.
    aid and AppSecretKey is secret and saved in osenv.
    Contract the development team to get more help.
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
