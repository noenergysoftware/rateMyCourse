class DBChecker:
    def __init__(self, connection, test_case_obj, app_name):
        self.connection = connection
        self.app_name = app_name
        self.test_case_obj = test_case_obj

    def __int_check(self, sql_script, prop_dict, expect_num):
        first_cond = True
        value_list = []
        for key, value in prop_dict.items():
            if not first_cond:
                sql_script = sql_script + " AND"
            first_cond = False
            sql_script = sql_script + " {0}=%s".format(key)
            value_list.append(value)
            
        with self.connection.cursor() as cursor:
            cursor.execute(sql_script, value_list)
            res_list = cursor.fetchall()
            self.test_case_obj.assertGreaterEqual(len(res_list), expect_num)

    def check(self, model_name, prop_dict, expect_num=1):
        model_name = model_name.lower()
        sql_script = "SELECT * FROM {0}_{1} WHERE".format(self.app_name, model_name)
        self.__int_check(sql_script, prop_dict, expect_num)

    def checkMeta(self, table_name, prop_dict, expect_num=1):
        table_name = table_name.lower()
        sql_script = "SELECT * FROM {0} WHERE".format(table_name)
        self.__int_check(sql_script, prop_dict, expect_num)
