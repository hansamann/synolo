const rest = require('../common/rest.js')


function type(parent) { 
	return parent.referenceType
}

function target(parent) {
    return rest.getProductById(parent.target.code)
}

module.exports = {
	CommerceProductReference : {
        type,
        target
    }
}