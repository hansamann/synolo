const got = require('got');

const GATEWAY_URL = process.env['GATEWAY_URL'];

if (GATEWAY_URL == undefined)
	throw new Error("You need to provide the env variable GATEWAY_URL which needs to point to the kyma commerce application connector!");

//commerce
const baseSiteId = "electronics";
const catalogId = "electronicsProductCatalog";
const catalogVersionId = "Online";

function localify(options) {
	if (process.env['LOCAL']) {
		console.log("We're local... adding Host header.");
		if (options) {
			if (!options.headers) {
				options.headers = {}
			}
			//this needs to be added if running locally AND using kubectl port-forward to access the cluster application connector
			//you need to change this to a value for your cluster. check the README.md
			options.headers['Host'] = 'app-graphql-ccv2-3f3a59e7-1389-4210-bd9b-ad420a130155'
		} 
	}

	return options;
}


async function getLanguages() {
	let options =  { json: true };
	
	return got(`${GATEWAY_URL}/${baseSiteId}/languages`, localify(options))
		.then(function (response) {
			console.log(response.body.languages)
			return response.body.languages
		})
		.catch(function (error) {
			console.log(error);
		});
}

async function getCountries(type) {
	let options = { json: true }
	if (type) {
		options.query = { type: type }
	}
	return got(`${GATEWAY_URL}/${baseSiteId}/countries`, localify(options))
		.then(function (response) {
			return response.body.countries
		})
		.catch(function (error) {
			console.log(error);
		});
}

async function getCategories() {
	let options = { json: true }
	return got(`${GATEWAY_URL}/${baseSiteId}/catalogs/${catalogId}/${catalogVersionId}`, localify(options))
		.then(response => {
			//console.log(response.body);
			return response.body.categories;
		})
		.catch(function (error) {
			console.log(error);
		});
}

async function getCategory(id) {
	let options = { json: true }
	return got(`${GATEWAY_URL}/${baseSiteId}/catalogs/${catalogId}/${catalogVersionId}/categories/${id}`, localify(options))
		.then(response => {
			//console.log(response.body);
			return response.body;
		})
		.catch(function (error) {
			console.log(error);
		});
}

async function productsByCategoryId(id) {
	let options = {
		json: true,
		query: {
			query: `:relevance:allCategories:${id}`,
			fields: "FULL"
		}
	}

	return got(`${GATEWAY_URL}/${baseSiteId}/products/search`, localify(options))
		.then(response => {
			//console.log(response.body);
			return response.body.products;
		})
		.catch(function (error) {
			console.log(error);
		});
}

async function getProductById(id) {

	let options = {
		json: true, 
		query: {
			fields: "FULL"
		}
	}
	return got(`${GATEWAY_URL}/${baseSiteId}/products/${id}`, localify(options))
		.then(response => {
			//console.log(response.body);
			return response.body;
		})
		.catch(function (error) {
			console.log(error);
		});

}

module.exports = {
	getLanguages,
	getCountries,
	getCategories,
	getCategory,
	productsByCategoryId,
	getProductById
}