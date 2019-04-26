# 基本流程
0. 我们接下来会要启用local-storage，但在这个模式下生成的jscoverage.js文件是存在bug的。我们需要先用jscover在非local-storage模式下生成一个jscoverage.js，然后复制保存下它，再继续操作。
1. jscover加工前端代码，使用filesystem模式，生成加入插桩代码后的前端代码，注意要启用local-storage模式。
2. 将之前保存下来的非local-storage模式下的jscoverage.js拿出来，覆盖掉生成的local-storage模式下的jscoverage.js。
3. 修改nginx的conf文件，使代理插桩后的前端代码（需要杀光nginx进程才能使得更改conf文件有效）
4. 修改测试代码，使得在每个webdriver要被销毁之前，调用jscoverage_serializeCoverageToJSON函数生成jscoverage.json文件。
    * 因为每个Testcase都有一个webdriver，所以我们为每一个testcase准备一个文件夹，然后在该文件夹下生成jscoverage.json文件。
5. 使用jscover的merge指令合并上一步产生的jscoverage.json们，将合并的jscoverage.json放在和jscoverage.html同目录下。
6. 修改jscoverage.js文件，将jscoverage_isReport改为true

    var jscoverage_isReport = true;
7. 使用edge打开jscoverage.html
    * 不能使用chrome，因为chrome禁止本地的文件访问。当然好像存在选项改，但还是直接Edge方便。


# 不使用Proxy的原因
因为Proxy模式需要修改浏览器代理。而我们目前的本地测试环境使用了Fiddler作为浏览器代理，这两个代理也就冲突了。