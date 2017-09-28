import { Lists } from '../imports/collections.js';
import { Tasks } from '../imports/collections.js';
import { Positions } from '../imports/collections.js';
import '../imports/listTemplate.js';

var currentIndex = 0;



Template.list.onRendered(function () {
	
	var toDrag;
	
	dragging = false;
			
	var moveDiv = this.find('.single-list');
	var listID = this.data._id;
	
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
//		console.log(pos.x);
//		console.log(pos.y);
		moveDiv.offset({left:pos["x"], top:pos["y"]})
	}
	
//	var count = 0;

	$("body").on("touchmove", function(e) {
		
		var touch = e.originalEvent.touches[0];
    
		if(dragging){

			toDrag.offset({left:touch.pageX, top:touch.pageY})

			Session.set( "currentListPos", { "x": touch.pageX, "y": touch.pageY} );

		}
		
	});
	
	
onmousemove = function(e){
	
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
//		toDrag.css("color", "black");
		
	} 
});

	
  	$( ".draggable" )

  .bind('mousedown touchstart', function() {
			
    	if(!dragging) dragging = !dragging;
			toDrag = $(this).parent()

//			toDrag.css("color", "gray");
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
	'click .edit'() {
		Session.set( "editing", this._id );
  },
	'click .cancel'(event) {
		Session.set( "editing", "" );
  },
	'submit .edit-task'(event){
		console.log("Hi");
		event.preventDefault();

		target = event.target;
		name = target.name.value;
		due = target.due.value;
		priority = target.priority.value;
		notes = target.notes.value;

		
		Tasks.update({_id : this._id},{$set:{name : name, notes: notes, priority: priority, due: due}});
		
		Session.set( "editing", "" );
		
	}
});

Template.task.helpers({
	isCompleted() {
		return this.completed;
  },
	dueOn() {
		var dayWrapper = moment(this.due);
		return "Due " + dayWrapper.fromNow();
  },
	editing(){
		if(Session.get("editing") == this._id){
			return true
		}
		return false;
	},
	isChecked(theVal){
		if(theVal == this.priority){
			return "checked";
		}
	},
});
