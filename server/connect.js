const mongoose = require('mongoose');

async function connectmongodB(url){
    return mongoose.connect(url);
}

module.exports = {
    connectmongodB
}