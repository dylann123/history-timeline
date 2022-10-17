// Variables

const maxWidth = 2000;
const maxHeight = 1000;

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
		return x/(maxWidth / window.innerWidth);
	},
	y: (y) => {
		return y/(maxHeight / window.innerHeight);
	}
}

let createPoint = (x, y, id = 0) => {
	const width = 10
	const height = 10

	let div = document.createElement("div")
	div.style.backgroundColor = "red"
	div.style.width = width+"px"
	div.style.height = height+"px"
	div.style.borderRadius = "10px"
	div.style.position = "absolute"
	div.className = "point"
	div.id = id
	div.style.left = getGlobalPos.x(x) - width/2 + "px"
	div.style.top = getGlobalPos.y(y) - height/2 + "px"

	document.body.prepend(div)
}

let inputgui = {
	width: 300,
	height: 400,
	x: 0,
	y: 0,
	mouseOver: false,
	active: false,
	create: (x, y) => {
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
		div.style.height = inputgui.height + "px"
		div.style.backgroundColor = "white"
		div.style.border = "black 1px solid"
		div.style.boxShadow = "2px 2px gray"
		div.style.padding = "10px"
		div.style.zIndex = "1"
		div.innerHTML = "Create new marker at " + inputgui.x + "," + inputgui.y

		let button = document.createElement("button")
		button.onclick = ()=>{
			createPoint(inputgui.x,inputgui.y,1)
			inputgui.remove()
		}
		button.innerText = "Submit"
		div.appendChild(button)

		document.body.prepend(div)
	},
	remove: () => {
		if (document.getElementById("input-box")) {
			document.getElementById("input-box").hidden = true
			inputgui.active = false
		}
	}
}

// Event listeners

document.addEventListener("mousemove", (e) => {
	let x = e.clientX;
	let y = e.clientY;

	x = getRelativePos.x(x).toFixed(0);
	y = getRelativePos.y(y).toFixed(0);

	document.getElementById("mouse-pos-display").innerHTML = `${x}, ${y}`;
})

document.addEventListener("mouseup", (e) => {
	if (inputgui.mouseOver) return
	if (inputgui.active) {
		inputgui.remove()
	} else {
		let x = e.x
		let y = e.y
		if (window.innerWidth - (inputgui.width + e.x) < 0) x -= inputgui.width
		if (window.innerHeight - (inputgui.height + e.h) < 0) x -= inputgui.height
		inputgui.x = getRelativePos.x(e.x).toFixed(0)
		inputgui.y = getRelativePos.y(e.y).toFixed(0)
		inputgui.create(x, y)
	}
})

