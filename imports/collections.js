import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Lists = new Mongo.Collection('lists');

export const Tasks = new Mongo.Collection('tasks');

export const Positions = new Mongo.Collection('positions');

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
	'positions.insert'(newId, theId, divPos, exp) {

		Positions.insert({ list: newId, owner: theId, pos: divPos, expanded: exp });

  },
  'tasks.remove'(taskId) {
    check(taskId, String);
 
    Tasks.remove(taskId);
  },
  'tasks.setChecked'(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);
 
    Tasks.update(taskId, { $set: { checked: setChecked } });
  },
});