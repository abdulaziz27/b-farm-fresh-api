const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
const apiDocsRoutes = require('./docs/api-docs');

app.use(cors({
    origin: 'http://localhost:3001',
    optionsSuccessStatus: 200,
}));
app.options('*', cors());


// Middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);
app.use(apiDocsRoutes);

//Routes
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');

const api = process.env.API_URL;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);
app.use(`${api}/cart`, cartRoutes);

// username: admin, pw: PPiEDp2XRoLgxOk3
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'banyumas-farm-fresh'
})
.then (()=> {
    console.log('Database connection is ready...');
})
.catch((err)=>{
    console.log(err);
})

// Server
app.listen(3000, () => {
    console.log('Server is running http://localhost:3000');
}); 
