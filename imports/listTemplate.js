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
	addMember() {
		
		if (this._id == Session.get("currentListToAdd") && Session.get( "addingMember")){
			return true;
		} else {return false}
		
  },
});


Template.list.events({
	'click .delete'(event) {
		event.stopImmediatePropagation();
    Lists.remove(this._id);

  },
	'click .add'(event){
		event.stopImmediatePropagation();
		
		//add member button has been clicked and then it was clicked on a different list	
		if (Session.get( "addingMember") && this._id != Session.get("currentListToAdd") ) { 
				Session.set( "addingMember", true );
		} else {
		//page loaded and add member button is unclicked	
				if(Session.get( "addingMember")){
				Session.set( "addingMember", !Session.get( "addingMember") );
			} else {
				Session.set( "addingMember", true );
			}
			
		}

			Session.set( "currentListToAdd", this._id );
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

		
		task = { name: name, due: due, priority: priority, notes: notes, completed: false, list: this._id };
		
		
		console.log(this._id);

		Tasks.insert({
      name,
      due: due,
			priority: priority,
			notes: notes,
			completed: false,
			list: this._id,// current time
    });

		
		target.name.value = '';
		target.due.value = '';
		target.notes.value = '';
		target.priority.value = '';
		

  },
	'submit .new-member'(event) {
   	event.preventDefault();
		target = event.target;
		name = target.name.value;
	
		console.log(name)
		Lists.update({ _id: this._id },{ $push: { owners: name }})
		
		Session.set( "addingMember", false );
  },
});