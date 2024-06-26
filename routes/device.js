import express from 'express';
import DeviceController from '../controllers/DeviceController';
import auth from '../middleware/auth';

const deviceRoutes = express.Router();

// POST - Add a new device
deviceRoutes.post('/', auth, DeviceController.newDevice);

// GET - Get a device by ID
deviceRoutes.get('/:deviceId', auth, DeviceController.getDeviceById);

// GET - List all devices of that user
deviceRoutes.get('/', auth, DeviceController.listAllDevices);

// GET - Get status of a device by ID
deviceRoutes.get('/:deviceId/status', auth, DeviceController.getDeviceStatus);

// PUT - turn a device ON/OFF
deviceRoutes.put('/:deviceId/toggle', auth, DeviceController.toggleDeviceState);

// PUT - Update a device by ID
deviceRoutes.put('/:deviceId', auth, DeviceController.updateDevice);

// DELETE - Delete a device by ID
deviceRoutes.delete('/:deviceId', auth, DeviceController.deleteDevice);

export default deviceRoutes;
