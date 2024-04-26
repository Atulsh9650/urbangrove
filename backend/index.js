const express = require('express');
const cors = require('cors');
require('dotenv').config();
const paypal=require('paypal-rest-sdk');

require('./util/dbconnection'); // for db connection
const app = express();


app.use(express.json());
app.use(cors());

app.use(require('./routes/user.route'));
app.use(require('./routes/file.route'));
app.use(require('./routes/product.route'));
app.use(require('./routes/order.route'));
app.use(require('./routes/paypalRoute'));

app.listen(process.env.PORT, () => {
    console.log("server is running on port 5000");
});
