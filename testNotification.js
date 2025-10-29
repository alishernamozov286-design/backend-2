require('dotenv').config();
const { notifyBooking } = require('./utilities/notify');

async function testNotification() {
  console.log('🔍 Testing booking notification system...');
  
  // Create a mock booking object
  const mockBooking = {
    customerName: "Test User",
    customerPhone: "+998901234567",
    customerEmail: "test@example.com",
    serviceId: {
      name: "Soch qirqish"
    },
    masterId: {
      name: "Alisher Namozov"
    },
    appointmentDate: new Date(),
    appointmentTime: "14:00",
    totalPrice: 50000,
    createdAt: new Date(),
    notes: "Test booking for notification"
  };
  
  console.log('🔄 Sending test booking notification...');
  const result = await notifyBooking(mockBooking);
  
  if (result.success) {
    console.log('✅ Booking notification sent successfully!');
  } else {
    console.log('❌ Failed to send booking notification:', result.error);
  }
}

testNotification().catch(console.error);