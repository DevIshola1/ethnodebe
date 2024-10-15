// Load environment variables from .env file
require('dotenv').config();
const express = require("express");
const cron = require('node-cron');
const cors = require("cors");
const { updateUserProfits } = require('./app/profits.js');
const userRoutes = require('./app/routes/user.routes'); // Import user routes 

const app = express();

var corsOptions = {
  origin: ["https://ethnodefe.vercel.app/", "dashboard.mine88.info"]
};

 app.use(cors(corsOptions));// to limit cors
//app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Use the routers
// app.use('/api/users', userRoutes); // All user routes prefixed with /api/users


const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to ETH2.0." });
});

require("./app/routes/user.routes")(app);

//Schedule the function to run every 24 hours
cron.schedule('0 0 * * *', () => {
  console.log('Running daily profit update...');
  updateUserProfits();
});

// cron.schedule('*/5 * * * *', () => {
//   console.log('Running profit update every 5 minutes...');
//   updateUserProfits();
// });


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
