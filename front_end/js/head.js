function jumpLogin(){
  //var tmp = window.sessionStorage.getItem("status");
  window.location.href = "./login.html";
  
}

function jumpSignUp(){
  window.location.href = "./signUp.html";
}

function jumpPersonalInfo(){
  window.location.href = "./personalinfo.html";
}

function jumpLogOut(){
  window.sessionStorage.clear();
  window.location.href = "./login.html"
}