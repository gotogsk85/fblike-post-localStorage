angular.module("zoomcarToDo",[])
	.controller("mainCtrl",function($scope){
		console.log("inside to do ctrl");
		$scope.todo={};
		$scope.todo.uname = localStorage.getItem("loggedInUserName");
		$scope.todo.logout = function(){
			localStorage.removeItem("loggedInUserName");
			location.href = location.href.replace("todolist.html","zoomcar.html");
		}
	})
	.directive("wentWell",function($compile){
		return{
			restrict:"E",
			scope:{},
			templateUrl : "wentWell.html",
			transclude:true,
			link:function(s,e,a){
				angular.element(document.getElementById('wentWellInput')).bind("keypress",function(e){
					if(e.which == 13){
						var value = s.wentWell;
						angular.element(document.getElementById('wentWellArea'))
						.append($compile("<div class='todoItem wentWell' data-value='"+value+"' edit-value><span class='show'>"+value+"</span><input key-press-update class='hide inputText'  type='text' value='"+value+"' /><a href='javascript:void(0)' class='delete' remove-me>delete</a></div>")(s))						
						s.hideinput=true;
						s.wentWell="";
						s.$digest();
					}
				});	
			},
			controller:function(){

			}
		}
	})	
	.directive("improvement",function($compile){
		return{
			restrict:"E",
			scope:{},
			templateUrl : "improvement.html",
			transclude:true,
			link:function(s,e,a){
				angular.element(document.getElementById('improvementInput')).bind("keypress",function(e){
					if(e.which == 13){
						var value = s.improved;
						angular.element(document.getElementById('improvedArea'))
						.append($compile("<div class='todoItem improvements' data-value='"+value+"' edit-value><span class='show'>"+value+"</span><input key-press-update class='hide inputText'  type='text' value='"+value+"' /><a href='javascript:void(0)' class='delete' remove-me>delete</a></div>")(s));												
						s.hideinput=true;
						s.improved = "";
						s.$digest();
					}
				});					
			},
			controller:function(){		
			}
		}
	})	
	.directive("greatIdeas",function($compile){
		return{
			restrict:"E",
			scope:{},
			transclude:true,
			templateUrl : "greatIdeas.html",
			link:function(s,e,a){
				angular.element(document.getElementById('brilliantIdeaInput')).bind("keypress",function(e){
					if(e.which == 13){
						var value = s.brilliantIdea;
						angular.element(document.getElementById('greatIdeasArea'))
						.append($compile("<div edit-value class='todoItem greatIdeas' data-value='"+value+"'><span class='show'>"+value+"</span><input key-press-update class='hide inputText' type='text' value='"+value+"' /><a href='javascript:void(0)' class='delete' remove-me>delete</a></div>")(s));																		
						s.hideinput=true;
						s.brilliantIdea = "";
						s.$digest();
					}
				});					
			},
			controller:function($scope){				
			}
		}
	})
	.directive("editValue",function(){
		return {
			scope:{},
			link: function(s,e,a){
				e.bind("dblclick",function(){
					e.find("input").removeClass("hide");
					e.find("span").addClass("hide");
					s.$digest();
				})			
			},
			controller:function($scope,$element){				
				
				this.updateSpanVal = function(newVal){					
					$element.find("span").text(newVal).removeClass("hide")					
					console.log(newVal);
				}
				
				this.removeItem = function(){
					$element.remove();
				}
			}
		}
	})
	.directive("removeMe",function(){
		return{
			require:"^editValue",
			link:function(s,e,a,c){				
				e.bind("click",function(e){
					c.removeItem();
				})
			}
		}
	})
	.directive("keyPressUpdate",function(){
		return {
			require:"^editValue",
			link: function(s,e,a,c){
				e.bind("keypress",function(e){
					if(e.which == 13){					
						var updatedValue = e.currentTarget.value;
						angular.element(e.currentTarget).addClass("hide").val(updatedValue);
						//angular.element(e.currentTarget).prev().removeClass("hide").text(updatedValue);
						c.updateSpanVal(updatedValue);
						s.$digest();
					}
				})			
			},
			controller:function($scope){				
				$scope.updateValue = function(e){
					if(e.which==13){
						alert(e.value);
					}
				}
			}
		}
	});
	