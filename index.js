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
     const paymentCollection = client.db('musicDB').collection('payments')
   
    
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
// verify instructor 
const verifyInstructor = async (req, res, next) => {
  const email = req.decoded.email;
  const query = { email: email }
  const user = await userCollection.findOne(query);
  if (user?.role !== 'instructor') {
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

    // instructor
    app.get('/users/instructor/:email', verifyJWT, async (req, res) => {
      const email = req.params.email;

      if (req.decoded.email !== email) {
        res.send({ instructor: false })
      }

      const query = { email: email }
      const user = await userCollection.findOne(query);
      const result = { instructor: user?.role === 'instructor' }
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

    // instructor
    app.patch('/users/instructor/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: 'instructor'
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
     app.get('/myclass/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await classesCollection.findOne(query);
            res.send(result);
        })


    app.get('/myclass', async (req, res) => {
      try {
        const email = req.query.email;
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

    // admin manageclass

    app.patch('/managealldclass/:id', async(req,res) =>{
      const id = req.params.id
      const updated = req.body
      const filter = {_id: new ObjectId(id)}
      const updateDoc = {
        $set:{
          status: updated.status
        }
      }
      const result = await classesCollection.updateOne(filter,updateDoc)
       res.send(result)
    } )

    app.put('/myclass/:id',async(req,res) =>{
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updatedCLass = req.body;
      const classes = {
        $set:{
          className: updatedCLass.className, 
          classImage: updatedCLass.classImage, 
          name: updatedCLass.name, 
          email: updatedCLass.email, 
          seats: updatedCLass.seats, 
          price: updatedCLass.price,
          status: updatedCLass.status 
         
        }
      }
        const result = await classesCollection.updateOne(filter,classes,options)
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




// payment
 // create payment intent
 app.post('/create-payment-intent', verifyJWT, async (req, res) => {
  const { price } = req.body;
  const amount = parseInt(price * 100);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'usd',
    payment_method_types: ['card']
  });

  res.send({
    clientSecret: paymentIntent.client_secret
  })
});

// payment 
app.get('/payments',async(req,res) =>{
  const email = req.query.email;
  if(!email){
    res.send([])
  }
  const query = {email:email}
  const sortOptions = {date: -1}
  const result = await paymentCollection.find(query).sort(sortOptions).toArray()
  res.send(result)

})



// payment related api
// app.post('/payments', verifyJWT, async (req, res) => {
//   const payment = req.body;
//   const insertResult = await paymentCollection.insertOne(payment);

//   const query = { _id: new ObjectId(payment.cartId) };
//   const deleteResult = await cartCollection.deleteOne(query)

//   res.send({ insertResult, deleteResult });
// })

// // todo neumeric issue seats te integer banabo
app.post('/payments', verifyJWT, async (req, res) => {
  const payment = req.body;
  const insertResult = await paymentCollection.insertOne(payment);

  const cartId = payment.cartId;
  const cartQuery = { _id: new ObjectId(cartId) };
  const cart = await cartCollection.findOne(cartQuery);
  const deleteResult = await cartCollection.deleteOne(cartQuery);
  if (cart.seats === 0) {
    // No available seats, return an error response
    return res.status(400).json({ error: 'No available seats' });
  }

  const seatsToUpdate = cart.seats; // Convert string to number
  if (isNaN(seatsToUpdate)) {
    // Invalid seat value, return an error response
    return res.status(400).json({ error: 'Invalid seat value' });
  }

  const classQuery = { _id: new ObjectId(payment.classId) };
  const classUpdate = { $inc: { seats: -seatsToUpdate } };

  const updateResult = await classesCollection.updateMany(classQuery, classUpdate);

  if (updateResult.modifiedCount === 0) {
    // Failed to update seats, return an error response
    return res.status(400).json({ error: 'Failed to update seats' });
  }

 

  res.json({ insertResult, deleteResult });
});





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