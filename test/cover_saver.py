import os

# Use JSCover
FS_COVER = False

class CoverSaver:
    def __init__(self):
        self.count = 0

    def trySaveCoverageReport(self, driver):
        json_str = driver.execute_script("return jscoverage_serializeCoverageToJSON();")

        coverage_dir = "D:/code_concerned/ruangong/rateMyCourse_front_coverage/coverage/"
        sub_dir = str(self.count)
        if not os.path.exists(coverage_dir + sub_dir):
            os.mkdir(coverage_dir + sub_dir)

        with open(coverage_dir + sub_dir + "/jscoverage.json", "w") as fd:
            fd.write(json_str)

        self.count += 1

cover_saver = CoverSaver()