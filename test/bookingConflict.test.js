const mongoose = require('mongoose');
const express = require('express');
const request = require('supertest');
const bookingRoutes = require('../routes/bookings');
const { mockBookings, mockServices, mockMasters } = require('../mockData');

// Create express app for testing
const app = express();
app.use(express.json());
app.use('/api/bookings', bookingRoutes);

// Mock mongoose
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    connect: jest.fn().mockResolvedValue(),
    connection: {
      readyState: 1,
      close: jest.fn().mockResolvedValue()
    }
  };
});

describe('Booking Conflict Detection', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Reset global mock data flag
    global.useMockData = true;
    
    // Clear mock bookings
    mockBookings.length = 0;
  });

  it('should return "Bu usta band!" when same master is booked at same time', async () => {
    // Add a conflicting booking to mock data
    mockBookings.push({
      _id: '1',
      masterId: 'master1',
      appointmentDate: new Date('2023-10-15'),
      appointmentTime: '10:00',
      status: 'tasdiqlangan'
    });

    const response = await request(app)
      .post('/api/bookings')
      .send({
        customerName: 'Test User',
        customerPhone: '+998901234567',
        serviceId: 'service1',
        masterId: 'master1',
        appointmentDate: '2023-10-15',
        appointmentTime: '10:00',
        totalPrice: 50000
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Bu usta band!');
  });

  it('should return "Bu kun band!" when same date and time is booked with different master', async () => {
    // Add a conflicting booking to mock data with different master
    mockBookings.push({
      _id: '1',
      masterId: 'master2', // Different master
      appointmentDate: new Date('2023-10-15'),
      appointmentTime: '10:00',
      status: 'tasdiqlangan'
    });

    const response = await request(app)
      .post('/api/bookings')
      .send({
        customerName: 'Test User',
        customerPhone: '+998901234567',
        serviceId: 'service1',
        masterId: 'master1', // Different master
        appointmentDate: '2023-10-15',
        appointmentTime: '10:00',
        totalPrice: 50000
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Bu kun band!');
  });

  it('should return "Bu vaqt band!" when same time is booked regardless of date or master', async () => {
    // Add a conflicting booking to mock data with different master and date
    mockBookings.push({
      _id: '1',
      masterId: 'master2', // Different master
      appointmentDate: new Date('2023-10-16'), // Different date
      appointmentTime: '10:00',
      status: 'tasdiqlangan'
    });

    const response = await request(app)
      .post('/api/bookings')
      .send({
        customerName: 'Test User',
        customerPhone: '+998901234567',
        serviceId: 'service1',
        masterId: 'master1', // Different master
        appointmentDate: '2023-10-15', // Different date
        appointmentTime: '10:00',
        totalPrice: 50000
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Bu vaqt band!');
  });

  it('should successfully create booking when no conflicts exist', async () => {
    // No conflicting bookings in mock data
    
    const response = await request(app)
      .post('/api/bookings')
      .send({
        customerName: 'Test User',
        customerPhone: '+998901234567',
        serviceId: 'service1',
        masterId: 'master1',
        appointmentDate: '2023-10-15',
        appointmentTime: '10:00',
        totalPrice: 50000
      });

    expect(response.status).toBe(201);
    expect(response.body.customerName).toBe('Test User');
  });
});