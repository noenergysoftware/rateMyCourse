
var gender;
var role;

function infoCheck() {
    var errmsg = "";
    var result = true;

    var name = $("#username").val();
    var uPattern = /^[a-zA-Z0-9_]{3,16}$/;
    var check_name=uPattern.test(name);
    console.log(check_name);

    if(check_name==false){
            errmsg=errmsg+"用户名格式错误\n";
            result=false;
    }

    var length = document.getElementById("personalIntroduce");
    if (length.value.length > 256) {
        errmsg = errmsg + "个人简介字数超过256！\n";
        result = false;
    }

    if (result == false) {
        alert(errmsg);
        return false;
    }

    return true;
    
}

function getUserData(){
    var name = $.cookie("username");
    $.ajax({
        async: true,
        type:"get",
        url: "http://testapi.ratemycourse.tk/getUserDetail/",
        data:{"username":$.cookie("username")},
        dataType:"json",
        success:function(data){
            //data=JSON.parse(data);
            console.log(data);
            if (data.status == "1"){
                document.getElementById("name").value = data.body.username;
                if(data.body.role=="T"){
                    $("#role_teacher").prop("checked",true);
                }
                else if(data.body.role=="S"){
                    $("#role_student").prop("checked",true);
                }
                else {
                    $("#role_others").prop("checked",true);
                }

                if(data.body.gender=="M"){
                    $("#gender_male").prop("checked",true);
                }
                else if(data.body.gender=="F"){
                    $("#gender_female").prop("checked",true);
                }
                else {
                    $("#gender_secret").prop("checked",true);
                }
                document.getElementById("personalIntroduce").value = data.body.self_introduction;
            }else {
                alert(data.errMsg);
            }
        },
        error:function(data){
            alert(JSON.stringify(data));
        }
    });
}

function modifier() {

    if ($("#role_teacher").prop("checked") == true){
        role = "T";
    }else if($("#role_student").prop("checked") == true){
        role = "S";
    }else {
        role = "O";
    }

    if ($("#gender_male").prop("checked") == true){
        gender = "M";
    }else if ($("#gender_female").prop("checked") == true){
        gender = "F";
    }else {
        gender = "A";
    }
    $.ajax({
        async: true,
        type: "POST",
        url: "http://testapi.ratemycourse.tk/updateUser/",
        dataType: "text",
        data: {
            username: $("#name").val(),
            role: role,
            gender: gender,
            self_introduction: $("#personalIntroduce").val()
        },
        xhrFields: {
                withCredentials: true
        },
        success: function (data) {
            data=JSON.parse(data);
            console.log(JSON.stringify(data));
            console.log(data.status);
            if (data.status == "1") {
                alert(data.body.message);
                window.setTimeout("location.href='./personalinfo.html'", 00);
            } else {
                alert(data.errMsg);
            }
        },
        error: function (data) {
            alert(JSON.stringify(data));
        }
    });
}


    //$("#submit").click(function () {
    //    if (infoCheck == true) {
     //       modifier();
      //  }
  //  });
$(document).ready(function () {
    
    getUserData();

    if ($.cookie("username") != undefined){
        document.getElementById("signIn").style.display = "none";
        document.getElementById("signUp").style.display = "none";
        document.getElementById("personalInfo").style.display = "block";
        document.getElementById("logOut").style.display = "block"
      } 

    
    
      
  //    console.log("role: "+role.val());
//      console.log("gender: "+gender.val());


    $("#submit").click(function () {
        if (infoCheck == true) {
            modifier();
        }
    });

})
