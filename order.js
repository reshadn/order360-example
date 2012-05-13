// Set up a collection to contain order information. On the server,
// it is backed by a MongoDB collection named "orders".

Orders = new Meteor.Collection("orders");

if (Meteor.is_client) {
    Template.Orders.orders = function() {
        return Orders.find();
    };

   var addOrder = function(){ 
        var timestamp = new Date();
        var now = timestamp.toString('yyyy-MM-dd');
        Orders.insert({
                year: 2010,
                model: "Honda",
                partInfo: "right side door",
                partPrice: 200,
                customerName: "Reshad Noorzay",
                customerPhone: "(310) 555-5555",
                status: {
                        statusType: "Quote",
                        statusLabel: ""
                },
                assignedTo: "Najeem",
                timestamp: now,
                comments: { 
                        comment: "need to pull from yard",
                        commenter: "Fahim",
                        commentTime: now
                        }
                });
   };
}
// On server startup, create some orders if the database is empty.
if (Meteor.is_server) {
Meteor.startup(function () {
  if (Orders.find().count() === 0) {
    var models = ["Honda", "Toyota", "Acura", "Saturn", "Lexus"];
    var partInfos = ["front bumper", "right head light", "rear view mirror", "a very long part name that will take up a lot of space"];
    var partPrice = 100; 
    var customers = ["ABC Company", "XYZ Company", "Local Auto Sales", "Bros. Auto Parts", "Big Co Auto Dealers"]; 
    var phones = "555-555-5555"; 
    var statusTypes = ["Quote", "Pending", "Pick up", "Delivery", "Quote"]; 
    var statusLabels = ["", "warning", "notice", "success", ""];
    var assignees = ["Najeem", "Juan", "Isaac", "Fahim", "Shiraz"]; 
    var comment = "This is a good part and we should sell quickly";
    var timestamp = new Date();
    var now = timestamp.toString('yyyy-MM-dd');
    var year = 2006;
    for(var i=0; i < 5; i++){
    Orders.insert({
                year: year,
                model: models[i],
                partInfo: partInfos[i],
                partPrice: partPrice,
                customerName: customers[i],
                customerPhone: phones,
                status: {
                        statusType: statusTypes[i],
                        statusLabel: statusLabels[i]
                        },
                assignedTo: assignees[i],
                timestamp: now,
                comments: { 
                        comment: comment,
                        commenter: assignees[0],
                        commentTime: now
                        }
                });
                timestamp += 1; // ensure unique timestamp.
                year++; // increment years
                partPrice += 100; // increment partPrice
    }
  }
});
}
