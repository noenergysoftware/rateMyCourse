var comment_num_per_page=5;
var total_page_number;


//加载评论
function generateGrid(number,imageUrls, userName, iTerm, iTeacher, iTotal, text, time, comment_ID, cnum, hot) {
    //获取评论的评价-->点赞数目
    var thumb_up_num;
    var ajax_success=$.ajax({
        async: true,
        type:"GET",
        url: "http://testapi.ratemycourse.tk/getRateComment/",
        dataType:"json",
        data:{              
            comment_ID: comment_ID
        },
        success:function(data){
            console.log(data);
            //data=JSON.parse(data);
            if(data.status=="1"){
                thumb_up_num=data.body.rate;
                console.log(comment_ID+"thumv_up_num"+thumb_up_num);
            }
            else{
              //alert(data.errMsg);
              console.log(" fail to get thumb_up_num");
            }
            
        },
        error:function(data){
          alert(JSON.stringify(data));
        }
    });

    

    var ScreenGridHtml = `
        <div>   
            <p>
        </div>
        <table>
            <tr>
                <td><p></td>
                <td><p></td>
            </tr>
        <table>
        <div>
            <p>
        </div>
        <div>
            <a>
            <a>
            <a>
            <a>
            <a>
            <p>
        </div>
        `;

        // create div
        var commentGrid = document.createElement("div");
        commentGrid.setAttribute("class", "card col-md-12");
        commentGrid.setAttribute("style","margin-top:8px");
        if(hot==1){
            commentGrid.id = "hot_comment_"+number;
        }
        else{
            commentGrid.id = "comment_"+number;
        }
        commentGrid.innerHTML = ScreenGridHtml;
        //insert user image and name
        //暂时没有用户头像

        var pTags = commentGrid.getElementsByTagName("p");
        var userNameNode = document.createTextNode(userName);
        pTags[0].appendChild(userNameNode);
        pTags[0].setAttribute("class", "userName col-md-4");

        // insert information
        var term = document.createTextNode("学期");
        var teacher = document.createTextNode("教师");
        var total = document.createTextNode("总评");
        var vTerm = document.createTextNode(iTerm);
        var vTeacher = document.createTextNode(iTeacher);
        var vTotal = document.createTextNode(iTotal.toFixed(1));
        //这些东西暂时都没有 就不显示了
        pTags[1].appendChild(teacher);
        pTags[2].appendChild(vTeacher);

        //insert text
        pTags[3].innerHTML = text;
        pTags[3].setAttribute("style", "margin-top:16px;margin-left:16px;text-align:left; width:70%")
        //inset time
        var timenode = document.createTextNode(time);
        pTags[4].appendChild(timenode);
        pTags[4].setAttribute("style", "float:left;text-align:left;margin-top:16px")

        var aTags =  commentGrid.getElementsByTagName("a");
        //显示点赞数目和踩的数目
        var agree_node = document.createElement("i");
        agree_node.setAttribute("class", "fa fa-thumbs-o-up");
        agree_node.setAttribute("onclick", "thumbUp(\"agree\","+comment_ID+",this)");
        aTags[0].appendChild(agree_node);
        
        aTags[0].appendChild(document.createTextNode(" "));
        var num_node = document.createElement("nobr");
        
        aTags[0].appendChild(num_node);
        aTags[0].appendChild(document.createTextNode(" "));

        var disagree_node = document.createElement("i");
        disagree_node.setAttribute("class", "fa fa-thumbs-o-down");
        disagree_node.setAttribute("onclick", "thumbUp(\"disagree\","+comment_ID+",this)");
        aTags[0].appendChild(disagree_node);


        //css
        var divTags = commentGrid.getElementsByTagName("div");
       
        divTags[1].setAttribute("class", "row text-center");
        divTags[2].setAttribute("class", "text-center");
        
        var tableTag = commentGrid.getElementsByTagName("table");
        tableTag[0].setAttribute("style", "width:50%; margin-top:2px;border-bottom:1px #e4e4e4 solid");
     
     //   console.log("successfully establish comment");
        
        $.when(ajax_success).done(function () {
            $(num_node).text(thumb_up_num);
        });

        return commentGrid;

       
}

