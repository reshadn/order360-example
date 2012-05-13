// Set up a collection to contain order information. On the server,
// it is backed by a MongoDB collection named "orders".

Orders = new Meteor.Collection("orders");

// On server startup, create some orders if the database is empty.
if (Meteor.is_server) {
Meteor.startup(function () {
  if (Orders.find().count() === 0) {
    // Orders -- {year: Number,
    //            model: String,
    //            partInfo: String ,
    //            partPrice: Number,
    //            customerName: String,
    //            customerPhone: Number,
    //            status: String,
    //            assigned: String,
    //            timestamp: Number}

    var data = ["2006", "Honda", "front bumper", "100.00", "Car Sales Company", "555-555-5555", "Quote", "Najeem"]
    var timestamp = (new Date()).getTime();
    
    Orders.insert({
                year: data[0],
                model: data[1],
                partInfo: data[2],
                partPrice: data[3],
                customerName: data[4],
                customerPhone: data[5],
                status: data[6],
                assigned: data[7],
                timestamp: timestamp
                });
                timestamp += 1; // ensure unique timestamp.

    }
});
}
