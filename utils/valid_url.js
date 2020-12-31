validUrl = (rel_url) => {

    if(rel_url.length < 8 || rel_url[0] != '/' || rel_url[1] != '?'
        || rel_url.substring(2, 6) != "room" || rel_url[6] != '=') {
        return false;
    }

    return true;
};

module.exports = validUrl;