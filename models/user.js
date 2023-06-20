const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
    },
    email: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        // required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    street: {
        type: String,
        default: ''
    },
    apartment: {
        type: String,
        default: ''
    },
    zip :{
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    isVerified: {
        type: Boolean,
        default: false
    }
});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
});

exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;

/*
    {
        "name": "user 1",
        "email": "user1@gmail.com",
        "password": "123",
        "phone": "085299",
        "isAdmin": false,
        "street": "Jl. Buntu",
        "apartment": "Apartment 1",
        "zip": "53144",
        "city": "Purwokerto",
        "country": "Indonesia"
    }
*/