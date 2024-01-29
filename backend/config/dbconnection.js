const mongoose = require('mongoose');
const connection = process.env.MONGO_URI;
try {
    mongoose.connect(connection, {
    // useNewURLParser: true,
    // useUnifiedTopology:true
    // useCreateIndex:true
}).then(()=>{
    console.log(`connection Done with MongoDB`);
})
} catch (error) {
    console.log(error);
}