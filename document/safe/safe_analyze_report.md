**注意，本文档将涉及许多细节内容，考虑到这些细节在开发过程中可能会有巨大的改变，而本文档的内容并不是在开发过程中起推动性作用的，故而本文档中的内容不将被持续维护。任何细节都以实际项目为准，本文档中的所有内容都可能已过期。**

**本文档中的大多数内容都没有理论支撑，仅为本人根据个人脑补的考量。**这主要是因为我是临时磨枪上阵的，基本都是现查百度的结论，内容仅供参考。

本文档的内容为从安全角度分析整个项目，寻找可能存在安全隐患的地方。

考虑的攻击方式包括：
* 由非规定渠道的添加、篡改、删除数据
* 伪造身份、权限
* 注入代码
* 爬取服务器端信息
* 耗尽服务器端资源
* 引发客户端/服务器端异常

项目安全包含：
* 服务器安全：服务器能否正常与客户端交互，并正常地响应客户端请求。
* 数据安全
* 账户安全

标记：
1. [?]表示我也不知道是否存在这样的攻击方式
2. [!]表示存在这样的攻击方式，但我不知道解决方式
3. [#]表示这里需要更仔细的检查


用户交互过程可以被抽象为：

客户端请求前端服务器 => 前端服务器处理请求 => 前端服务器返回响应 => 客户端收到前端服务器的响应 => 
客户端请求后端服务器 => 后端服务器处理请求 => 后端服务器返回响应 => 客户端收到后端服务器的响应

# 客户端请求
这部分主要由用户自己确保请求能否正常发送，我们没有什么可以做的。

# 前端服务器处理请求
前端服务器使用的是nginx，所做的工作仅仅是分发静态文件。需要考虑的攻击方式包括：

* dos攻击：过多的请求让服务器瘫痪

    这点对于后端服务器也是一样的，而且使用的都是Nginx，所以应该有相同的解决方案。简单的可以考虑以下两类方案：
    1. 对于同一IP的频繁请求限制流量。
    2. 阻塞具有异常头的请求。
    [参考1](https://blog.csdn.net/luyaran/article/details/71082471) [参考2](https://blog.csdn.net/weixin_38628533/article/details/80469712) [参考3-来自官网](https://www.nginx.com/blog/mitigating-ddos-attacks-with-nginx-and-nginx-plus/) [参考3-引用博客](https://www.cnblogs.com/EasonJim/p/7807729.html)
* 篡改服务器端存放的文件
* 注入代码

    考虑到在前端服务器我们对于任何请求都不会解析它的body，这几种需要在请求body部分存放数据的攻击不应该能够发生。
* 获取服务器信息，爬取服务器代码

    [!]

# 服务器返回响应
这部分主要考虑的是能否将响应发送给用户，因为目前都是用的云计算服务，基本是由服务提供商保证这点，没有我们可以做的。

# 客户端收到服务器的响应
* XSS攻击。[参考](https://www.freebuf.com/articles/web/185654.html)

    这类攻击可能不会直接影响到服务器安全，但会影响到客户使用。前段时间爆出来的[jquery原型污染](https://www.360zhijia.com/anquan/461210.html)就属于这类攻击。现在大多数浏览器都支持了XSS Filter，可以通过HTTP请求的头中包含X-XSS-PROTECTION来设置。django中，当启用了SecurityMiddleware后，可以通过设置[SECURE_BROWSER_XSS_FILTER](https://docs.djangoproject.com/en/2.1/ref/settings/#std:setting-SECURE_BROWSER_XSS_FILTER)来启用XSS Filter。而根据[这篇博客](https://www.freebuf.com/articles/web/138769.html)，XSS-Protection: 1; mode=block是我们应该选择的最优项，也是django默认的项。

# 后端服务器处理请求
略去nginx层的处理，该部分与前端服务器一致。所以我们需要考虑的只有django层的问题。

## Django的建议
先从[django官方文档](https://docs.djangoproject.com/zh-hans/2.2/topics/security/)入手考虑问题。

* CSRF攻击

    django自己原生提供了csrf检查，详见[该文档](https://docs.djangoproject.com/zh-hans/2.2/ref/csrf/#using-csrf)，但要注意的是因为我们不使用django的template，所以前端的csrftoken需要一些技巧来插入，可以参考[该博客](https://www.cnblogs.com/zhangtq/p/9759061.html)。我们的网站目前似乎并没有启用。

* SQL注入攻击

    [#]因为django通常不会直接执行sql语句，而是通过model的api来执行，所以通常不会遭受这样的攻击。但也存在可以直接执行sql语句的方式，我们的网站是否使用了这样的方式有待检查。

* Clickjacking攻击

    我注意到后端服务器启用了django自带的xframeoptions。但是问题是因为我们的前端服务器不由django分发，所以我们的前端发出的http响应其实依然不包含xframeoptions头。可以参考[该博客](https://blog.csdn.net/tigerzx/article/details/60373982)解决问题。

* SSL/HTTPS

    这部分就是因为HTTPS安全得多，所以我们最好一切请求回复都用HTTPS进行，至少任何和用户认证相关的都应该用HTTPS。为了达到这个目的，建议启用
    * [SESSION_COOKIE_SECURE](https://docs.djangoproject.com/en/2.1/ref/settings/#std:setting-SESSION_COOKIE_SECURE)：要求浏览器必须经过HTTPS请求发送sessionID的cookie。
    * [CSRF_COOKIE_SECURE](https://docs.djangoproject.com/en/2.1/ref/settings/#std:setting-CSRF_COOKIE_SECURE)：要求浏览器必须经过HTTPS请求发送csrftoken的cookie。不过这个我们应该用不上，因为根据上文对CSRF的描述，我们不应该通过cookie传送csrftoken。
    考虑到HSTS还挺复杂的，我们也许用不上严格的[HSTS](https://docs.djangoproject.com/en/2.1/ref/middleware/#http-strict-transport-security)策略。

* 伪装的用户上传的图片

    Django文档中提到，一个html文件只要加上一个PNG头，那么它也会被当成一个PNG图片，当这张图片被上传到服务器，然后再被下下来的话，它可能会被按照html文件解释，这里就会被利用。[?]

* 使用环境变量存放SECRET_KEY

    根据[deploy的checklist](https://docs.djangoproject.com/en/2.1/howto/deployment/checklist/#secret-key)以及[SECRET_KEY](https://docs.djangoproject.com/en/2.1/ref/settings/#std:setting-SECRET_KEY)的用途，可以证明SECRET_KEY是极度需要隐藏的信息，参考B站源码泄露的事情，而且我们的代码是直接公开在github上的，所以说SECRET_KEY直接硬编码在代码中是非常糟糕的做法。

* 管理数据库的远程登录

    目前我们使用的sqlite，所以不存在这个问题。如果以后转用MySQL的话，可能需要考虑直接禁用远程登录，或者为数据库的远程登录添加一些访问限制。


## 自身的分析
这里我们将从后端服务器提供的接口、存在的资源等角度分析漏洞。
考虑到排版问题，拆分到[](safe_self_analyze.md)中叙述。


# 依赖安全
因为我们的服务器一定会基于一些已有的东西来执行，所以我们需要时刻关注这些依赖项的安全情况。服务器安全的依赖项包括：
* nginx
* javascript
* jquery
* django