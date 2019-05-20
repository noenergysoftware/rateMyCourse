def writeLog(textin):
    """
    简单日志
    :param textin:
    :return:
    """
    try:
        with open("log.txt", "a") as fout:
            fout.write(textin + "\n")
    except:
        return 1
    else:
        return 0
