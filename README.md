## IoT Device Control and Data Management API
This project provides an API for managing your Internet of Things (IoT) devices. Think of it as a central hub that lets you control and monitor various devices like lights, thermostats, or sensors, all from one place.

### What can you do with this API?

- **Register your devices:** Easily add your IoT devices to the system for centralized management.
- **Control your devices:** Send commands to devices to perform actions, such as turning on lights, adjusting thermostats, and more.
- **Collect sensor data:** Gather and store data from your sensors, allowing you to analyze device performance and environmental conditions.
- **Get real-time updates:** Receive instant notifications when your devices change status or their environment experiences fluctuations.
- **Manage users:** Create and manage user accounts with appropriate permissions, ensuring secure access to device controls and data.

### Getting Started

Before diving in, you'll need a few things:

- Node.js ([https://nodejs.org/en](https://nodejs.org/en))
- MongoDB database ([https://www.mongodb.com/](https://www.mongodb.com/))
- Redis ([https://redis.io/](https://redis.io/))

**Let's set things up!**

1. **Grab the code:** Clone this repository from GitHub using:

```bash
git clone https://github.com/abdel2000-dply/iot-control-system.git
cd iot-control-system
```

2. **Install dependencies:** These are the additional tools the project needs to run. Use:

```bash
npm install
```

3. **Configure your environment:** Create a file named `.env` in the project directory and add the following details, replacing the placeholders with your own values:

```
DB_URI=mongodb://localhost:27017/iot_system  # Replace with your MongoDB connection URI
JWT_SECRET=your_jwt_secret                  # A secret key used for authentication
REFRESH_TOKEN_SECRET=your_refresh_token_secret  # Another secret key for refreshing tokens
PORT=5000                                     # Port on which the server will run (default: 5000)
NODE_ENV=development                         # Development environment setting
```

4. **Start the server:** Time to bring it to life! Run:

```bash
npm run start-server
```

The server will start on the port specified in the `.env` file (usually port 5000 by default).

###  Exploring the API

You can interact with the API using tools like Postman or curl. 

For detailed API usage documentation, including all available endpoints and request/response formats, we recommend using Swagger. Once the server is running, you can access the documentation at:

- API documentation:
```
http://localhost:5000/api-docs
```
- Websocket documentation
```
http://localhost:5000/ws-docs
```

### How to use the API

**Authentication:**

- **Register a new user:** 
  - Make a POST request to `/api/auth/register` with user information.

- **Log in a user:**
  - Make a POST request to `/api/auth/login` with username and password.

- **Other user-related actions:**
  - You can also log out or refresh tokens using the `/api/auth/logout` and `/api/auth/refresh-token` endpoints, respectively.

**Device Management:**

- **Register a new device:**
  - Make a POST request to `/api/devices` with device details.

- **Get information about a device:**
  - Make a GET request to `/api/devices/:deviceId`, replacing `:deviceId` with the actual device ID.

- **List all your devices:**
  - Make a GET request to `/api/devices`.

- **Update a device:**
  - Make a PUT request to `/api/devices/:deviceId` with updated device information.

- **Delete a device:**
  - Make a DELETE request to `/api/devices/:deviceId`.

- **Send a command to a device:**
  - Make a POST request to `/api/devices/:deviceId/command` with the desired command for the device.

**Data Management:**

- **Get data from a device:**
  - Make a GET request to `/api/deviceData/:deviceId`, replacing `:deviceId` with the actual device ID.

**Real-Time Updates:**

Devices can connect and send data using WebSockets. The provided `sendFakeData.js` script demonstrates how to simulate sending data from a device using Node.js. You can find this script in the project directory.

### Running Tests

To ensure everything's working smoothly, you can run the automated tests using:

```bash
npm test
```

### Logging

This project uses Winston for logging. Logs are saved in the `logs` directory. You can configure

### Contributing
Contributions are welcome! Please open an issue or submit a pull request with your changes.
