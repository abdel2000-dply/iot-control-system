import exspress from 'express';
import DataController from '../controllers/DataController.js';

const dataRoutes = exspress.Router();


dataRoutes.get('/:deviceId', DataController.getData);

export default dataRoutes;