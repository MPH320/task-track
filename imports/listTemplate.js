import { Template } from 'meteor/templating';
import { Lists } from '../imports/collections.js';
import { Tasks } from '../imports/collections.js';
import { Session } from 'meteor/session'

Template.list.helpers({
	tasks() {
		
		//console.log(this._id)
		
		return Tasks.find({ list: this._id })

		
    //return Lists.findOne(this._id)["tasks"];
  },
});

Template.list.events({
	'click .delete'(event) {
		event.stopImmediatePropagation();
    Lists.remove(this._id);

  },
  'click .expand-list'(event) {
    // Set the checked property to the opposite of its current value
		event.stopImmediatePropagation();
		//console.log(this.expanded);
	
    Lists.update(this._id, {
      $set: { expanded: ! this.expanded },
    });
		

  },
	'mousedown .draggable'(event) {
		
//		console.log("set list id");
//		console.log(this._id);
		Session.set( "currentList", this._id );
		event.stopImmediatePropagation();

  },
	'click .single-list'() {
		
		if (!Session.get( "currentListPos" )){
			return
		}
		
		if(this._id == Session.get( "currentList" )){
			pos = Session.get( "currentListPos" );
		}
		

		//".draggable"
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
		target = event.target;
		name = target.name.value;
		due = target.due.value;
		priority = target.priority.value;
		notes = target.notes.value;
		newid = new Mongo.ObjectID();
    // Set the checked property to the opposite of its current value
		
		//task = { name: name, due: due, priority: priority, notes: notes, completed: false, id: newid._str };
		
		task = { name: name, due: due, priority: priority, notes: notes, completed: false, list: this._id };
		
		
		console.log(this._id);
		
		//taskid = { newid._str: task}
		
//		
		Tasks.insert({
      name,
      due: due,
			priority: priority,
			notes: notes,
			completed: false,
			list: this._id,// current time
    });
		
		
		
		
//		Lists.update(this._id, {
//      	$push: { tasks: task },
//    });
		
		target.name.value = '';
		target.due.value = '';
		target.notes.value = '';
		target.priority.value = '';
		
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