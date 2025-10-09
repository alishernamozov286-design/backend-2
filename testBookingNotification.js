require('dotenv').config();
const { notifyBooking } = require('./utilities/notify');

async function testBookingNotification() {
  console.log('Testing booking notification...');
  
  // Create a mock booking object
  const mockBooking = {
    customerName: 'Test User',
    customerPhone: '+998901234567',
    customerEmail: 'test@example.com',
    serviceId: {
      name: 'Soch olish'
    },
    masterId: {
      name: 'Test Master'
    },
    appointmentDate: new Date(),
    appointmentTime: '14:30',
    totalPrice: 50000,
    notes: 'Test booking for Telegram notification',
    createdAt: new Date()
  };
  
  // Send notification
  const result = await notifyBooking(mockBooking);
  
  if (result.success) {
    console.log('✅ Booking notification sent successfully!');
  } else {
    console.log('❌ Failed to send booking notification:', result.error);
  }
}

testBookingNotification().catch(console.error);