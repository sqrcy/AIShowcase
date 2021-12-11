const brain = require('brain.js')
const fs = require('fs');
const { loadavg } = require('os');

let trainingData = [];

// Create Network
const net = new brain.recurrent.LSTM({ 
	activation: 'leaky-relu'
});
console.log("Brain | Network Initiated")

// Train
function loadTraining()
{
	train(JSON.parse(fs.readFileSync('./train.json')));
}


// Save Current Data
function saveTrainingData()
{
	try {
		fs.writeFile('./net.json', JSON.stringify(net.toJSON()), (err, result) => {
			if(err) console.log("Brain | Network Failed to Save Data" + err);
		});
	}catch(err){
		console.log(err);
	}
}

function loadExsistTrain()
{
	fs.readFile('net.json', 'utf8', function readFileCallback(err, data){
		if (err){
			console.log(err);
		} else {
		train(JSON.parse(fs.readFileSync('./train.json')));
		json = JSON.stringify(net.toJSON())
		fs.writeFile('net.json', json, function(err, result) {
			if(err) return console.log('Save Error: ', err)
		  });
	}});
}


// Train Network
const train = (dt) => {
	
	console.log("Training...");
	
	const d = new Date();
	
	net.train(dt, {
		iterations: 200,
		log: true,
		errorThresh: 0.001,
		logPeriod: 100,
		momentum: 0.1,
		learningRate: 0.001
	});
	
	saveTrainingData();
	
	console.log(`Brain | Finished training in ${(new Date() - d) / 1000} s`);
}


// Create Action
const reply = (intent) => {
	
	if(intent === "") return ":thinking:";
	
	var retstr = "";

	switch(parseInt(intent)) {
		case 1:
			retstr = "flag"
        break;
		case 2:
			retstr = "nothing"
        break;
		default:
            retstr = "nothing"
		break;
	}
	
	return retstr;
}

// Bootload testing
const boot = () => {
    let q = "fuck gay"
    var qs = q.replace(/[^a-zA-Z ]+/g, "").toLowerCase();
    console.log(reply(net.run(qs)));
}

// Test Training Data
function testTrainingModel()
{
	net.fromJSON(JSON.parse(fs.readFileSync('./net.json', 'utf8')));
	boot();
}

// Init
const init = () =>
{
   	loadTraining()
   	//testTrainingModel()
}
init();