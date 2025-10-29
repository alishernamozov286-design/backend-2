const axios = require('axios');

async function testBookingNotification() {
  console.log('🔍 Testing booking creation with Telegram notification...');
  
  // Booking data
  const bookingData = {
    customerName: "Test User",
    customerPhone: "+998901234567",
    customerEmail: "test@example.com",
    serviceId: "64f8b2c3d1e2a3b4c5d6e7f8", // Sample service ID
    masterId: "64f8b2c3d1e2a3b4c5d6e7f9",   // Sample master ID
    appointmentDate: "2025-10-30",
    appointmentTime: "14:00",
    totalPrice: 50000,
    notes: "Test booking for notification"
  };
  
  try {
    console.log('📡 Sending booking request...');
    const response = await axios.post('http://localhost:5001/api/bookings', bookingData);
    console.log('✅ Booking created successfully!');
    console.log('📥 Response:', response.data);
  } catch (error) {
    console.log('❌ Error creating booking:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Message:', error.message);
    }
  }
}

testBookingNotification().catch(console.error);