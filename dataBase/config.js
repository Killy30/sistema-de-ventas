const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/storeDB', {
    useUnifiedTopology: true, useNewUrlParser: true
})
.then(db => console.log('db is connect'))
.catch(err => console.log('error in db: ', err))
