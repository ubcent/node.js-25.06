const mongoose = require('mongoose');
const CRYPT_STEPS = 12;
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const userSchema = new Schema({
  email: {type: String},
  password: {type: String},
  firstName: {type: String, default: 'John'},
  lastName: {type: String},
});
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const password = await bcrypt.hash(this.password, CRYPT_STEPS);
    this.password = password;
  }
  next();
});

userSchema.methods.comparePassword = async function(candidate) {
  return await bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema, 'users');
