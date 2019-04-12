
function selectTeacher(name){
  $("#buttonSelectTeacher").html(name);
  
}


$(document).ready(function() {
  //1 加载课程名称 学院
  var coursenum=parseInt(window.sessionStorage.getItem("coursetoload"));
  $("#course_name").html(window.sessionStorage.getItem("course"+coursenum+"name"));
  var teacher_list=window.sessionStorage.getItem("course"+coursenum+"teacher_list");
  //var teacher_list=["教师1","教师2","教师3","教师4"];
  var data="";
  for(var i=0; i<teacher_list.length;i++){
    data+="<li>\n"+
             "  <a class=\"dropdown-item\" herf=\"#\" onclick=\"selectTeacher($(this).text())\">"+teacher_list[i]+"</a>\n"+
             "</li>\n";
    console.log(teacher_list[i]);
    if(i!=teacher_list-1){
      data+= "<div class=\"dropdown-divider\"></div>"
    }
    $("#teacherlist").html(data);
  }


  // alert("!!!")
  // Animation settings
  /*setAnimations()

  // Form validation for Sign in / Sign up forms
  validateSignUp()
  validateSignIn()

  // Login widget set according to cookie
  setCookie()

  ////////// csrf set up //////////
  function csrfSafeMethod(method) {
      // these HTTP methods do not require CSRF protection
      return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
  }
  $.ajaxSetup({
      beforeSend: function(xhr, settings) {
          if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
              xhr.setRequestHeader("X-CSRFToken", $.cookie("csrftoken"));
          }
      }
  });
  /////////////////////////////////*/
})

function Func_submit() {
  /*if($.cookie('username') == undefined){
    alert("提交评价前请先登录")
    return false
  }*/

  if($("#comment").val().length < 10){
    alert("评价内容至少需要10字")
	   return false
  }
  else if($("#comment").val().length > 2048){
    alert("评价内容不能多于2048字")
	   return false
  }
  var coursenum=parseInt(window.sessionStorage.getItem("coursetoload"));
  console.log(window.sessionStorage.getItem("course"+coursenum+"course_ID")+" "+$("#comment").val()+" "+$("#buttonSelectTeacher").text());
  var teacher=$("#buttonSelectTeacher").text();
  console.log(teacher);
  $.ajax({
      type: "POST",
      dataType: "json",
      url: "http://127.0.0.1:8000/makeComment/",
      data: {
        'username': "xmw7874",
        'course_ID': "60",
        'content' : $("#comment").val(),
        'teacher_name' : $("#buttonSelectTeacher").text()
      },
      success:function(data){
        //	alert("ajax success");
        console.log(data);
        //console.log(data.status)
        if(data.status=="1"){
            //alert(data.body.message);
            console.log("Successfully makeComment "+coursenum);
            
        }
        else{
            alert(data.errMsg);
        }  
      },
      error:function(data){
          alert(JSON.stringify(data));
      }
    });
  
}
