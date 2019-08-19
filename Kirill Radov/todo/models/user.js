const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const CRYPT_STEPS = 12;

const Schema = mongoose.Schema;

const userSchema = new Schema ({
    firstName: { type: String},
    lastName: { type: String},
    login: {type: String},
    password: {type: String},
    email: {type: String},
    banned: {type: Boolean},
});

userSchema.pre('save', async function (next) {
    if(this.isModified('password')) {
        const password = await bcrypt.hash(this.password, CRYPT_STEPS);
        this.password = password;
    }
    next();
});

userSchema.methods.comparePassword = async function(candidate) {
    return await bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema, 'users');