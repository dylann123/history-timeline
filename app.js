const fs = require("fs")
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

app.get('/years', (req, res) => {
	// console.log(req.body)

	if (!req.query.year) {
		let data = fs.readdirSync(__dirname + "/timeline")
		data.forEach(filename => filename = filename.replace(/\.[^/.]+$/, ""))
		res.send(JSON.stringify(data, null, 4))
	} else {
		if (fs.existsSync(__dirname + "/timeline/" + req.query.year + ".json")) {
			res.sendFile(__dirname + "/timeline/" + req.query.year + ".json")
		} else {
			res.send("[]")
			console.log("l")
		}
	}
})

app.post('/createpoint', (req, res) => {
	if (!req.body.x || !req.body.y || !req.body.title || !req.body.description || !req.body.year) {
		res.send("{\"success\":false}")
	} else {
		console.log({ x: req.body.x, y: req.body.y, title: req.body.title, description: req.body.description })
		let yearData = fs.readFileSync(__dirname + "/timeline/" + req.body.year + ".json")
		yearData = JSON.parse(yearData)
		yearData.push({ x: req.body.x, y: req.body.y, title: req.body.title, description: req.body.description })
		yearData = JSON.stringify(yearData, null, 4)
		fs.writeFileSync(__dirname + "/timeline/" + req.body.year + ".json",yearData)
		res.send("{\"success\":true}")
	}
})

app.listen(3000, () => {
	console.log('Listening on port 3000');
});