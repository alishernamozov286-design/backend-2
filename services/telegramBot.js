const fetch = require('node-fetch');

class TelegramBotService {
  constructor(token) {
    this.token = token;
    this.baseUrl = `https://api.telegram.org/bot${token}`;
  }

  // Botning chat ID sini olish uchun
  async getUpdates() {
    try {
      const response = await fetch(`${this.baseUrl}/getUpdates`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('❌ Bot updates olishda xato:', error.message);
      return null;
    }
  }

  // Xabar yuborish
  async sendMessage(chatId, text, options = {}) {
    try {
      const payload = {
        chat_id: chatId,
        text: text,
        parse_mode: options.parse_mode || 'HTML',
        ...options
      };

      const response = await fetch(`${this.baseUrl}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('❌ Telegram xato:', response.status, result);
        return { success: false, error: result.description || 'Unknown error' };
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('❌ Telegram yuborishda xato:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Bot ma'lumotlarini olish
  async getMe() {
    try {
      const response = await fetch(`${this.baseUrl}/getMe`);
      const result = await response.json();
      
      if (result.ok) {
        console.log('✅ Bot ma\'lumotlari:', {
          username: result.result.username,
          first_name: result.result.first_name,
          id: result.result.id
        });
        return result.result;
      } else {
        console.error('❌ Bot ma\'lumotlarini olishda xato:', result);
        return null;
      }
    } catch (error) {
      console.error('❌ Bot ma\'lumotlarini olishda xato:', error.message);
      return null;
    }
  }

  // Chat ID ni olish (admin uchun)
  async getChatId(username) {
    try {
      const updates = await this.getUpdates();
      if (updates && updates.result) {
        for (const update of updates.result) {
          if (update.message && update.message.from && 
              update.message.from.username === username.replace('@', '')) {
            return update.message.from.id;
          }
        }
      }
      return null;
    } catch (error) {
      console.error('❌ Chat ID olishda xato:', error.message);
      return null;
    }
  }

  // Test xabar yuborish
  async sendTestMessage(chatId) {
    const testMessage = `
🤖 <b>Barbershop Bot Test</b>

✅ Bot muvaffaqiyatli sozlandi!
📅 Sana: ${new Date().toLocaleString('uz-UZ')}

Bu test xabari. Bot endi bron qilinganida sizga xabar yuboradi.
    `.trim();

    return await this.sendMessage(chatId, testMessage);
  }
}

// Singleton pattern
let botInstance = null;

function createTelegramBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.log('⚠️ Telegram bot token sozlanmagan');
    return null;
  }
  
  if (!botInstance) {
    botInstance = new TelegramBotService(token);
  }
  
  return botInstance;
}

module.exports = { TelegramBotService, createTelegramBot };