var Captcha=false;
var Res;
window.callback = function(res){
		//console.log(res)
		// res（用户主动关闭验证码）= {ret: 2, ticket: null}
		// res（验证成功） = {ret: 0, ticket: "String", randstr: "String"}
		if(res.ret === 0){
				//alert(res.ticket)   // 票据
				Captcha=true;
				$("#TencentCaptcha").text("人机验证通过");
				$("#TencentCaptcha").attr("disabled","disabled"); 
				Res=res;
		}
}

$(document).ready(function(){
				
				var IP=returnCitySN["cip"];
				console.log(IP);
				

				function register(){
						console.log(Res.ticket);
						console.log(Res.randstr);
						$.ajax({
								async: false,
								type:"POST",
								url: "http://testapi.ratemycourse.tk/signUp/",
								dataType:"json",
								data:{              
										username: $("#name").val(),
										mail: $("#email").val(),
										password: md5($("#passwd").val()),
										IP:IP,
										Ticket: Res.ticket,
										Randstr: Res.randstr
								},
								xhrFields: {
										withCredentials: true
								},
								success:function(data){
										//data=JSON.parse(data);
									//	alert("ajax success");
										console.log(data);
										console.log(data.status)
										if(data.status=="1"){
												alert(data.body.message);
												window.setTimeout("location.href='./login.html'", 1000);
										}
										else{
											alert(data.errMsg);
											Captcha=false;
											$("#TencentCaptcha").text("人机验证");
											$("#TencentCaptcha").attr("disabled",""); 
										}
										
								},
								error:function(data){
									alert(JSON.stringify(data));
								}
						});
				}
				$("#tos").click(function(){
						if(check(Captcha)==true){
							register();
						}
        });
				
				$("html").keydown(function (event) {
            //13 = enter
            if (event.keyCode == 13) {
								if(check(Captcha)==true){
										register();
								}
            }
        });

    });
function check(check_Captcha){
		var errmsg="";

		var name=$("#name").val();
		console.log(name);
		var uPattern = /^[a-zA-Z0-9_]{3,16}$/;
		var check_name=uPattern.test(name);
		console.log(check_name);

		if(check_name==false){
				errmsg=errmsg+"用户名格式错误\n";
		}

		var email=$("#email").val();
		console.log(email);
		var ePattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		var check_email=ePattern.test(email)
		console.log(check_email);

		if(check_email==false){
				errmsg=errmsg+"邮箱格式错误\n";
		}
		
		var password=$("#passwd").val();
		var repassword=$("#repasswd").val();
		console.log(password);
		console.log(repassword);
		var pdPattern = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}$/;
		var check_password=pdPattern.test(password);
		console.log(check_password);

		if(check_password==false){
			errmsg=errmsg+"密码格式错误\n";
		}
		
		if(password!=repassword){
			errmsg=errmsg+"两次密码不一致\n";
			check_password=false;
		}

		if(check_Captcha==false){
			errmsg=errmsg+"人机验证未通过\n";
		}

		if( check_name==false || check_email==false || check_password==false || check_Captcha==false){
			alert(errmsg);
			return false;
		}
		return true;
	}