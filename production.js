// Production server

const express = require('express');
const app = express();
const port = 8080;
app.set('port', port);

app.use(express.static('./client/dist'));
app.use((req, res) => res.sendFile(`${__dirname}/client/dist/index.html`));

app.listen(port, () => console.log(`Production server listening on port ${port}`));
