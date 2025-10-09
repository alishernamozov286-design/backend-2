const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { mockServices } = require('../mockData');

// Get all services
router.get('/', async (req, res) => {
  try {
    if (global.useMockData) {
      console.log('ℹ️  Using mock data (services)');
      // Filter out inactive services
      const activeServices = mockServices.filter(service => service.isActive);
      return res.json(activeServices);
    }
    
    // Use real MongoDB
    const services = await Service.find({ isActive: true });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error occurred', error: error.message });
  }
});

// Get a single service
router.get('/:id', async (req, res) => {
  try {
    if (global.useMockData) {
      const service = mockServices.find(s => s._id.toString() === req.params.id && s.isActive);
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      return res.json(service);
    }
    
    // Use real MongoDB
    const service = await Service.findById(req.params.id);
    if (!service || !service.isActive) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error occurred', error: error.message });
  }
});

// Add new service
router.post('/', async (req, res) => {
  try {
    const { name, description, price, duration } = req.body;
    
    console.log("Creating new service with data:", { name, description, price, duration });
    
    // Validation
    if (!name || !description || !price || !duration) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (price <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }
    
    if (duration < 15) {
      return res.status(400).json({ message: 'Duration must be at least 15 minutes' });
    }
    
    if (global.useMockData) {
      const newService = {
        _id: require('mongoose').Types.ObjectId(),
        name,
        description,
        price: parseInt(price),
        duration: parseInt(duration),
        image: '',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockServices.push(newService);
      console.log("Service created in mock data:", newService);
      return res.status(201).json(newService);
    }
    
    // Use real MongoDB
    const service = new Service({
      name,
      description,
      price: parseInt(price),
      duration: parseInt(duration)
    });
    
    const savedService = await service.save();
    console.log("Service created in database:", savedService);
    res.status(201).json(savedService);
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ message: 'Server error occurred', error: error.message });
  }
});

// Update service
router.put('/:id', async (req, res) => {
  try {
    const { name, description, price, duration } = req.body;
    const serviceId = req.params.id;
    
    console.log("Updating service with ID:", serviceId);
    console.log("Update data:", { name, description, price, duration });
    
    // Validation
    if (!name || !description || !price || !duration) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (price <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }
    
    if (duration < 15) {
      return res.status(400).json({ message: 'Duration must be at least 15 minutes' });
    }
    
    if (global.useMockData) {
      const serviceIndex = mockServices.findIndex(s => s._id.toString() === serviceId && s.isActive);
      if (serviceIndex === -1) {
        console.log("Service not found in mock data");
        return res.status(404).json({ message: 'Service not found' });
      }
      
      mockServices[serviceIndex] = {
        ...mockServices[serviceIndex],
        name,
        description,
        price: parseInt(price),
        duration: parseInt(duration),
        updatedAt: new Date()
      };
      
      console.log("Service updated in mock data:", mockServices[serviceIndex]);
      return res.json(mockServices[serviceIndex]);
    }
    
    // Use real MongoDB
    // First check if service exists
    const existingService = await Service.findById(serviceId);
    if (!existingService) {
      console.log("Service not found in database");
      return res.status(404).json({ message: 'Service not found' });
    }
    
    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      {
        name,
        description,
        price: parseInt(price),
        duration: parseInt(duration)
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedService) {
      console.log("Service not found after update attempt");
      return res.status(404).json({ message: 'Service not found' });
    }
    
    console.log("Service updated in database:", updatedService);
    res.json(updatedService);
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ message: 'Server error occurred', error: error.message });
  }
});

// Delete service (set as inactive)
router.delete('/:id', async (req, res) => {
  try {
    const serviceId = req.params.id;
    console.log("Attempting to delete service with ID:", serviceId);
    
    if (global.useMockData) {
      const serviceIndex = mockServices.findIndex(s => s._id.toString() === serviceId && s.isActive);
      if (serviceIndex === -1) {
        console.log("Service not found in mock data");
        return res.status(404).json({ message: 'Service not found' });
      }
      
      mockServices[serviceIndex].isActive = false;
      console.log("Service marked as inactive in mock data");
      return res.json({ message: 'Service successfully deleted' });
    }
    
    // Use real MongoDB
    // First check if service exists
    const existingService = await Service.findById(serviceId);
    if (!existingService) {
      console.log("Service not found in database");
      return res.status(404).json({ message: 'Service not found' });
    }
    
    const service = await Service.findByIdAndUpdate(
      serviceId,
      { isActive: false },
      { new: true }
    );
    
    if (!service) {
      console.log("Service not found after update attempt");
      return res.status(404).json({ message: 'Service not found' });
    }
    
    console.log("Service successfully deleted:", service);
    res.json({ message: 'Service successfully deleted' });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ message: 'Server error occurred', error: error.message });
  }
});

module.exports = router;