//cookies
function setCookie(cname,cvalue,exdays)
{
  var d = new Date();
  d.setTime(d.getTime()+(exdays*24*60*60*1000));
  var expires = "expires="+d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires + ";path=/";
}

  function getCookie(cname)
{
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) 
  {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
  return "";
}

function selectSchool(a) {
  document.getElementById("buttonSelectSchool").innerText=a;
}

function selectMajor(a) {
  document.getElementById("buttonSelectMajor").innerText=a;
}

function addcourse(id){
  $.ajax({
      type:"POST",
      url: "http://127.0.0.1:8000/addCourse/",
      dataType:"json",
      data:{              
          name:"数学"+id,
          website:""+id,
          course_ID:""+id,
          description:"计算机组成原理"+id,
          course_type:"计算机科学与技术"+(id),
          credit:"4"
      },
      success:function(data){
        //	alert("ajax success");
          console.log(data);
          console.log(data.status)
          if(data.status=="1"){
              //alert(data.body.message);
              var a=1;
          }
          else{
            console.log(data.errMsg);
          }
          //window.setTimeout("location.href='./login.html'", 1200);
      },
      error:function(data){
        alert(JSON.stringify(data));
      }
  });
}

function addteachcourse(id){


  /*$.ajax({
    type:"POST",
    url: "http://127.0.0.1:8000/addTeacher/",
    dataType:"json",
    data:{ 
        name:"教师1",
        title:"教授"
    },
    success:function(data){
      //	alert("ajax success");
        console.log(data);
        console.log(data.status)
        if(data.status=="1"){
            //alert(data.body.message);
            var a=1;
        }
        else{
          console.log(data.errMsg);
        }
        //window.setTimeout("location.href='./login.html'", 1200);
    },
    error:function(data){
      alert(JSON.stringify(data));
    }
});*/


  $.ajax({
      type:"POST",
      url: "http://127.0.0.1:8000/addTeachCourse/",
      dataType:"json",
      data:{ 
          teacher_list:["老师1"],             
          course:"数学"+id,
          department:"计算机学院"
      },
      success:function(data){
        //	alert("ajax success");
          console.log(data);
          console.log(data.status)
          if(data.status=="1"){
              //alert(data.body.message);
              var a=1;
          }
          else{
            console.log(data.errMsg);
          }
          //window.setTimeout("location.href='./login.html'", 1200);
      },
      error:function(data){
        alert(JSON.stringify(data));
      }
  });
}


function storedata(data){
//  setCookie("coursenum",data.length,0);
  window.sessionStorage.setItem("coursenum",data.length);
  for (var i=0;i<data.length;i++){
      /*setCookie("course"+i+"name",data.body[i].name,1);
      setCookie("course"+i+"website",data.body[i].website,1);
      setCookie("course"+i+"course_ID",data.body[i].course_ID,1);
      setCookie("course"+i+"course_type",data.body[i].course_type,1);
      setCookie("course"+i+"description",data.body[i].description,1);
      setCookie("course"+i+"credit",data.body[i].credit,1);
      console.log(getCookie("course"+i+"description"));
      console.log("course"+i+"description   "+data.body[i].description);
      setCookie("username","WTF???",365);
      console.log(getCookie("username"));
      var x=document.cookie;
      console.log(x);*/
      console.log("test DOM storage");
      if (window.sessionStorage) { 
          window.sessionStorage.setItem("course"+i+"name",data.body[i].name);
          window.sessionStorage.setItem("course"+i+"website",data.body[i].website);
          window.sessionStorage.setItem("course"+i+"course_ID",data.body[i].course_ID);
          window.sessionStorage.setItem("course"+i+"course_type",data.body[i].course_type);
          window.sessionStorage.setItem("course"+i+"description",data.body[i].description);
          window.sessionStorage.setItem("course"+i+"credit",data.body[i].credit);
          window.sessionStorage.setItem("course"+i+"teacher_list",data.body[i].teacherlist);
          console.log(window.sessionStorage.getItem("course"+i+"website"));
          console.log("1111111"+window.sessionStorage.getItem("course"+i+"teacher_list"))
      }
  }
}

$(document).ready(function(){
  function search(){

      $.ajax({
            type:"GET",
            url: "http://127.0.0.1:8000/searchCourse/",
            dataType:"json",
            data:{              
                course_name: $("#searchboxCourse").val(),
            },
            success:function(data){
              //	alert("ajax success");
                console.log(data);
                //console.log(data.status)
                if(data.status=="1"){
                    //alert(data.body.message);
                    console.log("Successfully searched");
                    storedata(data);
                    window.setTimeout("location.href='./searchResult.html'",100000);
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
      else if (event.keyCode == 114) {
        //F3 to add  teach course
        
          addteachcourse(60);
    }
  });
});