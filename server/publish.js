// Orders -- {year: Number,
//            model: String,
//            partInfo: String ,
//            partPrice: Number,
//            customerName: String,
//            customerPhone: Number,
//            status: String,
//            assigned: String,
//            timestamp: Number}

Orders = new Meteor.Collection("orders");

// Publish all items for requested list_id.
Meteor.publish('orders', function() {
  return Orders.find();
});
