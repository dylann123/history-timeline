const express = require('express');
const body = require('body-parser');
const app = express();

const sourceDir = __dirname + '/src';

app.use(body.json());
app.use('timeline', express.static("timeline"))
app.use(express.static("public"));
app.use(express.static(sourceDir));

app.get('/', (req, res) => {
	res.sendFile(sourceDir + '/index.html')
});

app.listen(3000, () => {
	console.log('Listening on port 3000');
});