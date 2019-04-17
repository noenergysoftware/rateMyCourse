from unittest import skip

from django.test import tag

from page_objects import *
from user_actions import *
from front_basic import FrontBasicTC

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
        with LogStatus(page, "rbq", "rbq") as page:
            page = page.goPersonPage()
            page.checkIsSelf()


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
        page = self.createInitPage()
        with LogStatus(page, "rbq", "rbq") as page:
            page = page.goPersonPage()
            page.checkIsSelf()


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
        page = self.createInitPage()
        with LogStatus(page, "rbq", "rbq") as page:
            page = page.goPersonPage()
            page.checkIsSelf()

    def test_comment(self):
        page = self.createInitPage()
        commentpage = page.goCommentPage()
        commentpage.checkIsSelf()


@tag("front")
class FrontCommentGoLogicTC(FrontBasicTC):
    def goInitPage(self, homepage):
        searchpage = homepage.search("rbq")
        detailpage = searchpage.goDetailPage("0")
        commonpage = detailpage.goCommentPage()
        return commonpage

    def createInitPage(self):
        homepage = HomePage(self.driver, self.domain)
        return self.goInitPage(homepage)

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
        page = self.createInitPage()
        with LogStatus(page, "rbq", "rbq") as page:
            page = page.goPersonPage()
            page.checkIsSelf()

    def test_detail(self):
        # TODO This not pass, may somewhat wrong.
        page = HomePage(self.driver, self.domain)
        with LogStatus(page, "rbq", "rbq") as page:
            page = self.goInitPage(page)
            page.selectTeacher(0)
            page.editComment("kkkkkkkkkk")
            page = page.submitComment()
            page.checkIsSelf()


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
    