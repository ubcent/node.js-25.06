
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const CRYPT_STEPS = 12;

const Schema = mongoose.Schema;

const loginSchema = new Schema({
    authId: String,
    email: { type: String },
    password: { type: String },
    firstName: { type: String },
    lastName: { type: String },
});

loginSchema.pre('save', async function (next) {
    if(this.isModified('password')) {
      const password = await bcrypt.hash(this.password, CRYPT_STEPS);
      this.password = password;
    }
    next();
});

loginSchema.methods.comparePassword = async function(candidate) {
    return await bcrypt.compare(candidate, this.password);
}

module.exports = mongoose.model('Login', loginSchema, 'logins');