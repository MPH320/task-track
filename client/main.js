import { Lists } from '../imports/collections.js';
import { Tasks } from '../imports/collections.js';
import { Positions } from '../imports/collections.js';
import '../imports/listTemplate.js';

var currentIndex = 0;



Template.list.onRendered(function () {
	
	var toDrag;
	
	dragging = false;
//	var offsetVal = 0;
//	var inc = 100;
//	
//	offsetVal+=inc;
			
			
	var moveDiv = this.find('.single-list');
	var listID = this.data._id;
	//console.log(this.data._id)
	
	var posId; 

	if (!Meteor.user()) 
	{
		posId = Positions.findOne({list: listID, owner: "public" });
	} else{
		posId = Positions.findOne({list: listID, owner: Meteor.userId() });
	}
	
	moveDiv = $(moveDiv);
	

	if(posId){
		pos = posId.pos;
		moveDiv.offset({left:pos["x"], top:pos["y"]})
	} 
	
	var count = 0;

	$("body").on("touchmove", function(e) {
		
		var touch = e.originalEvent.touches[0];
		
		$(".test").html("<p>"+touch.pageX+"</p>");
		alert(touch);
    
		if(dragging){
			$(".test").html("<p> hi "+touch.clientX+"</p>");
			alert(count);
			alert(touch.clientX);
			count++;

			toDrag.offset({left:touch.clientX, top:touch.clientY})

			Session.set( "currentListPos", { "x": touch.clientX, "y": touch.clientY} );

		}
		
	});
	
	
onmousemove = function(e){
	
//	$(".test").html("<p>"+e.clientX+"</p>");
	
	if(dragging){

		toDrag.offset({left:e.clientX, top:e.clientY})
		
		Session.set( "currentListPos", { "x": e.clientX, "y": e.clientY} );
			
	}

}

$( "body" ).bind('mouseup touchend', function() {
//	console.log("end");
//	alert("end");
  if(dragging) {
		
		dragging = !dragging;
		toDrag.css("color", "black");
		
	} 
});

	
  	$( ".draggable" )

  .bind('mousedown touchstart', function() {
//			console.log("start");
//			alert("start");
			//console.log($(this).offset());
			
			//$(".draggable").css("color", "gray");
			
    	if(!dragging) dragging = !dragging;
			toDrag = $(this).parent()
		
//			console.log(toDrag);
			toDrag.css("color", "gray");
  });
	
	
	});

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});



Template.body.helpers({
	lists() {
   
		if (Meteor.user()) 
		{
			
			if(Meteor.user().profile){
				return Lists.find( { owners: Meteor.user().profile.name } );
			} else {
				return Lists.find( { owners: Meteor.user().username } );
			}
		} else { return Lists.find( { owners: "public" } ) }

	},
});


Template.body.events({
  'submit .new-list'(event) {
    // Prevent default browser form submit
    event.preventDefault();
		
		var ownersArray = [];
		//console.log(Meteor.userId());
		
		var theId = Meteor.userId();
		
		if (!Meteor.user()) 
		{
			ownersArray = ["public"];
			theId = "public";
			
		} else if(Meteor.user().profile){
			ownersArray = [Meteor.user().profile.name];
		} else {
			ownersArray = [Meteor.user().username];
		}
		
 		var divPos = { "x": 15, "y": 100};
    // Get value from form element
    const target = event.target;
    const name = target.name.value;
 		var taskArray = [];
    // Insert a task into the collection
   	var newId = Lists.insert({
      name,
      createdAt: new Date(),
			expanded: false,
			tasks: taskArray,
			owners: ownersArray,
    });
		
		if (!Meteor.user()) 
		{
			theId = "public";
		} 
		
		Positions.insert({ list: newId, owner: theId, pos: divPos, expanded: false });
	
		//Meteor.users.update(userId, {$set: {newId: divPos});

//		var url = 'http://example.com/kittens.jpg';
//		Meteor.users.update(userId, {$set: {'profile.photo': url});
 
    // Clear form
    target.name.value = '';
  },
});

Template.task.events({
  'click .toggle-checked'() {

    Tasks.update(this._id, {
      $set: { completed: ! this.completed },
    });
  },
  'click .delete'() {
    Tasks.remove(this._id);
  },
});

Template.task.helpers({
	isCompleted() {
		return this.completed;
  },
	dueOn() {
		var dayWrapper = moment(this.due);
		return "Due " + dayWrapper.fromNow();
  }
});
