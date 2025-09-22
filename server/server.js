const express = require('express');
const {connectmongodB} = require('./connect.js');
const cookieParser = require("cookie-parser");
const user = require('./router/user.js');
const app = express();
const PORT = 8002;
const url = 'mongodb+srv://Krish:918273@my-first-cluster.zfc6ret.mongodb.net/staypal';

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.json());


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

connectmongodB(url).then(()=>{
    console.log('DB up');
});

app.use("/user",user);