import mongoose from 'mongoose';

const DeviceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  deviceName: {
    type: String, // e.g. "Living Room Light"
    required: true,
  },
  deviceType: {
    type: String, // e.g. "light", "sensor", "thermostat"
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false, // to turn a device ON/OFF (true/false)
  },
  status: {
    type: String,
    default: 'offline', // "online", "offline", "maintenance", "error"
    // can be set dynamically based on communication with the device
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
  settings: {
    type: Object,
    default: {},
  // This will be used to store device specific settings
  // e.g. temperature, humidity, etc.
  // and it will have a meaning based on the deviceType
  },
});

const Device = mongoose.model('Device', DeviceSchema);
export default Device;
