const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    documentName: {
        type: String,
        required: true
    },
    copies: {
        type: Number,
        required: true,
        min: 1
    },
    paperSize: {
        type: String,
        required: true
    },
    printType: {
        type: String,
        required: true
    },
    bindingType: {
        type: String,
        required: false
    },
    additionalNotes: {
        type: String
    },
    cost: {
        type: Number,
        required: true,
        min: 0
      },      
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

orderSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Order', orderSchema);
