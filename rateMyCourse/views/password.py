import json

from django.http import HttpResponse

import rateMyCourse.views.authentication as auth
from rateMyCourse.models import *


def set_question(request):
    try:
        if not auth.auth_with_user(request, request.POST['username']):
            return HttpResponse(json.dumps({
                'status': -100,
                'errMsg': 'cookies 错误',
            }), content_type="application/json")
        username = request.POST['username']
        question = request.POST['question']
        answer = request.POST['answer']
    except:
        return HttpResponse(json.dumps({
            'status': -1,
            'errMsg': '缺失信息',
        }), content_type="application/json")
    else:
        try:
            qs = PasswordQuestion.objects.filter(user__username=username)
            if len(qs) == 0:
                c = PasswordQuestion(user=User.objects.get(name=username), question=question, answer=answer)
                c.save()
            else:
                c = qs[0]
                c.question = question
                c.answer = answer
                c.save()
        except:
            return HttpResponse(json.dumps({
                'status': -2,
                'errMsg': '设置失败',
            }), content_type="application/json")
    finally:
        return HttpResponse(json.dumps({
            'status': 1,
            'errMsg': '设置成功',
        }), content_type="application/json")


def reset_password(request):
    try:
        if not auth.auth_with_user(request, request.POST['username']):
            return HttpResponse(json.dumps({
                'status': -100,
                'errMsg': 'cookies 错误',
            }), content_type="application/json")
        username = request.POST['username']
        question = request.POST['question']
        answer = request.POST['answer']
        npassword = request.POST['new_password']
    except:
        return HttpResponse(json.dumps({
            'status': -1,
            'errMsg': '缺失信息',
        }), content_type="application/json")
    else:
        try:
            qs = PasswordQuestion.objects.filter(user__username=username)
            if len(qs) == 0:
                return HttpResponse(json.dumps({
                    'status': -1,
                    'errMsg': '用户未设置保护问题，无法重置密码，请联系管理员',
                }), content_type="application/json")
            else:
                c = qs[0]
                if c.question == question and c.answer == answer:
                    c.user.password = npassword
                    c.save()
                else:
                    return HttpResponse(json.dumps({
                        'status': -1,
                        'errMsg': '密码或问题错误',
                    }), content_type="application/json")
        except:
            return HttpResponse(json.dumps({
                'status': -2,
                'errMsg': '设置失败',
            }), content_type="application/json")
    finally:
        return HttpResponse(json.dumps({
            'status': 1,
            'errMsg': '重置成功',
        }), content_type="application/json")
