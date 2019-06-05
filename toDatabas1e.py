import os
import sys

pro_dir = os.getcwd()
sys.path.append(pro_dir)
os.environ['DJANGO_SETTINGS_MODULE'] = 'flamenco.settings'
import django

django.setup()
from rateMyCourse.models import *
import pandas as pd

for m in [User]:
    k=len(m.objects.all())
    cnt=0
    for j in m.objects.all():
        if cnt<k-1000:
            cnt=cnt+1
            j.delete()

