import { Template } from 'meteor/templating';
import { Lists } from '../imports/collections.js';
import { Session } from 'meteor/session'

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
	'click .single-list'() {
		
		pos = Session.get( "currentListPos" )
		
		//console.log(pos);
		
//		console.log(pos["x"]);
//		console.log(pos["y"]);
		
		
			Lists.update(this._id, {
      	$set: { pos: pos },
    	});
	
		
		
		
    // Set the checked property to the opposite of its current value

  },
});
