
//暂时不知道拿来干嘛的
function feedback(node){
    var text = $(node).parent().next().next().text();
    var textarea=$(node).parents("ul").find(".texta");
    textarea.val("").focus().val("@"+text); 
  }

//加载评论
function generateGrid(number,imageUrls, userName, iTerm, iTeacher, iTotal, text, time, commentid, cnum, snum) {
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
        commentGrid.id = number;
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

       

        //css
        var divTags = commentGrid.getElementsByTagName("div");
        //divTags[0].setAttribute("class", "row text-center col-md-1");
        divTags[1].setAttribute("class", "row text-center");
        divTags[2].setAttribute("class", "text-center");
        //divTags[0].setAttribute("style", "width:100%;border-bottom:1px #e4e4e4 solid;");
        //divTags[3].setAttribute("style", "width:100%;border-bottom:1px #e4e4e4 solid;margin-bottom:16px");
        var tableTag = commentGrid.getElementsByTagName("table");
        tableTag[0].setAttribute("style", "width:50%; margin-top:2px;border-bottom:1px #e4e4e4 solid");
        
        /*var a=document.getElementById("locationid");
        a.parentNode.insertBefore(commentGrid , a);*/
        console.log("successfully establish comment");

        return commentGrid;

        
}


function testAddComment(){
    window.setTimeout("location.href='./commentPage.html'", 0);
}


function toPage(pagenum){
    
    var coursetoshow=(pagenum-1)*5;
    var coursenum=window.sessionStorage.getItem("coursenum")
    var totalpagenumber=$("#totalpage").html();
    console.log(totalpagenumber+" "+pagenum);
    if(pagenum>totalpagenumber || pagenum<=0){
      alert("页码错误"+"***"+pagenum+"***");
      return;
    }

    for(var i=0;i<coursenum;i++){
        $("#"+i).hide();
    }
    for(var i=coursetoshow;i<coursenum && i<coursetoshow+5;i++){
        $("#"+i).show();
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
    //console.log("pagenum before last"+pagenum);
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




$(document).ready(function () {
    //generateGrid("#", "aya", "2016", "ruan", 20, "good", "2018", "1", "1", "2");
    if (window.sessionStorage.getItem("status")== "1"){
        document.getElementById("signIn").style.display = "none";
        document.getElementById("signUp").style.display = "none";
        document.getElementById("personalInfo").style.display = "block"
      }

    //1 从sessonStorage获取课程信息
    var coursenum=parseInt(window.sessionStorage.getItem("coursetoload"));
    console.log("now in "+coursenum);
    console.log("course ID "+window.sessionStorage.getItem("course"+coursenum+"course_ID"));
    $("#course_name").html(window.sessionStorage.getItem("course"+coursenum+"name"));
    $("#course_credit").html(window.sessionStorage.getItem("course"+coursenum+"credit"));
    $("#course_type").html(window.sessionStorage.getItem("course"+coursenum+"course_type"));
    $("#course_school").html("计算机学院");
    $("#coursedescription").html(window.sessionStorage.getItem("course"+coursenum+"description"))
    //2 获取评论信息
    $.ajax({
        type:"GET",
        url: "https://api.ratemycourse.tk/getCommentsByCourse/",
        dataType:"json",
        data:{              
            course_ID: window.sessionStorage.getItem("course"+coursenum+"course_ID"),
        },
        success:function(data){
            //	alert("ajax success");
            console.log(data);
            //console.log(data.status)
            if(data.status=="1"){
                //alert(data.body.message);
                console.log("Successfully get comment of id "+coursenum);
                if(data.length==0){
                    $("#noresult").show();
                    $("#jumpbutton").hide();
                }
                else{
                    $("#noresult").hide();
                    $("#jumpbutton").show();
                    for(var i=0;i<data.length;i++){
                        var x=generateGrid(i,"#",data.body[i].username,"#",data.body[i].teacher,0,data.body[i].content,data.body[i].editTime,data.body[i].commentID,0,0);
                        var a=document.getElementById("locationid");
                        a.parentNode.insertBefore(x , a);
                        if(i>=5){
                            $("#"+i).hide();
                        }
                    }
                    var totalpagenumber=Math.ceil(data.length/5);
                    console.log(totalpagenumber+"?????");
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
                            console.log("add page");
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
                        console.log("add page");
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


})
