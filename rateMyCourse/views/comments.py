import json

from django.http import HttpResponse

import rateMyCourse.views.authentication as auth
from rateMyCourse.models import *


def make_comment(request):
    """
    发表评论，需要用户名，课程ID，以及内容
    """
    try:
        if not auth.auth_with_user(request, request.POST['username']):
            return HttpResponse(json.dumps({
                'status': -100,
                'errMsg': 'cookies 错误',
            }), content_type="application/json")
        username = request.POST['username']
        course_ID = request.POST['course_ID']
        content = request.POST['content']
        teacher_name = request.POST['teacher_name']
    except:
        return HttpResponse(json.dumps({
            'status': -1,
            'errMsg': '缺失信息',
        }), content_type="application/json")
    else:
        try:
            c = Comment(content=content, teacher=Teacher.objects.get(name=teacher_name))
            c.save()
            b = MakeComment(user=User.objects.get(username=username),
                            course=Course.objects.get(course_ID=course_ID),
                            comment=c)
            b.save()
        except:
            return HttpResponse(json.dumps({
                'status': -1,
                'errMsg': '发表评论失败',
            }), content_type="application/json")
        else:
            return HttpResponse(json.dumps({
                'status': 1,
                'length': 1,
                'body': {
                    'message': "发表评论成功"
                }
            }), content_type="application/json")


def get_comment_by_course(request):
    """
    获取某节课的评论，需求课程号
    返回一个列表，每项为一条评论，时间顺序
    """
    try:
        '''if not auth.auth(request):
            return HttpResponse(json.dumps({
                'status': -100,
                'errMsg': 'cookies 错误',
            }), content_type="application/json")'''
        course_ID = request.GET['course_ID']
        rawList = MakeComment.objects.filter(course_id=Course.objects.get(course_ID=course_ID).id)

        retList = []
        for i in rawList:
            rdict = {}
            rdict['username'] = i.user.username
            rdict['content'] = i.comment.content
            rdict['editTime'] = str((i.comment.create_time+datetime.timedelta(seconds=8*60*60)).strftime("%Y-%m-%d %H:%M"))
            rdict['createTime'] = str((i.comment.edit_time+datetime.timedelta(seconds=8*60*60)).strftime("%Y-%m-%d %H:%M"))
            rdict['commentID'] = i.id
            rdict['teacher'] = i.comment.teacher.name
            retList.append(rdict)

    except:
        return HttpResponse(json.dumps({
            'status': -1,
            'errMsg': '获取评论失败',
        }), content_type="application/json")
    else:
        return HttpResponse(json.dumps({
            'status': 1,
            'length': len(rawList),
            'body': retList
        }), content_type="application/json")
    finally:
        pass


def edit_comment(request):
    """
    编辑评论，需求评论ID,新的content
    """
    try:
        c = MakeComment.objects.get(id=request.POST['comment_ID'])

        if not auth.auth_with_user(request,c.user.username):
            return HttpResponse(json.dumps({
                'status': -100,
                'errMsg': 'cookies 错误',
            }), content_type="application/json")

        c.comment.content = request.POST['content']

        c.comment.teacher = Teacher.objects.get(name=request.POST['teacher_name'])
        #c.comment.edit_time = datetime.datetime.now()
        c.comment.save()
    except:
        return HttpResponse(json.dumps({
            'status': -1,
            'errMsg': '更新评论失败',
        }), content_type="application/json")
    else:
        return HttpResponse(json.dumps({
            'status': 1,
            'length': 1,
            'body': {'message': "更新评论成功"}
        }), content_type="application/json")
