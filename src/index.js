 const express = require('express');
 require('./db/mongoose');
 const userRouter = require('./router/user');
 const taskRouter = require('./router/task');

 const app = express();
 const port = process.env.PORT;

 //  app.use((req, res, next) => {
 //      if (req.method === 'GET') {
 //          res.send('GET method is disabled');
 //      } else {
 //          next();
 //      }
 //  })

 //  app.use((req, res, next) => {
 //      res.status(503).send('Site is under maintainence');
 //  })

 const multer = require('multer');
 const upload = multer({
     dest: 'images',
     limits: {
         fileSize: 1000000
     },
     fileFilter(req, file, cb) {
         if (!file.originalname.match(/\.(doc|docx)$/)) {
             return cb(new Error('Must be a word file'));
         }
         cb(undefined, true);
     }
 })
 app.use(express.json());
 app.use(userRouter);
 app.use(taskRouter);

 app.listen(port, () => {
     console.log('Server is running at port ' + port);
 })