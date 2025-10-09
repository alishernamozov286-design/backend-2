const express = require('express');
const router = express.Router();
const { createTelegramBot } = require('../services/telegramBot');
const { sendTelegramMessage } = require('../utilities/notify');

// Bot ma'lumotlarini olish
router.get('/bot-info', async (req, res) => {
  try {
    const bot = createTelegramBot();
    if (!bot) {
      return res.status(400).json({ 
        success: false, 
        message: 'Bot token sozlanmagan' 
      });
    }

    const botInfo = await bot.getMe();
    if (botInfo) {
      res.json({ 
        success: true, 
        data: botInfo,
        message: 'Bot ma\'lumotlari muvaffaqiyatli olindi'
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Bot ma\'lumotlarini olishda xato' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server xatosi', 
      error: error.message 
    });
  }
});

// Chat ID ni username orqali olish
router.post('/get-chat-id', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username talab qilinadi'
      });
    }

    const bot = createTelegramBot();
    if (!bot) {
      return res.status(400).json({ 
        success: false, 
        message: 'Bot token sozlanmagan' 
      });
    }

    const chatId = await bot.getChatId(username);
    if (chatId) {
      res.json({
        success: true,
        data: { chatId, username },
        message: 'Chat ID topildi'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Chat ID topilmadi. Avval botga /start buyrug\'ini yuboring.'
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server xatosi', 
      error: error.message 
    });
  }
});

// Test xabar yuborish
router.post('/send-test', async (req, res) => {
  try {
    const { chatId } = req.body;
    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: 'Chat ID talab qilinadi'
      });
    }

    const bot = createTelegramBot();
    if (!bot) {
      return res.status(400).json({ 
        success: false, 
        message: 'Bot token sozlanmagan' 
      });
    }

    const result = await bot.sendTestMessage(chatId);
    if (result.success) {
      res.json({
        success: true,
        message: 'Test xabar yuborildi!',
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Xabar yuborishda xato',
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server xatosi', 
      error: error.message 
    });
  }
});

// Xabar yuborish (umumiy)
router.post('/send-message', async (req, res) => {
  try {
    const { chatId, message } = req.body;
    
    if (!chatId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Chat ID va message talab qilinadi'
      });
    }

    const result = await sendTelegramMessage(message, chatId);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Xabar yuborildi!',
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Xabar yuborishda xato',
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server xatosi', 
      error: error.message 
    });
  }
});

// Bot updates olish (debug uchun)
router.get('/updates', async (req, res) => {
  try {
    const bot = createTelegramBot();
    if (!bot) {
      return res.status(400).json({ 
        success: false, 
        message: 'Bot token sozlanmagan' 
      });
    }

    const updates = await bot.getUpdates();
    res.json({ 
      success: true, 
      data: updates,
      message: 'Updates olindi'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server xatosi', 
      error: error.message 
    });
  }
});

module.exports = router;