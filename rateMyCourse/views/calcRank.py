import numpy as np
import pandas as pd
from rankit.Table import Table
from rankit.Ranker import KeenerRanker
from rankit.Ranker import MasseyRanker
from rankit.Merge import borda_count_merge

from rateMyCourse.models import *

class Rankers:
    def __init__(self):
        self.rawTable=pd.DataFrame(columns = ["HCourse", "LCourse", "HScore", "LScore"])
        self.rawTable2=pd.DataFrame(columns = ["HCourse", "LCourse", "HScore", "LScore"])
        self.outTable={}
        self.allranks=[]
    def read_data(self):
        allRankDict={}
        ar=MakeRank.objects.all()
        for i in ar:
            username=i.user.username
            self.allranks.append([i.course.course_ID,i.rank.difficulty_score,
                                  i.rank.funny_score,i.rank.gain_score,i.rank.recommend_score])
            if username in allRankDict.keys():
                allRankDict[username].append([i.course.course_ID,i.rank.recommend_score])
            else:
                allRankDict[username]=[]
                allRankDict[username].append([i.course.course_ID, i.rank.recommend_score])
        tmpTable=[]
        tmpTable2=[]
        print(allRankDict)
        for i in allRankDict.keys():
            tmpl=allRankDict[i]
            for j in range(len(tmpl)):
                for k in range(j,len(tmpl)):
                    if j==k:
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
        self.rawTable=pd.DataFrame(tmpTable)
        self.rawTable2=pd.DataFrame(tmpTable2)

    def run_rank(self):
        data = Table(self.rawTable, col=[0,1,2,3])
        data2 = Table(self.rawTable2, col=[0,1,2,3])
        maseey=MasseyRanker()
        keener=KeenerRanker()
        maseeyRank=maseey.rank(data2)
        keenerRank=keener.rank(data)
        mergedRank = borda_count_merge([maseeyRank, keenerRank])
        self.outTable={}
        for index,i in mergedRank.iterrows():
            self.outTable[i[0]]=i[-1]
        return self.outTable

    def save_to_database(self):
        qs=[i[0] for i in self.allranks]
        for i in Course.objects.all():
            if len(RankCache.objects.filter(course=i))==0:
                c=RankCache(course=i)
                c.save()
            course_ID=i.course_ID
            if course_ID not in qs:
                continue
            c=RankCache.objects.get(course=i)
            c.difficulty_score = 0
            c.funny_score = 0
            c.gain_score = 0
            c.recommend_score = 0
            c.people=0
            c.save()
            for j in self.allranks:
                if j[0]==course_ID:
                    c.difficulty_score+=j[1]
                    c.funny_score+=j[2]
                    c.gain_score+=j[3]
                    c.recommend_score+=j[4]
                    c.people+=1
                    c.save()
            if course_ID in self.outTable.keys():
                c.position=self.outTable[course_ID]
                c.save()





def calc_rank():
    a=Rankers()
    a.read_data()
    a.run_rank()
    a.save_to_database()

if __name__=="__main__":
    a = Rankers()
    a.read_data()
    a.run_rank()
    a.save_to_database()
