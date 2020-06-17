const app = require('express')();
const bodyParser = require('body-parser');
const game = require('./game.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.route('/').get(sendQuestions);
app.route('/webhooks/inbound').get(handleInbound).post(handleInbound);
app.route('/webhooks/status').get(showStatus).post(showStatus);

function handleInbound (req, res) {
	console.log(req.body);
	const message = req.body.message.content.text.toUpperCase();

	switch (message) {
		case 'QUIZ':
			if (!game.answeringQuestion) {
				game.generateQuestion();
			} else {
				game.sendError();
			}
			break;
		case 'Y':
			if (!game.answeringQuestion) {
				game.generateQuestion();
			} else {
				game.sendError();
			}
			break;
		case 'N':
			game.answeringQuestion = false;
			game.sendScore();
			break;
		case 'A':
		case 'B':
		case 'C':
		case 'D':
		case 'E':
			game.checkAnswer(message);
			break;
		default:
			game.sendError();
			break;
	}

	res.status(204).send();
}

function showStatus (req, res) {
	console.log(req.body);
	res.status(204).send();
}

function sendQuestions (req, res) {
	game.generateQuestion();
	res.status(204).send();
}

app.listen(process.env.PORT || 5000);
