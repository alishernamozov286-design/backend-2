const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { mockBookings, mockServices, mockMasters } = require('../mockData');
const mongoose = require('mongoose');
const { notifyBooking } = require('../utilities/notify');
const { 
  sendBookingConfirmedSMS, 
  sendBookingCancelledSMS, 
  sendBookingCompletedSMS 
} = require('../utilities/smsNotify');

// Barcha bronlarni olish
router.get('/', async (req, res) => {
  try {
    const { masterId, date } = req.query;
    
    if (global.useMockData) {
      let activeBookings = mockBookings.filter(b => !b.isDeleted);
      
      // Agar masterId va date berilgan bo'lsa, filtrlash
      if (masterId && date) {
        activeBookings = activeBookings.filter(b => 
          b.masterId.toString() === masterId &&
          new Date(b.appointmentDate).toDateString() === new Date(date).toDateString() &&
          b.status !== 'bekor_qilingan'
        );
      }
      
      return res.json(activeBookings);
    }
    
    let query = { isDeleted: { $ne: true } };
    
    // Agar masterId va date berilgan bo'lsa, qo'shimcha filtr qo'shish
    if (masterId && date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      query.masterId = masterId;
      query.appointmentDate = { $gte: startOfDay, $lte: endOfDay };
      query.status = { $ne: 'bekor_qilingan' };
    }
    
    const bookings = await Booking.find(query)
      .populate('serviceId', 'name price duration')
      .populate('masterId', 'name phone')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Serverda xatolik yuz berdi', error: error.message });
  }
});

// Bitta bronni olish
router.get('/:id', async (req, res) => {
  try {
    if (global.useMockData) {
      const booking = mockBookings.find(b => b._id.toString() === req.params.id && !b.isDeleted);
      if (!booking) {
        return res.status(404).json({ message: 'Bron topilmadi' });
      }
      return res.json(booking);
    }
    
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      isDeleted: { $ne: true } 
    })
      .populate('serviceId')
      .populate('masterId');
    if (!booking) {
      return res.status(404).json({ message: 'Bron topilmadi' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Serverda xatolik yuz berdi', error: error.message });
  }
});

// Yangi bron qo'shish
router.post('/', async (req, res) => {
  try {
    const { 
      customerName, 
      customerPhone, 
      customerEmail, 
      serviceId, 
      masterId, 
      appointmentDate, 
      appointmentTime, 
      totalPrice, 
      notes 
    } = req.body;
    
    if (global.useMockData) {
      // Mock data bilan ishlash - vaqt toqnashuvini tekshirish
      const existingMockBooking = mockBookings.find(b => 
        b.masterId.toString() === masterId &&
        new Date(b.appointmentDate).toDateString() === new Date(appointmentDate).toDateString() &&
        b.appointmentTime === appointmentTime &&
        !b.isDeleted &&
        b.status !== 'bekor_qilingan'
      );

      if (existingMockBooking) {
        return res.status(400).json({ 
          message: 'Bu vaqtda usta band. Iltimos, boshqa vaqt tanlang.',
          conflict: true
        });
      }

      const newBooking = {
        _id: new mongoose.Types.ObjectId(),
        customerName,
        customerPhone,
        customerEmail,
        serviceId: serviceId,
        masterId: masterId,
        appointmentDate: new Date(appointmentDate),
        appointmentTime,
        totalPrice,
        status: 'kutilmoqda',
        notes,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockBookings.push(newBooking);
      
      // Populate with service and master info
      const service = mockServices.find(s => s._id.toString() === serviceId);
      const master = mockMasters.find(m => m._id.toString() === masterId);
      
      const populatedBooking = {
        ...newBooking,
        serviceId: service,
        masterId: master  
      };

      // Telegram xabarnoma
      notifyBooking(populatedBooking)
        .then(result => {
          if (!result.success) {
            console.error('⚠️ Telegram notification failed for mock booking:', result.error);
          }
        })
        .catch(error => {
          console.error('⚠️ Telegram notification error for mock booking:', error);
        });
      
      return res.status(201).json(populatedBooking);
    }
    
    // Vaqt toqnashuvini tekshirish
    const existingBooking = await Booking.findOne({
      masterId: masterId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime: appointmentTime,
      isDeleted: { $ne: true },
      status: { $ne: 'bekor_qilingan' }
    });

    if (existingBooking) {
      return res.status(400).json({ 
        message: 'Bu vaqtda usta band. Iltimos, boshqa vaqt tanlang.',
        conflict: true
      });
    }
    
    const newBooking = new Booking({
      customerName,
      customerPhone,
      customerEmail,
      serviceId,
      masterId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      totalPrice,
      notes
    });

    const savedBooking = await newBooking.save();
    const populatedBooking = await Booking.findById(savedBooking._id)
      .populate('serviceId')
      .populate('masterId');

    // Telegram xabarnoma
    notifyBooking(populatedBooking)
      .then(result => {
        if (!result.success) {
          console.error('⚠️ Telegram notification failed for real booking:', result.error);
        }
      })
      .catch(error => {
        console.error('⚠️ Telegram notification error for real booking:', error);
      });
  
    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(400).json({ message: 'Bron qilishda xatolik', error: error.message });
  }
});

// Bron statusini o'zgartirish
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (global.useMockData) {
      // Mock data bilan ishlash
      const bookingIndex = mockBookings.findIndex(b => b._id.toString() === req.params.id && !b.isDeleted);
      if (bookingIndex === -1) {
        return res.status(404).json({ message: 'Bron topilmadi' });
      }
      
      const oldStatus = mockBookings[bookingIndex].status;
      mockBookings[bookingIndex].status = status;
      mockBookings[bookingIndex].updatedAt = new Date();
      
      // Populate with service and master info
      const service = mockServices.find(s => s._id.toString() === mockBookings[bookingIndex].serviceId);
      const master = mockMasters.find(m => m._id.toString() === mockBookings[bookingIndex].masterId);
      
      const populatedBooking = {
        ...mockBookings[bookingIndex],
        serviceId: service,
        masterId: master
      };
      
      // SMS yuborish (faqat status o'zgargan bo'lsa)
      if (oldStatus !== status) {
        sendStatusChangeSMS(populatedBooking, status);
      }
      
      return res.json(populatedBooking);
    }
    
    // Real MongoDB bilan ishlash
    const oldBooking = await Booking.findById(req.params.id)
      .populate('serviceId')
      .populate('masterId');
      
    if (!oldBooking) {
      return res.status(404).json({ message: 'Bron topilmadi' });
    }
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('serviceId').populate('masterId');
    
    // SMS yuborish (faqat status o'zgargan bo'lsa)
    if (oldBooking.status !== status) {
      sendStatusChangeSMS(booking, status);
    }
    
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: 'Status o\'zgartirishda xatolik', error: error.message });
  }
});

