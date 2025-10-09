const fetch = require('node-fetch');

async function testCreateBooking() {
  console.log('Testing booking creation...');
  
  // Mock booking data
  const bookingData = {
    customerName: 'Alisher Namozov',
    customerPhone: '+998901234567',
    customerEmail: 'alisher@example.com',
    serviceId: '1',
    masterId: '1',
    appointmentDate: '2024-12-15',
    appointmentTime: '14:30',
    totalPrice: 50000,
    notes: 'Test booking through API'
  };
  
  try {
    const response = await fetch('http://localhost:5002/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Booking created successfully!');
      console.log('Booking ID:', result._id || result.id);
    } else {
      console.log('❌ Failed to create booking:', result.message);
      console.log('Full error:', result);
    }
  } catch (error) {
    console.log('❌ Error creating booking:', error.message);
    console.log('Error details:', error);
  }
}

testCreateBooking().catch(console.error);