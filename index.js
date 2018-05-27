const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const apiKey = require('./key')
// const db = require('./db');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/webhook', (req, res) => {

	let city = req.body.queryResult.parameters["geo-city"];
	// let city = 'Lagos';
	callWeather = (city) =>{
		return new Promise((resolve, reject) => {
	  		
			let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
			request(url, (err, response, body)=>{
				if(err) console.log(err)

				let weather = JSON.parse(body)
			    let output = 'in ' + weather.name + ', ' + 'it is ' + weather.weather[0].description;
			    console.log(output)
			    resolve(output);
			});
	    res.on('error', (error) => {
	    	console.log(`Error calling the weather API: ${error}`)
	        reject();
	    });
		    
		})
	}

	// let city = 'Lagos';
	callWeather(city).then((output) => {

		res.json({
				"fulfillmentMessages": [
	      			{
	        			"text": {
	          			"text": [
	            		output
	          		]
        		}
      		}
    	]
	}); // Return the results of the weather API to Dialogflow
	}).catch(()=>{
		res.json({
				"fulfillmentMessages": [
	    			{
	       				"text": {
	       				"text": [
	           			`I don't know the weather but I hope it's good!`
	       			]
        		}
      		}
    	]
	});
	});
	

});

app.get('/', (req, res) => {
	res.render('index');
	res.end();
});

const PORT = 3100;

app.listen(process.env.PORT || PORT, () => {
	console.log('now listening to ' + PORT)
});