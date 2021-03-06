import pandas as pd
from rankit.Merge import borda_count_merge
from rankit.Ranker import KeenerRanker
from rankit.Ranker import MasseyRanker
from rankit.Table import Table

from rateMyCourse.models import *

"""
计算课程，教师排名的科学算法，数学原理请参考团队博客。
需求rankit库，可以pip直接安装，也可以去GitHub中下源码编译。
"""

class Rankers:
    """
    计算课程排名，使用了梅西法和科利法的波达计数作为
    """
    def __init__(self) -> None:
        # 考虑到平局与没有平局的情况，我们存两张表
        self.rawTable = pd.DataFrame(columns=["HCourse", "LCourse", "HScore", "LScore"])
        self.rawTable2 = pd.DataFrame(columns=["HCourse", "LCourse", "HScore", "LScore"])
        self.outTable = {}
        self.allranks = []

    def read_data(self) -> None:
        """
        从数据库中读取评分信息到Table中
        """
        allRankDict = {}
        ar = MakeRank.objects.all()
        # 注意我们要针对每个人单独存到字典里的一项，因为算法是以每个人的打分评判的
        for i in ar:
            username = i.user.username
            self.allranks.append([i.course.course_ID, i.rank.difficulty_score,
                                  i.rank.funny_score, i.rank.gain_score, i.rank.recommend_score])
            if username in allRankDict.keys():
                allRankDict[username].append([i.course.course_ID, i.rank.recommend_score])
            else:
                allRankDict[username] = []
                allRankDict[username].append([i.course.course_ID, i.rank.recommend_score])
        tmpTable = []
        tmpTable2 = []
        # print(allRankDict)
        # 处理评价信息，将每个人的评价信息翻译到对比中
        for i in allRankDict.keys():
            tmpl = allRankDict[i]
            for j in range(len(tmpl)):
                for k in range(j, len(tmpl)):
                    if j == k:
                        continue
                    if tmpl[j][1] > tmpl[k][1]:
                        print(1)
                        tmpTable.append([tmpl[j][0], tmpl[k][0], tmpl[j][1], tmpl[k][1]])
                        tmpTable2.append([tmpl[j][0], tmpl[k][0], tmpl[j][1], tmpl[k][1]])
                    if tmpl[j][1] < tmpl[k][1]:
                        print(2)
                        tmpTable.append([tmpl[k][0], tmpl[j][0], tmpl[k][1], tmpl[j][1]])
                        tmpTable2.append([tmpl[k][0], tmpl[j][0], tmpl[k][1], tmpl[j][1]])
                    if tmpl[j][1] == tmpl[k][1]:
                        print(3)
                        tmpTable.append([tmpl[j][0], tmpl[k][0], tmpl[j][1] + 0.5, tmpl[k][1] - 0.5])
                        tmpTable.append([tmpl[k][0], tmpl[j][0], tmpl[k][1] + 0.5, tmpl[j][1] - 0.5])
        self.rawTable = pd.DataFrame(tmpTable)
        self.rawTable2 = pd.DataFrame(tmpTable2)

    def run_rank(self) -> dict:
        """
        计算评价信息到outTable并返回
        """
        if len(self.rawTable) == 0:
            data = None
        else:
            data = Table(self.rawTable, col=[0, 1, 2, 3])
        if len(self.rawTable) == 0:
            data2 = None
        else:
            data2 = Table(self.rawTable2, col=[0, 1, 2, 3])
        # 封装的评价方式，具体请参考rankit库作者的github
        maseey = MasseyRanker()
        keener = KeenerRanker()
        # 处理无人打分的情况导致的异常
        if data2 != None and data != None:
            maseeyRank = maseey.rank(data2)
            keenerRank = keener.rank(data)
            mergedRank = borda_count_merge([maseeyRank, keenerRank])
            self.outTable = {}
            for index, i in mergedRank.iterrows():
                self.outTable[i[0]] = i[-1]
            return self.outTable
        if data2 != None:
            maseeyRank = maseey.rank(data2)
            mergedRank = maseeyRank
            self.outTable = {}
            for index, i in mergedRank.iterrows():
                self.outTable[i[0]] = i[-1]
            return self.outTable

        if data != None:
            keenerRank = keener.rank(data)
            mergedRank = keenerRank
            self.outTable = {}
            for index, i in mergedRank.iterrows():
                self.outTable[i[0]] = i[-1]
            return self.outTable

        return {}

    def save_to_database(self) -> None:
        """
        存储上面的排名到数据库缓存中。如果只需要即时信息，可以只用上面的函数，取返回值即可。
        """
        qs = [i[0] for i in self.allranks]
        for i in Course.objects.all():
            if len(RankCache.objects.filter(course=i)) == 0:
                c = RankCache(course=i)
                c.save()
            course_ID = i.course_ID
            if course_ID not in qs:
                continue
            c = RankCache.objects.get(course=i)
            c.difficulty_score = 0
            c.funny_score = 0
            c.gain_score = 0
            c.recommend_score = 0
            c.people = 0
            c.save()
            for j in self.allranks:
                if j[0] == course_ID:
                    c.difficulty_score += j[1]
                    c.funny_score += j[2]
                    c.gain_score += j[3]
                    c.recommend_score += j[4]
                    c.people += 1
                    c.save()
            if course_ID in self.outTable.keys():
                c.position = self.outTable[course_ID]
                c.save()


