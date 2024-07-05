import exspress from 'express';
import DataController from '../controllers/DataController.js';

const dataRoutes = exspress.Router();

/**
 * @swagger
 * /api/deviceData/{deviceId}:
 *   get:
 *     summary: Get device data
 *     description: Retrieve data for a specific device within a date range.
 *     tags: [DeviceData]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: deviceId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device
 *       - name: startDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date for the data retrieval
 *       - name: endDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date for the data retrieval
 *     responses:
 *       200:
 *         description: Device data retrieved successfully
 *       404:
 *         description: Device not found
 */
dataRoutes.get('/:deviceId', DataController.getData);

export default dataRoutes;
