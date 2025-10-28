const express = require('express');
const {connectmongodB} = require('./connect.js');
const cookieParser = require("cookie-parser");
const user = require('./router/user.js');
const tenant = require('./router/tenant.js');
const propertyOwner = require('./router/propertyOwner.js');
const dashboard = require('./router/home.js');  

const app = express();
require('dotenv').config();
const cors = require('cors');

const url = process.env.MONGO;
const PORT = 8002;

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

connectmongodB(url).then(() => {
    console.log('DB up');
});

app.use("/user", user);
app.use("/tenant", tenant);
app.use("/propertyOwner", propertyOwner);
app.use("/home", dashboard);   
