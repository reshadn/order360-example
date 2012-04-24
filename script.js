// Set up a collection to contain pledge information.
// On the server, it is backed by a
//  MongoDB collection named "pledges".

Pledges = new Meteor.Collection("pledges");

if (Meteor.is_client) {
  Template.pledgeboard.pledges = function () {
    return Pledges.find();
  };

  Template.pledgeboard.selected_name = function () {
    var pledge = Pledges.findOne(Session.get("selected_name"));
    return pledge && pledge.email;
  };

  Template.pledgeboard.selected = function () {
    return Session.equals("selected_name", this._id) ? "selected" : '';
   };
 
  Template.pledgeboard.admin = function () {
// allow admin to be toggled on and off to show all pledges
    return true;
  };

  Template.pledgeTotals.count = function () {
    return Pledges.find().count();
  };
  Template.pledgeTotals.amountTotal = function () {
    // find sum of all amounts
        
    }

  };

  Template.pledge.selected = function () {
    return Session.equals("selected_name", this._id) ? "selected" : '';
  };

  Template.newpledge.events = {
    'click input.addPledge': function () {
        var new_email = $('input#new_email').val();
        var new_amount =$('input#new_amount').val(); 
        Pledges.insert({email: new_email, amount: new_amount});
    }
  };

  Template.pledgeboard.events = {
    'click input.remove': function () {
      Pledges.remove(Session.get("selected_name"));
    }
  };
  Template.pledge.events = {
    'click': function () {
      Session.set("selected_name", this._id);
     }
   };

}

// On server startup, create some pledges if the database is empty.
if (Meteor.is_server) {
  Meteor.startup(function () {
    if (Pledges.find().count() === 0) {
      var emails = ["test@email.com",
                   "new@email.com",
                   "another@email.com",
                   "more@email.com"];
      for (var i = 0; i < emails.length; i++)
        Pledges.insert({email: emails[i], amount: Math.floor(Math.random()*10)*5});
    }
  });
}
