function alt(parent) {
    return parent.altText;
}

function type(parent) {
    return parent.imageType;
}

function index(parent) {
    return parent.galleryIndex;
}

module.exports = {
	CommerceImage : {
        alt,
        type,
        index,
    }
}