const axios = require('axios');

async function testRealBooking() {
  console.log('🔍 Testing booking creation with real data...');
  
  try {
    // Get services
    console.log('📡 Getting services...');
    const servicesResponse = await axios.get('http://localhost:5001/api/services');
    const services = servicesResponse.data;
    console.log(`✅ Found ${services.length} services`);
    
    // Get masters
    console.log('📡 Getting masters...');
    const mastersResponse = await axios.get('http://localhost:5001/api/masters');
    const masters = mastersResponse.data;
    console.log(`✅ Found ${masters.length} masters`);
    
    if (services.length === 0 || masters.length === 0) {
      console.log('❌ No services or masters found');
      return;
    }
    
    // Use the first service and master
    const service = services[0];
    const master = masters[0];
    
    console.log(`📝 Using service: ${service.name} (${service._id})`);
    console.log(`📝 Using master: ${master.name} (${master._id})`);
    
    // Booking data
    const bookingData = {
      customerName: "Test User",
      customerPhone: "931234567",
      customerEmail: "test@example.com",
      serviceId: service._id,
      masterId: master._id,
      appointmentDate: "2025-10-30",
      appointmentTime: "14:30",
      totalPrice: service.price, // Add the price from the service
      notes: "Test booking with real data"
    };
    
    console.log('📡 Sending booking request...');
    const response = await axios.post('http://localhost:5001/api/bookings', bookingData);
    console.log('✅ Booking created successfully!');
    console.log('📥 Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('❌ Error during test:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Message:', error.message);
    }
  }
}

testRealBooking().catch(console.error);