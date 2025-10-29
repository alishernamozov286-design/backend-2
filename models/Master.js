const mongoose = require('mongoose');

const masterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  photo: {
    type: String,
    default: ''
  },
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  specialization: [{
    type: String,
    required: true
  }],
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5
  },
  phone: {
    type: String,
    required: true
  },
  // Telegram chat ID for worker notifications
  telegramChatId: {
    type: String,
    default: null
  },
  workingHours: {
    start: {
      type: String,
      required: true,
      default: '09:00'
    },
    end: {
      type: String,
      required: true,
      default: '18:00'
    }
  },
  workingDays: [{
    type: String,
    enum: ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba'],
    required: true
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Master', masterSchema);