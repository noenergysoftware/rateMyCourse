function check_password(){
    var password=$("#password").val();
    var pdPattern = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}$/;
    return pdPattern.test(password);
}

function check_repassword(){
    var password=$("#password").val();
    var repassword=$("#repassword").val();
    if(password==repassword){
        return true;
    }
    else{
        return false;
    }
}

function set(){
	
}

function reset(){
    if(check_password() && check_repassword() && $("#question1").val().length<=100){

        console.log($("#question1").val()+" "+md5($("#password").val()));
        $.ajax({
            async: true,
            type: "POST",
            url: "http://testapi.ratemycourse.tk/resetPassword/",
            dataType: "json",
            data:{
				username: $("#username").val(),
				question:"你的高中学校名称和年级是？",
				answer:$("#question1").val(),
                npassword:md5($("#password").val()),
                csrfmiddlewaretoken:  $.cookie("csrftoken")
            },
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
				console.log(data);
				console.log("success");
            },
            error: function (data) {
                console.log(data);
				console.log("fail");
            }
        });	
    }
    else{
        alert("密码不符合规定或问题答案过长！")
    }
}


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

    $("#username").keyup(function () {
		if($("#username").val().length>100){
			$("#username_confirm").removeClass("fa-check-circle-o");
            $("#username_confirm").removeClass("fa-check-circle");
            $("#username_confirm").addClass("fa-close");
		}
		else{
			$("#username_confirm").removeClass("fa-check-circle-o");
            $("#username_confirm").removeClass("fa-close");
            $("#username_confirm").addClass("fa-check-circle");
		}
    });

    $("#question1").keyup(function () {
		if($("#question1").val().length>100){
			$("#question1_confirm").removeClass("fa-check-circle-o");
            $("#question1_confirm").removeClass("fa-check-circle");
            $("#question1_confirm").addClass("fa-close");
		}
		else{
			$("#question1_confirm").removeClass("fa-check-circle-o");
            $("#question1_confirm").removeClass("fa-close");
            $("#question1_confirm").addClass("fa-check-circle");
		}
    });
    $("#password").keyup(function () {
        if(check_password()==false){
            $("#password_confirm").removeClass("fa-check-circle-o");
            $("#password_confirm").removeClass("fa-check-circle");
            $("#password_confirm").addClass("fa-close");
        }
        else{
            $("#password_confirm").removeClass("fa-check-circle-o");
            $("#password_confirm").removeClass("fa-close");
            $("#password_confirm").addClass("fa-check-circle");
        }
    });

    $("#repassword").keyup(function () {
        if(check_repassword()==false){
            $("#repassword_confirm").removeClass("fa-check-circle-o");
            $("#repassword_confirm").removeClass("fa-check-circle");
            $("#repassword_confirm").addClass("fa-close");
        }
        else{
            $("#repassword_confirm").removeClass("fa-check-circle-o");
            $("#repassword_confirm").removeClass("fa-close");
            $("#repassword_confirm").addClass("fa-check-circle");
        }
    });

    if($.cookie("username")!=undefined){
        $("#username").val($.cookie("username"))
    }
    

})


