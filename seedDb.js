const mongoose = require('mongoose')
const Posts = require('./routes/Posts/models/Post')
const Seed = require('./seed.json')


require('dotenv').config()



const seedFunc = async() => {
    try{
        const data = await Posts.create(Seed)
        console.log(`${data.length} records created`)
        await mongoose.disconnect()
        console.log(`MongoDB Disconnected`)
        process.exit(0)
    }
    catch(error){
        console.error(error)
        process.exit(1)
    }
}

mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true},()=>{
    mongoose.connection.db.dropDatabase()
}).then(()=>{
console.log('MongoDB Connection')
seedFunc()

  }).catch((err)=>console.log(`Mongo Error: ${err}`))