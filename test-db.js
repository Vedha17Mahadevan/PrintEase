const mongoose = require('mongoose');
const Order = require('./models/Order');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/printease', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
    
    // Test query to check if orders exist
    return Order.find().populate('userId', 'fullName email');
}).then(orders => {
    console.log(`Found ${orders.length} orders in database`);
    if (orders.length > 0) {
        console.log('Sample order:', JSON.stringify(orders[0], null, 2));
    } else {
        console.log('No orders found in database');
    }
}).catch(err => {
    console.error('Error connecting to database:', err);
}).finally(() => {
    // Close the connection
    mongoose.connection.close();
});