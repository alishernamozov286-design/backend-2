const fetch = require('node-fetch');
const Master = require('../models/Master');
const { mockMasters } = require('../mockData');

const formatBookingMessage = (booking) => {
  const svc = booking.serviceId && booking.serviceId.name ? booking.serviceId.name : 'Xizmat';
  const master = booking.masterId && booking.masterId.name ? booking.masterId.name : 'Usta';
  const date = booking.appointmentDate ? new Date(booking.appointmentDate).toLocaleDateString('uz-UZ') : '';
  const time = booking.appointmentTime || '';
  const price = booking.totalPrice ? new Intl.NumberFormat('uz-UZ').format(booking.totalPrice) + " so'm" : '';
  const createdAt = booking.createdAt ? new Date(booking.createdAt).toLocaleString('uz-UZ') : '';

  return [
    '🎉 <b>Yangi bron qilindi!</b>',
    '',
    `<b>👤 Mijoz:</b> ${booking.customerName || ''}`,
    `<b>📞 Telefon:</b> ${booking.customerPhone || ''}`,
    booking.customerEmail ? `<b>✉️ Email:</b> ${booking.customerEmail}` : null,
    '',
    `<b>💈 Xizmat:</b> ${svc}`,
    `<b>🧑‍🔧 Usta:</b> ${master}`,
    `<b>📅 Sana:</b> ${date}`,
    `<b>⏰ Vaqt:</b> ${time}`,
    `<b>💵 Narx:</b> ${price}`,
    `<b>🕒 Yaratilgan vaqt:</b> ${createdAt}`,
    '',
    booking.notes ? `<b>📝 Izoh:</b> ${booking.notes}` : null,
    '',
    '<b>✅ Status:</b> Kutilmoqda'
  ].filter(Boolean).join('\n');
};

const formatWorkerBookingMessage = (booking) => {
  const svc = booking.serviceId && booking.serviceId.name ? booking.serviceId.name : 'Xizmat';
  const date = booking.appointmentDate ? new Date(booking.appointmentDate).toLocaleDateString('uz-UZ') : '';
  const time = booking.appointmentTime || '';
  const price = booking.totalPrice ? new Intl.NumberFormat('uz-UZ').format(booking.totalPrice) + " so'm" : '';

  return [
    '🔔 <b>Sizga yangi buyurtma!</b>',
    '',
    `<b>👤 Mijoz:</b> ${booking.customerName || ''}`,
    `<b>📞 Telefon:</b> ${booking.customerPhone || ''}`,
    '',
    `<b>💈 Xizmat:</b> ${svc}`,
    `<b>📅 Sana:</b> ${date}`,
    `<b>⏰ Vaqt:</b> ${time}`,
    `<b>💵 Narx:</b> ${price}`,
    '',
    'Iltimos, mijozni kutib oling!'
  ].filter(Boolean).join('\n');
};

async function sendTelegramMessage(text, recipientChatId = null) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const defaultChatId = process.env.TELEGRAM_CHAT_ID;
  const chatId = recipientChatId || defaultChatId; // Use provided chat ID or default
  
  console.log('🔍 Telegram notification attempt:');
  console.log('  Token exists:', !!token);
  console.log('  Default Chat ID exists:', !!defaultChatId);
  console.log('  Provided Chat ID:', recipientChatId);
  console.log('  Final Chat ID to use:', chatId);
  
  if (!token) {
    console.log('❌ Telegram Bot Token sozlanmagan!');
    return { success: false, error: 'Bot token yo\'q' };
  }
  
  if (!chatId) {
    console.log('❌ Telegram Chat ID sozlanmagan!');
    return { success: false, error: 'Chat ID yo\'q' };
  }
  
  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    console.log('📡 Sending request to:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        chat_id: chatId, 
        text: text,
        parse_mode: 'HTML'
      })
    });
    
    const result = await response.json();
    console.log('📥 Telegram API response status:', response.status);
    console.log('📥 Telegram API response body:', JSON.stringify(result, null, 2));
    
    if (!response.ok) {
      console.error('❌ Telegram xato:', response.status, result);
      return { success: false, error: result.description || 'Unknown error' };
    }
    
    console.log('✅ Telegram xabar yuborildi!');
    return { success: true, data: result };
  } catch (e) {
    console.error('❌ Telegram yuborishda xato:', e.message);
    console.error('❌ Xato tafsilotlari:', e);
    return { success: false, error: e.message };
  }
}

async function notifyBooking(booking) {
  try {
    console.log('🔔 Booking notification triggered for:', booking.customerName);
    const text = formatBookingMessage(booking);
    console.log('📝 Formatted message:', text);
    
    // Send notification to admin
    const adminResult = await sendTelegramMessage(text);
    if (!adminResult.success) {
      console.error('❌ Booking notification xatosi (admin):', adminResult.error);
    } else {
      console.log('✅ Booking notification sent to admin successfully!');
    }
    
    // Send notification to worker
    let workerChatId = null;
    
    // Check if we're using mock data or real data
    if (global.useMockData) {
      const master = mockMasters.find(m => m._id.toString() === booking.masterId);
      workerChatId = master ? master.telegramChatId : null;
    } else {
      // For real data, get the master's chat ID from the database
      try {
        const master = await Master.findById(booking.masterId);
        workerChatId = master ? master.telegramChatId : null;
      } catch (error) {
        console.error('❌ Error getting master data:', error.message);
      }
    }
    
    // If worker has a chat ID, send notification to worker
    if (workerChatId) {
      const workerText = formatWorkerBookingMessage(booking);
      const workerResult = await sendTelegramMessage(workerText, workerChatId);
      if (!workerResult.success) {
        console.error('❌ Booking notification xatosi (worker):', workerResult.error);
      } else {
        console.log('✅ Booking notification sent to worker successfully!');
      }
    } else {
      console.log('ℹ️  Worker notification skipped (no chat ID for worker)');
    }
    
    return adminResult;
  } catch (error) {
    console.error('❌ Booking notificationda kutilmagan xato:', error.message);
    return { success: false, error: error.message };
  }
}

module.exports = { notifyBooking, sendTelegramMessage };