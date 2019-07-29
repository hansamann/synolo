const got = require('got');

function main(parent) { 
    return parent.weather[0].main
}

function description(parent) { 
    return parent.weather[0].description
}

function temp(parent) { 
    return parent.main.temp
}

function humidity(parent) { 
    return parent.main.humidity
}

function wind(parent) { 
    return parent.wind.speed
}


module.exports = {
	Weather : {
        main,
        description,
        temp,
        humidity,
        wind
	}
}

