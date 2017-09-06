import { Lists } from '../imports/collections.js';
import '../imports/listTemplate.js';

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
    return Lists.find({});
  },
});


Template.body.events({
  'submit .new-list'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const text = target.text.value;
 		var taskArray = [
			{ text: 'This is task 1' },
			{ text: 'This is task 2' },
			{ text: 'This is task 3' },
  	];
    // Insert a task into the collection
    Lists.insert({
      text,
      createdAt: new Date(),
			expanded: false,
			pos: { "x": 15, "y": 100},
			tasks: taskArray,
    });
 
    // Clear form
    target.text.value = '';
  },
});