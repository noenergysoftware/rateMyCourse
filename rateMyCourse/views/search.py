import hashlib
import json
from urllib import request, parse

from django.http import HttpResponse
from django.shortcuts import render, get_list_or_404, get_object_or_404
from django.views.decorators.csrf import csrf_exempt,csrf_protect
from rateMyCourse.models import *
import rateMyCourse.views.authentication as auth
detail_names = ['有趣程度', '充实程度', '课程难度', '课程收获']


def search_teacher(request):
    """
    搜索教师.
    教师姓名，空为任意教师
    姓名包含关键字的所有教师
    """
    retlist = []
    try:

        '''if not auth.auth(request):
            return HttpResponse(json.dumps({
                'status': -100,
                'errMsg': 'cookies 错误',
            }), content_type="application/json")'''

        teacher_name = request.GET['teacher_name']
        teacher_list = Teacher.objects.filter(name__icontains=teacher_name)
        for teacher in teacher_list:
            retlist.append(teacher.ret())
    except Exception:
        return HttpResponse(json.dumps({
            'status': -1,
            'errMsg': 'search teacher Error',
        }), content_type="application/json")
    return HttpResponse(json.dumps({
        'status': 1,
        'length': len(teacher_list),
        'body': retlist,
    }), content_type="application/json")


def search_course(request):
    """
    搜索课程.
    课程姓名，空为任意课程
    姓名包含关键字的所有课程
    """
    retlist = []
    try:

        '''if not auth.auth(request):
            return HttpResponse(json.dumps({
                'status': -100,
                'errMsg': 'cookies 错误',
            }), content_type="application/json")'''

        course_name = request.GET['course_name']
        course_list = Course.objects.filter(name__icontains=course_name)
        for course in course_list:
            tl=TeachCourse.objects.filter(course=course)
            teacher_list=[]
            department=''
            for tc in tl:
                department=tc.department.name
                for tmp in tc.teachers.all():
                    if tmp.name not in teacher_list:
                        teacher_list.append(tmp.name)
            retlist.append(course.ret())
            retlist[-1]['teacher_list']=teacher_list
            retlist[-1]['department'] = department
    except Exception:
        return HttpResponse(json.dumps({
            'status': -1,
            'errMsg': 'search course Error',
        }), content_type="application/json")
    return HttpResponse(json.dumps({
        'status': 1,
        'length': len(course_list),
        'body': retlist,
    }), content_type="application/json")

def search_user(request):
    """
    搜索用户.
    用户姓名，空为任意用户
    姓名包含关键字的所有用户
    """
    retlist = []
    try:
        '''if not auth.auth(request):
            return HttpResponse(json.dumps({
                'status': -100,
                'errMsg': 'cookies 错误',
            }), content_type="application/json")'''
        username = request.GET['username']

        if username=='':
            return HttpResponse(json.dumps({
                'status': -1,
                'errMsg': 'user name Error',
            }), content_type="application/json")

        user_list = User.objects.filter(username__icontains=username)
        for user in user_list:
            retlist.append(user.ret())
    except Exception:
        return HttpResponse(json.dumps({
            'status': -1,
            'errMsg': 'user name Error',
        }), content_type="application/json")
    return HttpResponse(json.dumps({
        'status': 1,
        'length': len(user_list),
        'body': retlist,
    }), content_type="application/json")

def get_user_detail(request):
    """
    搜索用户.
    用户姓名，空为任意用户
    姓名包含关键字的所有用户
    """

    try:
        '''if not auth.auth(request):
            return HttpResponse(json.dumps({
                'status': -100,
                'errMsg': 'cookies 错误',
            }), content_type="application/json")'''
        username = request.GET['username']

        if username=='':
            return HttpResponse(json.dumps({
                'status': -1,
                'errMsg': 'user name Error',
            }), content_type="application/json")

        user = User.objects.get(username=username)
        retlist={}
        retlist['username']=user.username
        retlist['mail']=user.mail
        retlist['role']=user.role
        retlist['gender']=user.gender
        retlist['self_introduction']=user.self_introduction
    except Exception:
        return HttpResponse(json.dumps({
            'status': -1,
            'errMsg': 'Get Error',
        }), content_type="application/json")
    return HttpResponse(json.dumps({
        'status': 1,
        'length': 1,
        'body': retlist,
    }), content_type="application/json")


def search_course_by_department(request):
    '''
    按所属部门搜索课程
    要求准确的部门名称，返回该部门的课程
    '''
    retlist=[]
    try:

        '''if not auth.auth(request):
            return HttpResponse(json.dumps({
                'status': -100,
                'errMsg': 'cookies 错误',
            }), content_type="application/json")'''
        department=request.GET['department']
        course_name=request.GET['course_name']
        course_list=TeachCourse.objects.filter(department=Department.objects.get(name=department).id)
        tmplist=[]
        for course in course_list:
            if course_name not in Course.objects.get(id=course.course_id).name:
                continue
            if Course.objects.get(id=course.course_id).name not in tmplist:
                tmplist.append(Course.objects.get(id=course.course_id).name)
                tl = TeachCourse.objects.filter(course=course.course_id)
                teacher_list = []
                for tc in tl:
                    for tmp in tc.teachers.all():
                        if tmp.name not in teacher_list:
                            teacher_list.append(tmp.name)
                retlist.append(Course.objects.get(id=course.course_id).ret())
                retlist[-1]['teacher_list'] = teacher_list
                retlist[-1]['department'] = department

    except:
        return HttpResponse(json.dumps({
            'status': -1,
            'errMsg': '获取课程列表失败',
        }), content_type="application/json")
    return HttpResponse(json.dumps({
        'status': 1,

        'length': len(retlist),
        'body': retlist,
    }), content_type="application/json")

def get_department(request):
    '''
    得到部门列表
    '''
    retlist=[]
    try:
        '''if not auth.auth(request):
            return HttpResponse(json.dumps({
                'status': -100,
                'errMsg': 'cookies 错误',
            }), content_type="application/json")'''
        department=Department.objects.all()
        for dep in department:
            retlist.append(dep.ret())
    except:
        return HttpResponse(json.dumps({
            'status': -1,
            'errMsg': '获取学院列表失败',
        }), content_type="application/json")
    return HttpResponse(json.dumps({
        'status': 1,
        'length': len(retlist),
        'body': retlist,
    }), content_type="application/json")
