function infoCheck() {
    var errmsg = '';
    var name = $("#username").val();
    console.log(name);
    var C = true;
    if (name.length < 3) {
        errmsg = errmsg + "用户名长度至少为3！\n";
        C = false;
    }

    var role = $("#role").val();
    if (role != "T" && role != "S" && role != "O") {
        errmmsg = errmsg + "role填写不正确！\n";
        C = false;
    }

    var gender = $("#gender").val();
    if (gender != "F" && gender != "M" && gender != "A") {
        errmsg = errmsg + "gender填写不正确！\n";
        C = flag;
    }

    var length = document.getElementById("personalIntroduce");
    if (length.value.length > 256) {
        errmsg = errmsg + "个人简介字数超过256！\n";
        C = flag;
    }

    if (C == false) {
        alert(errmsg);
        return false;
    }

    return true;
}



$(document).ready(function () {
    //console.log(window.sessionStorage.getItem("status")== "1");
    if ($.cookie("username") != undefined){
        document.getElementById("signIn").style.display = "none";
        document.getElementById("signUp").style.display = "none";
        document.getElementById("personalInfo").style.display = "block"
      } 

    function modifier() {
        $.ajax({
            type: "POST",
            url: "https://api.ratemycourse.tk/updateUser/",
            dataType: "json",
            data: {
                username: $("#username").val(),
                role: $("#role").val(),
                gender: $("#gender").val(),
                self_introductino: $("#personalIntroduce").val()
            },
            xhrFields: {
                    withCredentials: true
            },
            success: function (data) {
                console.log(JSON.stringify(data));
                console.log(data.status);
                if (data.status == "1") {
                    alert(data.body.message);
                } else {
                    alert(data.errMsg);
                }
            },
            error: function (data) {
                alert(JSON.stringify(data));
            }
        });
    }
    $("#submit").click(function () {
        if (infoCheck == true) {
            modifier();
        }
    });

})