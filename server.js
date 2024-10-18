const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const DRONE_CONFIG_URL = 'https://script.google.com/macros/s/AKfycbzwclqJRodyVjzYyY-NTQDb9cWG6Hoc5vGAABVtr5-jPA_ET_2IasrAJK4aeo5XoONiaA/exec';
const DRONE_LOGS_URL = 'https://app-tracking.pockethost.io/api/collections/drone_logs/records';


app.get('/configs/test'), async (res) => {
    const response = await axios.get(`${DRONE_CONFIG_URL}`);

    res.json({
        "response1" : response,
        "response2" : response.data,
        "response3" : response.data.data
    })
   
}

app.get('/configs/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const response = await axios.get(`${DRONE_CONFIG_URL}`);

      if(!response || !response.data || response.data.data) {
        console.error("Response Not Found")
        return res.status(505).json({
            "Message" : "Response not found",
        })
      }

      let drone_data = response.data.data; 

      const drone_config = drone_data.find(drone => drone.drone_id == id);

      if (!drone_config) {
        console.log("Drone not Found.");
        return res.status(404).json({
            "Message" : "Drone not Found.",
        })
      }

      const maxSpeed = config.max_speed ? Math.min(config.max_speed, 110) : 100;

      res.send(200).json({
        drone_id: config.drone_id,
        drone_name: config.drone_name,
        light: config.light,
        country: config.country,
        max_speed: maxSpeed
      });
  } catch (error) {
      console.error('Error details:', error); 
      res.status(500).json({
        "Message" : "Error fetching drone config"
      });
  }
});


app.get('/status/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${DRONE_CONFIG_URL}?drone_id=${id}`);
        
        if (!response.data.data) {
            return res.status(500).send('Invalid response from API');
        }

        let data = response.data.data;  

        const config = data.find(drone => drone.drone_id == id);

        if (!config) {
            return res.status(404).send('Drone not found');
        }

        const condition = config.condition;

        res.json({ condition });
    } catch (error) {
        console.error(error);  
        res.status(500).send('Error fetching drone status');
    }
});


app.get('/logs', async (req, res) => {
  try {
      const response = await axios.get(DRONE_LOGS_URL);
      const logs = response.data.items;

      const formattedLogs = logs.map(log => ({
          drone_id: log.drone_id,
          drone_name: log.drone_name,
          created: log.created,
          light: log.light,  
          country: log.country,
          celsius: log.celsius,
          population: log.population
      }));
      console.log(logs)
      res.json(formattedLogs);
  } catch (error) {
      console.error(error);  
      res.status(500).send('Error fetching logs');
  }
});


app.post('/logs', async (req, res) => {
    try {
        const response = await axios.post(DRONE_LOGS_URL, req.body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        res.status(response.status).send("ok");
    } catch (error) {
        console.error('Error posting logs:', error);
        res.status(500).send('Error saving log data');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
