
//暂时不知道拿来干嘛的
function feedback(node){
    var text = $(node).parent().next().next().text();
    var textarea=$(node).parents("ul").find(".texta");
    textarea.val("").focus().val("@"+text); 
  }

//加载评论
function generateGrid(imageUrls, userName, iTerm, iTeacher, iTotal, text, time, commentid, cnum, snum) {
    var ScreenGridHtml = `
        <div>   
            <p>
        </div>
            
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
        commentGrid.id = commentid;
        commentGrid.innerHTML = ScreenGridHtml;
        //insert user image and name
        //暂时没有用户头像

        var pTags = commentGrid.getElementsByTagName("p");
        var userNameNode = document.createTextNode(userName);
        pTags[0].appendChild(userNameNode);
        pTags[0].setAttribute("class", "userName col-md-4");

        // insert information
        var term = document.createTextNode("学期");
        var teacher = document.createTextNode("上课老师");
        var total = document.createTextNode("总评");
        var vTerm = document.createTextNode(iTerm);
        var vTeacher = document.createTextNode(iTeacher);
        var vTotal = document.createTextNode(iTotal.toFixed(1));
        //这些东西暂时都没有 就不显示了


        //insert text
        pTags[1].innerHTML = text;
        pTags[1].setAttribute("style", "margin-top:16px;margin-left:16px;text-align:left; width:70%")
        //inset time
        var timenode = document.createTextNode(time);
        pTags[2].appendChild(timenode);
        pTags[2].setAttribute("style", "float:left;text-align:left;margin-top:16px")

       

        //css
        var divTags = commentGrid.getElementsByTagName("div");
        //divTags[0].setAttribute("class", "row text-center col-md-1");
        divTags[1].setAttribute("class", "row text-center");
        divTags[2].setAttribute("class", "text-center");
        //divTags[0].setAttribute("style", "width:100%;border-bottom:1px #e4e4e4 solid;");
        //divTags[3].setAttribute("style", "width:100%;border-bottom:1px #e4e4e4 solid;margin-bottom:16px");
       // var tableTag = commentGrid.getElementsByTagName("table");
       // tableTag[0].setAttribute("style", "width:70%; margin-top:8px;border-bottom:1px #e4e4e4 solid");
        
        /*var a=document.getElementById("locationid");
        a.parentNode.insertBefore(commentGrid , a);*/
        console.log("successfully establish comment");

        return commentGrid;

        
}


function testAddComment(){
    window.setTimeout("location.href='./commentPage.html'", 0);
    /*$.ajax({
        type:"POST",
        url: "http://127.0.0.1:8000/makeComment/",
        dataType:"json",
        data:{              
            username:"xmw7874",
            course_ID:60,
            content: "非常棒 啊啊啊啊"
        },
        success:function(data){
            //	alert("ajax success");
            console.log(data);
            //console.log(data.status)
            if(data.status=="1"){
                //alert(data.body.message);
                console.log("Successfully add comment of course id 60 ");
                
            }
            else{
                alert(data.errMsg);
            }
            
        },
        error:function(data){
            alert(JSON.stringify(data));
        }
    });*/
}



//获得评论
function setComments() {//get comments list from service
    if($.cookie('username') == undefined){
        $.ajax('/getComment', {
            dataType: 'json',
            data: {
                'course_number': window.location.pathname.split('/')[2]
            },
        }).done(function(data){
            var imgurl = "../../static/ratemycourse/images/user.png";
            var parents = document.getElementById("commentDiv");
            var child = parents.children;
            if(child.length!=0){
               $("#commentDiv").empty();
            }
            for(var i=0; i<data.comments.length; i++){
                //generate a new row
                var cmt = data.comments[i]
                var Grid = generateGrid(imgurl, cmt.userName, cmt.iTerm, cmt.iTeacher, cmt.iTotal, cmt.text, cmt.time, cmt.iId, cmt.cnum, cmt.snum);
                //insert this new row
                parents.appendChild(Grid);
            }
        })
    }else{
        $.ajax('/getComment', {
            dataType: 'json',
            data: {
                'course_number': window.location.pathname.split('/')[2],
                'username': $.cookie('username'),
            },
        }).done(function(data){
            var imgurl = "../../static/ratemycourse/images/user.png";
            var parents = document.getElementById("commentDiv");
            var child = parents.children;
            if(child.length!=0){
               $("#commentDiv").empty();
            }
            for(var i=0; i<data.comments.length; i++){
                //generate a new row
                var cmt = data.comments[i]
                var Grid = generateGrid(imgurl, cmt.userName, cmt.iTerm, cmt.iTeacher, cmt.iTotal, cmt.text, cmt.time, cmt.iId, cmt.cnum, cmt.snum);
                //insert this new row
                parents.appendChild(Grid);
                //show delete
                if(cmt.isSelf==1){
                    Grid.getElementsByClassName('delete')[0].style.display='block';
                    Grid.getElementsByClassName('change')[0].style.display='block';
                }
                if(cmt.support==1) Grid.getElementsByClassName('good')[0].setAttribute("class", "goodclick");
            }
        })
    }

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
        url: "http://127.0.0.1:8000/getCommentsByCourse/",
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
                for(var i=0;i<data.length;i++){
                    var x=generateGrid("#",data.body[i].username,"#","#",0,data.body[i].content,data.body[i].editTime,data.body[i].commentID,0,0);
                    var a=document.getElementById("locationid");
                    a.parentNode.insertBefore(x , a);
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
