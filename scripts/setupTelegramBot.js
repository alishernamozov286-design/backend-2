require('dotenv').config();
const { createTelegramBot } = require('../services/telegramBot');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function setupBot() {
  console.log('🤖 Telegram Bot Sozlash');
  console.log('========================\n');

  // Bot token tekshirish
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.log('❌ TELEGRAM_BOT_TOKEN .env faylida sozlanmagan!');
    console.log('\n📝 Quyidagi qadamlarni bajaring:');
    console.log('1. Telegram da @BotFather ga yozing');
    console.log('2. /newbot buyrug\'ini yuboring');
    console.log('3. Bot nomi va username ni kiriting');
    console.log('4. Olingan tokenni .env faylida TELEGRAM_BOT_TOKEN ga qo\'ying\n');
    return;
  }

  const bot = createTelegramBot();
  if (!bot) {
    console.log('❌ Bot yaratilmadi!');
    return;
  }

  // Bot ma'lumotlarini olish
  console.log('🔄 Bot ma\'lumotlarini tekshirish...');
  const botInfo = await bot.getMe();
  
  if (!botInfo) {
    console.log('❌ Bot ma\'lumotlarini olishda xato! Token to\'g\'ri emasmi?');
    return;
  }

  console.log('\n✅ Bot muvaffaqiyatli topildi:');
  console.log(`📛 Nom: ${botInfo.first_name}`);
  console.log(`🆔 Username: @${botInfo.username}`);
  console.log(`🔢 ID: ${botInfo.id}\n`);

  // Chat ID sozlash
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!chatId) {
    console.log('⚠️  TELEGRAM_CHAT_ID sozlanmagan!');
    console.log('\n📝 Chat ID olish uchun:');
    console.log(`1. @${botInfo.username} botga yozing`);
    console.log('2. /start buyrug\'ini yuboring');
    console.log('3. Pastdagi API chaqiruvdan foydalaning:\n');
    
    rl.question('Username kiriting (masalan: alishernamozovvv): ', async (username) => {
      if (username) {
        const userChatId = await bot.getChatId(username);
        if (userChatId) {
          console.log(`\n✅ Chat ID topildi: ${userChatId}`);
          console.log('\n📝 .env fayliga quyidagini qo\'shing:');
          console.log(`TELEGRAM_CHAT_ID=${userChatId}\n`);
          
          // Test xabar yuborish
          rl.question('Test xabar yuborish xohlaysizmi? (y/n): ', async (answer) => {
            if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
              const result = await bot.sendTestMessage(userChatId);
              if (result.success) {
                console.log('✅ Test xabar yuborildi!');
              } else {
                console.log('❌ Test xabar yuborishda xato:', result.error);
              }
            }
            rl.close();
          });
        } else {
          console.log('❌ Chat ID topilmadi. Avval botga /start buyrug\'ini yuboring.');
          rl.close();
        }
      } else {
        rl.close();
      }
    });
  } else {
    console.log(`✅ TELEGRAM_CHAT_ID sozlangan: ${chatId}`);
    
    // Test xabar yuborish
    rl.question('Test xabar yuborish xohlaysizmi? (y/n): ', async (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        const result = await bot.sendTestMessage(chatId);
        if (result.success) {
          console.log('✅ Test xabar yuborildi!');
        } else {
          console.log('❌ Test xabar yuborishda xato:', result.error);
        }
      }
      rl.close();
    });
  }
}

// Help ma'lumotlari
function showHelp() {
  console.log('🤖 Telegram Bot Sozlash Yo\'riqnomasi');
  console.log('=====================================\n');
  
  console.log('📝 1. Bot yaratish:');
  console.log('   - Telegram da @BotFather ga yozing');
  console.log('   - /newbot buyrug\'ini yuboring');
  console.log('   - Bot nomini kiriting (masalan: "Barbershop Booking Bot")');
  console.log('   - Bot username ni kiriting (masalan: "barbershop_booking_bot")');
  console.log('   - Tokenni nusxalab .env faylida TELEGRAM_BOT_TOKEN ga qo\'ying\n');
  
  console.log('📝 2. Chat ID olish:');
  console.log('   - Yaratilgan botga yozing');
  console.log('   - /start buyrug\'ini yuboring');
  console.log('   - Bu skriptni ishga tushiring: node scripts/setupTelegramBot.js');
  console.log('   - Username ni kiriting va Chat ID ni oling\n');
  
  console.log('📝 3. API endpointlari:');
  console.log('   - GET /api/telegram/bot-info - Bot ma\'lumotlari');
  console.log('   - POST /api/telegram/get-chat-id - Chat ID olish');
  console.log('   - POST /api/telegram/send-test - Test xabar');
  console.log('   - GET /api/telegram/updates - Bot updates\n');
}

// Argumentlarni tekshirish
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  showHelp();
} else {
  setupBot().catch(console.error);
}