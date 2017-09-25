import { Template } from 'meteor/templating';
import { Lists } from '../imports/collections.js';
import { Tasks } from '../imports/collections.js';
import { Positions } from '../imports/collections.js';
import { Session } from 'meteor/session'

//var count = 0;

Template.list.helpers({
	tasks() {
		
		//console.log(this._id)
		
		//return Tasks.find({ list: this._id }, { sort: { priority: -1 } })
		
		return Tasks.find({list: this._id}, { sort: [['completed', 'asc'], ['priority', 'desc']] });

		
    //return Lists.findOne(this._id)["tasks"];
  },
	addMember() {
		
		if (this._id == Session.get("currentListToAdd") && Session.get( "addingMember")){
			return true;
		} else {return false}
		
  },
	isExpanded(){
		
		if (!Meteor.user()) 
		{
			posId = Positions.findOne({list: this._id, owner: "public" });
		} else{
			posId = Positions.findOne({list: this._id, owner: Meteor.userId() });
		}

		
		if (posId){

			return posId.expanded;
		}
	
	},
	getDate(){
//		var d = new Date();
//		d = d.toJSON().slice(0,19)
		
//		console.log("yo");
//		$('input[type=datetime-local]').val(new Date().toJSON().slice(0,19));
//		return d.toISOString();
		
//	$( "input[name='due']" ).val(d.toISOString());
		var now = moment().format('YYYY-MM-DDTHH:mm');
		return now;
		
//		return "2013-03-18T13:00";
		
//		$( "input[name='due']" ).val(d.toLocaleString());
	},
});


Template.list.events({
	'click .delete'(event) {
		event.stopImmediatePropagation();
		
		
		var posToDel = Positions.find({ list: this._id }).fetch();
		
//		console.log(posToDel);
		
		if(posToDel){
			
			for(var i = 0; i < posToDel.length; i++){
//				console.log(i);
//				console.log(posToDel[i]._id);
				Positions.remove(posToDel[i]._id);
			}
			
		}
		
		
		
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

		var theId;
		
		if (!Meteor.user()) 
		{
			posId = Positions.findOne({list: this._id, owner: "public" });
			theId = "public";
		} else{
			posId = Positions.findOne({list: this._id, owner: Meteor.userId() });
			theId = Meteor.userId();
		}
		
		if (posId){
			Positions.update(posId._id, {
				$set: { expanded: ! posId.expanded },
			});
		} else{
			Positions.insert({ list: this._id, owner: theId, expanded: true });
		}

		
		
		

  },
	'mousedown, touchstart .draggable'(event) {
		
//		$(".test").html("<p> hi "+count+"</p>");
//		count++;
		
//		console.log("set list id");
//		console.log(this._id);
		Session.set( "currentList", this._id );
		event.stopImmediatePropagation();

  },
	'click, touchend .single-list'() {
		
//		console.log("hey")
		
		if (!Session.get( "currentListPos" )){
			return
		}
		
		if(this._id == Session.get( "currentList" )){
			pos = Session.get( "currentListPos" );
		}
		

		//".draggable"
//		console.log(pos["x"]);
//		console.log(pos["y"]);
		
		
//			Lists.update(this._id, {
//      	$set: { pos: pos },
//    	});
		
		var posId; 
		var theId;
		
		if (!Meteor.user()) 
		{
			theId = "public"
			posId = Positions.findOne({list: this._id, owner: theId });
//			console.log(posId);
		} else{
			theId = Meteor.userId()
			posId = Positions.findOne({list: this._id, owner: theId });
		}
		
		//console.log(posId);
		
		if (posId){
			Positions.update(posId._id, {
      	$set: { pos: pos },
    	});
			
//			$(".test").html("<p> updated "+count+"</p>");
//			count++;
//			console.log(posId);
			
		} else{
			Positions.insert({ list: this._id, owner: theId, pos: pos });
		}
		
			
		


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

		
		//task = { name: name, due: due, priority: priority, notes: notes, completed: false, list: this._id };
		
		
//		console.log(this._id);

		Tasks.insert({
      name,
      due: due,
			priority: priority,
			notes: notes,
			completed: false,
			list: this._id,// current time
    });

		
		var now = moment().format('YYYY-MM-DDTHH:mm');
		
		target.name.value = '';
		target.due.value = now;
		target.notes.value = '';
		target.priority.value = '';
		

  },
	'submit .new-member'(event) {
   	event.preventDefault();
		target = event.target;
		name = target.name.value;
	

		Lists.update({ _id: this._id },{ $push: { owners: name }})
		
		Session.set( "addingMember", false );
  },
});