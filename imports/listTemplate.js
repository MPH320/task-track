import { Template } from 'meteor/templating';
import { Lists } from '../imports/collections.js';
import { Session } from 'meteor/session'

Template.list.helpers({
	tasks() {
		
//		var taskArray = [];
//		
//		Lists.update(
//			 { _id: this._id },
//			 { $push: { tasks: taskArray } }
//		)
//		

		
    return Lists.findOne(this._id)["tasks"];;
  },
});

Template.list.events({
	'click .delete'(event) {
		event.stopImmediatePropagation();
    Lists.remove(this._id);
		console.log("c");
  },
  'click .expand-list'(event) {
    // Set the checked property to the opposite of its current value
		event.stopImmediatePropagation();
		//console.log(this.expanded);
	
    Lists.update(this._id, {
      $set: { expanded: ! this.expanded },
    });
		
		console.log("b");
  },
	'click .single-list'() {
		
		if (!Session.get( "currentListPos" )){
			return
		}
		
		pos = Session.get( "currentListPos" )

		
//		console.log(pos["x"]);
//		console.log(pos["y"]);
		
		
			Lists.update(this._id, {
      	$set: { pos: pos },
    	});

    // Set the checked property to the opposite of its current value

  },
	'submit .new-task'(event) {
    // Prevent default browser form submit
    event.preventDefault();
		console.log("Adding task");
//		
//		console.log(Meteor.userId());
//		var ownersArray = [ Meteor.userId() ];
// 
//    // Get value from form element
//    const target = event.target;
//    const text = target.text.value;
// 		var taskArray = [
//			{ text: 'This is task 1' },
//			{ text: 'This is task 2' },
//			{ text: 'This is task 3' },
//  	];
//    // Insert a task into the collection
//    Lists.insert({
//      text,
//      createdAt: new Date(),
//			expanded: false,
//			pos: { "x": 15, "y": 100},
//			tasks: taskArray,
//			owners: ownersArray,
//    });
// 
//    // Clear form
//    target.text.value = '';
  },
});