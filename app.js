const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');

const PORT = 8080;
const app = express();

//middlewares
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors({ origin: '*', credentials: true }));

//routes
app.use(require('./routes/RouteMessages'));

app.listen(PORT, () => {
  console.log(`Connected by port ${PORT}`);
});
