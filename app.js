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
			console.log("Year " + req.query.year + " is not valid.")
		}
	}
})

app.post('/createpoint', (req, res) => {
	if (!req.body.x || !req.body.y || !req.body.title || !req.body.description || !req.body.year) {
		res.send("{\"success\":false}")
	} else {
		console.log({ x: req.body.x, y: req.body.y, title: req.body.title, description: req.body.description })
		let year = __dirname + "/timeline/" + req.body.year + ".json"
		if (!fs.existsSync(year)) {
			fs.writeFileSync(year, "[]")
		}
		let yearData = fs.readFileSync(year)
		yearData = JSON.parse(yearData)
		yearData.push({ x: req.body.x, y: req.body.y, title: req.body.title, description: req.body.description })
		yearData = JSON.stringify(yearData, null, 4)
		fs.writeFileSync(year, yearData)
		res.send("{\"success\":true}")
	}
})

app.post("/deletepoint", (req, res) => {
	if (req.body.year && req.body.x && req.body.y) {
		let year = __dirname + "/timeline/" + req.body.year + ".json"
		if (fs.existsSync(year)) {
			let data = fs.readFileSync(year)
			data = JSON.parse(data)
			let success = false
			for (let i in data) {
				let point = data[i]
				console.log(`${point["x"]},${point["y"]} compared to ${req.body.x},${req.body.y}`)
				if (point["x"] == req.body.x && point["y"] == req.body.y) {
					data.splice(i, 1)
					data = JSON.stringify(data, null, 4)
					fs.writeFile(year, data, () => { })
					console.log(point["x"] + "," + point["y"] + " deleted in year " + year + " at index " + i)
					res.send("{\"success\":\"true\"}")
					success = true
				}
			}
			if (!success) res.send("{\"error\":\"invalid year\"}")
		} else {
			console.log(req.body.year + " is not valid. ")
			res.send("{\"error\":\"invalid year\"}")
		}
	} else {
		res.send("{\"success\":false}")
	}
})

app.listen(3000, () => {
	console.log('Listening on port 3000');
});