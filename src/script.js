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
		document.body.prepend(div)
	},
	remove: () => {
		if (document.getElementById("input-box")) {
			document.getElementById("input-box").remove()
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
	if(inputgui.mouseOver) return
	if (inputgui.active) {
		inputgui.remove()
	} else {
		inputgui.create(e.x, e.y)
	}
})

