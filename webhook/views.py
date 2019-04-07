from django.http import HttpResponse, HttpResponseForbidden
from django.views.decorators.csrf import csrf_exempt

import hmac
import json
import os
import git


@csrf_exempt
def github(request):
    # Check Method
    if request.method != "POST":
        return HttpResponse(status=405)

    # Parse Header
    event = request.META.get("HTTP_X_GITHUB_EVENT", "")
    signature = request.META.get("HTTP_X_HUB_SIGNATURE", "")

    # Check Event
    if event != "push":
        return HttpResponse("Not registered event [{0}].".format(event))

    # Check Signature
    if not signature:
        return HttpResponse("No signature.")
    sha_name, sha_sign = signature.split("=")
    if sha_name != "sha1":
        return HttpResponse("Not registered sign method")

    mac = hmac.new(
        bytes(os.environ["SECRET_KEY"], encoding="utf-8"),
        msg=request.body, 
        digestmod="sha1")
    if not hmac.compare_digest(str(mac.hexdigest()), str(sha_sign)):
        return HttpResponseForbidden("Signature not match.")

    # Parse Body
    if not request.body:
        return HttpResponse("No body.")
    body = json.loads(request.body)
    
    # Deploy Work
    # Here we just pull the master branch
    repo = git.Repo(".")
    remote = repo.remote()
    branch_name = "deploy/webhook"
    remote.pull(branch_name + ":" + branch_name)

    return HttpResponse("Great.")