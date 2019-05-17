var course_num_per_page=5;
var score_data;
var total_page_number;
var course_num=window.sessionStorage.getItem("coursenum");;
var ajax_success;
var page_dot = document.createElement("li");
page_dot.setAttribute("class","page-item");
page_dot.setAttribute("id","page_dot");
page_dot.setAttribute("style","display:none");
page_dot.innerHTML="<a class=\"page-link\" href=\"#c_pagination\">...</a>";

var page_dot2 = document.createElement("li");
page_dot2.setAttribute("class","page-item");
page_dot2.setAttribute("id","page_dot2");
page_dot2.setAttribute("style","display:none");
page_dot2.innerHTML="<a class=\"page-link\" href=\"#c_pagination\">...</a>";

var current_page=1;

function adddiv(number){
    var x = document.createElement("div");
    x.setAttribute("class","container");
    x.setAttribute("id","course"+number);
    /*添加一个类命为让css识别添加不同背景 */
    if(number%2 == 1){
      //x.setAttribute("class", "background1");
      x.addClass("backround1");
    }
    else {
      //x.setAttribute("class", "background2");
      x.addClass("background2");
    }
    var course_id=window.sessionStorage.getItem("course"+number+"course_ID");

    x.innerHTML="<div class=\"row\" >\n"+
                "  <div class=\"col-md-2  col-0\"></div>\n"+
                "  <a class=\"col-md-4 col-12 align-self-center text-center text-md-left\" href=\"#\" onclick=\"toCourse("+number+")\" style=\"text-decoration:none\">"+window.sessionStorage.getItem("course"+number+"name")+"</a>\n"+
                "  <div class=\"col-md-1 col-0\"></div>\n"+
                "  <div id=\"rank_number_"+number+"\" class=\"col-md-3 col-12 text-md-left text-center align-self-center \" ></div>\n"+
                "  <div class=\"col-md-2 col-0\"></div>\n"+
                "</div>\n"+
                "<div class=\"row\" >\n"+
                "  <div class=\"col-md-6\" >\n"+
                "    <div class=\"row\" >\n"+
                "      <div class=\"col-md-4 col-4 text-md-center text-center align-self-center\"> 学校</div>\n"+
                "      <div class=\"col-md-8 col-8 text-md-center text-center align-self-center\">"+"北京航空航天大学"+"</div>\n"+
                "    </div>\n"+
                "    <div class=\"row\" >\n"+
                "      <div class=\"col-md-4 col-4 text-md-center text-center align-self-center\"> 学院</div>\n"+
                "      <div class=\"col-md-8 col-8 text-md-center text-center align-self-center\">"+window.sessionStorage.getItem("course"+number+"department")+"</div>\n"+
                "    </div>\n"+
                "    <div class=\"row\" >\n"+
                "      <div class=\"col-md-4 col-4 text-md-center text-center align-self-center\"> 类型</div>\n"+
                "      <div class=\"col-md-8 col-8 text-md-center text-center align-self-center\">"+window.sessionStorage.getItem("course"+number+"course_type")+"</div>\n"+
                "    </div>\n"+
                "    <div class=\"row\" >\n"+
                "      <div class=\"col-md-4 col-4 text-md-center text-center align-self-center\"> 学分</div>\n"+
                "      <div class=\"col-md-8 col-8 text-md-center text-center align-self-center\">"+window.sessionStorage.getItem("course"+number+"credit")+"</div>\n"+
                "    </div>\n"+
                "  </div>\n"+
                "  <div class=\"col-md-6\" >\n"+
                "    <div class=\"row\" >\n"+
                "      <div class=\"col-md-4 col-4 text-md-center text-center align-self-center\" > 推荐程度</div>\n"+
                "      <div class=\"col-md-8 col-8 text-md-center text-center align-self-center\" id=\"recommend_score_"+number+"\" ></div>\n"+
                "    </div>\n"+
                "    <div class=\"row\" >\n"+
                "      <div class=\"col-md-4 col-4 text-md-center text-center align-self-center\"> 课程难度</div>\n"+
                "      <div class=\"col-md-8 col-8 text-md-center text-center align-self-center\" id=\"difficulty_score_"+number+"\" ></div>\n"+
                "    </div>\n"+
                "    <div class=\"row\" >\n"+
                "      <div class=\"col-md-4 col-4 text-md-center text-center align-self-center\"> 课程收获</div>\n"+
                "      <div class=\"col-md-8 col-8 text-md-center text-center align-self-center\" id=\"gain_score_"+number+"\" ></div>\n"+
                "    </div>\n"+
                "    <div class=\"row\" >\n"+
                "      <div class=\"col-md-4 col-4 text-md-center text-center align-self-center\"> 有趣程度</div>\n"+
                "      <div class=\"col-md-8 col-8 text-md-center text-center align-self-center\" id=\"funny_score_"+number+"\" ></div>\n"+
                "    </div>\n"+
                "  </div>\n"+
                "</div>\n";
    /*var a=document.getElementById("c_pagination");
    a.parentNode.insertBefore(x , a);*/
    
    //console.log("success");
    $.ajax({
        async: true,
        type:"GET",
        url: "https://api.ratemycourse.tk/getRankByCourse/",
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
    });
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
    current_page=pagenum;

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
    
    $("#page_dot").hide();
    $("#page_dot2").hide();
    if(pagenum <= 4){
        if(total_page_number<=6){
            for(var i=1; i<=total_page_number ;i++){
              $("#page"+i).show();
            }
        }
        else{
            for(var i=1; i<=5 ;i++){
                $("#page"+i).show();
            }
            $("#page_dot2").show();
            $("#page"+total_page_number).show();
        }
    }
    else if(pagenum >= (total_page_number-3)){
        if(total_page_number<=6){
            for(var i=1; i<=total_page_number ;i++){
              $("#page"+i).show();
            }
        }
        else{
            for(var i=total_page_number; i>total_page_number-5; i--){
                $("#page"+i).show();
            }
            $("#page_dot").show();
            $("#page1").show();
        }
    }
    else{
        //此时 n>=9
        for(var i=pagenum-2;i<=pagenum+2 ;i++){
            $("#page"+i).show();
        }
        $("#page_dot").show();
        $("#page1").show();
        $("#page_dot2").show();
        $("#page"+total_page_number).show();
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
    toPage(current_page+1);
}
function lastPage(){
    toPage(current_page-1);
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
        url: "https://api.ratemycourse.tk/getAllRank/",
        dataType:"json",
        success:function(data){
            //console.log(data);
            //data=JSON.parse(data);
            if(data.status=="1"){
                score_data=data;
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

    if(window.screen.width<768){
      $("#c_pagination").addClass("pagination-sm");  
    }

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
    //$("#jumpbutton").hide();
    //console.log("coursenum!!!"+coursenum);
    if(coursenum==0 || coursenum==null){
      $("#noresult").show();
      //$("#jumpbutton").hide();
      $("#serachedCourseNum").html(0);
      return ;
    }
    $("#noresult").hide();
    //$("#jumpbutton").show();
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
        if(total_page_number>=7){
          var a=document.getElementById("page2");
          a.parentNode.insertBefore(page_dot , a);
          var b=document.getElementById("page"+total_page_number);
          b.parentNode.insertBefore(page_dot2 , b);
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