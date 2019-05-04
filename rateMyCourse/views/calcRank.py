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
        self.outTable=None
    def read_data(self):
        allRankDict={}
        ar=MakeRank.objects.all()
        for i in ar:
            username=i.user.username
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
        ret={}
        for index,i in mergedRank.iterrows():
            ret[i[0]]=i[-1]
        return ret

def calc_rank():
    a=Rankers()
    a.read_data()
    return a.run_rank()
