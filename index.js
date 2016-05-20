var diffusion = require("diffusion");

function doConnect() {
	connect({
		host: "localhost",
		port: 8080,
		secure: false,
	}, "?MongoDB/truefx//");
}

function connect(connectionSpec, topicSelector) {
	diffusion.connect(connectionSpec).then(function(session){
		console.log("Connected to ", JSON.stringify(connectionSpec));

		session.subscribe(topicSelector).asType(diffusion.datatypes.json()).on('value', function(topicPath, spec, newValue) {
			processValue(topicPath, newValue.get());
		});

	}, function(error){
		alert(`Cannot connect to ${JSON.stringify(connectionSpec)}: ${JSON.stringify(error)}`);
	});
}

let fxRows = {}; // fx-pair-name => FxRowView
const fxTableBody = document.getElementById('fxTableBody');

function processValue(topicPath, value) {
	const pairName = value.pairName;
	if (!(pairName in fxRows)) {
		fxRows[pairName] = new FxRowView(fxTableBody, value);
	} else {
		fxRows[pairName].update(value);
	}
}

function addSimpleCell(row, cellValue) {
	const result = row.insertCell(-1);
	result.appendChild(document.createTextNode(cellValue));
	return result;
}

function resolveComplexPrice(bidOffer) {
		return bidOffer.big.concat(bidOffer.points);
}

class FxRowView {

	constructor(table, value) {
		this.domRow = table.insertRow(-1);
		this.pairName = value.pairName;

		// Constructor all the cells 
		addSimpleCell(this.domRow, value.pairName);
		this.bidBig = addSimpleCell(this.domRow, value.bid.big);
		this.bidPoints = addSimpleCell(this.domRow, value.bid.points);

		this.offerBig = addSimpleCell(this.domRow, value.offer.big);
		this.offerPoints = addSimpleCell(this.domRow, value.offer.points);
		
		addSimpleCell(this.domRow, value.open);
		addSimpleCell(this.domRow, value.high);
		addSimpleCell(this.domRow, value.low);

		this.offer = value.offer.big.concat(value.offer.points);

		this.bid = resolveComplexPrice(value.bid);
		this.offer = resolveComplexPrice(value.offer);
	}

	update(newValue) {
		// Bid
		this.bidBig.textContent = newValue.bid.big;
		this.bidPoints.textContent = newValue.bid.points;

		const newBid = resolveComplexPrice(newValue.bid);
		const bidClassName = (newBid > this.bid) ? "up" : ((newBid < this.bid) ? "down": "");
		this.bid = newBid;
		this.bidBig.className = bidClassName
		this.bidPoints.className = bidClassName;
		
		// Offer
		this.offerBig.textContent = newValue.offer.big;
		this.offerPoints.textContent = newValue.offer.points;

		const newOffer = resolveComplexPrice(newValue.offer);
		const offerClassName = (newOffer > this.offer) ? "up" : ((newOffer < this.offer) ? "down": "");
		this.offer = newOffer;
		this.offerBig.className = offerClassName
		this.offerPoints.className = offerClassName;
	}
}

