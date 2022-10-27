// Variables

const maxWidth = 2000;
const maxHeight = 1000;

let year = 1400

// Functions

let getRelativePos = {
	x: (x) => {
		return (maxWidth / window.innerWidth) * x;
	},
	y: (y) => {
		return (maxHeight / window.innerHeight) * y;
	}
}

let getGlobalPos = {
	x: (x) => {
		return x / (maxWidth / window.innerWidth);
	},
	y: (y) => {
		return y / (maxHeight / window.innerHeight);
	}
}

let drawPoint = (x, y, title, description) => {
	const width = 10
	const height = 10

	let div = document.createElement("div")
	div.style.backgroundColor = "red"
	div.style.width = width + "px"
	div.style.height = height + "px"
	div.style.borderRadius = "10px"
	div.style.position = "absolute"
	div.setAttribute("data-title", title)
	div.setAttribute("data-description", description)
	div.className = "point"
	div.style.left = getGlobalPos.x(parseInt(x)) - width / 2 + "px"
	div.style.top = getGlobalPos.y(parseInt(y)) - height / 2 + "px"

	// div.onmouseover = (e) => {
	// 	drawHoverText(e.x, e.y, title)
	// 	inputgui.mouseOver = true
	// }
	// div.onmouseout = (e) => {
	// 	document.getElementById("hover-text").remove()
	// 	inputgui.mouseOver = false
	// }

	// div.onclick = (e) => {
	// 	drawHoverText(e.x, e.y, title + "\n" + description)
	// 	inputgui.active = true
	// }

	document.getElementById("point-container").prepend(div)
}

let drawHoverText = (x, y, text) => {
	let div = document.createElement("div")
	div.innerText = text
	div.id = "hover-text"
	div.style.backgroundColor = "white"
	div.style.border = "1px black solid"
	div.style.position = "absolute"
	div.style.top = y + "px"
	div.style.left = x + "px"
	div.style.padding = "2px"

	document.body.appendChild(div)
}
let drawDetailedText = (x, y, title, description) => {
	let div = document.createElement("div")
	div.innerHTML = "<b>" + title + "</b><br />" + description
	div.id = "detailed-text"
	div.style.backgroundColor = "white"
	div.style.border = "1px black solid"
	div.style.position = "absolute"
	div.style.top = y + "px"
	div.style.left = x + "px"
	div.style.padding = "2px"

	document.body.appendChild(div)
}

let loadYear = (year) => {
	let points = document.querySelectorAll(".point")
	points.forEach((elem)=>{
		elem.remove()
	})
	fetch("/years?year=" + year)
		.then(res => res.json())
		.then(data => {
			// console.log(data)
			document.cookie = "year=" + year;
			for (let i in data) {
				drawPoint(data[i].x, data[i].y, data[i].title, data[i].description)
			}
		})
}

let uploadPoint = (x, y, year, title, description) => {
	let payload = {
		x: x,
		y: y,
		year: year,
		title: title,
		description: description
	}
	fetch('/createpoint', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	}).then(res => res.json()).then(data => {
		console.log("UPLOAD", data)
		loadYear(year)
	});
}

let deletePoint = (year, x, y) => {
	let payload = {
		x: x,
		y: y,
		year: year
	}
	fetch('/deletepoint', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	}).then(res => res.json()).then(data => {
		console.log("DELETE", data)
		loadYear(year)
	});
}

let getYears = async () => {
	let output = await fetch("/years")
	output = output.json()
	return output
}

