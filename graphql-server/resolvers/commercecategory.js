
const rest = require('../common/rest.js')

async function products(parent) { 
	return rest.productsByCategoryId(parent.id);
}

module.exports = {
	CommerceCategory : {
        products
    }
}