from unittest import skip

from django.test import tag

from page_objects import *
from user_actions import *
from front_basic import FrontBasicTC

@tag("kkk")
@tag("front")
class FrontContentCheckTC(FrontBasicTC):
    def IDCheck(self, page, id_text_dict):
        for text_id, exp_text in id_text_dict.items():
            element = page.waitAppear_ID(text_id)
            text = element.text
            self.assertEqual(text, exp_text)

    def test_detail_course(self):
        page = HomePage(self.driver, self.domain)
        page = page.search("论持久战")
        page = page.goDetailPage(0)
        page.checkIsSelf()

        self.IDCheck(page, 
            {
                page.name_text_id: "论持久战",
                page.credit_text_id: "1",
                page.type_text_id: "必修",
                page.school_text_id: "Office",
                page.description_text_id: "猫真可爱"
            }
        )

    @skip
    def test_person(self):
        page = HomePage(self.driver, self.domain)
        with LogStatus(page, "ming", "ming") as page:
            page.goPersonPage()
            page.checkIsSelf()
            # TODO 还不知道该页面是否会显示个人信息
            self.IDCheck(page,
                {
                    page.name_text_id: "ming",
                    page.role_text_id: "学生",
                    page.gender_text_id: "男",
                    page.intro_text_id: "mingming"
                }
            )

    def test_detail_comment(self):
        page = HomePage(self.driver, self.domain)
        page = page.search("论持久战")
        page = page.goDetailPage(0)
        page.checkIsSelf()

        # TODO check comment content