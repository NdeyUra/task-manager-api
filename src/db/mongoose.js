const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    // const me = new USer({
    //     name: '    Saurav   ',
    //     email: 'SAURAV@GAMIL.COM',
    //     password: 'Password123'
    // })
    // me.save().then(() => {
    //     console.log(me);
    // }).catch((error) => {
    //     console.log(error);
    // })
    // const me = new Tasks({
    //     description: 'Take bath'
    // });
    // me.save().then(() => {
    //     console.log(me);
    // }).catch((error) => {
    //     console.log(error);
    // })