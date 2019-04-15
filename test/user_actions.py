from page_objects import *

def logAction(page, name, password):
    if not page is LoginPage:
        page = page.goLoginPage()
    return page.logIn(name, password)