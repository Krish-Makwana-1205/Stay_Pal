const express = require('express');
const {connectmongodB} = require('./connect.js');

const app = express();
const PORT = 8002;
const url = 'mongodb+srv://Krish:918273@my-first-cluster.zfc6ret.mongodb.net/staypal';

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

connectmongodB(url).then(()=>{
    console.log('DB up');
});
