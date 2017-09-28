import { Template } from 'meteor/templating';
import { Lists } from '../imports/collections.js';
import { Tasks } from '../imports/collections.js';
import { Positions } from '../imports/collections.js';
import { Session } from 'meteor/session'

Template.list.helpers({
	tasks() {
		
		//return Tasks.find({ list: this._id }, { sort: { priority: -1 } })
		
		return Tasks.find({list: this._id}, { sort: [['completed', 'asc'], ['priority', 'desc']] });

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
		
		var now = moment().format('YYYY-MM-DDTHH:mm');
		return now;
		
//		return "2013-03-18T13:00";
		
	},
});


Template.list.events({
	'click .delete'(event) {
		event.stopImmediatePropagation();
		
		var posToDel = Positions.find({ list: this._id }).fetch();
		
		if(posToDel){
			
			for(var i = 0; i < posToDel.length; i++){
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

		Session.set( "currentList", this._id );
		event.stopImmediatePropagation();

  },
	'click, touchend .single-list'() {
		
		if (!Session.get( "currentListPos" )){
			return
		}
		
		if(this._id == Session.get( "currentList" )){
			pos = Session.get( "currentListPos" );
		}
		
		var posId; 
		var theId;
		
		if (!Meteor.user()) 
		{
			theId = "public"
			posId = Positions.findOne({list: this._id, owner: theId });
		} else{
			theId = Meteor.userId()
			posId = Positions.findOne({list: this._id, owner: theId });
		}
		
		if (posId){
			Positions.update(posId._id, {
      	$set: { pos: pos },
    	});
			
		} else{
			Positions.insert({ list: this._id, owner: theId, pos: pos });
		}

  },
	'submit .new-task'(event) {
    // Prevent default browser form submit
    event.preventDefault();
		target = event.target;
		name = target.name.value;
		due = target.due.value;
		priority = target.priority.value;
		notes = target.notes.value;

		Tasks.insert({
      name,
      due: due,
			priority: priority,
			notes: notes,
			completed: false,
			list: this._id,
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