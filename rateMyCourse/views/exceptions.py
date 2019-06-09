import json


def formatException(status, errMsg):
    return json.dumps({
        'status': status,
        'errMsg': errMsg,
    })
