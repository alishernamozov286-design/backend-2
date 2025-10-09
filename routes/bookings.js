const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { mockBookings, mockServices, mockMasters } = require('../mockData');
const mongoose = require('mongoose');
const { notifyBooking } = require('../utilities/notify');

// Barcha bronlarni olish
router.get('/', async (req, res) => {
  try {
    if (global.useMockData) {
      const activeBookings = mockBookings.filter(b => !b.isDeleted);
      return res.json(activeBookings);
    }
    
    const bookings = await Booking.find({ isDeleted: { $ne: true } })
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
      // Mock data bilan ishlash
      // Check for specific conflicts in order of priority
      // 1. Exact conflict (master + date + time)
      const exactConflict = mockBookings.find(b => 
        b.masterId.toString() === masterId &&
        b.appointmentDate.toDateString() === new Date(appointmentDate).toDateString() &&
        b.appointmentTime === appointmentTime &&
        ['kutilmoqda', 'tasdiqlangan'].includes(b.status)
      );
      
      if (exactConflict) {
        return res.status(400).json({ message: 'Bu usta band!' });
      }
      
      // 2. Date and time conflict (any master)
      const dateTimeConflict = mockBookings.find(b => 
        b.appointmentDate.toDateString() === new Date(appointmentDate).toDateString() &&
        b.appointmentTime === appointmentTime &&
        ['kutilmoqda', 'tasdiqlangan'].includes(b.status)
      );
      
      if (dateTimeConflict) {
        return res.status(400).json({ message: 'Bu kun band!' });
      }
      
      // 3. Time conflict (any date, any master)
      const timeConflict = mockBookings.find(b => 
        b.appointmentTime === appointmentTime &&
        ['kutilmoqda', 'tasdiqlangan'].includes(b.status)
      );
      
      if (timeConflict) {
        return res.status(400).json({ message: 'Bu vaqt band!' });
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
      notifyBooking(populatedBooking).catch(()=>{});
      
      return res.status(201).json(populatedBooking);
    }
    
    // Check for specific conflicts in order of priority
    // 1. Exact conflict (master + date + time)
    const exactConflict = await Booking.findOne({
      masterId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { $in: ['kutilmoqda', 'tasdiqlangan'] }
    });

    if (exactConflict) {
      return res.status(400).json({ message: 'Bu usta band!' });
    }
    
    // 2. Date and time conflict (any master)
    const dateTimeConflict = await Booking.findOne({
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { $in: ['kutilmoqda', 'tasdiqlangan'] }
    });

    if (dateTimeConflict) {
      return res.status(400).json({ message: 'Bu kun band!' });
    }
    
    // 3. Time conflict (any date, any master)
    const timeConflict = await Booking.findOne({
      appointmentTime,
      status: { $in: ['kutilmoqda', 'tasdiqlangan'] }
    });

    if (timeConflict) {
      return res.status(400).json({ message: 'Bu vaqt band!' });
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
    notifyBooking(populatedBooking).catch(()=>{});
    
    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(400).json({ message: 'Bron qilishda xatolik', error: error.message });
  }
});

// Bron statusini o'zgartirish
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('serviceId').populate('masterId');
    
    if (!booking) {
      return res.status(404).json({ message: 'Bron topilmadi' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: 'Status o\'zgartirishda xatolik', error: error.message });
  }
});

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