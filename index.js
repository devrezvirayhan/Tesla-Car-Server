const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId

const port = process.env.PORT || 7000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0x2gm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();
    // console.log('Database Connected SucessFully')



    const database = client.db('tasle_car');
    const ourcarCollection = database.collection('collection')
    const OrderCollection = database.collection('orders')

    // APPOINTMENTS


    //MAKE ADMIN IN ADMIN TO ADMIN
    app.post('/addProducts', async (req, res) => {
      const result = await ourcarCollection.insertOne(req.body)
      res.send(result)
    });


    // GET ALL PRODUCTS
    app.get('/addProducts', async (req, res) => {
      const result = await ourcarCollection.find({}).toArray();
      res.send(result)
      console.log(result)
    })

    // SUNGLE PRODUCT ID DATA BASE
    app.get('/singleProduct/:id', async(req, res)=>{
      const result = await ourcarCollection.find({_id:ObjectId(req.params.id)}).toArray();
      res.send(result[0])
    })

      // CONFROM ORDER NOT & ORDER NOW

      app.post("/confromOrder", async (req, res) => {
        const result = await OrderCollection.insertOne(req.body);
        res.send(result);
      });


      // MY ORDERS IN WEBSITE HIT THE DATABASE

      app.get('/myOrders/:email', async(req, res)=>{
        const result = await OrderCollection.find({email: req.params.email}).toArray();
        console.log(result)
        res.send(result)
      })


  }
  finally {
    // await client.close();
  }
}

run().catch(console.dir)


app.get('/', (req, res) => {
  res.send('Tesla CAR By Rezvi Rayhan. Welcome To Our New Projects. Thank You')
})

app.listen(port, () => {
  console.log(`listening at ${port}`)
})