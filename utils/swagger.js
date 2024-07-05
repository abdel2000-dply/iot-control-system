import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'IoT Control System API',
    version: '1.0.0',
    description: 'API for controlling IoT devices'
  },
  servers: [
    {
      url: 'http://localhost:5000'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

export default (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get('/ws-docs', (req, res) => {
    res.json({
      description: 'WebSocket API for IoT Device Control and Data Management',
      endpoints: [
        {
          event: 'authenticate',
          description: 'Authenticate a device with a JWT token',
          payload: {
            token: 'JWT token provided during device registration'
          },
          response: {
            authenticated: { message: 'Authenticated successfully' },
            authError: { error: 'Invalid token' },
            authError: { error: 'Device not found' }
          }
        },
        {
          event: 'deviceData',
          description: 'Send data from a device',
          payload: {
            deviceData: { temperature: 22 }
          },
          response: {
            ack: 'Data received',
            deviceError: { error: 'Device not authenticated' }
          }
        }
      ]
    });
  });
};
