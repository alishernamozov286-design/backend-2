require('dotenv').config();
const { notifyBooking } = require('./utilities/notify');

async function demoFullBookingNotification() {
  console.log('Demonstrating full booking notification...');
  
  // Create a comprehensive mock booking object with all possible fields
  const fullBooking = {
    customerName: 'Alisher Namozov',
    customerPhone: '+998901234567',
    customerEmail: 'alisher@example.com',
    serviceId: {
      name: 'Premium Soch Olish + Soqol',
      price: 85000,
      duration: 60
    },
    masterId: {
      name: 'Otabek Karimov',
      phone: '+998998765432'
    },
    appointmentDate: new Date('2025-10-15T00:00:00Z'),
    appointmentTime: '14:30',
    totalPrice: 85000,
    notes: 'Iltimos, 14:15 da kelishni so\'rayman. Oldin telegramda habar beraman.',
    status: 'kutilmoqda',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  console.log('Sending notification with full booking details...');
  const result = await notifyBooking(fullBooking);
  
  if (result.success) {
    console.log('✅ Full booking notification sent successfully!');
  } else {
    console.log('❌ Failed to send full booking notification:', result.error);
  }
  
  // Create a minimal booking object (to test edge cases)
  const minimalBooking = {
    customerName: 'Test User',
    customerPhone: '+998900000000',
    serviceId: {
      name: 'Oddiy Soch Olish'
    },
    masterId: {
      name: 'Test Master'
    },
    appointmentDate: new Date('2025-10-20T00:00:00Z'),
    appointmentTime: '10:00',
    totalPrice: 50000,
    createdAt: new Date()
  };
  
  console.log('Sending notification with minimal booking details...');
  const result2 = await notifyBooking(minimalBooking);
  
  if (result2.success) {
    console.log('✅ Minimal booking notification sent successfully!');
  } else {
    console.log('❌ Failed to send minimal booking notification:', result2.error);
  }
}

demoFullBookingNotification().catch(console.error);