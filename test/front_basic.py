from unittest import TestCase

from selenium import webdriver
from selenium.webdriver.common.proxy import Proxy, ProxyType
from selenium.webdriver import DesiredCapabilities
from cover_saver import *

PROXY_COVER = False # Still not avaliable.

class FrontBasicTC(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        if PROXY_COVER:
            cap = DesiredCapabilities.EDGE.copy()
            prox = Proxy()
            prox.proxy_type = ProxyType.MANUAL
            sock = "127.0.0.1:3128"
            prox.http_proxy = sock
            prox.add_to_capabilities(cap)
            cls.driver = webdriver.Remote(desired_capabilities=cap)
        else:
            cls.driver = webdriver.Chrome()

    @classmethod
    def tearDownClass(cls):
        if FS_COVER:
            cover_saver.trySaveCoverageReport(cls.driver)
        cls.driver.close()
        super().tearDownClass()

    def setUp(self):
        self.domain = "127.0.0.1"