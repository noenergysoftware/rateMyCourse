from django.conf.urls import url

from .views import search, register, models, comments, rank, password

urlpatterns = [
    # 用户相关，如注册，登录登出，获取CSRF，更新个人信息，注销等
    url(r'^signIn/$', register.sign_in, name='signIn'),
    url(r'^signUp/$', register.sign_up, name='signUp'),
    url(r'^updateUser/$', register.update_user, name='updateUser'),
    url(r'^logout/$', register.logout, name='logout'),
    url(r'^deleteUser/$', register.delete_user, name="deleteUser"),
    url(r'^getToken/$', register.get_token, name="getCSRFToken"),

    # 搜索相关，搜索教师，课程，获取用户信息，头像等
    url(r'^searchTeacher/$', search.search_teacher, name='searchTeacher'),
    url(r'^searchCourse/$', search.search_course, name='searchCourse'),
    url(r'^searchUser/$', search.search_user, name='searchUser'),
    url(r'^getUserDetail/$', search.get_user_detail, name='getUserDetail'),
    url(r'^getUserProfilePhoto/$', search.get_user_profile_photo, name='getUserProfilePhoto'),
    url(r'^searchCourseByDepartment/$', search.search_course_by_department, name='searchCourseByDepartment'),
    url(r'^getDepartment/$', search.get_department, name='getDepartment'),

    # 更新用户头像，更新选课信息
    url(r'^updateUserProfilePhoto/$', models.update_user_profile_photo, name="updateUserProfilePhoto"),
    url(r'^addSelectCourse/$', models.add_select_course, name="addSelectCourse"),
    url(r'^delSelectCourse/$', models.del_select_course, name="delSelectCourse"),

    # 发表评论，获取课程评论，删除评论，点赞点踩等
    url(r'^makeComment/$', comments.make_comment, name="makeComment"),
    url(r'^getCommentsByCourse/$', comments.get_comment_by_course, name="getCommentsByCourse"),
    url(r'^getCommentsByTeacher/$', comments.get_comment_by_teacher, name="getCommentsByTeacher"),
    url(r'^editComment/$', comments.edit_comment, name="editComments"),
    url(r'^rateComment/$', comments.rate_comment, name="rateComment"),
    url(r'^getRateComment/$', comments.get_rate_comment, name="getRateComment"),
    url(r'^getHotComment/$', comments.get_high_rate_comment, name="getHotComment"),

    # 打分信息
    url(r'^makeRank/$', rank.make_rank, name="makeRank"),
    url(r'^getRankByCourse/$', rank.get_rank_by_course, name="getRankByCourse"),
    url(r'^getRankBySortedCourse/$', rank.get_rank_by_sorted_course, name="getRankBySortedCourse"),
    url(r'^getRankBySortedTeacher/$', rank.get_rank_by_sorted_teacher, name="getRankBySortedTeacher"),
    url(r'^getAllRank/$', rank.get_all_rank, name="getALLRank"),
    url(r'^flushRank/$', rank.flush, name="flush"),

    # 密码重置
    url(r'^setQuestion/$', password.set_question, name="setQuestion"),
    url(r'^resetPassword/$', password.reset_password, name="resetPassword"),

]
