import { Lists } from '../imports/collections.js';
import { Tasks } from '../imports/collections.js';
import '../imports/listTemplate.js';

var currentIndex = 0;



Template.list.onRendered(function () {
	
	var toDrag;
	
	dragging = false;
	var offsetVal = 0;
	var inc = 100;
	
	offsetVal+=inc;
			
			
	var moveDiv = this.find('.single-list');
	var listID = this.data._id;
	//console.log(this.data._id)

	
	if(this.data.pos){
		pos = this.data.pos;
		//console.log(pos);
		moveDiv = $(moveDiv);
		moveDiv.offset({left:pos["x"], top:pos["y"]})
		
	}

	
	
onmousemove = function(e){
	
	
	if(dragging){

		toDrag.offset({left:e.clientX, top:e.clientY})
		
		Session.set( "currentListPos", { "x": e.clientX, "y": e.clientY} );
			
	}

}

$( "body" ).mouseup(function() {
  if(dragging) {
		
		dragging = !dragging;
		
		
	} 
});

	
  	$( ".draggable" )

  .mousedown(function() {

			//console.log($(this).offset());
    	if(!dragging) dragging = !dragging;
			toDrag = $(this).parent()
		
			//console.log(toDrag);
			
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
		if (!Meteor.user()) 
		{
			ownersArray = ["public"];
		} else if(Meteor.user().profile){
			ownersArray = [Meteor.user().profile.name];
		} else {
			ownersArray = [Meteor.user().username];
		}
		
 
    // Get value from form element
    const target = event.target;
    const name = target.name.value;
 		var taskArray = [];
    // Insert a task into the collection
    Lists.insert({
      name,
      createdAt: new Date(),
			expanded: false,
			pos: { "x": 15, "y": 100},
			tasks: taskArray,
			owners: ownersArray,
    });
 
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
