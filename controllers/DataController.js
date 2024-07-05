import DeviceData from "../models/DeviceData";
import logger from "../utils/logger";

class DataController {
  static async getData(req, res) {
    const { deviceId } = req.params;
    const { startDate, endDate } = req.query;
    
    if (!startDate) {
      // default to 1 hour ago
      startDate = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    }

    if (!endDate) {
      endDate = new Date().toISOString();
    }

    try {
      const query = {
        deviceId,
        timestamp: { $gte: new Date(startDate), $lte: new Date(endDate) }
      };

      const data = await DeviceData.find(query).sort({ timestamp: 'asc' });

      if (data.length === 0) {
        logger.info(`No data found for device ${deviceId}`);
        return res.status(404).json({ error: 'No data found for this device in the specified time range' });
      }

      logger.info(`Data retrieved for device ${deviceId}`);
      res.json(data);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default DataController;
