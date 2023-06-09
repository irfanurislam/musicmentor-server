// app.get('/coffee',async(req,res) =>{
    //   const cursor = coffeeCollection.find()
    //   const result = await cursor.toArray() 
    //   res.send(result)
    // })

    // app.get('/coffee/:id', async(req, res) => {
    //         const id = req.params.id;
    //         const query = {_id: new ObjectId(id)}
    //         const result = await coffeeCollection.findOne(query);
    //         res.send(result);
    //     })





      // app.put('/coffee/:id', async(req,res) =>{
    //   const id = req.params.id
    //   const filter = {_id: new ObjectId(id)}
    //   const options = {upsert: true}
    //   const updatedCoffee = req.body;
    //   const coffee = {
    //     $set:{
    //       name: updatedCoffee.name, 
    //       quantity: updatedCoffee.quantity, 
    //       supplier: updatedCoffee.supplier, 
    //       taste: updatedCoffee.taste, 
    //       category: updatedCoffee.category, 
    //       details: updatedCoffee.details, 
    //       photo: updatedCoffee.photo
    //     }
    //   }
    //   const result = await coffeeCollection.updateOne(filter,coffee,options)
    //   res.send(result)
    // })

    // app.delete('/coffee/:id',async(req,res) =>{
    //   const id = req.params.id
    //   const query = {_id: new ObjectId(id)}
    //   const result = await coffeeCollection.deleteOne(query)
    //   res.send(result)
    // })