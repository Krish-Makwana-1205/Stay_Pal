const express = require("express");
const { connectmongodB } = require("./connect.js");
const cookieParser = require("cookie-parser");

const user = require("./router/user.js");
const tenant = require("./router/tenant.js");
const propertyOwner = require("./router/propertyOwner.js");
const dashboard = require("./router/home.js");
const roommate = require("./router/Roommate.js");
const chat = require("./router/message.js");
const predictionRoutes = require("./router/predictionRoutes.js");
const RadiusSearch = require("./router/radiusSearch.js");

require("./cron/deleteotp.js");

require("dotenv").config();
const cors = require("cors");
const app = express();

const url = process.env.MONGO;
const PORT = process.env.PORT || 8002;

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",

      "https://staypal1-topaz.vercel.app",

      /^https:\/\/staypal1-.*\.vercel\.app$/,
    ],
    credentials: true,
  })
);


// app.options("*", cors());

// Routes
app.use("/user", user);
app.use("/tenant", tenant);
app.use("/propertyOwner", propertyOwner);
app.use("/home", dashboard);
app.use("/roommate", roommate);
app.use("/chat", chat);
app.use("/prediction", predictionRoutes);
app.use("/radiussearch", RadiusSearch);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

connectmongodB(url).then(() => {
  console.log("DB up");
});