require('dotenv').config();
const { createTelegramBot } = require('../services/telegramBot');

async function testTelegram() {
  console.log('🔍 Testing Telegram Bot...');
  
  const bot = createTelegramBot();
  if (!bot) {
    console.log('❌ Bot not initialized');
    return;
  }

  // Test bot info
  console.log('🔄 Getting bot info...');
  const botInfo = await bot.getMe();
  if (botInfo) {
    console.log('✅ Bot Info:');
    console.log(`   Name: ${botInfo.first_name}`);
    console.log(`   Username: @${botInfo.username}`);
    console.log(`   ID: ${botInfo.id}`);
  } else {
    console.log('❌ Failed to get bot info');
    return;
  }

  // Test sending message
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (chatId) {
    console.log(`\n🔄 Sending test message to chat ID: ${chatId}...`);
    const result = await bot.sendTestMessage(chatId);
    if (result.success) {
      console.log('✅ Test message sent successfully!');
    } else {
      console.log('❌ Failed to send test message:', result.error);
    }
  } else {
    console.log('⚠️ TELEGRAM_CHAT_ID not set in .env file');
  }
}

testTelegram().catch(console.error);