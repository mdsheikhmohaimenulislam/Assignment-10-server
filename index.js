const express = require('express');
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000


// Middleware
app.use(cors())
app.use(express.json())

app.get('/', (req,res) => {
    res.send("simply GreenNest Server running")
})


app.listen(port, () => {
    console.log(`Simply GreenNest server running on ${port}`);
})