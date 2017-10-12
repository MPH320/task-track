import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Lists = new Mongo.Collection('lists');

export const Tasks = new Mongo.Collection('tasks');

export const Positions = new Mongo.Collection('positions');

if (Meteor.isServer) {
  // This code only runs on the server

	Meteor.publish('lists', function(){
		
		if (Meteor.user()) 
		{
			
			if(Meteor.user().profile){
				return Lists.find( { owners: Meteor.user().profile.name } );
			} else {
				return Lists.find( { owners: Meteor.user().username } );
			}
		} else { return Lists.find( { owners: "public" } ) }
		
	});
	
	Meteor.publish('tasks', function(){
		
    if (Meteor.user()) 
		{
			if(Meteor.user().profile){
				return Tasks.find( { owners: Meteor.user().profile.name } );
			} else {
				return Tasks.find( { owners: Meteor.user().username } );
			}
		} else { return Tasks.find( { owners: "public" } ) }
	});
	
	Meteor.publish('positions', function(){
			if (!Meteor.user()) 
		{
			return Positions.find({owner: "public" });
		} else{
			return Positions.find({ owner: Meteor.userId() });
		}
	});


}

Meteor.methods({
  'lists.insert'(name, date, exp, taskArray, ownersArray) {
		
		Lists.insert({
      name,
      createdAt: date,
			expanded: exp,
			tasks: taskArray,
			owners: ownersArray,
    });
 
   
  },
		'tasks.insert'(name, due, priority, notes, completed, id, owners) {
		
		Tasks.insert({
      name,
      due: due,
			priority: priority,
			notes: notes,
			completed: completed,
			list: id,
			owners: owners
    });
		
  },
	'positions.insert'(newId, theId, exp) {

		Positions.insert({ list: newId, owner: theId, expanded: exp });

  },
	'positions.updatePos'(newId, owner, pos) {

		Positions.insert({ list: newId, owner: owner, pos: pos });

  },
	'positions.update'(newId, pos) {

			Positions.update(newId, {
      	$set: { pos: pos },
    	});

  },
	'positions.expand'(newId, exp) {

		Positions.update(newId, {
				$set: { expanded: exp },
			});

  },
	'lists.remove'(theId) {
		check(theId, String);
		Lists.remove(theId);

  },
	'lists.member'(theId, owner) {
		check(theId, String);
		Lists.update({ _id: theId },{ $push: { owners: owner }})
  },
	'tasks.member'(theId, owner) {
		check(theId, String);
		Tasks.update({ list: theId },{ $push: { owners: owner }}, {multi:true})
  },
	'positions.remove'(theId) {
		check(theId, String);
		Positions.remove(theId);

  },
  'tasks.remove'(taskId) {
    check(taskId, String);
 
    Tasks.remove(taskId);
  },
	'tasks.update'(taskId, name, notes, priority, due) {
    check(taskId, String);
 
    Tasks.update({_id : taskId},{$set:{name : name, notes: notes, priority: priority, due: due}});
  },
	'tasks.updateCompleted'(taskId, status) {
    check(taskId, String);
 		
     Tasks.update(taskId, {
      $set: { completed: status },
    });
	
  },
});