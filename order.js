// Set up a collection to contain order information. On the server,
// it is backed by a MongoDB collection named "orders".

Orders = new Meteor.Collection("orders");

if (Meteor.is_client) {
    Template.Orders.orders = function() {
        return Orders.find();
    };
}
// On server startup, create some orders if the database is empty.
if (Meteor.is_server) {
Meteor.startup(function () {
  if (Orders.find().count() === 0) {
    var data = ["2006", "Honda", "front bumper", "100.00", "Car Sales Company", "555-555-5555", "Quote", "Najeem", "This is a good part and we should sell quickly"]
    var timestamp = (new Date()).getTime();
    var i = 1; // track comment counter
    Orders.insert({
                partID: i,
                year: data[0],
                model: data[1],
                partInfo: data[2],
                partPrice: data[3],
                customerName: data[4],
                customerPhone: data[5],
                status: data[6],
                assigned: data[7],
                timestamp: timestamp,
                comments: {
                        commentID: i,
                        comment: data[8]
                }
                });
                timestamp += 1; // ensure unique timestamp.
                i++; // increment comment counter
    }
});
}