let inputgui = {
	width: 300,
	height: 400,
	x: 0,
	y: 0,
	mouseOver: false,
	active: false,
	create: async (x, y) => {
		inputgui.active = true
		let div = document.createElement("div")
		div.onmouseover = () => {
			inputgui.mouseOver = true
		}
		div.onmouseout = () => {
			inputgui.mouseOver = false
		}
		div.id = "input-box"
		div.style.position = "absolute"
		div.style.top = y + "px"
		div.style.left = x + "px"
		div.style.width = inputgui.width + "px"
		// div.style.height = inputgui.height + "px"
		div.style.backgroundColor = "white"
		div.style.border = "black 1px solid"
		div.style.boxShadow = "2px 2px gray"
		div.style.padding = "10px"
		div.style.zIndex = "1"
		div.innerHTML = "Create new marker at " + inputgui.x + "," + inputgui.y

		let title = document.createElement("span")
		title.innerText = "Title: "

		let titleInput = document.createElement("input")
		titleInput.placeholder = "Title"
		titleInput.id = "titleInput"

		let year = document.createElement("span")
		year.innerText = "Year: "

		let list = document.createElement("datalist")
		list.id = "yearlist"

		let years = await getYears()
		for (let i of years) {
			let year = document.createElement("option")
			year.value = i.replace(/\.[^/.]+$/, "");
			list.appendChild(year)
		}

		let yearInput = document.createElement("input")
		yearInput.placeholder = "Year"
		yearInput.id = "yearInput"
		yearInput.setAttribute("list", "yearlist")
		yearInput.min = "0"
		yearInput.type = "number"

		yearInput.appendChild(list)

		let description = document.createElement("span")
		description.innerText = "Description: "

		let descriptionInput = document.createElement("textarea")
		descriptionInput.style.resize = "none"
		descriptionInput.style.width = "98%"
		descriptionInput.rows = 10
		descriptionInput.cols = 10
		descriptionInput.placeholder = "Description"
		descriptionInput.id = "descriptionInput"

		let button = document.createElement("button")
		button.onclick = () => {
			drawPoint(inputgui.x, inputgui.y, titleInput.value)
			// console.log(inputgui.x, inputgui.y, yearInput.value, titleInput.value, descriptionInput.value)
			uploadPoint(inputgui.x, inputgui.y, yearInput.value, titleInput.value, descriptionInput.value)
			inputgui.mouseOver = false
			inputgui.remove()
		}
		button.innerText = "Submit"

		div.appendChild(document.createElement("br"))
		div.appendChild(document.createElement("br"))

		div.appendChild(title)
		div.appendChild(titleInput)

		div.appendChild(document.createElement("br"))

		div.appendChild(year)
		div.appendChild(yearInput)

		div.appendChild(document.createElement("br"))

		div.appendChild(description)
		div.appendChild(document.createElement("br"))
		div.appendChild(descriptionInput)

		div.appendChild(document.createElement("br"))
		div.appendChild(button)

		document.body.prepend(div)
	},
	remove: () => {
		inputgui.active = false
		if (document.getElementById("input-box")) {
			document.getElementById("input-box").remove()
		}
		if (document.getElementById("detailed-text")) {
			document.getElementById("detailed-text").remove()
		}
	}
}

// Event listeners

document.addEventListener("mousemove", (e) => {
	if (document.getElementById("hover-text")) {
		document.getElementById("hover-text").remove()
		inputgui.mouseOver = false
	}
	let x = e.clientX;
	let y = e.clientY;

	x = getRelativePos.x(x).toFixed(0);
	y = getRelativePos.y(y).toFixed(0);

	document.getElementById("mouse-pos-display").innerHTML = `${x}, ${y}`;

	if (document.elementFromPoint(e.x, e.y).hasAttribute("data-title") && !document.getElementById("detailed-text")) {
		drawHoverText(e.x + 1, e.y + 1, document.elementFromPoint(e.x, e.y).getAttribute("data-title"))
		inputgui.mouseOver = true
	}
})

document.addEventListener("mousedown", (e) => {
	if (document.elementFromPoint(e.x, e.y).hasAttribute("data-title")) {
		if (!document.getElementById("detailed-text")) {
			drawDetailedText(e.x, e.y, document.elementFromPoint(e.x, e.y).getAttribute("data-title"), document.elementFromPoint(e.x, e.y).getAttribute("data-description"))
			inputgui.active = true
		} else {
			document.getElementById("detailed-text").remove()
			inputgui.active = false
		}
		return
	}
	if (inputgui.mouseOver) return
	if (document.getElementById("hover-text")) document.getElementById("hover-text").remove()
	if (inputgui.active) {
		inputgui.remove()
	} else {
		let x = e.x
		let y = e.y
		if (window.innerWidth - (inputgui.width + e.x) < 0) x -= inputgui.width + 20
		if (window.innerHeight - (inputgui.height + e.h) < 0) x -= inputgui.height
		inputgui.x = getRelativePos.x(e.x).toFixed(0)
		inputgui.y = getRelativePos.y(e.y).toFixed(0)
		inputgui.create(x, y)
	}
})

// Load


loadYear(document.cookie.split("year=")[1] || 1400)

