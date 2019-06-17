
var gender;
var role;
var formData;
var ajax_success;
function reset(){
    window.setTimeout("location.href='./safe.html'", 0);
}

function html2Escape(sHtml) {
    return sHtml.replace(/[<>&"]/g,function(c){
      return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];
    });
}

function setQuestion(){
    if($.cookie("username")==undefined){
        alert("未登录，无法设置安全问题");
        return;
    }

    if($("#question1").val().length>0 && $("#question1").val().length>0){

        $.ajax({
            async: true,
            type: "POST",
            url: "https://api.ratemycourse.tk/setQuestion/",
            dataType: "json",
            data:{
                username:   $.cookie("username"),
                question:   "你的高中学校名称和年级是？",
                answer:     $("#question1").val(),
                csrfmiddlewaretoken:  $.cookie("csrftoken")
            },
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                console.log(data);
                if(data.status=="1"){
                    alert(data.body.message);
                    $('#close_modal2').click();
                }
                else{
                    alert(data.errMsg);
                }
            },
            error: function (data) {
                console.log(data);
                if(data.readyState==4){
                    window.sessionStorage.setItem('callBack',data.responseText);
                    window.setTimeout("location.href='./callBack.html'",0);
                }
                else if(data.readyState==0){
                    alert("请求发送失败，请稍后再进行尝试");
                }
                else{
                    alert(JSON.stringify(data));
                }
            }
        });	
    }
    else{
        alert("问题答案过长或为空");
    }
}

function getUserData(name){
    
    ajax_succes=$.ajax({
        async: true,
        type:"get",
        url: "https://api.ratemycourse.tk/getUserDetail/",
        data:{
            username:name
        },
        dataType:"json",
        success:function(data){
            //data=JSON.parse(data);
            console.log(data);
            if (data.status == "1"){
                $("#name").text(data.body.username);
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
                $("#personalIntroduce").text(data.body.self_introduction);
                console.log(data.body.profile_photo);
                $("#user_profile_photo").prop("src",data.body.profile_photo); 

                window.sessionStorage.setItem("user_data",JSON.stringify(data))
            }else {
                alert(data.errMsg);
            }
        },
        error:function(data){
            if(data.readyState==4){
                window.sessionStorage.setItem('callBack',data.responseText);
                window.setTimeout("location.href='./callBack.html'",0);
            }
            else if(data.readyState==0){
                alert("请求发送失败，请稍后再进行尝试");
            }
            else{
                alert(JSON.stringify(data));
            }
        }
    });
}

function modifier() {
    if($("#name").text()!=$.cookie("username")){
        alert("不能修改他人信息！");
        return;
    }


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


    console.log($("#personalIntroduce").text().length);

    if($("#personalIntroduce").text().length>256){
        alert("个人简介字数请不要超过256!");
        return;
    }

    console.log($("#name").text()+"**"+role+"**"+gender+"**"+$("#personalIntroduce").text());
    $.ajax({
        async: true,
        type: "POST",
        url: "https://api.ratemycourse.tk/updateUser/",
        dataType: "text",
        data: {
            username: $("#name").text(),
            role: role,
            gender: gender,
            self_introduction: $("#personalIntroduce").text(),
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
            if(data.readyState==4){
                window.sessionStorage.setItem('callBack',data.responseText);
                window.setTimeout("location.href='./callBack.html'",0);
            }
            else if(data.readyState==0){
                alert("请求发送失败，请稍后再进行尝试");
            }
            else{
                alert(JSON.stringify(data));
            }
        }
    });
}

function genComment(data){

    console.log(data);
    var comments=data.body.user_comments;

    var length=Object.getOwnPropertyNames(comments).length;
    console.log("?????????"+length);
    for(i = length - 1; i >= 0; i--){
        
        var single_comment= $("<div class=\"card col-md-12\" style=\"margin-top:8px\" id=\"comment_"+i+"\">"+
                            "<div class=\"col-md-10 offset-md-1\">"+
                            "   <div class=\"row align-items-center\">\n"+
                            "       <p class=\"my-4 col-md-2 col-4\">"+comments[i].course.name+"</p>"+
                            "       <p class=\"my-4 col-md-2 col-4\">教师</p>"+
                            "       <p class=\"my-4 col-md-2 col-6\">"+comments[i].comment.teacher+"</p>"+
                            "   </div>\n"+
                            "   <hr class=\"my-1\" width=\"70%\">"+
                            "   <div class=\"row text-center\">"+
                            "       <p style=\"margin-top:16px;margin-left:16px;text-align:left; width:80%\">"+html2Escape(comments[i].comment.content)+"</p>\n"+
                            "   </div>"+
                            "   <div class=\"row text-center\">"+
                            "       <a class=\"col-md-4 col-12\" >"+
                            "           <p style=\"float:left;text-align:left;\">"+comments[i].comment.edit_time+"</p>"+
                            "       </a>"+
                            "   </div>"+
                            "</div>"+
                            "</div>");

       
        $("#comment").append(single_comment);
    }
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
        url: "https://api.ratemycourse.tk/getToken/",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
           $.cookie("csrftoken",data.token);
        },
        error: function (data) {
            if(data.readyState==4){
                window.sessionStorage.setItem('callBack',data.responseText);
                window.setTimeout("location.href='./callBack.html'",0);
            }
            else if(data.readyState==0){
                alert("请求发送失败，请稍后再进行尝试");
            }
            else{
                alert(JSON.stringify(data));
            }
        }
    });
    var name=window.sessionStorage.getItem("username");

    if(name==$.cookie("username") && name!=undefined){
        //确定是本人的信息
        $("#safe").show();
        $("#modify").show();
        $("#show_modal").show();
    }
    else{
        $("#safe").hide();
        $("#modify").hide();
        $("#show_modal").hide();
    }
    getUserData(name);

    if(name!=$.cookie("username")){
        $("#role_teacher").attr("disabled","disabled");
        $("#role_student").attr("disabled","disabled");
        $("#role_others").attr("disabled","disabled");
        $("#gender_male").attr("disabled","disabled");
        $("#gender_female").attr("disabled","disabled");
        $("#gender_secret").attr("disabled","disabled");
        $("#personalIntroduce").attr("disabled","disabled");
        
    }

    if($.cookie("username") != undefined){
        document.getElementById("signIn").style.display = "none";
        document.getElementById("signUp").style.display = "none";
        document.getElementById("personalInfo").style.display = "block";
        document.getElementById("logOut").style.display = "block"
    } 

    $.when(ajax_success).done(function () {
        genComment(JSON.parse(window.sessionStorage.getItem("user_data")));
    });
    
      
  //    console.log("role: "+role.val());
