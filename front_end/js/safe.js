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
	$.ajax({
		async: true,
		type: "POST",
		url: "http://testapi.ratemycourse.tk/setQuestion/",
		dataType: "json",
		data:{
			username: $.cookie("username"),
			question:"你的高中学校名称和年级是？",
			answer:"武汉二中2016",
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

function reset(){
    if(check_password() && check_repassword() && $("#question1").val().length<=100){

        console.log($("#question1").val()+" "+md5($("#password").val()));
        $.ajax({
            async: true,
            type: "POST",
            url: "http://testapi.ratemycourse.tk/resetPassword/",
            dataType: "json",
            data:{
				username: $.cookie("username"),
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


    

})


