import express from 'express';
import DeviceController from '../controllers/DeviceController';
import auth from '../middleware/auth';

const deviceRoutes = express.Router();

/**
 * @swagger
 * /api/devices:
 *   post:
 *     summary: Add a new device
 *     description: This endpoint allows an authorized user to create a new device in the system.
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deviceName:
 *                 type: string
 *                 description: The name of the device
 *                 required: true
 *               deviceType:
 *                 type: string
 *                 description: The type of the device
 *                 required: true
 *     responses:
 *       201:
 *         description: Device created successfully, including a token for device use.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newDevice:
 *                   type: object
 *                   description: The newly created device
 *                 token:
 *                   type: string
 *                   description: Token for the device to connect to the websocket server
 *       400:
 *         description: Missing device name or type
 */
deviceRoutes.post('/', auth, DeviceController.newDevice);

/**
 * @swagger
 * /api/devices/{deviceId}:
 *   get:
 *     summary: Get a device by ID
 *     description: Retrieve the details of a specific device by its ID.
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: deviceId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device
 *     responses:
 *       200:
 *         description: Device details retrieved successfully
 *       404:
 *         description: Device not found
 */
deviceRoutes.get('/:deviceId', auth, DeviceController.getDeviceById);

/**
 * @swagger
 * /api/devices:
 *   get:
 *     summary: List all devices of the user
 *     description: Retrieve a list of all devices associated with the authenticated user.
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of devices retrieved successfully
 *       404:
 *         description: No devices found
 */
deviceRoutes.get('/', auth, DeviceController.listAllDevices);

/**
 * @swagger
 * /api/devices/{deviceId}/status:
 *   get:
 *     summary: Get status of a device by ID
 *     description: Retrieve the status (ON/OFF) of a specific device by its ID.
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: deviceId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device
 *     responses:
 *       200:
 *         description: Device status retrieved successfully
 *       404:
 *         description: Device not found
 */
deviceRoutes.get('/:deviceId/status', auth, DeviceController.getDeviceStatus);

/**
 * @swagger
 * /api/devices/{deviceId}/toggle:
 *   put:
 *     summary: Turn a device ON/OFF
 *     description: Toggle the ON/OFF state of a specific device by its ID.
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: deviceId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device
 *     responses:
 *       200:
 *         description: Device state toggled successfully
 *       404:
 *         description: Device not found
 */
deviceRoutes.put('/:deviceId/toggle', auth, DeviceController.toggleDeviceState);

/**
 * @swagger
 * /api/devices/{deviceId}:
 *   put:
 *     summary: Update a device by ID
 *     description: Update the details of a specific device by its ID.
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: deviceId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deviceName:
 *                 type: string
 *                 description: The name of the device
 *               deviceType:
 *                 type: string
 *                 description: The type of the device
 *               settings:
 *                 type: object
 *                 description: The settings of the device
 *     responses:
 *       200:
 *         description: Device updated successfully
 *       404:
 *         description: Device not found
 */
deviceRoutes.put('/:deviceId', auth, DeviceController.updateDevice);

/**
 * @swagger
 * /api/devices/{deviceId}:
 *   delete:
 *     summary: Delete a device by ID
 *     description: Remove a specific device by its ID.
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: deviceId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device
 *     responses:
 *       204:
 *         description: Device deleted successfully
 *       404:
 *         description: Device not found
 */
deviceRoutes.delete('/:deviceId', auth, DeviceController.deleteDevice);

/**
 * @swagger
 * /api/devices/{deviceId}/command:
 *   post:
 *     summary: Send a command to a device
 *     description: Send a command to a specific device by its ID.
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: deviceId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               command:
 *                 type: object
 *                 description: The command to be sent to the device
 *                 example: { "temperature": 24 }
 *     responses:
 *       200:
 *         description: Command sent successfully
 *       400:
 *         description: Missing command
 *       404:
 *         description: Device not found
 */
deviceRoutes.post('/:deviceId/command', auth, DeviceController.sendCommand);

export default deviceRoutes;
