var course_num_per_page=5;
var score_data;
var total_page_number;
var course_num=window.sessionStorage.getItem("coursenum");
var ajax_success;


function adddiv(number){
    var x = document.createElement("div");
    x.setAttribute("class","container");
    x.setAttribute("id","course"+number);
    var course_id=window.sessionStorage.getItem("course"+number+"course_ID");

    x.innerHTML="<div class=\"row\" style=\"background:#eeeeee\">\n"+
                "  <div class=\"col-md-2  col-sm-0\"></div>\n"+
                "  <a class=\"col-md-4 col-sm-12 text-sm-center text-md-left\" href=\"#\" onclick=\"toCourse("+number+")\" style=\"text-decoration:none;font-size:40px;color:#000000; width:62%;\">"+window.sessionStorage.getItem("course"+number+"name")+"</a>\n"+
                "  <div class=\"col-md-1 col-sm-0\"></div>\n"+
                "  <div id=\"rank_number_"+number+"\" class=\"col-md-2 col-sm-12 text-md-left text-center align-self-center my-4\" style=\"font-size:24px\"></div>\n"+
                "  <div class=\"col-md-3 col-sm-0\"></div>\n"+
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
                "  <div id=\"rank_number_"+number+"\" class=\"col-md-6 text-md-left text-center align-self-center my-4\" style=\"font-size:24px\"></div>\n"+
                "</div>\n"+
                "<div class=\"row\" style=\"background:#eeeeee\">\n"+
                "  <div class=\"col-md-3 text-md-left text-center align-self-center my-4\" style=\"font-size:24px\">难度</div>\n"+
                "  <div id=\"difficulty_score_"+number+"\" class=\"col-md-3 text-md-left text-center align-self-center my-4\"></div>\n"+
                "  <div class=\"col-md-3 text-md-left text-center align-self-center my-4\" style=\"font-size:24px\">有趣程度</div>\n"+
                "  <div id=\"funny_score_"+number+"\" class=\"col-md-3 text-md-left text-center align-self-center my-4\"></div>\n"+
                "</div>\n"+
                "<div class=\"row\" style=\"background:#eeeeee\">\n"+
                "  <div class=\"col-md-3 text-md-left text-center align-self-center my-4\" style=\"font-size:24px\">课程收获</div>\n"+
                "  <div id=\"gain_score_"+number+"\" class=\"col-md-3 text-md-left text-center align-self-center my-4\"></div>\n"+
                "  <div class=\"col-md-3 text-md-left text-center align-self-center my-4\" style=\"font-size:24px\">推荐程度</div>\n"+
                "  <div id=\"recommend_score_"+number+"\" class=\"col-md-3 text-md-left text-center align-self-center my-4\"></div>\n"+
                "</div>\n"+
                "<br>\n";
    /*var a=document.getElementById("c_pagination");
    a.parentNode.insertBefore(x , a);*/
    
    //console.log("success");
    /*$.ajax({
        async: true,
        type:"GET",
        url: "http://testapi.ratemycourse.tk/getRankByCourse/",
        dataType:"json",
        data:{
          course_ID:course_id
        },
        success:function(data){
            console.log(data);
            //data=JSON.parse(data);
            if(data.status=="1"){
              raty(data.body.difficulty_score,"#difficulty_score_"+number);
              raty(data.body.funny_score,"#funny_score_"+number);
              raty(data.body.gain_score,"#gain_score_"+number);
              raty(data.body.recommend_score,"#recommend_score_"+number);
              $("#rank_number_"+number).text("评分人数"+data.length);
            }
            else{
              //alert(data.errMsg);
              console.log(course_id+" fail to get rank");
            }
            
        },
        error:function(data){
          alert(JSON.stringify(data));
        }
    });*/
    return x;
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
    //1 超出范围的页码报错
    if(pagenum > total_page_number || pagenum <= 0){
        alert("页码错误"+"***"+pagenum+"***");
        return;
    }

    //2 获得到所要开始加载的课程序号
    var course_to_show=(pagenum-1)*course_num_per_page;
    
    //3 加载页码内容,使用adddiv
    //将course_data清空
    $("#course_data").html("");
    for(var i = course_to_show;i < course_num && i < (course_to_show + course_num_per_page); i++){
        //向course_data内插入
        $("#course_data").append(adddiv(i));
    }

    //4 等待ajax获取评分完毕后加载评分
    $.when(ajax_success).done(function () {
        for(var i = course_to_show;i < course_num && i < (course_to_show + course_num_per_page); i++){
            var id=window.sessionStorage.getItem("course"+i+"course_ID");
            raty(score_data.body[id].difficulty_score,"#difficulty_score_"+i);
            raty(score_data.body[id].funny_score,"#funny_score_"+i);
            raty(score_data.body[id].gain_score,"#gain_score_"+i);
            raty(score_data.body[id].recommend_score,"#recommend_score_"+i);
            $("#rank_number_"+i).text("评分人数   "+score_data.body[id].rank_number);
        }
    });

    //5 隐藏其余的页码以及上下页
    for(var i=1;i<=total_page_number;i++){
        $("#page"+i).hide();
    }
    
    if(pagenum<=3){
        for(var i=1;i<=5 && i<=total_page_number ;i++){
            $("#page"+i).show();
        }
    }
    else if((total_page_number-pagenum)<=2){
        for(var i=total_page_number;i>total_page_number-5 && i>=1 ;i--){
            $("#page"+i).show();
        }
    }
    else{
        for(var i=pagenum-2;i<=pagenum+2 ;i++){
            $("#page"+i).show();
        }
    }

    if(pagenum>1){
      $("#lastpage").show();
    }
    else{
      $("#lastpage").hide();
    }

    if(pagenum<total_page_number){
      $("#nextpage").show();
    }
    else{
      $("#nextpage").hide();
    }
    
    //6 最后修改页码
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

    //立即请求课程的评分
    ajax_success=$.ajax({
        async: true,
        type:"GET",
        url: "http://testapi.ratemycourse.tk/getAllRank/",
        dataType:"json",
        success:function(data){
            //console.log(data);
            //data=JSON.parse(data);
            if(data.status=="1"){
                score_data=data;
                /*var i,id;
                for(i=0;i<coursenum;i++){
                    id=window.sessionStorage.getItem("course"+i+"course_ID");
                    raty(data.body[id].difficulty_score,"#difficulty_score_"+i);
                    raty(data.body[id].funny_score,"#funny_score_"+i);
                    raty(data.body[id].gain_score,"#gain_score_"+i);
                    raty(data.body[id].recommend_score,"#recommend_score_"+i);
                    $("#rank_number_"+i).text("评分人数"+data.body[id].rank_number);
                }*/
            }
            else{
              //alert(data.errMsg);
              console.log(" fail to get rank");
            }
            
        },
        error:function(data){
          alert(JSON.stringify(data));
        }
    });



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
    
    $("#noresult").hide();
    $("#jumpbutton").hide();
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


    /*for(var number=0;number<coursenum;number++){
        adddiv(number);
        if(number>5){
          document.getElementById("course"+number).style.display="none";
        }
    }*/
    
    total_page_number=Math.ceil(coursenum/course_num_per_page);
  //  console.log(total_page_number+"?????");
    $("#pagenum").html(1);
    $("#totalpage").html(total_page_number);
    if(total_page_number>1){
        $("#jump").show();
        $("#nextpage").show();
      // document.getElementById("jump").style.display="";
      // document.getElementById("nextpage").style.display="";

        //add page button
        for(var i=1;i<=total_page_number;i++){
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
    toPage(1);
})