class RankersTeacher:
    """
    计算教师排名，与上面的基本一样，请参考上面的方法
    """

    def __init__(self):
        self.rawTable = pd.DataFrame(columns=["HCourse", "LCourse", "HScore", "LScore"])
        self.rawTable2 = pd.DataFrame(columns=["HCourse", "LCourse", "HScore", "LScore"])
        self.outTable = {}
        self.allranks = []

    def read_data(self):
        allRankDict = {}
        ar = MakeRank.objects.all()
        for i in ar:
            username = i.user.username
            TeacherSet = TeachCourse.objects.filter(course=i.course)
            for j in TeacherSet:
                for k in j.teachers.filter():
                    self.allranks.append([k.name, i.rank.difficulty_score,
                                          i.rank.funny_score, i.rank.gain_score, i.rank.recommend_score])
                    if username in allRankDict.keys():
                        allRankDict[username].append([k.name, i.rank.recommend_score])
                    else:
                        allRankDict[username] = []
                        allRankDict[username].append([k.name, i.rank.recommend_score])
        tmpTable = []
        tmpTable2 = []
        print(allRankDict)
        for i in allRankDict.keys():
            tmpl = allRankDict[i]
            for j in range(len(tmpl)):
                for k in range(j, len(tmpl)):
                    if j == k:
                        continue
                    if tmpl[j][1] > tmpl[k][1]:
                        print(1)
                        tmpTable.append([tmpl[j][0], tmpl[k][0], tmpl[j][1], tmpl[k][1]])
                        tmpTable2.append([tmpl[j][0], tmpl[k][0], tmpl[j][1], tmpl[k][1]])
                    if tmpl[j][1] < tmpl[k][1]:
                        print(2)
                        tmpTable.append([tmpl[k][0], tmpl[j][0], tmpl[k][1], tmpl[j][1]])
                        tmpTable2.append([tmpl[k][0], tmpl[j][0], tmpl[k][1], tmpl[j][1]])
                    if tmpl[j][1] == tmpl[k][1]:
                        print(3)
                        tmpTable.append([tmpl[j][0], tmpl[k][0], tmpl[j][1] + 0.5, tmpl[k][1] - 0.5])
                        tmpTable.append([tmpl[k][0], tmpl[j][0], tmpl[k][1] + 0.5, tmpl[j][1] - 0.5])
                        tmpTable2.append([tmpl[j][0], tmpl[k][0], tmpl[j][1] + 0.5, tmpl[k][1] - 0.5])
                        tmpTable2.append([tmpl[k][0], tmpl[j][0], tmpl[k][1] + 0.5, tmpl[j][1] - 0.5])
        print(tmpTable2)
        self.rawTable = pd.DataFrame(tmpTable)
        self.rawTable2 = pd.DataFrame(tmpTable2)

    def run_rank(self):
        if len(self.rawTable) == 0:
            data = None
        else:
            data = Table(self.rawTable, col=[0, 1, 2, 3])
        if len(self.rawTable) == 0:
            data2 = None
        else:
            data2 = Table(self.rawTable2, col=[0, 1, 2, 3])

        maseey = MasseyRanker()
        keener = KeenerRanker()
        if data2 != None and data != None:
            maseeyRank = maseey.rank(data2)
            keenerRank = keener.rank(data)
            mergedRank = borda_count_merge([maseeyRank, keenerRank])
            self.outTable = {}
            for index, i in mergedRank.iterrows():
                self.outTable[i[0]] = i[-1]
            return self.outTable
        if data2 != None:
            maseeyRank = maseey.rank(data2)
            mergedRank = maseeyRank
            self.outTable = {}
            for index, i in mergedRank.iterrows():
                self.outTable[i[0]] = i[-1]
            return self.outTable

        if data != None:
            keenerRank = keener.rank(data)
            mergedRank = keenerRank
            self.outTable = {}
            for index, i in mergedRank.iterrows():
                self.outTable[i[0]] = i[-1]
            return self.outTable

        return {}

    def save_to_database(self):
        qs = [i[0] for i in self.allranks]
        for i in Teacher.objects.all():
            if len(TeacherRankCache.objects.filter(teacher=i)) == 0:
                c = TeacherRankCache(teacher=i)
                c.save()
            teacher_name = i.name
            if teacher_name not in qs:
                continue
            c = TeacherRankCache.objects.get(teacher=i)
            c.difficulty_score = 0
            c.funny_score = 0
            c.gain_score = 0
            c.recommend_score = 0
            c.people = 0
            c.save()
            for j in self.allranks:
                if j[0] == teacher_name:
                    c.difficulty_score += j[1]
                    c.funny_score += j[2]
                    c.gain_score += j[3]
                    c.recommend_score += j[4]
                    c.people += 1
                    c.save()
            if teacher_name in self.outTable.keys():
                c.position = self.outTable[teacher_name]
                c.save()


def calc_rank():
    # 封装的过程
    a = Rankers()
    a.read_data()
    a.run_rank()
    a.save_to_database()


def calc_rank_teacher():
    # 封装的过程
    a = RankersTeacher()
    a.read_data()
    a.run_rank()
    a.save_to_database()


if __name__ == "__main__":
    a = RankersTeacher()
    a.read_data()
    a.run_rank()
    a.save_to_database()
