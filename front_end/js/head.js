function jumpLogin(){
  //var tmp = window.sessionStorage.getItem("status");
  window.location.href = "https://ratemycourse.tk/login.html";
  
}

function jumpSignUp(){
  window.location.href = "https://ratemycourse.tk/signup.html";
}

function jumpPersonalInfo(){
  window.location.href = "https://ratemycourse.tk/personalinfo.html";
}

function jumpLogOut(){
  
  $.ajax({
    type:"POST",
    url: "https://api.ratemycourse.tk/logout/",
    dataType:"json",
    data:{
      username: $.cookie("username")
    },
    xhrFields: {
      withCredentials: true
    },
    success:function(data){
      //console.log("status "+data.status);
      if (data.status > 0 ){
          $.cookie("username",undefined);
          $.removeCookie("username",{ path: '/'});
          alert("注销成功");
          window.setTimeout("location.href='./index.html'", 500);
      }
      else{
        alert("注销失败");
      }
    },
    error:function(data){
      alert("注销失败");
    }
  });
  
}