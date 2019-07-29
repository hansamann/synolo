const rest = require('../common/rest.js')
const got = require('got')

const WEATHER_APP_ID = process.env['OPENWEATHER_APP_ID'];
if (WEATHER_APP_ID == undefined)
	throw new Error("You need to provide the env variable WEATHER_APP_ID which needs to be a valid OpenWeather app id!");

async function languages(parent, {active}) {
	let langs = await rest.getLanguages()
	if (active != undefined) 
	{
		return langs.filter(lang => lang.active == active)
	} else
	{
		return langs;	
	}
}

async function countries(parent, {type}) {
	return await rest.getCountries(type)
}

async function categories(parent){
	return await rest.getCategories()
}

async function category(parent, {id}){
	return await rest.getCategory(id)
}

async function product(parent, {id}){
	return await rest.getProductById(id)
}

async function gateway_url(parent) {
	return process.env['GATEWAY_URL'];
}

async function weather(parent, {city, country}) {
	let options = {
		json: true,
		query : {
			q : `${city},${country}`,
			APPID : WEATHER_APP_ID,
			units : 'metric'
		}
	}
	return got.get('http://api.openweathermap.org/data/2.5/weather', options)
	.then(function (response) {
		//console.log(response.body);
		return response.body
	})
	.catch(function (error) {
		console.log(error);
	});	
}

module.exports = {
	Query : {
		GATEWAY_URL : gateway_url,
		languages : languages,
		countries : countries,
		categories : categories,
		product : product,
		category : category,
		weather : weather
	}
}
