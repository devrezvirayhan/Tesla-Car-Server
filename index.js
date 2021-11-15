const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0x2gm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();
    // console.log('Database Connected SucessFully')

    const database = client.db('tasle_car');
    const ourcarCollection = database.collection('collection');
    const OrderCollection = database.collection('orders');
    const userCollection = database.collection('user');
    const OurAllCollection = database.collection('Product');
    const ReviCollection = database.collection('review')


    app.post('/addallProduct', async (req, res) => {
      const result = await OurAllCollection.insertOne(req.body)
      res.send(result)
    });

    // GET ALL PRODUCTS
    app.get('/addallProduct', async (req, res) => {
      const result = await OurAllCollection.find({}).toArray();
      res.send(result)
      console.log(result)
    })
    app.get('/singleallProduct/:id', async (req, res) => {
      const result = await OurAllCollection
        .find({ _id: ObjectId(req.params.id) })
        .toArray();
      res.send(result[0]);
    })

    app.post("/confirallmOrder", async (req, res) => {
      const result = await OrderCollection.insertOne(req.body);
      res.send(result);
    });

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
    app.get('/singleProduct/:id', async (req, res) => {
      const result = await ourcarCollection
        .find({ _id: ObjectId(req.params.id) })
        .toArray();
      res.send(result[0]);
    })

    //  GET SINGLE PRODUCTS IN DATABASE 

    // CONFRIM ORDER ID DATABASE MONGODB
    app.post("/confirmOrder", async (req, res) => {
      const result = await OrderCollection.insertOne(req.body);
      res.send(result);
    });
    // MY CONFROM ORDER 
    app.get("/myOrders/:email", async (req, res) => {
      const result = await OrderCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });
    // DELETE ORDER 
    app.delete("/deleteOrder/:id", async (req, res) => {
      const result = await OrderCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });
    app.post('/users', async (req, res) => {
      const user = req.body
      const result = await userCollection.insertOne(user);
      console.log(result)
      res.json(result)
    })

    app.put('/users', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const optins = { upsert: true };
      const updateDoc = { $set: user }
      const result = userCollection.updateOne(filter, updateDoc, optins);
      res.json(result)
    })

    app.put('/users/admin', async(req, res)=>{
      const user = req.body;
      console.log('put', user);
      const filter = {email: user.email};
      const updateDoc = { $set: {role:'admin'}};
      const result = await userCollection.updateOne(filter, updateDoc)
      res.json(result)
    })

// ADMIN ADMIN EMAIL EMAIL DOCTOR 
app.get('/users/email', async(req, res)=>{
  const email = req.params.email;
  const query = {email: email};
  const user = await userCollection.find(query);
  let isAdmin = false;
  if(user?.role === 'admin'){
    isAdmin = true;
  }
  res.json({admin : isAdmin})

})





// GET API
app.get('/names', async(req, res)=>{
  const cursor = ReviCollection.find({});
  const names = await cursor.toArray();
  res.send(names)
})


// SINGLE GET API SERVICE
app.get('/names/:id', async(req,res)=>{
const id = req.params.id;
const query = {_id:ObjectId(id)}
const name = await ReviCollection.findOne(query)
res.json(name);
})


// POST API
app.post('/names', async(req,res)=>{
  const name = req.body;
console.log('Hit the post api', name);
  const result = await ReviCollection.insertOne(name)
  console.log(result)
  res.json(result)
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