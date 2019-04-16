from django.test.testcases import TestCase

from selenium.webdriver.edge.webdriver import WebDriver

class FrontBasicTC(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.driver = WebDriver()

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()
        super().tearDownClass()

    def setUp(self):
        self.domain = "127.0.0.1"