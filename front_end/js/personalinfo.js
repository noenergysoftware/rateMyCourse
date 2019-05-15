
var gender;
var role;
var formData;
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
        data:{
            username:$.cookie("username")
        },
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
                console.log(data.body.profile_photo);
                $("#user_profile_photo").prop("src",data.body.profile_photo); 
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

    console.log($("#name").val()+"**"+role+"**"+gender+"**"+$("#personalIntroduce").val());
    $.ajax({
        async: true,
        type: "POST",
        url: "http://testapi.ratemycourse.tk/updateUser/",
        dataType: "text",
        data: {
            username: $("#name").val(),
            role: role,
            gender: gender,
            self_introduction: $("#personalIntroduce").val(),
            csrfmiddlewaretoken:  $.cookie("csrftoken")
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

    $("#upload_photo").click(function () {
        uploadPhoto();
    });

})

function ProcessFile(e) {
    
    
}
function contentLoaded() {
    document.getElementById('upload').addEventListener('change', ProcessFile, false);
}
function uploadPhoto(){
    if ($.cookie("username") == undefined){
        alert("你还未登录，无法上传头像");
        return;
    }
    var file = document.getElementById("upload").files[0];
    console.log(file);
    if (file && checkPhoto(file)) {
        console.log("rignt");
        formData=new FormData();
        formData.append('smfile',file);
        $.ajax({
            type:"POST",
            url:"https://sm.ms/api/upload",
            data:formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                console.log(data);
                if(data.code="success"){
                    //上传成功
                    $.ajax({
                        type:"POST",
                        url:"http://testapi.ratemycourse.tk/updateUserProfilePhoto/",
                        data:{
                            username: $.cookie("username"),
                            profile_photo: data.data.url,
                            csrfmiddlewaretoken:  $.cookie("csrftoken")
                        },
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function (data2) {
                            console.log(data2);
                            if(data2.status=="1"){
                                alert("上传头像成功！");
                                $('#close_modal').click();
                            }
                            else{
                                console.log(data2.errMsg);
                                alert(data2.errMsg);
                            }
                        },
                        error: function (data2) {
                            console.log(data2);
                            
                        }
                    });
                }
                else{
                    console.log(data.msg);
                }
    
            },
            error: function (data) {
                console.log(data);
                
            }
        });
    }
}

function checkPhoto(file){
    var errmsg = "";
    var result = true;
    console.log(file.name+"\n"+file.size);
    var reg = /.*?\.(gif|png|jpg)/gi;
    if(!reg.test(file.name.substr(file.name.lastIndexOf(".")))){
        errmsg+="请选择jpg或png格式图片！";
        result=false;
    }
    var size=parseInt(file.size);
    if(size>=5242880){
        errmsg+="图片过大，请选择不超过5MB大小的图片";
        result=false;
    }
    console.log(errmsg);
    return result;
}
