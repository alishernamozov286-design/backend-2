require('dotenv').config();
const { createTelegramBot } = require('./services/telegramBot');

async function testTelegram() {
  console.log('Testing Telegram bot...');
  
  // Check if token is loaded
  console.log('Token:', process.env.TELEGRAM_BOT_TOKEN ? 'Loaded' : 'Not loaded');
  console.log('Chat ID:', process.env.TELEGRAM_CHAT_ID ? 'Loaded' : 'Not loaded');
  
  const bot = createTelegramBot();
  if (!bot) {
    console.log('❌ Bot not initialized');
    return;
  }
  
  // Test sending a message
  const chatId = '7935196609';
  const result = await bot.sendTestMessage(chatId);
  
  if (result.success) {
    console.log('✅ Test message sent successfully!');
  } else {
    console.log('❌ Failed to send test message:', result.error);
  }
}

testTelegram().catch(console.error);