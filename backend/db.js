const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect(process.env.DB);


const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String
})



const accountSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: Number,
})

const User = mongoose.model('User', userSchema);
const Account = mongoose.model('Account', accountSchema);

module.exports = {
    User,
    Account
}