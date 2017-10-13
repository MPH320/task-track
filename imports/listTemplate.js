import { Template } from 'meteor/templating';
import { Lists } from '../imports/collections.js';
import { Tasks } from '../imports/collections.js';
import { Positions } from '../imports/collections.js';
import { Session } from 'meteor/session'


Template.list.helpers({
	tasks() {
		return Tasks.find({list: this._id}, { sort: [['completed', 'asc'], ['priority', 'desc']] });
  },
	addMember() {
		
		if (this._id == Session.get("currentListToAdd") && Session.get( "addingMember")){
			return true;
		} else {return false}
		
  },
	isExpanded(){

		posId = Positions.findOne({list: this._id});
		if (posId){
			return posId.expanded;
		}
	
	},
	getDate(){
		
		var now = moment().format('YYYY-MM-DDTHH:mm');
		return now;
//	return "2013-03-18T13:00";
		
	},
});


Template.list.events({
	'click .delete'(event) {
		event.stopImmediatePropagation();
		
		var posToDel = Positions.find({ list: this._id }).fetch();
		
		if(posToDel){
			
			for(var i = 0; i < posToDel.length; i++){

				Meteor.call('positions.remove', posToDel[i]._id);
			}
			
		}
		

		Meteor.call('lists.remove', this._id);

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
		
		posId = Positions.findOne({list: this._id});
		
		if (!Meteor.user()) 
		{
			
			theId = "public";
		} else{
		
			theId = Meteor.userId();
		}
		
		if (posId){
			Meteor.call('positions.expand', posId._id, ! posId.expanded);
		} else{
			Meteor.call('positions.insert', this._id, theId, true);
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
			Meteor.call('positions.update', posId._id, pos);
		} else{
			Meteor.call('positions.updatePos', this._id, theId, pos);
		}

  },
	'submit .new-task'(event) {
    // Prevent default browser form submit
    event.preventDefault();
		target = event.target;
		name = target.name.value;
		due = target.due.value;
		priority = target.priority.value;
		//notes = target.notes.value;
		notes = $(target).parent().find('.notesDiv').html();
		
		Meteor.call('tasks.insert', name, due, priority, notes, false, this._id, this.owners);

		var now = moment().format('YYYY-MM-DDTHH:mm');
		
		target.name.value = '';
		target.due.value = now;
		//target.notes.value = '';
		target.priority.value = '';
		$(target).parent().find('.notesDiv').html('Task notes:');
		
		//console.log($(target).parent().find('.editDiv').html());

  },
	'submit .new-member'(event) {
   	event.preventDefault();
		target = event.target;
		name = target.name.value;

		Meteor.call('lists.member', this._id, name);
		Meteor.call('tasks.member', this._id, name);
		
		Session.set( "addingMember", false );
  },
});