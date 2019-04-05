from django.test import TestCase, Client, tag
import json

from rateMyCourse.models import User

@tag("back")
class BackBasicTestCase(TestCase):
    # Prepare the database by using fixture.
    fixtures = ["fixture.json"]

    def postContainTest(self, url, form, text):
        # Send Request
        #   Specify the interface to test by assigning the url.
        #   With the form attached.
        response = self.client.post(url, form)
                    
        # Response Check
        #   Check the status code(default 200) 
        #   and whether contain text in body.
        try:
            body = json.loads(response.content)
            self.assertEqual(body["status"], 1)
            self.assertContains(response, text)
        except Exception as e:
            print("Body is:", body)
            raise e

    @tag("demo")
    def test_sign_up(self):
        # Send Request & Response Check
        self.postContainTest(
            "/signUp/",
            {
                "username": "test",
                "password": "123",
                "mail": "test@test.com"
            },
            "test"
        )
        # Side Effect Check
        #   Check whether the side effects take place.
        self.assertTrue(
            User.objects.filter(
                username="test", 
                password="123",
                mail="test@test.com"
            ).exists()
        )

    def test_update_user(self):
        self.postContainTest(
            "/updateUser/",
            {
                "username": "rbq",
                "role": "Teacher",
                "gender": "Male",
                "selfintroduction": "hhh"
            },
            "rbq"
        )
        self.assertTrue(
            User.objects.filter(
                username="rbq",
                role="Teacher",
                gender="Male",
                selfinstroduction="hhh"
            ).exists()
        )

    def test_search_teacher(self):
        pass
        # TODO       

