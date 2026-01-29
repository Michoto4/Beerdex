import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connect from './database/connect.js';
import router from './router/route.js';

const app = express();

/** middlewares */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by');

const port = 8080;

/** HTTP GET request */
app.get('/', (req, res) => {
  res.status(201).json("Home GET Request");
});


/** API routes */
app.use('/api', router);


/** start server only when there is a valid connection */

connect().then(() => {
  try {
    app.listen(port, () => {
      console.log(`Server connected to http://localhost:${port}`);
    })
  } catch (error) {
    console.log("Cannot connect to the server");
  }
}).catch(error => {
  console.log("Invalid database connection!")
});