// Status o'zgarishida SMS yuborish funksiyasi
async function sendStatusChangeSMS(booking, newStatus) {
  try {
    let smsResult;
    
    switch (newStatus) {
      case 'tasdiqlangan':
        smsResult = await sendBookingConfirmedSMS(booking);
        console.log('📱 Tasdiq SMS yuborildi:', smsResult.success ? '✅' : '❌', booking.customerPhone);
        break;
        
      case 'bekor_qilingan':
        smsResult = await sendBookingCancelledSMS(booking);
        console.log('📱 Bekor qilish SMS yuborildi:', smsResult.success ? '✅' : '❌', booking.customerPhone);
        break;
        
      case 'bajarilgan':
        smsResult = await sendBookingCompletedSMS(booking);
        console.log('📱 Bajarildi SMS yuborildi:', smsResult.success ? '✅' : '❌', booking.customerPhone);
        break;
        
      default:
        console.log('📱 SMS yuborilmadi - status:', newStatus);
        break;
    }
    
    if (smsResult && !smsResult.success) {
      console.error('❌ SMS yuborishda xatolik:', smsResult.error);
    }
  } catch (error) {
    console.error('❌ SMS yuborishda xatolik:', error.message);
  }
}

// Soft delete booking
router.delete('/:id', async (req, res) => {
  try {
    const bookingId = req.params.id;
    console.log("Attempting to soft delete booking with ID:", bookingId);
    
    if (global.useMockData) {
      const bookingIndex = mockBookings.findIndex(b => b._id.toString() === bookingId);
      if (bookingIndex === -1) {
        console.log("Booking not found in mock data");
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      // Mark as deleted instead of removing
      mockBookings[bookingIndex].isDeleted = true;
      mockBookings[bookingIndex].deletedAt = new Date();
      console.log("Booking marked as deleted in mock data");
      return res.json({ message: 'Booking successfully deleted' });
    }
    
    // Use real MongoDB - update to mark as deleted instead of hard delete
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { 
        isDeleted: true, 
        deletedAt: new Date() 
      },
      { new: true }
    );
    
    if (!booking) {
      console.log("Booking not found in database");
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    console.log("Booking successfully soft deleted:", booking);
    res.json({ message: 'Booking successfully deleted' });
  } catch (error) {
    console.error("Error soft deleting booking:", error);
    res.status(500).json({ message: 'Server error occurred', error: error.message });
  }
});

// Get deleted bookings
router.get('/deleted', async (req, res) => {
  try {
    if (global.useMockData) {
      const deletedBookings = mockBookings.filter(b => b.isDeleted);
      return res.json(deletedBookings);
    }
    
    const deletedBookings = await Booking.find({ isDeleted: true })
      .populate('serviceId')
      .populate('masterId')
      .sort({ deletedAt: -1 });
    
    res.json(deletedBookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error occurred', error: error.message });
  }
});

// Restore deleted booking
router.patch('/:id/restore', async (req, res) => {
  try {
    const bookingId = req.params.id;
    
    if (global.useMockData) {
      const bookingIndex = mockBookings.findIndex(b => b._id.toString() === bookingId && b.isDeleted);
      if (bookingIndex === -1) {
        return res.status(404).json({ message: 'Deleted booking not found' });
      }
      
      // Unmark as deleted
      mockBookings[bookingIndex].isDeleted = false;
      mockBookings[bookingIndex].deletedAt = undefined;
      console.log("Booking restored in mock data:", mockBookings[bookingIndex]);
      return res.json(mockBookings[bookingIndex]);
    }
    
    // Use real MongoDB
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { 
        isDeleted: false, 
        deletedAt: undefined 
      },
      { 
        new: true 
      }
    ).populate('serviceId').populate('masterId');
    
    if (!booking) {
      return res.status(404).json({ message: 'Deleted booking not found' });
    }
    
    console.log("Booking successfully restored:", booking);
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error occurred', error: error.message });
  }
});

module.exports = router;









