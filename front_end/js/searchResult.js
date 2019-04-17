function adddiv(number){
    var x = document.createElement("div");
    x.setAttribute("class","container");
    x.setAttribute("id","course"+number);
    var course_id=window.sessionStorage.getItem("course"+number+"course_ID");

    x.innerHTML="<div class=\"row\" style=\"background:#eeeeee\">\n"+
                "  <a href=\"#\" onclick=\"toCourse("+number+")\" style=\"text-decoration:none;font-size:30px;color:#000000; width:62%;\">"+window.sessionStorage.getItem("course"+number+"name")+"</a>\n"+
                "</div>\n"+
                "<div class=\"row\" style=\"background:#eeeeee\">\n"+
                "  <div class=\"col-md-3 text-md-left text-center align-self-center my-4\"> 学校\n"+
                "    <p>"+"北京航空航天大学"+"</p>\n"+
                "  </div>\n"+
                "  <div class=\"col-md-3 text-md-left text-center align-self-center my-4\"> 学院\n"+
                "    <p>"+window.sessionStorage.getItem("course"+number+"department")+"</p>\n"+
                "  </div>\n"+
                "  <div class=\"col-md-3 text-md-left text-center align-self-center my-4\"> 类型\n"+
                "    <p>"+window.sessionStorage.getItem("course"+number+"course_type")+"</p>\n"+
                "  </div>\n"+
                "  <div class=\"col-md-3 text-md-left text-center align-self-center my-4\"> 学分\n"+
                "    <p>"+window.sessionStorage.getItem("course"+number+"credit")+"</p>\n"+
                "  </div>\n"+
                "</div>\n"+
                "<div class=\"row\" style=\"background:#eeeeee\">\n"+
                "  <div class=\"col-md-3 text-md-left text-center align-self-center my-4\" style=\"font-size:24px\">难度</div>\n"+
                "  <div id=\"diffculty_score\" class=\"col-md-3 text-md-left text-center align-self-center my-4\"></div>\n"+
                "  <div class=\"col-md-3 text-md-left text-center align-self-center my-4\" style=\"font-size:24px\">有趣程度</div>\n"+
                "  <div id=\"funny_score\" class=\"col-md-3 text-md-left text-center align-self-center my-4\"></div>\n"+
                "</div>\n"+
                "<div class=\"row\" style=\"background:#eeeeee\">\n"+
                "  <div class=\"col-md-3 text-md-left text-center align-self-center my-4\" style=\"font-size:24px\">课程收获</div>\n"+
                "  <div id=\"gain_score\" class=\"col-md-3 text-md-left text-center align-self-center my-4\"></div>\n"+
                "  <div class=\"col-md-3 text-md-left text-center align-self-center my-4\" style=\"font-size:24px\">推荐程度</div>\n"+
                "  <div id=\"recommend_score\" class=\"col-md-3 text-md-left text-center align-self-center my-4\"></div>\n"+
                "</div>\n"+
                "<br>\n";
    var a=document.getElementById("c_pagination");
    a.parentNode.insertBefore(x , a);
    //console.log("success");
    $.ajax({
        type:"GET",
        url: "https://api.ratemycourse.tk/getRankByCourse/",
        dataType:"json",
        data:{
          course_ID:course_id
        },
        success:function(data){
            if(data.status=="1"){
              raty(data.body.rank_dict.diffculty_score,"#diffculty_score");
              raty(data.body.rank_dict.funny_score,"#funny_score");
              raty(data.body.rank_dict.gain_score,"#gain_score");
              raty(data.body.rank_dict.recommend_score,"#recommend_score");
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

function raty(number,id){
  $(id).raty({
    score:number,
    starOn:"./resource/star-on.png",
    starOff:"./resource/star-off.png",
    starHalf:"./resource/star-half.png",
    readOnly:true,
    halfShow:true,
    size:34,
 })
}


function toPage(pagenum){
    var coursetoshow=(pagenum-1)*5;
    var coursenum=window.sessionStorage.getItem("coursenum")
    var totalpagenumber=Math.ceil(coursenum/5);;
 // console.log(totalpagenumber+" "+pagenum);
    if(pagenum>totalpagenumber || pagenum<=0){
      alert("页码错误"+"***"+pagenum+"***");
      return;
    }

    for(var i=0;i<coursenum;i++){
        $("#course"+i).hide();
    }
    for(var i=coursetoshow;i<coursenum && i<coursetoshow+5;i++){
        $("#course"+i).show();
    }

    for(var i=1;i<=totalpagenumber;i++){
        $("#page"+i).hide();
    }
    
    if(pagenum<=3){
        for(var i=1;i<=5 && i<=totalpagenumber ;i++){
            $("#page"+i).show();
        }
    }
    else if((totalpagenumber-pagenum)<=2){
        for(var i=totalpagenumber;i>totalpagenumber-5 && i>=1 ;i--){
            $("#page"+i).show();
        }
    }
    else{
        for(var i=pagenum-2;i<=pagenum+2 ;i++){
            $("#page"+i).show();
        }
    }
   // console.log("pagenum before last"+pagenum);
    if(pagenum>1){
   
      $("#lastpage").show();
     
    }
    else{
      $("#lastpage").hide();
    }

    if(pagenum<totalpagenumber){
      $("#nextpage").show();
    }
    else{
      
      $("#nextpage").hide();
    }
    
    $("#pagenum").html(pagenum);

}


function jumpPage(){
    toPage($("#jumpPage").val());
}

function nextPage(){
    toPage(parseInt($("#pagenum").text())+1);
}
function lastPage(){
    toPage(parseInt($("#pagenum").text())-1);
}

function toCourse(number){
   // console.log("to course"+number);
    window.sessionStorage.setItem("coursetoload",number);
    //console.log("to course"+number);
    window.setTimeout("location.href='./coursePage.html'", 0);

}

$(document).ready(function(){

    if ($.cookie("username") != undefined){
        document.getElementById("signIn").style.display = "none";
        document.getElementById("signUp").style.display = "none";
        document.getElementById("personalInfo").style.display = "block";
        document.getElementById("logOut").style.display = "block"
      }
    // alert("!!!")
    // Form validation for Sign in / Sign up forms
    var coursenum=window.sessionStorage.getItem("coursenum");
    
    $("#serachedCourseNum").html(coursenum);
    
    //console.log("coursenum!!!"+coursenum);
    if(coursenum==0 || coursenum==null){
      $("#noresult").show();
      $("#jumpbutton").hide();
      $("#serachedCourseNum").html(0);
      return ;
    }
    $("#noresult").hide();
    $("#jumpbutton").show();
    //test to gen div
    //console.log(233333);


    for(var number=0;number<coursenum;number++){
        adddiv(number);
        if(number>5){
          document.getElementById("course"+number).style.display="none";
        }
    }
    
    var totalpagenumber=Math.ceil(coursenum/5);
  //  console.log(totalpagenumber+"?????");
    $("#pagenum").html(1);
    $("#totalpage").html(totalpagenumber);
    if(totalpagenumber>1){
        $("#jump").show();
        $("#nextpage").show();
      // document.getElementById("jump").style.display="";
      // document.getElementById("nextpage").style.display="";

        //add page button
        for(var i=1;i<=totalpagenumber;i++){
            var x = document.createElement("li");
            x.setAttribute("class","page-item");
            x.setAttribute("id","page"+i);
            x.innerHTML="<a class=\"page-link\" onclick=\"toPage("+i+")\" href=\"#\">"+i+"</a>";
            
            var a=document.getElementById("nextpage");
            a.parentNode.insertBefore(x , a);
          //  console.log("add page");
            if(i>5){
              console.log("hide");
              $("#page"+i).hide();
            }
        }
    }
    else{
      //$("#nextpage").show();
        var x = document.createElement("li");
        x.setAttribute("class","page-item");
        x.setAttribute("id","page"+i);
        x.innerHTML="<a class=\"page-link\" onclick=\"toPage(1)\" href=\"#\">1</a>";
        var a=document.getElementById("nextpage");
        a.parentNode.insertBefore(x , a);
       // console.log("add page");
    }
})