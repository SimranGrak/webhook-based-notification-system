const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    customerName: { type: String, required: true },
    items: { type: [String], required: true },
    total: { type: Number, required: true }
});

module.exports = mongoose.model("Order", orderSchema);
