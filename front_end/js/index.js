

function selectSchool(a) {
  document.getElementById("buttonSelectSchool").innerText=a;
}

function selectDepartment(a) {
  document.getElementById("buttonSelectDepartment").innerText=a;
}


function storedata(data){
//  setCookie("coursenum",data.length,0);
  window.sessionStorage.setItem("coursenum",data.length);
  for (var i=0;i<data.length;i++){
      
      //console.log("test DOM storage");
      if (window.sessionStorage) { 
          window.sessionStorage.setItem("course"+i+"name",data.body[i].name);
          window.sessionStorage.setItem("course"+i+"website",data.body[i].website);
          window.sessionStorage.setItem("course"+i+"course_ID",data.body[i].course_ID);
          window.sessionStorage.setItem("course"+i+"course_type",data.body[i].course_type);
          window.sessionStorage.setItem("course"+i+"description",data.body[i].description);
          window.sessionStorage.setItem("course"+i+"credit",data.body[i].credit);
          window.sessionStorage.setItem("course"+i+"department",data.body[i].department);
          //console.log(data.body[i].teacher_list);
          window.sessionStorage.setItem("course"+i+"teacher_list",data.body[i].teacher_list);
          //console.log(window.sessionStorage.getItem("course"+i+"website"));
          //console.log("1111111"+window.sessionStorage.getItem("course"+i+"teacher_list"))
          
      }
  }
}







$(document).ready(function(){
  
  if ($.cookie("username") != undefined){
    document.getElementById("signIn").style.display = "none";
    document.getElementById("signUp").style.display = "none";
    document.getElementById("personalInfo").style.display = "block";
    document.getElementById("logOut").style.display = "block";
  } 

  $.ajax({
      async: false,
      type:"GET",
      url: "http://testapi.ratemycourse.tk/getDepartment/",
      dataType:"json",
      success:function(data){
        //data=JSON.parse(data);
        //	alert("ajax success");
          //console.log(data);
          //console.log(data.status)
          if(data.status=="1"){
              //alert(data.body.message);
              var data2="<li>\n"+
                        "  <a class=\"dropdown-item\" herf=\"#\" onclick=\"selectDepartment($(this).text())\">"+"选择学院"+"</a>\n"+
                        "</li>\n"+
                        "<div class=\"dropdown-divider\"></div>";
              for(var i=0; i<data.body.length;i++){
                data2+="<li>\n"+
                        "  <a class=\"dropdown-item\" herf=\"#\" onclick=\"selectDepartment($(this).text())\">"+data.body[i].name+"</a>\n"+
                        "</li>\n";
                //console.log(data.body[i]);
                if(i<(data.body.length-1)){
                  data2+= "<div class=\"dropdown-divider\"></div>";
                }
                $("#departments").html(data2);
              }
          }
          else{
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


  function search(){
      
      var department=$("#buttonSelectDepartment").text();

      if (department=="选择学院"){
        //没有选择学院
          $.ajax({
              async: false,
              type:"GET",
              url: "http://testapi.ratemycourse.tk/searchCourse/",
              dataType:"json",
              data:{              
                  course_name: $("#searchboxCourse").val()
              },
              success:function(data){
                //data=JSON.parse(data);
                //	alert("ajax success");
                 // console.log(data);
                  //console.log(data.status)
                  if(data.status=="1"){
                      //alert(data.body.message);
                      //console.log("Successfully searched");
                      storedata(data);
                      window.setTimeout("location.href='./searchResult.html'",0);
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
      else{
        //选择了学院
          $.ajax({
              async: false,
              type:"GET",
              url: "http://testapi.ratemycourse.tk/searchCourseByDepartment/",
              dataType:"json",
              data:{              
                  course_name: $("#searchboxCourse").val(),
                  department: $("#buttonSelectDepartment").text()
              },
              success:function(data){
                //data=JSON.parse(data);
                //	alert("ajax success");
                 // console.log(data);
                  //console.log(data.status)
                  if(data.status=="1"){
                      //alert(data.body.message);
                     // console.log("Successfully searched");
                      storedata(data);
                      window.setTimeout("location.href='./searchResult.html'",0);
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

      
  }
  $("#buttonSearchCourse").click(function(){
      search();
  });
  $("html").keydown(function (event) {
      if (event.keyCode == 13) {
          //enter to search
          search();
      }
      else if (event.keyCode == 113) {
          //F2 to add course
          for(var id=60;id<80;id++)
            addcourse(id);
      }
      
  });
});