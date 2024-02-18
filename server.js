const express = require('express');
const connectDB = require('./config/db')
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

//ConnectDatabase
connectDB();

//init middleware
app.use(express.json({extend: false}))
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

app.get('/', (req,res) => {
    res.send('API RUNNING')
})

app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/post', require('./routes/api/post'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`App running on ${PORT}`)
})