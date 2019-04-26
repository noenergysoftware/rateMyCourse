该文件整合了一些不能放进报告中，但具体操作中会用到的东西。


# 测试数据库
使用`test/fixture.json`作为主要的测试数据库。但要注意，目前还使用`fixture_for_split_page.json`作为测试前端的切页功能时的追加数据库，在测试切页时需要加载它。

通过以下指令获取：

    python manage.py dumpdata -e contenttypes -e admin -e auth.Permission --natural-foreign --indent=2 > test/fixture.json

通过以下指令加载（注意是追加式的加载）：

    python manage.py loaddata test/fixture.json

# 后端-同质合并-测试逻辑与测试数据分离
详见在[test_auto_back.md](test_auto_back.md)。

# 前测试点覆盖率
详见[](test_front_coverage.md)