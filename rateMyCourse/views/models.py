import json
import smtplib
from email.header import Header
from email.mime.text import MIMEText
from random import Random  # 用于生成随机码

from django.conf import settings
from django.http import HttpResponse

from rateMyCourse.models import *
import rateMyCourse.views.authentication as auth


def update_user_profile_photo(request):

    try:
        if not auth.auth_with_user(request, request.POST['username']):
            return HttpResponse(json.dumps({
                'status': -100,
                'errMsg': 'cookies 错误',
            }), content_type="application/json")
        user_name = request.POST['username']
        profile_photo = request.POST['profile_photo']
        user = User.objects.get(username=user_name)
        user.profile_photo = profile_photo
    except Exception:
        return HttpResponse(json.dumps({
            'status': -1,
            'errMsg': 'Update Error',
        }), content_type="application/json")
    return HttpResponse(json.dumps({
        'status': 1,
        'length': 1,
        'body': {
            'message': "成功更新用户{0}的头像".format(user.username)
        }
    }), content_type="application/json")


def add_teacher(request):
    """
    增加教师，需求教师的基本信息：姓名，职称
    """
    try:
        if not auth.auth(request):
            return HttpResponse(json.dumps({
                'status': -100,
                'errMsg': 'cookies 错误',
            }), content_type="application/json")
        name = request.POST['name']
        title = request.POST['title']
        try:
            website = request.POST['website']
        except BaseException:
            website = "null"
        Teacher(name=name, title=title, website=website).save()
    except Exception as err:
        if "unique" in str(err):
            return HttpResponse(json.dumps({
                'status': -1,
                'errMsg': 'teacher already exist',
            }), content_type="application/json")
        else:
            return HttpResponse(json.dumps({
                'status': -1,
                'errMsg': 'Operation Error',
            }), content_type="application/json")
    else:
        return HttpResponse(json.dumps({
            'status': 1,
            'length': 1,
            'body': {
                'message': "新建教师{0}成功".format(name)
            }
        }), content_type="application/json")
    finally:
        pass


def add_course(request):
    """
    增加课程，需求课程的基本信息：名字，网站，ID，描述，类型，学分
    """
    try:
        if not auth.auth(request):
            return HttpResponse(json.dumps({
                'status': -100,
                'errMsg': 'cookies 错误',
            }), content_type="application/json")
        name = request.POST['name']
        website = request.POST['website']
        course_ID = request.POST['course_ID']
        description = request.POST['description']
        course_type = request.POST['course_type']
        credit = request.POST['credit']
        Course(
            name=name,
            website=website,
            course_type=course_type,
            course_ID=course_ID,
            description=description,
            credit=credit).save()
    except Exception:
        return HttpResponse(json.dumps({
            'status': -1,
            'errMsg': 'Operation Error',
        }), content_type="application/json")
    else:
        return HttpResponse(json.dumps({
            'status': 1,
            'length': 1,
            'body': {
                'message': "新建课程{0}成功".format(name)
            }
        }), content_type="application/json")
    finally:
        pass


def add_teach_course(request):
    """
    增加课授课信息，需求教师列表，课程，部门
    """
    try:
        if not auth.auth(request):
            return HttpResponse(json.dumps({
                'status': -100,
                'errMsg': 'cookies 错误',
            }), content_type="application/json")
        department = Department.objects.get(name=request.POST['department'])
        course = Course.objects.get(name=request.POST['course'])

        teacher_list = request.POST.getlist('teacher_list', [])

        c = TeachCourse(department=department, course=course)
        c.save()

        for teacher_name in teacher_list:
            c.teachers.add(Teacher.objects.get(name=teacher_name))
        c.save()
    except Exception as err:
        return HttpResponse(json.dumps({
            'status': -1,
            'errMsg': str(err),
        }), content_type="application/json")
    else:
        return HttpResponse(json.dumps({
            'status': 1,
            'length': 1,
            'body': {
                'message': "新建授课信息成功"
            }
        }), content_type="application/json")
    finally:
        pass


def add_select_course(request):
    """
    增加选课信息，需求学生id，课程列表，部门列表
    """
    try:
        if not auth.auth(request):
            return HttpResponse(json.dumps({
                'status': -100,
                'errMsg': 'cookies 错误',
            }), content_type="application/json")
        user = User.objects.get(id=request.POST['user_id'])

        course_list = request.POST.getlist('course_list', [])
        department_list = request.POST.getlist('department_list', [])

        for [course_name, department_name] in [course_list, department_list]:
            c = SelectCourse(
                user=user,
                course=Course.objects.get(name=course_name),
                department=Department.objects.get(name=department_name)
            )
            c.save()
    except Exception as err:
        return HttpResponse(json.dumps({
            'status': -1,
            'errMsg': str(err),
        }), content_type="application/json")
    else:
        return HttpResponse(json.dumps({
            'status': 1,
            'length': 1,
            'body': {
                'message': "添加课程关注成功".format(user)
            }
        }), content_type="application/json")
    finally:
        pass


def del_select_course(request):
    """
    去除选课信息，需求学生id，课程列表，部门列表
    """
    try:
        if not auth.auth(request):
            return HttpResponse(json.dumps({
                'status': -100,
                'errMsg': 'cookies 错误',
            }), content_type="application/json")
        user = User.objects.get(id=request.POST['user_id'])

        course_list = request.POST.getlist('course_list', [])
        department_list = request.POST.getlist('department_list', [])

        for [course_name, department_name] in [course_list, department_list]:
            SelectCourse.objects.filter(
                user=user,
                course=Course.objects.get(name=course_name),
                department=Department.objects.get(name=department_name)
            ).delete()
    except Exception as err:
        return HttpResponse(json.dumps({
            'status': -1,
            'errMsg': str(err),
        }), content_type="application/json")
    else:
        return HttpResponse(json.dumps({
            'status': 1,
            'length': 1,
            'body': {
                'message': "移除关注成功".format(user)
            }
        }), content_type="application/json")
    finally:
        pass
