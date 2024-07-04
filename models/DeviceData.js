import mongoose from 'mongoose';

const DeviceDataSchema = new mongoose.Schema({
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  data: {
    type: Object, // e.g. { temperature: 25, humidity: 50 }
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
    // depending on the device, the data could be sent frequently (e.g. every 5s, 30min, etc.)
  }
});

const DeviceData = mongoose.model('DeviceData', DeviceDataSchema);

export default DeviceData;
