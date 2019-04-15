from unittest import skip

from django.test.testcases import TestCase
from django.test import tag

from selenium.webdriver.edge.webdriver import WebDriver

from page_objects import *
from user_actions import *

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

@tag("front")
class FrontHomeGoLogicTC(FrontBasicTC):
    def createInitPage(self):
        return HomePage(self.driver, self.domain)

    def test_login(self):
        page = self.createInitPage()
        loginpage = page.goLoginPage()
        loginpage.checkIsSelf()

    def test_regist(self):
        page = self.createInitPage()
        registpage = page.goRegistPage()
        registpage.checkIsSelf()

    def test_search(self):
        page = self.createInitPage()
        searchpage = page.search("rbq")
        searchpage.checkIsSelf()

    def test_person(self):
        page = self.createInitPage()
        page = logAction(page, "rbq", "rbq")
        page.alertAccept()
        page = page.goPersonPage()
        try:
            page.checkIsSelf()
        finally:
            page.clearCookies()


@tag("front")
class FrontSearchGoLogicTC(FrontBasicTC):
    def createInitPage(self):
        homepage = HomePage(self.driver, self.domain)
        searchpage = homepage.search("rbq")
        searchpage.checkIsSelf()
        return searchpage

    def test_home(self):
        searchpage = self.createInitPage()
        homepage = searchpage.goHomePage()
        homepage.checkIsSelf()

    def test_login(self):
        searchpage = self.createInitPage()
        loginpage = searchpage.goLoginPage()
        loginpage.checkIsSelf()

    def test_regist(self):
        searchpage = self.createInitPage()
        registpage = searchpage.goRegistPage()
        registpage.checkIsSelf()

    def test_detail(self):
        searchpage = self.createInitPage()
        detailpage = searchpage.goDetailPage(0)
        detailpage.checkIsSelf()

    def test_person(self):
        # TODO need login
        pass


@tag("front")
class FrontDetailGoLogicTC(FrontBasicTC):
    def createInitPage(self):
        homepage = HomePage(self.driver, self.domain)
        searchpage = homepage.search("rbq")
        detailpage = searchpage.goDetailPage("0")
        detailpage.checkIsSelf()
        return detailpage

    def test_home(self):
        page = self.createInitPage()
        homepage = page.goHomePage()
        homepage.checkIsSelf()

    def test_login(self):
        page = self.createInitPage()
        loginpage = page.goLoginPage()
        loginpage.checkIsSelf()

    def test_regist(self):
        page = self.createInitPage()
        registpage = page.goRegistPage()
        registpage.checkIsSelf()

    def test_search(self):
        # TODO need more spec
        pass

    def test_person(self):
        # TODO need login
        pass

    def test_comment(self):
        page = self.createInitPage()
        commentpage = page.goCommentPage()
        commentpage.checkIsSelf()


@tag("front")
class FrontCommentGoLogicTC(FrontBasicTC):
    def createInitPage(self):
        homepage = HomePage(self.driver, self.domain)
        searchpage = homepage.search("rbq")
        detailpage = searchpage.goDetailPage("0")
        commonpage = detailpage.goCommentPage()
        return commonpage

    def test_home(self):
        page = self.createInitPage()
        homepage = page.goHomePage()
        homepage.checkIsSelf()

    def test_login(self):
        page = self.createInitPage()
        loginpage = page.goLoginPage()
        loginpage.checkIsSelf()

    def test_regist(self):
        page = self.createInitPage()
        registpage = page.goRegistPage()
        registpage.checkIsSelf()

    def test_person(self):
        # TODO need login
        pass

    def test_detail(self):
        # TODO need test database to reroll
        pass


@tag("front")
@skip
class FrontPersonGoLogicTC(FrontBasicTC):
    def createInitPage(self):
        homepage = HomePage(self.driver, self.domain)
        personpage = None
        # TDOO need login
        return personpage

    # TODO I don't know this page's go logic
    #       So do login&signin pages
    