//      console.log("gender: "+gender.val());


    $("#submit").click(function () {
        if (infoCheck == true) {
            modifier();
        }
    });

})


var initCropperInModal = function(img, input, modal){
        var $image = img;
        var $inputImage = input;
        var $modal = modal;
        var options = {
            aspectRatio: 1, // 纵横比
            viewMode: 2,
            preview: '.img-preview' // 预览图的class名
        };
        // 模态框隐藏后需要保存的数据对象
        var saveData = {};
        var URL = window.URL || window.webkitURL;
        var blobURL;
        $modal.on('show.bs.modal',function () {
            // 如果打开模态框时没有选择文件就点击“打开图片”按钮
            /*if(!$inputImage.val()){
                $inputImage.click();
            }*/
        }).on('shown.bs.modal', function () {
            // 重新创建
            $image.cropper( $.extend(options, {
                ready: function () {
                    // 当剪切界面就绪后，恢复数据
                    if(saveData.canvasData){
                        $image.cropper('setCanvasData', saveData.canvasData);
                        $image.cropper('setCropBoxData', saveData.cropBoxData);
                    }
                }
            }));
        }).on('hidden.bs.modal', function () {
            // 保存相关数据
            saveData.cropBoxData = $image.cropper('getCropBoxData');
            saveData.canvasData = $image.cropper('getCanvasData');
            // 销毁并将图片保存在img标签
            $image.cropper('destroy').attr('src',blobURL);
        });
        if (URL) {
            $inputImage.change(function() {
                var files = this.files;
                var file;
                if (!$image.data('cropper')) {
                    return;
                }
                if (files && files.length) {
                    file = files[0];
                    if (/^image\/\w+$/.test(file.type)) {

                        if(blobURL) {
                            URL.revokeObjectURL(blobURL);
                        }
                        blobURL = URL.createObjectURL(file);

                        // 重置cropper，将图像替换
                        $image.cropper('reset').cropper('replace', blobURL);

                        // 选择文件后，显示和隐藏相关内容
                        $('.img-container').show();
                        $('.img-preview-box').show();
                        $('#changeModal .disabled').removeAttr('disabled').removeClass('disabled');
                        $('#changeModal .tip-info').hide();

                    } else {
                        window.alert('请选择一个图像文件！');
                    }
                }
            });
        } else {
            $inputImage.prop('disabled', true).addClass('disabled');
        }
    }


    var sendPhoto = function(){
        var photo = $('#photo').cropper('getCroppedCanvas', {
            width: 300,
            height: 300
        }).toBlob(function (blob) {
            formData=new FormData();
            formData.append('smfile',blob);
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
                            url:"https://api.ratemycourse.tk/updateUserProfilePhoto/",
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
                                    $("#user_profile_photo").prop("src",data.data.url); 
                                }
                                else{
                                    console.log(data2.errMsg);
                                    alert(data2.errMsg);
                                }
                            },
                            error: function (data2) {
                                if(data.readyState==4){
                                    window.sessionStorage.setItem('callBack',data.responseText);
                                    window.setTimeout("location.href='./callBack.html'",0);
                                }
                                else if(data.readyState==0){
                                    alert("请求发送失败，请稍后再进行尝试");
                                }
                                else{
                                    alert(JSON.stringify(data));
                                }
                                
                            }
                        });
                    }
                    else{
                        console.log(data.msg);
                    }
        
                },
                error: function (data) {
                    if(data.readyState==4){
                        window.sessionStorage.setItem('callBack',data.responseText);
                        window.setTimeout("location.href='./callBack.html'",0);
                    }
                    else if(data.readyState==0){
                        alert("请求发送失败，请稍后再进行尝试");
                    }
                    else{
                        alert(JSON.stringify(data));
                    }
                    
                }
            });
        });
    }

    $(function(){
        initCropperInModal($('#photo'),$('#photoInput'),$('#changeModal'));
    });