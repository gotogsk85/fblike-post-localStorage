/* For DB simulation using local storage instead of $http service */
angular.module("zoomcarAssignment",[])
	.constant("initLocalStorageDBValsConst",{
		"details":[{uname:"abc",email:"abc@gmail.com",pwd:"12"},
				  {uname:"abcd",email:"abcd@gmail.com",pwd:"23"},
				  {uname:"abce",email:"abce@gmail.com",pwd:"34"}]
	})
	.service("storageSvc",function(initLocalStorageDBValsConst){
		this.insertWhenEmpty = function(){
			var users = localStorage.getItem("users");
			if(!users){
				localStorage.setItem("users",JSON.stringify(initLocalStorageDBValsConst.details));
			}					
		}
		this.registerData = function(dataObj){			
			var usersLocal = JSON.parse(localStorage.getItem("users"));
			usersLocal.push(dataObj);
			localStorage.setItem("users",JSON.stringify(usersLocal));
		}
		this.loginData = function(dataObj){
			var users = JSON.parse(localStorage.getItem("users"));
			for(var c=0,l=users.length;c<l;c++){
				if((dataObj["username"] == users[c]["uname"])&&(dataObj["password"] == users[c]["pwd"]))				
					return true;
			}		
			return false;
		}
	})
	.controller("mainCtrl",["$scope","storageSvc",function($scope,storageSvc){
		storageSvc.insertWhenEmpty();
		console.log("inside controller !");
		$scope.zoomcar = {};		
		//$scope.zoomcar.login = {};
		$scope.zoomcar.loginForm = true;
		
		$scope.zoomcar.setLoginRegisterForm = function(){						
			$scope.zoomcar.loginForm = !$scope.zoomcar.loginForm;
		}
		
	}])
	.directive("loginForm",function(storageSvc){
		return {
			restrict : "E",
			templateUrl:"login.html",
			scope : {},
			link:function(s,e,a){
				s.zoomcar ={};
				s.zoomcar.login={};
				s.zoomcar.loginStatus = true;				
			},
			controller:function($scope){							
				$scope.loginSubmit = function(valid){
					if(valid){															
						var postData = $scope.zoomcar.login;						
						$scope.zoomcar.loginStatus = storageSvc.loginData(postData);						
						// have not used routes since i am running this from my local: without any server				
						if($scope.zoomcar.loginStatus){
							localStorage.setItem("loggedInUserName",postData.username);
							location.href = location.href.replace("zoomcar.html","todolist.html");
						}
					}					
				};
			}
		}		
	})
	.directive("registerForm",function(storageSvc){
		return {
			restrict : "E",
			templateUrl:"register.html",
			scope : {
				func: "&"
			},
			controller:function($scope){
				$scope.zoomcar = {};
				$scope.zoomcar.register = {};
				$scope.zoomcar.registerStatus = {
					isEmailRegistered:false,
					isUsernameAvailable:false
				};			

				$scope.registerUser = function(valid,func){
					if(valid){
						var postData = $scope.zoomcar.register;
						storageSvc.registerData(postData);
						func();
					}
				}	
			}
		}		
	})	
	.directive("validateEmail",function(){
		return{			
			require:"ngModel",
			link:function(s,e,a,modelCtrl){
				modelCtrl.$validators.validateEmail = function(modelValue,viewValue){					
					var emailPat = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
					return emailPat.test(viewValue);
					
				}
			}
		}		
	});