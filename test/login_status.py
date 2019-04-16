from django.test import Client
from http.cookies import SimpleCookie

class LoginStatus:
    def __init__(self, testcaseobj, username, password):
        self.testcaseobj = testcaseobj
        self.username = username
        self.password = password

    def __enter__(self):
        client = self.testcaseobj.client
        client.cookies = SimpleCookie(
            {
                "username": self.username,
                "password": self.password
            }
        )
        session = client.session
        session["auth_sess"] = self.username
        session.save()
        return self

    def __exit__(self, exc_type, exc_value, exc_tb):
        self.testcaseobj.client.session.flush()
        self.testcaseobj.client = Client()
        return False