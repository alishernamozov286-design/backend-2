require('dotenv').config();
const { createTelegramBot } = require('./services/telegramBot');

async function testTelegram() {
  console.log('🔍 Testing Telegram configuration...');
  
  // Check environment variables
  console.log('TELEGRAM_BOT_TOKEN exists:', !!process.env.TELEGRAM_BOT_TOKEN);
  console.log('TELEGRAM_CHAT_ID exists:', !!process.env.TELEGRAM_CHAT_ID);
  
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.log('❌ TELEGRAM_BOT_TOKEN is not set in .env file');
    return;
  }
  
  if (!process.env.TELEGRAM_CHAT_ID) {
    console.log('❌ TELEGRAM_CHAT_ID is not set in .env file');
    return;
  }
  
  const bot = createTelegramBot();
  if (!bot) {
    console.log('❌ Failed to create Telegram bot instance');
    return;
  }
  
  console.log('🔄 Getting bot information...');
  const botInfo = await bot.getMe();
  if (!botInfo) {
    console.log('❌ Failed to get bot information');
    return;
  }
  
  console.log('✅ Bot information retrieved successfully:');
  console.log('   Name:', botInfo.first_name);
  console.log('   Username:', botInfo.username);
  console.log('   ID:', botInfo.id);
  
  console.log('🔄 Sending test message...');
  const result = await bot.sendTestMessage(process.env.TELEGRAM_CHAT_ID);
  if (result.success) {
    console.log('✅ Test message sent successfully!');
  } else {
    console.log('❌ Failed to send test message:', result.error);
  }
}

testTelegram().catch(console.error);