const express = require('express');
const app = express();
app.use(express.json());

let logs = [
  {
    drone_id: 5,
    drone_name: "RoboDrone IV",
    created: "2024-09-22 07:37:32.111Z",
    light: "on",
    country: "Pakistan",
    celsius: 45
  },
  {
    drone_id: 5,
    drone_name: "RoboDrone IV",
    created: "2024-09-22 07:37:57.411Z",
    light: "on",
    country: "Pakistan",
    celsius: 46
  }
];

// 1. GET /configs/5
app.get('/configs/5', (req, res) => {
  let droneConfig = {
    drone_id: 5,
    drone_name: "RoboDrone IV",
    light: "on",
    country: "Pakistan",
    max_speed: 110
  };

  // ถ้า max_speed ไม่มีให้ตั้งค่าเป็น 100
  if (!droneConfig.max_speed) {
    droneConfig.max_speed = 100;
  }

  // ถ้า max_speed มากกว่า 110 ให้ตอบกลับเป็น 110
  if (droneConfig.max_speed > 110) {
    droneConfig.max_speed = 110;
  }

  res.json(droneConfig);
});

// 2. GET /status/:id
app.get('/status/:id', (req, res) => {
  const droneId = req.params.id;
  // สมมติว่าทุก drone มีสถานะ "good"
  res.json({ condition: "good" });
});

// 3. GET /logs
app.get('/logs', (req, res) => {
  res.json(logs);
});
node app.js

// 4. POST /logs
app.post('/logs', (req, res) => {
  const newLog = req.body;
  logs.push(newLog);
  res.status(201).json(newLog); // ตอบกลับ log ที่เพิ่มใหม่
});

// เริ่มเซิร์ฟเวอร์
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
curl -X POST http://localhost:3000/logs -H "Content-Type: application/json" -d '{"drone_id": 5, "drone_name": "RoboDrone IV", "created": "2024-09-22 08:00:00.000Z", "light": "on", "country": "Pakistan", "celsius": 47}'

