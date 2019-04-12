import json
from django.http import HttpResponse
from rateMyCourse.models import *
from django.core.exceptions import ObjectDoesNotExist
import rateMyCourse.views.authentication as auth
def make_rank(request):
    """
    发表评分，需要用户名，课程ID，以及分数
    """
    try:
        if not auth.auth(request):
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
    except:
        return HttpResponse(json.dumps({
            'status': -1,
            'errMsg': '缺失信息',
        }), content_type="application/json")
    else:
        try:
            b = MakeRank.objects.get(user=User.objects.get(username=username),
                          course=Course.objects.get(course_ID=course_ID))
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
        except:
            return HttpResponse(json.dumps({
                'status': -1,
                'errMsg': '缺失信息',
            }), content_type="application/json")
        else:
            # edit
            r=b.rank
            r.difficulty_score = difficulty_score
            r.funny_score = funny_score
            r.gain_score = gain_score
            r.recommend_score = recommend_score
            r.edit_time=datetime.datetime.now()
            r.save()
            return HttpResponse(json.dumps({
                'status': 1,
                'length': 1,
                'body': {
                    'message': "更新评分成功"
                }
            }), content_type="application/json")



def get_rank_by_course(request):
    """
    获取某节课的评分，需求课程号
    返回一个字典，关键字为四项评分的名字，内容为平均分
    """
    try:
        if not auth.auth(request):
            return HttpResponse(json.dumps({
                'status': -100,
                'errMsg': 'cookies 错误',
            }), content_type="application/json")
        course_ID = request.GET['course_ID']
        rawList = MakeRank.objects.filter(course_id=Course.objects.get(course_ID=course_ID).id)

        num_rank = 0
        rank_dict = {}
        for c in rawList:
            num_rank = num_rank + 1
            rank_dict['difficulty_score'] += c.rank.difficulty_score
            rank_dict['funny_score'] += c.rank.funny_score
            rank_dict['gain_score'] += c.rank.gain_score
            rank_dict['recommend_score'] += c.rank.recommend_score

        rank_dict['difficulty_score'] /= num_rank
        rank_dict['funny_score'] /= num_rank
        rank_dict['gain_score'] /= num_rank
        rank_dict['recommend_score'] /= num_rank
    except:
        return HttpResponse(json.dumps({
            'status': -1,
            'errMsg': '获取评分失败',
        }), content_type="application/json")
    else:
        return HttpResponse(json.dumps({
            'status': 1,
            'length': len(num_rank),
            'body': rank_dict
        }), content_type="application/json")
    finally:
        pass


