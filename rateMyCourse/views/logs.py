import os
def writeLog(textin):
    try:
        with open("log.txt","a") as fout:
            fout.write(textin+"\n")
    except:
        return 1
    else:
        return 0