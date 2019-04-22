# 基本框架
* nginx服务器，开在80端口，负责分发html, js文件
* django服务器，开在X端口，负责后端接口的供应。使用fiddler来映射api.rateMyCourse.tk到本地的localhost:X
* testcase进程，负责调用selenium，然后selenium打开浏览器，请求nginx服务器获取网页文件，再通过ajax请求django服务器获取后端数据。