import { Lists } from '../imports/collections.js';
import '../imports/listTemplate.js';

var currentIndex = 0;



Template.list.onRendered(function () {
	
	var toDrag;
	
	dragging = false;
	var offsetVal = 0;
	var inc = 100;
	
	offsetVal+=inc;
			
			
	var moveDiv = this.find('.single-list');
	
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
		

		

	
//    Tasks.update(this._id, {
//      $set: { checked: ! this.checked },
//    });

		
		
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
    //return Lists.find({});
		
		return Lists.find( { owners: Meteor.userId() } )
  },
});


Template.body.events({
  'submit .new-list'(event) {
    // Prevent default browser form submit
    event.preventDefault();
		
		//console.log(Meteor.userId());
		var ownersArray = [ Meteor.userId() ];
 
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
		//this.completed = !this.completed;
		
		newval = !this.completed;
		
		console.log(this.id)
		console.log(Template.parentData()._id);
		
		Lists.update(
  		{ _id: Template.parentData()._id, "tasks.id": this.id}, 
  		{$set: { "tasks.completed": newval }}
		);
		
		//newid = new Mongo.ObjectID();
    // Set the checked property to the opposite of its current value
		//console.log(newid._str);
//    Tasks.update(this._id, {
//      $set: { checked: ! this.checked },
//    });
  },
  'click .delete'() {
    Tasks.remove(this._id);
  },
});

Template.task.helpers({
	isCompleted() {
		return this.completed;
  }
});

//Template.myItem.helpers({
//  listIndex: function() {
//    return currentIndex += 1;
//  }
//});

//Template.task.helpers({
//	someHelper() {
//    //return Lists.find({});
//		
//		console.log("i'm helping");
//  },
//});