import express from 'express';

// Create the express application
const app: express.Application = express();

// Listen to port 2030
app.listen(2030, () => {
    console.log('Listening to port 2030...')
});

