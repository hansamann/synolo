
const rest = require('../common/rest.js')

async function id(parent) { 
	return parent.code;
}

async function categories(parent) { 
    console.log('categories are', parent.categories)
    return parent.categories.map( (cat) => {
        return rest.getCategory(cat.code);
    })
}

async function images(parent, {format, type, index}) { 

    let images = parent.images;
    if (format != undefined) {
        images = parent.images.filter( img => img.format == format)
    }

    if (type != undefined) {
        images = parent.images.filter( img => img.imageType == type)
    }

    if (index != undefined) {
        images = parent.images.filter( img => img.galleryIndex == index)
    }
    
    return images;
}


async function references(parent) {
    return parent.productReferences
}

async function stock(parent) {
    //console.log(parent.stock.stockLevel); very often null in data set
    return {
        level : parent.stock.stockLevel,
        status : parent.stock.stockLevelStatus
    }
}

module.exports = {
	CommerceProduct : {
        id,
        categories,
        images,
        references,
        stock
    }
}