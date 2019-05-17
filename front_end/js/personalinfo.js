
var gender;
var role;
var formData;
function infoCheck() {
    var errmsg = "";
    var result = true;

    /*var name = $("#username").val();
    var uPattern = /^[a-zA-Z0-9_]{3,16}$/;
    var check_name=uPattern.test(name);
    console.log(check_name);

    if(check_name==false){
            errmsg=errmsg+"用户名格式错误\n";
            result=false;
    }*/

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
        url: "https://api.ratemycourse.tk/getUserDetail/",
        data:{
            username:$.cookie("username")
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

    console.log($("#name").text()+"**"+role+"**"+gender+"**"+$("#personalIntroduce").val());
    $.ajax({
        async: true,
        type: "POST",
        url: "https://api.ratemycourse.tk/updateUser/",
        dataType: "text",
        data: {
            username: $("#name").text(),
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
        url: "https://api.ratemycourse.tk/getToken/",
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
            width: 100,
            height: 100
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
        });
    }

    $(function(){
        initCropperInModal($('#photo'),$('#photoInput'),$('#changeModal'));
    });