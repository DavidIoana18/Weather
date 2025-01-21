import express from 'express';
import axios from 'axios';
import dotenv from "dotenv";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://api.weatherapi.com/v1";

dotenv.config();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

const API_KEY = process.env.WEATHER_API_KEY;

app.get("/", (req, res) =>{
    res.render("home.ejs");
});

app.post("/current-weather",  async (req, res) =>{
    const city = req.body.city;
    const date = req.body.date;
    try{
        const astronomy = await axios.get(API_URL + "/astronomy.json", {
            params:{
                key: API_KEY,
                q: city,
                dt: date
            }
        });

        const forecast = await axios.get(API_URL + "/forecast.json", {
            params: {
                key: API_KEY,
                q: city,
                days: 1
            }        
        });
        
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        
        const localtime = forecast.data.location.localtime;
        const[datePart, timePart] = localtime.split(" ");
        const hour = timePart.split(":")[0];
        const currentHour = parseInt(hour, 10);

        const dateObj = new Date(datePart);
        const weekDay = daysOfWeek[dateObj.getDay()];
        const month = months[dateObj.getMonth()];
        const day = dateObj.getDate();
        const formattedDate = `${day} ${month}`;

        const visibility = forecast.data.current.vis_km;

        const latitude = forecast.data.location.lat; 
        const longitude= forecast.data.location.lon;

        const hourlyForecast = forecast.data.forecast.forecastday[0].hour;
        let nextHours = [];
        let reorderedForecast = []; // Will contain the reordered forecast because the current one contains the hours like this: 00, 01, .., 23

        // Forecast index for the current hour
        const currentIndex = hourlyForecast.findIndex(forecast => {
            const forecastHour = new Date(forecast.time).getHours();
            return forecastHour === currentHour;
        });

        // Reorder the forecast so that it starts with the current hour
        if (currentIndex !== -1) { //extract all elements from the two arrays and include them in the new array using spread operator (...)
            reorderedForecast = [
                ...hourlyForecast.slice(currentIndex),    // From the current hour until the end of the hourlyForecast array
                ...hourlyForecast.slice(0, currentIndex), // From the beginning of the hourlyForecast array to the current hour
            ];
        }

        // Get the next 4 hours from reorderedForecast
        nextHours = reorderedForecast.slice(0, 4).map(forecast => {
            const forecastTime = new Date(forecast.time);
            const forecastHour = forecastTime.getHours();

            let formattedTime = forecastTime.toLocaleTimeString([], { hour: '2-digit', hour12: false });

            if (formattedTime === '24') {
                formattedTime = '00';
            }
             return {
                time: (forecastHour === currentHour) ? "Now" :  formattedTime,
                temp_c: forecast.temp_c,
                condition_icon: forecast.condition.icon,
            };
        });
      
    res.render("weather.ejs", {
        weather: forecast.data, 
        formattedDate: formattedDate,
        weekDay: weekDay,
        astronomy: astronomy.data,
        visibilityKm: visibility,
        lat: latitude,
        long: longitude, 
        nextHours: nextHours
        });
    }catch(error){
        console.log(error);
        res.status(500).send("Error fetching weather data");
    }
});

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
})