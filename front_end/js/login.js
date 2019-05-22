


$(document).ready(function () {
    $.ajax({
        async: true,
        type: "GET",
        url: "http://testapi.ratemycourse.tk/getToken/",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
           $.cookie("csrftoken",data.token);
        },
        error: function (data) {
            console.log(JSON.stringify(data));
            alert(JSON.stringify(data));
        }
    });



        function login() {
            var name;
            var email;
            if ($("#name").val().indexOf("@") == -1) {       //true:是name登录
                name = document.getElementById("name").value;
                
            } else {
                
                email = document.getElementById("name").value;
            }
            
            //document.getElementByIssd("login").disabled = true;
            $.ajax({
                async: false,
                type: "POST",
                url: "http://testapi.ratemycourse.tk/signIn/",
                dataType: "json",
                data: {
                    username: name,
                    mail: email,
                    password: md5($("#password").val()),
                    csrfmiddlewaretoken:  $.cookie("csrftoken")
                },
                xhrFields: {
                    withCredentials: true
                },
                success: function (data) {
                    //data=JSON.parse(data);
                    console.log(JSON.stringify(data));
                    console.log(data.status);
                    if (data.status == "1") {
                        var date = new Date();
                        date.setTime(date.getTime()+120*60*1000);
                        $.cookie("username", data.body.username, { expires:date,path: '/' });
                        
                        //window.sessionStorage.setItem("status",data.status);           //登录成功"status"="0",用于切换导航栏
                        //window.sessionStorage.setItem("username",data.body.username);
                        //console.log("status"+window.sessionStorage.getItem("status"));
                        alert(data.body.username + "登录成功！");
                        window.setTimeout("location.href='./index.html'", 1200);
                    }
                    else {
                        console.log(JSON.stringify(data));
                        alert(data.errMsg);
                    }
                    //window.setTimeout("location.href='/user'", 1200);
                },
                error: function (data) {
                    console.log(JSON.stringify(data));
                    alert(JSON.stringify(data));
                }
            });
        }
        $("html").keydown(function (event) {
            //13 = enter
            if (event.keyCode == 13) {
                login();
            }
        });
        $("#login").click(function () {
            login();
        });
    })