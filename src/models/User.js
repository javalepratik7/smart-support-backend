const mongoose = require('mongoose');
const { hashPassword } = require('../utils/hashPassword');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password_hash: {
    type: String,
    required: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

userSchema.pre('save', function(next) {
  if (this.isModified('password_hash')) {
    this.password_hash = hashPassword(this.password_hash);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);