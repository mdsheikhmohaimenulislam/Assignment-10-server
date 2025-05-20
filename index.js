const express = require('express');
const app = express()
const cors = require('cors');
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000



// Middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sltbrlg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const plantsCollection = client.db('plantsDB').collection('plants')

    app.post('/plants', async (req,res) => {
        const newPlants = req.body;
        const result = await plantsCollection.insertOne(newPlants);
        res.send(result)
        console.log(newPlants);
    })






      await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  

  }
}
run().catch(console.dir);



app.get('/', (req,res) => {
    res.send("simply GreenNest Server running")
})


app.listen(port, () => {
    console.log(`Simply GreenNest server running on ${port}`);
})