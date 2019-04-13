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
  window.sessionStorage.clear();
  window.location.href = "https://ratemycourse.tk/login.html"
}