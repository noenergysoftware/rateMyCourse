import os

#str1='https://api.ratemycourse.tk/'
#str2='http://ratemycourse.canuse.tk/'

str1='http://testapi.ratemycourse.tk/'
str2='https://api.ratemycourse.tk/'

def Xreplace(path):
    os.chdir(path) # 跳到D盘
    files = os.listdir(os.getcwd())
    print(files)
    for file in files:
        if os.path.isdir(file):
            continue
        lines = open(file,'r',encoding="utf-8").readlines() #打开文件，读入每一行
        fp = open(file+'.bak','w',encoding="utf-8") #打开你要写得文件pp2.txt
        for s in lines:
            #print(s)
            #print() 
            fp.write(s.replace(str1,str2))
        fp.close() # 关闭文件
        os.remove(file)
        print(file+'.bak'+'  '+file)
        os.rename(file+'.bak',file)

path='d:\\ruangong\\rateMyCourse\\front_end\\'
Xreplace(path)
path='d:\\ruangong\\rateMyCourse\\front_end\\js'
Xreplace(path)

'''    
path='d:\\ruangong\\rateMyCourse_test\\front_end\\js'
os.chdir(path) # 跳到D盘
files = os.listdir(os.getcwd())
print(files)
for file in files:
    if os.path.isdir(file):
        continue
    lines = open(file,'r',encoding="utf-8").readlines() #打开文件，读入每一行
    fp = open(file+'.bak','w',encoding="utf-8") #打开你要写得文件pp2.txt
    for s in lines:
        #print(s)
        #print() 
        fp.write(s.replace('https://api.ratemycourse.tk/','http://ratemycourse.canuse.tk/'))
    fp.close() # 关闭文件
    os.remove(file)
    print(file+'.bak'+'  '+file)
    os.rename(file+'.bak',file)
'''
