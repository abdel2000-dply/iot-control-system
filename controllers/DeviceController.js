import Device from '../models/Device';

class DeviceController {
  static async newDevice(req, res) {
    // Post - Create a new device
  }

  static async getDeviceById(req, res) {
    // GET - Get a device by ID
  }

  static async listAllDevices(req, res) {
    // GET - List all devices of that user
  }

  static async toggleDeviceState(req, res) {
    // PUT - turn a device ON/OFF
  }
  
  static async getDeviceStatus(req, res) {
    // GET - Get the status of a device (ON/OFF)
  }

}

export default DeviceController;
