const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Order = require('./models/Order');
const path = require('path');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Root route handler
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Get orders (for both users and admin)
app.get('/api/orders', async (req, res) => {
    console.log(`[${new Date().toISOString()}] GET /api/orders request received`); // Added timestamped log
    try {
        console.log('API endpoint /api/orders called');
        const { userId } = req.query;
        let filter = {};
        
        // If userId is provided, filter by userId (for regular users)
        // If not provided, return all orders (for admin)
        if (userId) {
            filter = { userId };
        }

        console.log('Fetching orders with filter:', filter);
        let query = Order.find(filter).sort({ createdAt: -1 }); // Sort by creation date, newest first

        // Only populate user details if a specific userId is requested (for user dashboard)
        // Admin view doesn't need populated details based on current UI
        if (userId) {
            query = query.populate('userId', 'fullName email'); // Populate user details
        }

        const orders = await query.exec();

        console.log('Orders found:', orders.length);
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// User Registration
app.post('/api/users/register', async (req, res) => {
    try {
        const { fullName, institution, className, email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = new User({
            fullName,
            institution,
            className,
            email,
            password: hashedPassword
        });

        await user.save();

        // Create token
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        res.status(201).json({
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                institution: user.institution,
                className: user.className
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// User Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        res.json({
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                institution: user.institution,
                className: user.className
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create Order
app.post('/api/orders', async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});



// Update Order Status (for admin)
app.put('/api/orders/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        
        if (!orderId || !status) {
            return res.status(400).json({ message: 'Order ID and status are required' });
        }
        
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status, updatedAt: Date.now() },
            { new: true }
        );
        
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        res.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Order (for admin)
app.delete('/api/orders/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        
        if (!orderId) {
            return res.status(400).json({ message: 'Order ID is required' });
        }
        
        const deletedOrder = await Order.findByIdAndDelete(orderId);
        
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));