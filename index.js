const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sltbrlg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const plantsCollection = client.db("plantsDB").collection("plants");

//     const date = new Date("2020-02-05T00:00:00.000Z");
// console.log(date.toLocaleDateString("en-GB"));

    // Get data on mongodb to display data
    // All Plants
    app.get("/plants", async (req, res) => {
      const { searchParams } = req.query;
      let query = {};
      // Search
      if (searchParams) {
        query = {
          name: { $regex: searchParams, $options: "i" },
        };
      }

      const cursor = plantsCollection.find(query).sort({ NextWateringDate: 1 });
      const result = await cursor.toArray();

      res.send(result);
    });

    // singleDetails section
    app.get("/plants/:id", async (req, res) => {
      const id = req.params.id;

      try {
        const objectId = new ObjectId(id);
        const plant = await plantsCollection.findOne({ _id: objectId });

        if (!plant) {
          return res.status(404).send({ message: "Plant not found" });
        }

        res.send(plant);
      } catch (error) {
        // Invalid ObjectId format
        return res.status(400).send({ message: "Invalid ID format" });
      }
    });

    // Add plants data on mongodb database
    app.post("/plants", async (req, res) => {
      const newPlants = req.body;
      const nextDate = new Date(newPlants.NextWateringDate);
      newPlants.NextWateringDate = nextDate
      console.log(newPlants);
      const result = await plantsCollection.insertOne(newPlants);
      res.send(result);
      console.log(newPlants);
    });

    // Update Plants
    app.put("/plants/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatePlants = req.body;
      const updateDoc = {
        $set: updatePlants,
      };
      const result = await plantsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // New Plants Sort section
    app.get("/new-plants", async (req, res) => {
      const result = await plantsCollection
        .find({})
        .sort({ _id: -1 })
        .limit(6)
        .toArray();
      res.send(result);
    });

    // Deleted section
    app.delete("/plants/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = plantsCollection.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: -1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("simply GreenNest Server running");
});

app.listen(port, () => {
  console.log(`Simply GreenNest server running on ${port}`);
});
