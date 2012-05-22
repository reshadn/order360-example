// Set up a collection to contain order information. On the server,
// it is backed by a MongoDB collection named "orders".

Orders = new Meteor.Collection("orders");

if (Meteor.is_client) {
    Template.Orders.orders = function() {
        // Orders.find().sort({timestamp: 1}); 
        return Orders.find({}, {sort: {rawTime: -1}});
    };

   var addOrder = function(){ 
        var yearInput = $('#year').val();
        var modelInput = $('#model').val();
        var partInfoInput = $('#partInfo').val();
        var partPriceInput = $('#partPrice').val();
        var customerNameInput = $('#customerName').val();
        var customerPhoneInput = $('#customerPhone').val();
        var orderStatusInput = $('#orderStatus').val();
        
        // Determine orderStatus and assign label
        var statusLabels = ["", "warning", "notice", "success"];
        var setStatusLabel;
        switch(orderStatusInput)
        {
            case "Pending":
            setStatusLabel = statusLabels[1];
            break;
            case "Delivery":
            setStatusLabel = statusLabels[2];
            break;
            case "Pick Up":
            setStatusLabel = statusLabels[3];
            break;
            case "Quote":
            setStatusLabel = statusLabels[0];
            break;
        }

        var assignedToInput = $('#assignedTo').val()
        var timestamp = new Date();
        var time = timestamp.getTime();
        var now = timestamp.toString('yyyy-MM-dd');
        Orders.insert({
                year: yearInput,
                model: modelInput,
                partInfo: partInfoInput,
                partPrice: partPriceInput,
                customerName: customerNameInput,
                customerPhone: customerPhoneInput,
                status: {
                        statusType: orderStatusInput,
                        statusLabel: setStatusLabel
                },
                assignedTo: assignedToInput,
                timestamp: now,
                rawTime: time,
                comments: { 
                        comment: "need to pull from yard",
                        commenter: "Fahim",
                        commentTime: now
                        }
                });

        Template.Orders.events = {
            'click button.delete': function () {
                Session.set("selected_order", this.id);
                Orders.remove(Session.get("selected_order"));
            }
        }
   };
}
// On server startup, create some orders if the database is empty.
if (Meteor.is_server) {
Meteor.startup(function () {
// Initial Startup function to show placeholder info
/*
  if (Orders.find().count() === 0) {
    var models = ["Honda", "Toyota", "Acura", "Saturn", "Lexus"];
    var partInfos = ["front bumper", "right head light", "rear view mirror", "a very long part name that will take up a lot of space"];
    var partPrice = 100; 
    var customers = ["ABC Company", "XYZ Company", "Local Auto Sales", "Bros. Auto Parts", "Big Co Auto Dealers"]; 
    var phones = "555-555-5555"; 
    var statusTypes = ["Quote", "Pending", "Pick up", "Delivery", "Quote"]; 
    var statusLabels = ["", "warning", "notice", "success", ""];
    var assignees = ["Najeem", "Juan", "Isaac", "Fahim", "Shiraz"]; 
    var commentDefault = "This is a good part and we should sell quickly";
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
                        comment: commentDefault,
                        commenter: assignees[0],
                        commentTime: now
                        }
                });
                timestamp += 1; // ensure unique timestamp.
                year++; // increment years
                partPrice += 100; // increment partPrice
    }
  }
*/
});
}
