因为启用了HTTPS，所以在需要在测试环境中自签发一个证书，并且还得让浏览器信任，才能正常进行测试。

# 1. windows下安装openssl
注意，1.1.x版本的opensll有bug，所以要装1.0.2版本的。

我们既需要[二进制版本](https://slproweb.com/products/Win32OpenSSL.html)的，也需要[源码版本](https://www.openssl.org/source/)的。我们跑肯定是跑的二进制版本的，但需要从源码版本那里得到openssl.cnf。

下下来后安装就完事了。

# 2. 复制openssl.cnf到二进制版本的bin目录下
openssl.cnf在源码版本的app目录下，拷贝过去就行。

# 3. 修改openssl.cnf，生成证书
按照[这篇博客](https://blog.csdn.net/u013066244/article/details/78725842?utm_source=blogxgwz0)操作就行了。客户端证书不需要生成。

# 4. 信任证书
双击生成的crt文件，选择“受信任的根证书颁发机构”，然后一路点下去就完事了。

# 5. 启动服务器的时候启用证书
django服务器按[这篇博客](https://blog.csdn.net/yfj300/article/details/80597873)，不过证书不按它的生成。

nginx服务器按[这篇博客](https://www.cnblogs.com/jingxiaoniu/p/6745254.html)，同样的，不按它的生成证书。