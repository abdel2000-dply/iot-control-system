import express from 'express';
import DataController from '../controllers/DataController.js';
import auth from '../middleware/auth';

const dataRoutes = express.Router();

/**
 * @swagger
 * /api/deviceData/{deviceId}:
 *   get:
 *     summary: Get device data
 *     description: Retrieve data for a specific device within a date range. If `startDate` is not provided, defaults to 1 hour ago. If `endDate` is not provided, defaults to the current time.
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
 *         description: Start date for the data retrieval (defaults to 1 hour ago)
 *         example: 2024-01-01T00:00:00.000Z
 *       - name: endDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date for the data retrieval (defaults to current time)
 *         example: 2024-01-01T23:59:59.999Z
 *     responses:
 *       200:
 *         description: Device data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                   data:
 *                     type: object
 *                     additionalProperties: true
 *       404:
 *         description: No data found for this device in the specified time range
 *       500:
 *         description: Internal server error
 */
dataRoutes.get('/:deviceId', auth, DataController.getData);

export default dataRoutes;
