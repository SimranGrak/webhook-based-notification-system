const express=require('express');
const Order = require("../models/Order");
const Notification = require("../models/Notification"); 

const router=express.Router();

module.exports=(io)=>{
router.post('/orders',async(req,res)=>{
  try{
    const { orderId, customerName, items, total } = req.body;
    const existingOrder = await Order.findOne({ orderId });
    if (existingOrder) {
        return res.status(400).json({ message: "Order already exists" });
    }

    // Save order to database
    const newOrder = new Order({ orderId, customerName, items, total });
    await newOrder.save();

    console.log("✅ Order Saved:", newOrder);

    let notificationMessage;
            if (total > 50) {
                notificationMessage = `🎉 Big Order! ${customerName} placed an order of $${total}!`;
            } else {
                notificationMessage = `🛒 New order placed by ${customerName} for $${total}`;
            }

            const notification = new Notification({ orderId, message: notificationMessage });
            await notification.save();

            console.log("🔔 Notification Created:", notification);

            // Emit based on order value
            if (total > 50) {
                io.emit("newNotification", { message: notificationMessage, type: "success" });
            } else {
                io.emit("newNotification", { message: notificationMessage, type: "info" });
            }

            res.status(201).json({ message: "Order stored successfully", order: newOrder });

    // const notificationMessage = `New order placed by ${customerName}`;
    // const notification = new Notification({ orderId, message: notificationMessage });
    // await notification.save();

    // console.log("🔔 Notification Created:", notification);

    // io.emit("newNotification", notification);
    // console.log("📢 Emitting Notification:", notification);

    // res.status(201).json({ message: "Order stored successfully", order: newOrder });
  }
  catch(error){
    console.error('error storing order:',error);
    res.status(500).json({error:'internal server error'});
  }
});

return router;
};