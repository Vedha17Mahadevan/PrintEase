const mongoose = require('mongoose');
const User = require('./models/User');
const Order = require('./models/Order');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/printease', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Check if there are any users
        const userCount = await User.countDocuments();
        let testUser;

        if (userCount === 0) {
            // Create a test user
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);
            
            testUser = new User({
                fullName: 'Test User',
                email: 'test@example.com',
                password: hashedPassword,
                institution: 'Test University',
                className: 'Computer Science'
            });
            
            await testUser.save();
            console.log('Test user created');
        } else {
            // Get the first user
            testUser = await User.findOne();
            console.log('Using existing user');
        }

        // Check if there are any orders
        const orderCount = await Order.countDocuments();

        if (orderCount === 0) {
            // Create sample orders
            const orders = [
                {
                    userId: testUser._id,
                    documentName: 'Assignment1.pdf',
                    copies: 2,
                    paperSize: 'A4',
                    printType: 'Black & White',
                    bindingType: 'Spiral',
                    additionalNotes: 'Urgent please',
                    status: 'pending'
                },
                {
                    userId: testUser._id,
                    documentName: 'Thesis.pdf',
                    copies: 1,
                    paperSize: 'A3',
                    printType: 'Color',
                    bindingType: 'Hard Cover',
                    additionalNotes: '',
                    status: 'processing'
                },
                {
                    userId: testUser._id,
                    documentName: 'Report.pdf',
                    copies: 3,
                    paperSize: 'A4',
                    printType: 'Black & White',
                    bindingType: 'None',
                    additionalNotes: 'Double-sided printing',
                    status: 'completed'
                }
            ];

            await Order.insertMany(orders);
            console.log('Sample orders created');
        } else {
            console.log(`${orderCount} orders already exist in database`);
        }

        console.log('Database seeding completed successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Close the connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Run the seed function
seedDatabase();