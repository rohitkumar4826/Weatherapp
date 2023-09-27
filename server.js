const express = require('express');
const axios = require('axios');
const app = express();
const cors =require('cors');
const bp =require('body-parser');
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bp.urlencoded({extended:true}));
app.use(express.static(__dirname));
app.use(express.static('public')); // Serve static files (e.g., HTML, CSS, JavaScript) from the 'public' directory
console.log("Server started");
// Define your API endpoints

app.get("/",(req,res)=>
{
    res.sendFile(__dirname+"/index.html");
})
app.post('/currentWeather', async (req, res) => {
    const cityName = req.body.city;
    console.log('cityname',cityName);
    try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=ea34265dc5794c4d47e857bcb7d1427b&units=metric`);
        if(req.body.units==='Celcius')
        {
            let degree = response.data.main.temp;
            degree= degree*9/5+32;
            response.data.main.temp=degree;
        }
        res.json(response.data);
        // console.log(response.data)
    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch data' });
    }
});

app.get('/forecast', async (req, res) => {
    const cityName = req.query.city;
    console.log(req.query);
    console.log(req.body);
    try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=8e7f4b8da3ffcaca8dc36827f5c76f69&units=metric`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch data' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
