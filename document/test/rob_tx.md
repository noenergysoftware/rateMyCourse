# 基本构图
就不画画了。

将Fiddler设为浏览器，Python的代理，然后劫持所有发到ssl.captcha.qq.com的请求，使用本地的假的腾讯验证码服务器来处理。假的服务器的代码托管在了[这里](https://github.com/noenergysoftware/faketx).

劫持的内容很简单，主要是如何达到本地劫持的效果会要费点脑子。

# 前端劫持
前端的劫持很简单，就是给Fiddler的HOSTS选项里加上一条`localhost:3668		ssl.captcha.qq.com`就行了，3668是假的服务器的端口。然后返回假的js代码就行。

# 后端劫持
后端劫持非常苦恼。因为Fiddler只是自动代理浏览器而已，然而后端发送请求是用的urllib，所以Fiddler通常来说是代理不了的。

受[这篇博客](https://blog.csdn.net/u013948858/article/details/78255814)的启发，我发现可以通过使用urllib的proxy来手动添加代理。但那样就意味着我需要更改后端代码，这是我想尽可能避免的。

而根据[这篇博客](https://www.cnblogs.com/jmmchina/p/6692576.html)，可以通过全局添加opener来避免修改后端代码。所以最后的解决办法是割离出一个独立的test_manager.py，在测试环境中使用它来启动后端服务器，然后在test_manage.py中添加代理。

最后还有一个问题，因为我们使用了https，而测试环境下的证书是我自己签的，所以验证通过不了。为了解决这个问题，我参考了[SO上的这个问题](https://stackoverflow.com/questions/27835619/urllib-and-ssl-certificate-verify-failed-error)中的解决办法，替换掉了默认的SSL认证方式。