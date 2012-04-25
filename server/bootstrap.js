Meteor.startup(function () {
  if (Orders.find().count() === 0) {
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
