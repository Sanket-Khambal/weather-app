require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');


app.listen(process.env.PORT || 5000);
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}))

app.get('/',(req,res)=>{
    res.render('index')
})

app.post('/',(req,res)=>{
    let city = req.body.location;
    const options = {
        method: 'GET',
        url: 'https://community-open-weather-map.p.rapidapi.com/weather',
        qs: {
          q: city,
          units: 'metric',
        },
        headers: {
          'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
          'x-rapidapi-key': process.env.API_KEY,
          useQueryString: true
        }
      };
    request(options,(err,response,body)=>{
      if(err){
        res.render('index',{weather:null,error:`${err} Oops, something went wrong!`})
      }
      else{
        let weather = JSON.parse(body)
        console.log(weather)
        
        if (weather.main===undefined){
          res.render('index',{weather:null,error:`City not found, please try again!`});
        }
      
        else{
          let result = `It's ${weather.main.temp}° C in ${weather.name}! `;
          let humidity = `Humidity: ${weather.main.humidity}%`;
          res.render('index',{weather:result,weather_2:humidity, error:null});
          //console.log(result)
        }
      }

    })

    
})