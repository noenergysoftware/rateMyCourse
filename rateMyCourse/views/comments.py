import json

from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse
from django.views.decorators.cache import cache_page

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
        try:
            parent_comment=request.POST['parent_comment']
        except:
            parent_comment=-1
    except BaseException:
        return HttpResponse(json.dumps({
            'status': -1,
            'errMsg': '缺失信息',
        }), content_type="application/json")
    else:
        try:
            c = Comment(
                content=content,parent_comment=parent_comment,
                teacher=Teacher.objects.get(
                    name=teacher_name))
            c.save()
            b = MakeComment(user=User.objects.get(username=username),
                            course=Course.objects.get(course_ID=course_ID),
                            comment=c)
            b.save()
        except BaseException:
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
        rawList = MakeComment.objects.filter(
            course_id=Course.objects.get(
                course_ID=course_ID).id)

        retList = []
        for i in rawList:
            rdict = {}
            rdict['username'] = i.user.username
            rdict['content'] = i.comment.content
            rdict['editTime'] = str(
                (i.comment.create_time +
                 datetime.timedelta(
                     seconds=8 *
                     60 *
                     60)).strftime("%Y-%m-%d %H:%M"))
            rdict['createTime'] = str(
                (i.comment.edit_time +
                 datetime.timedelta(
                     seconds=8 *
                     60 *
                     60)).strftime("%Y-%m-%d %H:%M"))
            rdict['commentID'] = i.id
            rdict['teacher'] = i.comment.teacher.name
            rdict['parent_comment']=i.comment.parent_comment
            retList.append(rdict)

    except BaseException:
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

def get_comment_by_teacher(request):
    """
       获取某个老师所上过的课的评论，需求老师id
       返回一个列表，每项为一条评论，时间顺序
    """
    try:
        '''if not auth.auth(request):
            return HttpResponse(json.dumps({
                'status': -100,
                'errMsg': 'cookies 错误',
            }), content_type="application/json")'''
        teacher_ID = request.GET['teacher_ID']
        rawList = Comment.objects.filter(teacher=Teacher.objects.get(id=teacher_ID))

        retList = []
        for i in rawList:
            rdict = {}
            rdict['content'] = i.comment.content
            rdict['editTime'] = str((i.comment.create_time +datetime.timedelta(seconds=8 *60 *60)).strftime("%Y-%m-%d %H:%M"))
            rdict['createTime'] = str((i.comment.edit_time +datetime.timedelta(seconds=8 *60 *60)).strftime("%Y-%m-%d %H:%M"))
            rdict['commentID'] = i.id
            rdict['teacher'] = i.comment.teacher.name
            retList.append(rdict)

    except BaseException:
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

        if not auth.auth_with_user(request, c.user.username):
            return HttpResponse(json.dumps({
                'status': -100,
                'errMsg': 'cookies 错误',
            }), content_type="application/json")

        c.comment.content = request.POST['content']

        c.comment.teacher = Teacher.objects.get(
            name=request.POST['teacher_name'])
        #c.comment.edit_time = datetime.datetime.now()
        c.comment.save()
    except BaseException:
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


def rate_comment(request):
    try:
        if not auth.auth_with_user(request, request.POST['username']):
            return HttpResponse(json.dumps({
                'status': -100,
                'errMsg': 'cookies 错误',
            }), content_type="application/json")
        username = request.POST['username']
        comment_ID = request.POST['comment_ID']
        type = request.POST['type']
    except BaseException:
        return HttpResponse(json.dumps({
            'status': -1,
            'errMsg': '缺失信息',
        }), content_type="application/json")
    else:
        try:
            rate = RateComment.objects.get(
                user=User.objects.get(
                    username=username), comment=Comment.objects.get(
                    id=comment_ID))
        except ObjectDoesNotExist:
            rate = RateComment(
                user=User.objects.get(
                    username=username), comment=Comment.objects.get(
                    id=comment_ID))
            rate.save()
            c = Comment.objects.get(id=comment_ID)
            if type == 'agree':
                c.rate += 1
                rate.rate = 1
            else:
                c.rate -= 1
                rate.rate = -1
            c.save()
            rate.save()
            return HttpResponse(json.dumps({
                'status': 1,
                'length': 1,
                'body': {'message': "评价评论成功"}
            }), content_type="application/json")
        except BaseException:
            return HttpResponse(json.dumps({
                'status': -1,
                'errMsg': '评价评论失败',
            }), content_type="application/json")
        else:
            c = Comment.objects.get(id=comment_ID)
            if type == 'agree':
                if rate.rate == 0:
                    rate.rate = 1
                    c.rate += 1
                    c.save()
                    rate.save()
                    return HttpResponse(json.dumps({
                        'status': 1,
                        'length': 1,
                        'body': {'message': "赞同评论成功"}
                    }), content_type="application/json")
                elif rate.rate == -1:
                    rate.rate = 1
                    c.rate += 2
                    c.save()
                    rate.save()
                    return HttpResponse(json.dumps({
                        'status': 1,
                        'length': 1,
                        'body': {'message': "已赞同评论"}
                    }), content_type="application/json")
                else:
                    rate.rate = 0
                    c.rate -= 1
                    c.save()
                    rate.save()
                    return HttpResponse(json.dumps({
                        'status': 1,
                        'length': 1,
                        'body': {'message': "已取消赞同评论"}
                    }), content_type="application/json")
            else:
                if rate.rate == 0:
                    rate.rate = -1
                    c.rate -= 1
                    c.save()
                    rate.save()
                    return HttpResponse(json.dumps({
                        'status': 1,
                        'length': 1,
                        'body': {'message': "反对评论成功"}
                    }), content_type="application/json")
                elif rate.rate == 1:
                    rate.rate = -1
                    c.rate -= 2
                    c.save()
                    rate.save()
                    return HttpResponse(json.dumps({
                        'status': 1,
                        'length': 1,
                        'body': {'message': "已反对评论"}
                    }), content_type="application/json")
                else:
                    rate.rate = 0
                    c.rate += 1
                    c.save()
                    rate.save()
                    return HttpResponse(json.dumps({
                        'status': 1,
                        'length': 1,
                        'body': {'message': "已取消反对评论"}
                    }), content_type="application/json")

#@cache_page(5)
def get_rate_comment(request):
    try:
        comment_ID = request.GET['comment_ID']
        comment = Comment.objects.get(id=comment_ID)
    except BaseException:
        return HttpResponse(json.dumps({
            'status': -1,
            'errMsg': "缺少commentID",
        }), content_type="application/json")
    else:
        return HttpResponse(json.dumps({
            'status': 1,
            'length': 1,
            'body': {'rate': comment.rate}
        }), content_type="application/json")


@cache_page(60 * 60 * 2)
def get_high_rate_comment(request):
    try:
        course_ID = request.GET['course_ID']
        course = Course.objects.get(course_ID=course_ID)
    except BaseException:
        return HttpResponse(json.dumps({
            'status': -1,
            'errMsg': "缺少courseID",
        }), content_type="application/json")
    else:
        tlist = []
        b = MakeComment.objects.filter(course=course)
        for i in b:
            if i.comment.rate > 0:
                tlist.append([i.comment_id, i.comment.rate])
        tlist.sort(key=lambda x: x[-1], reverse=True)
        return HttpResponse(json.dumps({
            'status': 1,
            'length': len(tlist),
            'body': tlist,
        }), content_type="application/json")
