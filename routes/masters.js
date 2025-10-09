const express = require('express');
const router = express.Router();
const Master = require('../models/Master');
const { mockMasters } = require('../mockData');

// Barcha ustalarni olish
router.get('/', async (req, res) => {
  try {
    if (global.useMockData) {
      console.log('ℹ️  Mock data dan foydalanilmoqda (masters)');
      return res.json(mockMasters);
    }
    
    // Real MongoDB dan foydalanish
    const masters = await Master.find({ isActive: true });
    res.json(masters);
  } catch (error) {
    res.status(500).json({ message: 'Serverda xatolik yuz berdi', error: error.message });
  }
});

// Bitta ustani olish
router.get('/:id', async (req, res) => {
  try {
    if (global.useMockData) {
      const master = mockMasters.find(m => m._id.toString() === req.params.id);
      if (!master) {
        return res.status(404).json({ message: 'Usta topilmadi' });
      }
      return res.json(master);
    }
    
    // Real MongoDB dan foydalanish
    const master = await Master.findById(req.params.id);
    if (!master) {
      return res.status(404).json({ message: 'Usta topilmadi' });
    }
    res.json(master);
  } catch (error) {
    res.status(500).json({ message: 'Serverda xatolik yuz berdi', error: error.message });
  }
});

// Yangi usta qo'shish
router.post('/', async (req, res) => {
  try {
    const { name, experience, specialization, phone, workingHours, workingDays } = req.body;
    
    // Validatsiya
    if (!name || !experience || !phone || !workingHours || !workingDays || !Array.isArray(specialization) || specialization.length === 0) {
      return res.status(400).json({ message: 'Barcha maydonlar to\'ldirilishi shart' });
    }
    
    if (global.useMockData) {
      const newMaster = {
        _id: require('mongoose').Types.ObjectId(),
        name,
        experience,
        specialization,
        phone,
        workingHours,
        workingDays,
        rating: 5.0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockMasters.push(newMaster);
      return res.status(201).json(newMaster);
    }
    
    // Real MongoDB dan foydalanish
    const master = new Master({
      name,
      experience,
      specialization,
      phone,
      workingHours,
      workingDays
    });
    
    const savedMaster = await master.save();
    res.status(201).json(savedMaster);
  } catch (error) {
    res.status(500).json({ message: 'Serverda xatolik yuz berdi', error: error.message });
  }
});

// Ustani yangilash
router.put('/:id', async (req, res) => {
  try {
    const { name, experience, specialization, phone, workingHours, workingDays } = req.body;
    
    // Validatsiya
    if (!name || !experience || !phone || !workingHours || !workingDays || !Array.isArray(specialization) || specialization.length === 0) {
      return res.status(400).json({ message: 'Barcha maydonlar to\'ldirilishi shart' });
    }
    
    if (global.useMockData) {
      const masterIndex = mockMasters.findIndex(m => m._id.toString() === req.params.id);
      if (masterIndex === -1) {
        return res.status(404).json({ message: 'Usta topilmadi' });
      }
      
      mockMasters[masterIndex] = {
        ...mockMasters[masterIndex],
        name,
        experience,
        specialization,
        phone,
        workingHours,
        workingDays,
        updatedAt: new Date()
      };
      
      return res.json(mockMasters[masterIndex]);
    }
    
    // Real MongoDB dan foydalanish
    const updatedMaster = await Master.findByIdAndUpdate(
      req.params.id,
      {
        name,
        experience,
        specialization,
        phone,
        workingHours,
        workingDays
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedMaster) {
      return res.status(404).json({ message: 'Usta topilmadi' });
    }
    
    res.json(updatedMaster);
  } catch (error) {
    res.status(500).json({ message: 'Serverda xatolik yuz berdi', error: error.message });
  }
});

// Ustani o'chirish (faol emas qilish)
router.delete('/:id', async (req, res) => {
  try {
    if (global.useMockData) {
      const masterIndex = mockMasters.findIndex(m => m._id.toString() === req.params.id);
      if (masterIndex === -1) {
        return res.status(404).json({ message: 'Usta topilmadi' });
      }
      
      mockMasters[masterIndex].isActive = false;
      return res.json({ message: 'Usta muvaffaqiyatli o\'chirildi' });
    }
    
    // Real MongoDB dan foydalanish
    const master = await Master.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!master) {
      return res.status(404).json({ message: 'Usta topilmadi' });
    }
    
    res.json({ message: 'Usta muvaffaqiyatli o\'chirildi' });
  } catch (error) {
    res.status(500).json({ message: 'Serverda xatolik yuz berdi', error: error.message });
  }
});

module.exports = router;