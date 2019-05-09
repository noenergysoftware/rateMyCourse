import json
from django.http import HttpResponse
from django.views.decorators.cache import cache_page

from rateMyCourse.models import *
from django.core.exceptions import ObjectDoesNotExist
import rateMyCourse.views.authentication as auth
import rateMyCourse.views.calcRank as calcRank
from django.views.decorators.csrf import csrf_exempt, csrf_protect


def make_rank(request):
    """
    发表评分，需要用户名，课程ID，以及分数
    """
    try:
        if not auth.auth_with_user(request, request.POST['username']):
            return HttpResponse(json.dumps({
                'status': -100,
                'errMsg': 'cookies 错误',
            }), content_type="application/json")
        username = request.POST['username']
        course_ID = request.POST['course_ID']
        difficulty_score = request.POST['difficulty_score']
        funny_score = request.POST['funny_score']
        gain_score = request.POST['gain_score']
        recommend_score = request.POST['recommend_score']
        if difficulty_score > 5 or difficulty_score < 0 or funny_score > 5 or funny_score < 0 or gain_score > 5 or gain_score < 0 or recommend_score > 5 or recommend_score < 0:
            return HttpResponse(json.dumps({
                'status': -1,
                'errMsg': '非法分数',
            }), content_type="application/json")

    except BaseException:
        return HttpResponse(json.dumps({
            'status': -1,
            'errMsg': '缺失信息',
        }), content_type="application/json")
    else:
        try:
            b = MakeRank.objects.get(
                user=User.objects.get(
                    username=username), course=Course.objects.get(
                    course_ID=course_ID))
        except ObjectDoesNotExist:
            # create new
            r = Rank(difficulty_score=difficulty_score,
                     funny_score=funny_score,
                     gain_score=gain_score,
                     recommend_score=recommend_score,
                     )
            r.save()
            b1 = MakeRank(user=User.objects.get(username=username),
                          course=Course.objects.get(course_ID=course_ID),
                          rank=r)
            b1.save()
            return HttpResponse(json.dumps({
                'status': 1,
                'length': 1,
                'body': {
                    'message': "发表评分成功"
                }
            }), content_type="application/json")
        except BaseException:
            return HttpResponse(json.dumps({
                'status': -1,
                'errMsg': '缺失信息',
            }), content_type="application/json")
        else:
            # edit
            r = b.rank
            r.difficulty_score = difficulty_score
            r.funny_score = funny_score
            r.gain_score = gain_score
            r.recommend_score = recommend_score
            # r.edit_time=datetime.datetime.now()
            r.save()
            return HttpResponse(json.dumps({
                'status': 1,
                'length': 1,
                'body': {
                    'message': "更新评分成功"
                }
            }), content_type="application/json")


@cache_page(60 * 60)
def get_rank_by_course(request):
    """
    获取某节课的评分，需求课程号
    返回一个字典，关键字为四项评分的名字，内容为平均分
    """
    try:
        '''if not auth.auth(request):
            return HttpResponse(json.dumps({
                'status': -100,
                'errMsg': 'cookies 错误',
            }), content_type="application/json")'''
        course_ID = request.GET['course_ID']
        # rawList = MakeRank.objects.filter(course_id=Course.objects.get(course_ID=course_ID).id)
        course = RankCache.objects.get(course_id=Course.objects.get(course_ID=course_ID).id)

        num_rank = 0
        rank_dict = {}
        rank_dict['difficulty_score'] = 0
        rank_dict['funny_score'] = 0
        rank_dict['gain_score'] = 0
        rank_dict['recommend_score'] = 0

        rank_dict['difficulty_score'] = course.difficulty_score / (1 if course.people == 0 else course.people)
        rank_dict['funny_score'] = course.funny_score / (1 if course.people == 0 else course.people)
        rank_dict['gain_score'] = course.gain_score / (1 if course.people == 0 else course.people)
        rank_dict['recommend_score'] = course.recommend_score / (1 if course.people == 0 else course.people)
    except BaseException:
        return HttpResponse(json.dumps({
            'status': -1,
            'errMsg': '获取评分失败',
        }), content_type="application/json")
    else:
        return HttpResponse(json.dumps({
            'status': 1,
            'length': course.people,
            'body': rank_dict
        }), content_type="application/json")
    finally:
        pass


@cache_page(60 * 60)
def get_all_rank(request):
    all_course_ID = Course.objects.all()
    retDist = {}
    for course_ID in all_course_ID:
        # rawList = MakeRank.objects.filter(course_id=course_ID)
        course = RankCache.objects.get(course_id=course_ID)

        num_rank = 0
        rank_dict = {}
        rank_dict['difficulty_score'] = 0
        rank_dict['funny_score'] = 0
        rank_dict['gain_score'] = 0
        rank_dict['recommend_score'] = 0
        rank_dict['difficulty_score'] = course.difficulty_score / (1 if course.people == 0 else course.people)
        rank_dict['funny_score'] = course.funny_score / (1 if course.people == 0 else course.people)
        rank_dict['gain_score'] = course.gain_score / (1 if course.people == 0 else course.people)
        rank_dict['recommend_score'] = course.recommend_score / (1 if course.people == 0 else course.people)
        rank_dict['rank_number'] = course.people
        retDist[course_ID.course_ID] = rank_dict

    return HttpResponse(json.dumps({
        'status': 1,
        'length': len(retDist),
        'body': retDist
    }), content_type="application/json")


def get_rank_by_sorted_course(request):
    all_rank = RankCache.objects.all()

    sorted_course_list = []
    for rank in all_rank:
        if rank.position != -1:
            rank_dict = {}
            rank_dict['difficulty_score'] = rank.difficulty_score
            rank_dict['funny_score'] = rank.funny_score
            rank_dict['gain_score'] = rank.gain_score
            rank_dict['recommend_score'] = rank.recommend_score
            sorted_course_list.append([rank.course.ret(), rank_dict, rank.position])
    sorted_course_list.sort(key=lambda x: x[-1], reverse=True)

    return HttpResponse(json.dumps({
        'status': 1,
        'length': len(sorted_course_list),
        'body': sorted_course_list,
    }), content_type="application/json")


def get_rank_by_sorted_teacher(request):
    all_rank = TeacherRankCache.objects.all()

    sorted_teacher_list = []
    for rank in all_rank:
        if rank.position != -1:
            rank_dict = {}
            rank_dict['difficulty_score'] = rank.difficulty_score
            rank_dict['funny_score'] = rank.funny_score
            rank_dict['gain_score'] = rank.gain_score
            rank_dict['recommend_score'] = rank.recommend_score
            sorted_teacher_list.append([rank.teacher.ret(), rank_dict, rank.position])
    sorted_teacher_list.sort(key=lambda x: x[-1], reverse=True)

    return HttpResponse(json.dumps({
        'status': 1,
        'length': len(sorted_teacher_list),
        'body': sorted_teacher_list,
    }), content_type="application/json")


def flush(request):
    calcRank.calc_rank()
    calcRank.calc_rank_teacher()
    return HttpResponse(json.dumps({
        'status': 1,
        'length': 1,
        'body': "更新成功",
    }), content_type="application/json")