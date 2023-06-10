const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const jwt = require('jsonwebtoken');
require('dotenv').config()
const stripe = require('stripe')(process.env.PAYMENT_SECRET_KEY)
const app = express()

const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// verify jwt

const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).send({ error: true, message: 'unauthorized access' });
  }
  // bearer
  const token = authorization.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: true, message: 'unauthorized access' })
    }
    req.decoded = decoded;
    next();
  })
}

console.log(process.env.DB_PASS)
// const uri = "mongodb+srv://coffeeStore:zuTzHhwlyjH1I2t2@cluster0.psezczp.mongodb.net/?retryWrites=true&w=majority";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.psezczp.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

     
     const userCollection = client.db('musicDB').collection('users')
     const classesCollection = client.db('musicDB').collection('classes')
     const cartCollection = client.db('musicDB').collection('carts')
   
    
    //  jwt
    app.post('/jwt', (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })

      res.send({ token })
    })

// verify admin 
const verifyAdmin = async (req, res, next) => {
  const email = req.decoded.email;
  const query = { email: email }
  const user = await userCollection.findOne(query);
  if (user?.role !== 'admin') {
    return res.status(403).send({ error: true, message: 'forbidden message' });
  }
  next();
}


    //  users related api
    app.get('/users',verifyJWT,verifyAdmin, async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });


    app.post('/users',async(req,res) =>{
      const newUser = req.body 

      const query = { email: newUser.email }
      const alreadyUser = await userCollection.findOne(query);
      console.log('alreadyuser',alreadyUser);

      if (alreadyUser) {
        return res.send({ message: 'user already exists' })
      }

      const result = await userCollection.insertOne(newUser);
      res.send(result);
    })

    // role admin // eivabe instructor korbo
    app.get('/users/admin/:email', verifyJWT, async (req, res) => {
      const email = req.params.email;

      if (req.decoded.email !== email) {
        res.send({ admin: false })
      }

      const query = { email: email }
      const user = await userCollection.findOne(query);
      const result = { admin: user?.role === 'admin' }
      res.send(result);
    })

    app.patch('/users/admin/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: 'admin'
        },
      };

      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);

    })

    app.delete('/users/:id',async(req,res) =>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await userCollection.deleteOne(query)
      res.send(result)
    })

    // role instructor






     app.get('/myclass',async(req,res) =>{  
      const cursor = classesCollection.find()
      const result = await cursor.toArray() 
      res.send(result)
    })


    app.get('/myclass', async (req, res) => {
      try {
        const email = req.query.instructorEmail;
      console.log(email)
       if(!email){
        res.send([])
       }
       const query = {email:email}
        // Assuming you have established a MongoDB connection and have access to the "classes" collection
        const result = await classesCollection.find(query).toArray();
    
        res.json(result);
      } catch (error) {
        console.error('Error fetching classes:', error);
        res.status(500).json({ error: 'Failed to fetch classes' });
      }
    });





    app.post('/addclass',async(req,res) =>{
        const newClasses = req.body
        console.log(newClasses)
        const result = await classesCollection.insertOne(newClasses)
        res.send(result)
        
    })

    // my Booked Collections

    app.get('/carts',verifyJWT, async(req,res) =>{
      const email = req.query.email
      if(!email){
        res.send([])

      }
      const decodedEmail = req.decoded.email;
      if (email !== decodedEmail) {
        return res.status(403).send({ error: true, message: 'porviden access' })
      }
      const query = {email:email}
      const result = await cartCollection.find(query).toArray()
      res.send(result)
    })

    app.post('/carts',async(req,res) =>{
      const item = req.body
      console.log(item)
      const result = await cartCollection.insertOne(item)
      res.send(result)

    })


    app.get('/carts/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await cartCollection.findOne(query);
            res.send(result);
        })


    app.delete('/carts/:id',async(req,res) =>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await cartCollection.deleteOne(query)
      res.send(result)
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req,res) =>{
    res.send('my another music mentor ')
})

app.listen(port,() =>{
    console.log(`music  store running${port}`)
})