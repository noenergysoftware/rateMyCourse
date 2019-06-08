function jumpLogin(){
  //var tmp = window.sessionStorage.getItem("status");
  window.location.href = "./login.html";
  
}

function jumpSignUp(){
  window.location.href = "./signup.html";
}

function jumpPersonalInfo(){
  window.sessionStorage.setItem("username",$.cookie("username"));
  window.location.href = "./personalinfo.html";
}

function jumpLogOut(){
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
  $.ajax({
    async: false,
    type:"POST",
    url: "https://api.ratemycourse.tk/logout/",
    dataType:"json",
    data:{
      username: $.cookie("username"),
      csrfmiddlewaretoken:  $.cookie("csrftoken")
    },
    xhrFields: {
      withCredentials: true
    },
    success:function(data){
      //data=JSON.parse(data);
      //console.log("status "+data.status);
      if (data.status > 0 ){
          $.cookie("username",undefined);
          $.removeCookie("username",{ path: '/'});
          alert("注销成功");
          window.setTimeout("location.href='./index.html'", 500);
      }
      else{
        $.cookie("username",undefined);
        $.removeCookie("username",{ path: '/'});
        alert("注销成功");
        window.setTimeout("location.href='./index.html'", 500);
        //alert("注销失败");
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