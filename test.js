(function(){
	
	var latestUserId = localStorage.getItem("currentUserId"),
		loggedInUserId = localStorage.getItem("loggedInUserId"),
		userId = latestUserId == null ? 0 :  latestUserId*1,
		loggedInUserObj = null;

	function _showRegForm(){
		$(".registration-screen").removeClass("hide").addClass("show");
		$(".login-screen").removeClass("show").addClass("hide");	
		$(".user-post-screen").removeClass("show").addClass("hide");	
	}

	function _showLoginForm(){
		$(".registration-screen").removeClass("show").addClass("hide");
		$(".login-screen").removeClass("hide").addClass("show");				
		$(".user-post-screen").removeClass("show").addClass("hide");	
	}

	function _checkForUsers(){

		var userData = localStorage.getItem("users");
		if(!userData) {
			_showRegForm();			
		}

	}

	function _registerUserCb(e){
		userId = userId + 1;
		var regForm = $(".registration-form"),
			newUserId = userId,
			userObj = {
				loginStatus: false,
				email: regForm.find("#reg-email").val(),
				password: regForm.find("#reg-email").val(),
				userPost: [],
				hisFriends: []
			}
		var userLocalStorageObj = JSON.parse(localStorage.getItem("users"));
		if(userLocalStorageObj == null) userLocalStorageObj = {};
		userLocalStorageObj[newUserId] = userObj;
		localStorage.setItem("users",JSON.stringify(userLocalStorageObj));
		localStorage.setItem("currentUserId",userId);
		alert("registration done !");
		_showLoginForm();
	}

	function _loginUserCb(){
		var loginForm = $(".login-form"),
			emailId = loginForm.find("#email").val(),
			pwd = loginForm.find("#pwd").val();
			userObj = JSON.parse(localStorage.getItem("users")),
			match = 0, loggedInUserId = 0;
		for(var c in userObj){
			if(userObj[c].email == emailId && userObj[c].password == pwd) {
				userObj[c].loginStatus = true;
				loggedInUserObj = userObj[c];
				loggedInUserId = c;
				match = 1;
				break;
			}
		}	
		if(match == 1){
			$(".registration-screen").removeClass("show").addClass("hide");
			$(".login-screen").removeClass("show").addClass("hide");	
			var userData = JSON.parse(localStorage.getItem("users"));
			userData[loggedInUserId] = loggedInUserObj;
			localStorage.setItem("users", JSON.stringify(userData));
			localStorage.setItem("loggedInUserId", loggedInUserId);
			$(".user-post-screen").removeClass("hide").addClass("show");
			_showUserPage();
		}else{
			_showLoginForm();
		}
	}

	function _showCurrentUsersPosts(){
		var userObj = JSON.parse(localStorage.getItem("users")),
			postHTML = "",
			userPosts = userObj[loggedInUserId].userPost;
		if(userPosts.length > 0)	$(".current-users-posts-area") .removeClass("hide").addClass("show");
		else $(".current-users-posts-area") .removeClass("show").addClass("hide");
		for(var c = userPosts.length - 1; c >= 0 ; c--){
			var timer = "<div class='pull-right timer'>"+userPosts[c].timer+"</div>";
			postHTML += "<div class='your-posts' id='"+loggedInUserId+"-"+c+"-user-post'>"+userPosts[c].name+timer+"</div>" ;			
		}
		$("#current-users-posts").html(postHTML);		
	}

	function _showFriendsPosts(){
		var userObj = JSON.parse(localStorage.getItem("users")),
			friendsArray = loggedInUserObj.hisFriends,
			postHTML = "";			
		for(var c = 0; c < friendsArray.length; c++){
			var id = friendsArray[c];
				posts = userObj[id].userPost,
				friendName = userObj[id].email;
			for(var d = posts.length - 1; d >= 0; d--){
				var postedFriendsName = "<h4>"+friendName+"</h4>",
					post = "<div>"+posts[d].name+"</div>",
					timer = "<div class='pull-right timer'>"+posts[d].timer+"</div>";
				postHTML += "<div class='friend-posts' id='"+id+"-"+d+"-user-post'>"+timer+postedFriendsName+post+"</div>" ;
			}
		}
		$("#friends-posts-area").html(postHTML);
	}

	function _showPostMessages(){
		_showCurrentUsersPosts();
		_showFriendsPosts();		
	}

	function _showUserPage(){
		$(".registration-screen").removeClass("show").addClass("hide");
		$(".login-screen").removeClass("show").addClass("hide");
		$(".user-post-screen").removeClass("hide").addClass("show");
		var userObj = JSON.parse(localStorage.getItem("users"));
		loggedInUserObj = userObj[loggedInUserId];
		console.log(loggedInUserObj);
		$("#loggedin-user-email").html(loggedInUserObj.email);		
		_addFriends();	
		_showPostMessages();
	}	

	function _addFriends(){
		var userObj = JSON.parse(localStorage.getItem("users")),
		finalHTML = "";
		for(var c in userObj){
			if(userObj[loggedInUserId].hisFriends.indexOf(c) == -1 && c != loggedInUserId){
				finalHTML += "<span class='friend-suggesstion' data-userid='"+c+"' title='Add "+userObj[c].email+" as your friend'>Email : "+ userObj[c].email +"</span>";	
			}
		}
		$("#add-friends-area").html(finalHTML);
	}

	function _addThisFriend(e){
		var friendId = $(this).attr("data-userid"),
			userObj = JSON.parse(localStorage.getItem("users"));
		loggedInUserObj.hisFriends.push(friendId);		
		userObj[friendId].hisFriends.push(loggedInUserId);
		userObj[loggedInUserId] = loggedInUserObj;
		localStorage.setItem("users",JSON.stringify(userObj));
		console.log(JSON.parse(localStorage.getItem("users")));
		$(this).remove();
		alert("friend added !");
		_showFriendsPosts();
	}

	function _postComment(e){
		var userObj = JSON.parse(localStorage.getItem("users")),
			postObj = {
				name: $("#post-form").find("#user-post").val(),
				timer: "Just Now",
				timerNum: 0
			},
			currentUserObj = userObj[loggedInUserId],
			userPosts = userObj[loggedInUserId].userPost;
		
		userPosts.push(postObj);			
		localStorage.setItem("users", JSON.stringify(userObj));
		var userPostIndex = userPosts.length - 1;

		setInterval((function(loggedInUserId, userPostIndex){
			var userObj = JSON.parse(localStorage.getItem("users"));
			var count = userObj[loggedInUserId].userPost[userPostIndex].timerNum;
			return function(){
				count = count + 1;
				var userObj = JSON.parse(localStorage.getItem("users"));
				userObj[loggedInUserId].userPost[userPostIndex].timer = count + " min ago" ;
				localStorage.setItem("users",JSON.stringify(userObj));
				_showPostMessages();
			}
		}(loggedInUserId, userPostIndex)),60000)		

		alert("you posted !");
		_showCurrentUsersPosts();
	}

	function _logoutCurrentUser(){
		var loggedInUserId = localStorage.getItem("loggedInUserId"),
			userObj = JSON.parse(localStorage.getItem("users"));
		userObj[loggedInUserId].loginStatus = false;
		localStorage.setItem("users",JSON.stringify(userObj));
		localStorage.setItem("loggedInUserId", null);
		_showLoginForm();
	}

	$("body").on("click","#register",_registerUserCb);
	$("body").on("click",".showRegForm",_showRegForm);
	$("body").on("click","#loginUser",_loginUserCb);
	$("body").on("click",".friend-suggesstion", _addThisFriend)
	$("body").on("click","#post", _postComment)
	$("body").on("click","#logout", _logoutCurrentUser)	

	if(!loggedInUserId)
		_checkForUsers();
	else {
		_showUserPage();
	}

}())
