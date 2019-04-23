目前还不能用。

# 基本流程
1. jscover加工前端代码，使用filesystem模式，生成加入插桩代码后的前端代码
2. 修改nginx的conf文件，使代理插桩后的前端代码（需要杀光nginx进程才能使得更改conf文件有效）
3. 在每个webdriver要被销毁之前，调用jscoverage_serializeCoverageToJSON函数生成jscoverage.json文件。
    * 因为每个Testcase都有一个webdriver，所以我们为每一个testcase准备一个文件夹，然后在该文件夹下生成jscoverage.json文件。
    * __`注意每一次driver的get, 或者location.herf（也就是任何一次url的变换）都会清空js的内存，也就是说jscoverage的数据会在页面跳转的时候被清空，所以我们每次页面跳转之前都需要保存一个jscoverage。不过目前我还没做这项工作。`__[这篇博客](http://www.cnblogs.com/rgqancy/p/6878275.html)讲了原因。
4. 使用jscover的merge指令合并上一步产生的jscoverage.json们，将合并的jscoverage.json放在和jscoverage.html同目录下。
5. 修改jscoverage.js文件，将jscoverage_isReport改为true

    var jscoverage_isReport = true;
6. 使用edge打开jscoverage.html