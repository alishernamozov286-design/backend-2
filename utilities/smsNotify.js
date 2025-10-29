const axios = require('axios');

// Eskiz.uz SMS API sozlamalari
const SMS_CONFIG = {
  baseURL: 'https://notify.eskiz.uz/api',
  email: process.env.ESKIZ_EMAIL || 'your-email@example.com',
  password: process.env.ESKIZ_PASSWORD || 'your-password',
  token: null,
  tokenExpiry: null
};

// Token olish
async function getAuthToken() {
  try {
    if (SMS_CONFIG.token && SMS_CONFIG.tokenExpiry && new Date() < SMS_CONFIG.tokenExpiry) {
      return SMS_CONFIG.token;
    }

    const response = await axios.post(`${SMS_CONFIG.baseURL}/auth/login`, {
      email: SMS_CONFIG.email,
      password: SMS_CONFIG.password
    });

    if (response.data && response.data.data && response.data.data.token) {
      SMS_CONFIG.token = response.data.data.token;
      // Token 30 kun amal qiladi
      SMS_CONFIG.tokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      console.log('✅ SMS token muvaffaqiyatli olindi');
      return SMS_CONFIG.token;
    } else {
      throw new Error('Token olinmadi');
    }
  } catch (error) {
    console.error('❌ SMS token olishda xatolik:', error.message);
    return null;
  }
}

// SMS yuborish
async function sendSMS(phone, message) {
  try {
    // Test rejimi - haqiqiy SMS yuborish o'rniga console log
    if (process.env.NODE_ENV === 'development' || !SMS_CONFIG.email || SMS_CONFIG.email === 'your-email@example.com') {
      console.log('📱 TEST SMS (haqiqiy SMS yuborilmadi):');
      console.log('   Telefon:', phone);
      console.log('   Xabar:', message);
      console.log('   ----------------------------------------');
      return { success: true, messageId: 'test-' + Date.now() };
    }

    const token = await getAuthToken();
    if (!token) {
      return { success: false, error: 'Token olinmadi' };
    }

    // Telefon raqamni to'g'ri formatga keltirish
    let formattedPhone = phone.replace(/\D/g, '');
    if (formattedPhone.startsWith('998')) {
      formattedPhone = formattedPhone;
    } else if (formattedPhone.length === 9) {
      formattedPhone = '998' + formattedPhone;
    } else {
      return { success: false, error: 'Telefon raqam formati noto\'g\'ri' };
    }

    const response = await axios.post(
      `${SMS_CONFIG.baseURL}/message/sms/send`,
      {
        mobile_phone: formattedPhone,
        message: message,
        from: '4546'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data.status === 'success') {
      console.log('✅ SMS muvaffaqiyatli yuborildi:', formattedPhone);
      return { success: true, messageId: response.data.data.id };
    } else {
      console.error('❌ SMS yuborishda xatolik:', response.data);
      return { success: false, error: response.data.message || 'SMS yuborilmadi' };
    }
  } catch (error) {
    console.error('❌ SMS yuborishda xatolik:', error.message);
    return { success: false, error: error.message };
  }
}

// Bron tasdiqlanganida SMS
async function sendBookingConfirmedSMS(booking) {
  const message = `Hurmatli ${booking.customerName}! 
Sizning ${new Date(booking.appointmentDate).toLocaleDateString('uz-UZ')} sanasiga ${booking.appointmentTime} vaqtga bronlashtirgan ${booking.serviceId.name} xizmatingiz TASDIQLANDI. 
Usta: ${booking.masterId.name}
Manzil: [Salon manzili]
Barbershop`;

  return await sendSMS(booking.customerPhone, message);
}

// Bron bekor qilinganida SMS
async function sendBookingCancelledSMS(booking) {
  const message = `Hurmatli ${booking.customerName}! 
Afsuski, ${new Date(booking.appointmentDate).toLocaleDateString('uz-UZ')} sanasiga ${booking.appointmentTime} vaqtga bronlashtirgan ${booking.serviceId.name} xizmatingiz BEKOR QILINDI. 
Boshqa vaqt uchun: +998 XX XXX XX XX
Barbershop`;

  return await sendSMS(booking.customerPhone, message);
}

// Bron bajarilganida SMS
async function sendBookingCompletedSMS(booking) {
  const message = `Hurmatli ${booking.customerName}! 
${booking.serviceId.name} xizmati muvaffaqiyatli bajarildi. 
Xizmatimizdan foydalanganingiz uchun rahmat! 
Yana kutamiz: +998 XX XXX XX XX
Barbershop`;

  return await sendSMS(booking.customerPhone, message);
}

module.exports = {
  sendSMS,
  sendBookingConfirmedSMS,
  sendBookingCancelledSMS,
  sendBookingCompletedSMS
};