//点赞
function thumbUp(attitude, comment_ID, node){
    if ($.cookie("username") == undefined){
        alert("请登录后再进行点赞或踩");
        return;
    }
    
    $.ajax({
        async: true,
        type:"POST",
        url: "http://testapi.ratemycourse.tk/rateComment/",
        dataType:"json",
        data:{
            username: $.cookie("username"),            
            comment_ID: comment_ID,
            type: attitude,
            csrfmiddlewaretoken:  $.cookie("csrftoken")
        },
        xhrFields: {
            withCredentials: true
        },
        success:function(data){
            console.log(data);
            //message类型 评价评论成功,已取消赞同评论,反对评论成功,已取消反对评论,赞同评论成功
            //data=JSON.parse(data);
            if(data.status=="1"){
                //成功点赞或者点踩
                if(data.body.message == "评价评论成功" || data.body.message == "赞同评论成功" || data.body.message == "反对评论成功" ){
                    console.log(data.body.message);
                    if(attitude=="agree"){
                        //点赞
                        $(node).animate({
                            fontSize:'+=8px'
                        },"fast");
                        $(node).animate({
                            fontSize:'-=8px'
                        },"fast");
                        $(node).removeClass("fa-thumbs-o-up");
                        $(node).addClass("fa-thumbs-up");
                        var thumb_up_num=parseInt($(node).parent().children("nobr").text());
                        //console.log(thumb_up_num);
                        $(node).parent().children("nobr").text(thumb_up_num+1);
                    }
                    else{
                        $(node).animate({
                            fontSize:'+=8px'
                        },"fast");
                        $(node).animate({
                            fontSize:'-=8px'
                        },"fast");
                        $(node).removeClass("fa-thumbs-o-down");
                        $(node).addClass("fa-thumbs-down");
                        var thumb_up_num=parseInt($(node).parent().children("nobr").text());
                        //console.log(thumb_up_num);
                        $(node).parent().children("nobr").text(thumb_up_num-1);
                    }
                }
                else if(data.body.message=="已取消赞同评论"){
                    console.log(data.body.message);
                    $(node).removeClass("fa-thumbs-up");
                    $(node).addClass("fa-thumbs-o-up");
                    var thumb_up_num=parseInt($(node).parent().children("nobr").text());
                    //console.log(thumb_up_num);
                    $(node).parent().children("nobr").text(thumb_up_num-1);
                }
                else if(data.body.message=="已取消反对评论"){
                    console.log(data.body.message);
                    $(node).removeClass("fa-thumbs-down");
                    $(node).addClass("fa-thumbs-o-down");
                    var thumb_up_num=parseInt($(node).parent().children("nobr").text());
                    //console.log(thumb_up_num);
                    $(node).parent().children("nobr").text(thumb_up_num+1);
                }
                else if(data.body.message=="已赞同评论"){
                    //直接将反对变成赞同
                    console.log(data.body.message);
                    var i_tags =  node.parentNode.getElementsByTagName("i");
                    $(i_tags[1]).removeClass("fa-thumbs-down");
                    $(i_tags[1]).addClass("fa-thumbs-o-down");
                    $(i_tags[0]).animate({
                        fontSize:'+=8px'
                    },"fast");
                    $(i_tags[0]).animate({
                        fontSize:'-=8px'
                    },"fast");
                    $(i_tags[0]).removeClass("fa-thumbs-o-up");
                    $(i_tags[0]).addClass("fa-thumbs-up");
                    $(node).removeClass("fa-thumbs-up");
                    $(node).addClass("fa-thumbs-o-up");
                    var thumb_up_num=parseInt($(node).parent().children("nobr").text());
                    //console.log(thumb_up_num);
                    $(node).parent().children("nobr").text(thumb_up_num+2);
                }
                else if(data.body.message=="已反对评论"){
                    //直接将赞同变为反对
                    console.log(data.body.message);
                    var i_tags =  node.parentNode.getElementsByTagName("i");
                    $(i_tags[0]).removeClass("fa-thumbs-up");
                    $(i_tags[0]).addClass("fa-thumbs-o-up");
                    $(i_tags[1]).animate({
                        fontSize:'+=8px'
                    },"fast");
                    $(i_tags[1]).animate({
                        fontSize:'-=8px'
                    },"fast");
                    $(i_tags[1]).removeClass("fa-thumbs-o-down");
                    $(i_tags[1]).addClass("fa-thumbs-down");
                    var thumb_up_num=parseInt($(node).parent().children("nobr").text());
                    //console.log(thumb_up_num);
                    $(node).parent().children("nobr").text(thumb_up_num-2);
                }
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

//热评
function hotComment(course_id, comment_data){
    //1 获得热评
    console.log("comment_data");
    console.log(comment_data);
    $.ajax({
        async: true,
        type:"GET",
        url: "http://testapi.ratemycourse.tk/getHotComment/",
        dataType:"json",
        data:{              
            course_ID: course_id
        },
        success:function(data){
            console.log(data);
            if(data.status=="1"){
                if(data.length==0){
                    $("#no_hot_comment").show();
                }
                else{
                    var i;
                    for(i=0;i<data.length;i++){
                        $("#hot_comment").append(generateGrid(i,"#", data.body[i].username, "#", data.body[i].teacher, 0, data.body[i].content, data.body[i].editTime, data.body[i].commentID, 0, 1));
                    }
                }
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

function AddComment(){
    window.setTimeout("location.href='./commentPage.html'", 0);
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


    //2 获取保存的data数据以及需要加载的评论序号
    var data = JSON.parse(window.sessionStorage.getItem("comment_data"));
    var comment_to_show=(pagenum-1)*comment_num_per_page;
    var comment_num=window.sessionStorage.getItem("comment_num");

    //3 开始加载 generateGrid
    $("#comment").html("");//请空
    for(var i = comment_to_show; i < comment_num && i < (comment_to_show + comment_num_per_page); i++){
        //console.log(data.body[i]);
        $("#comment").append(generateGrid(i,"#", data.body[i].username, "#", data.body[i].teacher, 0, data.body[i].content, data.body[i].editTime, data.body[i].commentID, 0, 0));
    }

    //4 隐藏其余的页码以及上下页
    for(var i=1;i<=total_page_nmber;i++){
        $("#page"+i).hide();
    }
    
    if(pagenum<=3){
        for(var i=1;i<=5 && i<=total_page_nmber ;i++){
            $("#page"+i).show();
        }
    }
    else if((total_page_nmber-pagenum)<=2){
        for(var i=total_page_nmber;i>total_page_nmber-5 && i>=1 ;i--){
            $("#page"+i).show();
        }
    }
    else{
        for(var i=pagenum-2;i<=pagenum+2 ;i++){
            $("#page"+i).show();
        }
    }
    //console.log("pagenum before last"+pagenum);
    if(pagenum>1){
      $("#lastpage").show();
    }
    else{
      $("#lastpage").hide();
    }

    if(pagenum<total_page_nmber){
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




$(document).ready(function () {
    $.ajax({
        async: true,
        type: "GET",
        url: "http://testapi.ratemycourse.tk/getToken/",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
           $.cookie("csrftoken",data.token);
        },
        error: function (data) {
            console.log(JSON.stringify(data));
            alert(JSON.stringify(data));
        }
      });
    
    //generateGrid("#", "aya", "2016", "ruan", 20, "good", "2018", "1", "1", "2");
    if ($.cookie("username") != undefined){
        document.getElementById("signIn").style.display = "none";
        document.getElementById("signUp").style.display = "none";
        document.getElementById("personalInfo").style.display = "block";
        document.getElementById("logOut").style.display = "block"
      }

    

    //1 从sessonStorage获取课程信息
    var coursenum=parseInt(window.sessionStorage.getItem("coursetoload"));
    //console.log("now in "+coursenum);
    //console.log("course ID "+window.sessionStorage.getItem("course"+coursenum+"course_ID"));
    $("#course_name").html(window.sessionStorage.getItem("course"+coursenum+"name"));
    $("#course_credit").html(window.sessionStorage.getItem("course"+coursenum+"credit"));
    $("#course_type").html(window.sessionStorage.getItem("course"+coursenum+"course_type"));
    $("#course_school").html(window.sessionStorage.getItem("course"+coursenum+"department"));
    $("#coursedescription").html(window.sessionStorage.getItem("course"+coursenum+"description"))
    
    //显示评分
    var course_id=window.sessionStorage.getItem("course"+coursenum+"course_ID");

    

    $.ajax({
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
              raty(data.body.difficulty_score,"#difficulty_score");
              raty(data.body.funny_score,"#funny_score");
              raty(data.body.gain_score,"#gain_score");
              raty(data.body.recommend_score,"#recommend_score");
              $("#rank_number").text("评分人数   "+data.length);
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


    //2 获取评论信息
    $.ajax({
        async: true,
        type:"GET",
        url: "http://testapi.ratemycourse.tk/getCommentsByCourse/",
        dataType:"json",
        data:{              
            course_ID: window.sessionStorage.getItem("course"+coursenum+"course_ID")
        },
        success:function(data){
            //data=JSON.parse(data);
            //	alert("ajax success");
           // console.log(data);
            //console.log(data.status)
            if(data.status=="1"){
                //alert(data.body.message);
                //console.log("Successfully get comment of id "+coursenum);
                if(data.length==0){
                    $("#noresult").show();
                    $("#jumpbutton").hide();
                }
                else{
                    $("#noresult").hide();
                    $("#jumpbutton").show();
                    window.sessionStorage.setItem("comment_num",data.length);
                    window.sessionStorage.setItem("comment_data",JSON.stringify(data));
                    /*for(var i=0;i<data.length;i++){
                        var x=generateGrid(i,"#",data.body[i].username,"#",data.body[i].teacher,0,data.body[i].content,data.body[i].editTime,data.body[i].commentID,0,0);
                        var a=document.getElementById("locationid");
                        a.parentNode.insertBefore(x , a);
                        if(i>=5){
                            $("#"+i).hide();
                        }
                    }*/
                    
                    total_page_nmber=Math.ceil(data.length/comment_num_per_page);
                    console.log(data.length+" "+total_page_nmber+"?????");

                    $("#pagenum").html(1);
                    $("#totalpage").html(total_page_nmber);
                    if(total_page_nmber>1){
                        $("#jump").show();
                        $("#nextpage").show();
                        //生成页码跳转按钮W
                        for(var i=1;i<=total_page_nmber;i++){
                            var x = document.createElement("li");
                            x.setAttribute("class","page-item");
                            x.setAttribute("id","page"+i);
                            x.innerHTML="<a class=\"page-link\" onclick=\"toPage("+i+")\" href=\"#\">"+i+"</a>";
                            
                            var a=document.getElementById("nextpage");
                            a.parentNode.insertBefore(x , a);
                            // console.log("add page");
                            if(i>5){
                            //console.log("hide");
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

                    //生成热评
                    hotComment(course_id,data);

                    toPage(1);
                }
            }
            else{
                alert(data.errMsg);
            }
            
        },
        error:function(data){
            alert(JSON.stringify(data));
        }
    });


    


})
