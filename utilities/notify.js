const fetch = require('node-fetch');

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

async function sendTelegramMessage(text, recipientChatId = null) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const defaultChatId = process.env.TELEGRAM_CHAT_ID;
  const chatId = recipientChatId || defaultChatId; // Use provided chat ID or default
  
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
    const text = formatBookingMessage(booking);
    const result = await sendTelegramMessage(text);
    if (!result.success) {
      console.error('❌ Booking notification xatosi:', result.error);
    }
    return result;
  } catch (error) {
    console.error('❌ Booking notificationda kutilmagan xato:', error.message);
    return { success: false, error: error.message };
  }
}

module.exports = { notifyBooking, sendTelegramMessage };