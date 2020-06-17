require('dotenv').config();
const Nexmo = require('Nexmo');
const fetch = require('node-fetch');
const { request } = require('express');

let answeringQuestion = false;
let currentQuestion = {};
let questionCount = 0;
let score = 0;
const alpha = [ 'A', 'B', 'C', 'D', 'E' ];

const nexmo = new Nexmo(
	{
		apiKey: process.env.API_KEY,
		apiSecret: process.env.API_SECRET,
		applicationId: process.env.APPLICATION_ID,
		privateKey: process.env.PRIVATE_KEY_FILE,
	},
	{
		debug: true,
		// use Sandbox endpoint
		apiHost: process.env.API_HOST,
	}
);

async function generateQuestion () {
	try {
		answeringQuestion = true;
		questionCount++;
		const response = await fetch('https://opentdb.com/api.php?amount=1');
		const json = await response.json();
		currentQuestion = json.results[0];
		let choices = [ ...currentQuestion.incorrect_answers ];
		choices.push(currentQuestion.correct_answer);
		shuffleQuestions(choices);
		currentQuestion.choices = choices;
		sendQuestion(currentQuestion);
	} catch (error) {
		console.log(error);
	}
}

function checkAnswer (answer) {
	answeringQuestion = false;
	// find answer in choices
	let index = alpha.indexOf(answer);
	if (index < 0) {
		sendError();
	} else {
		if (currentQuestion.choices[index] === currentQuestion.correct_answer) {
			// correct answer
			score++;
			sendMessage('Correct!');
		} else {
			// incorrect answer
			let correctIndex = currentQuestion.choices.indexOf(
				currentQuestion.correct_answer
			);
			let incorrectResponse = `Sorry, the correct answer was ${alpha[
				correctIndex
			]}.`;
			sendMessage(incorrectResponse);
		}
		setTimeout(sendAnother, 2000);
	}
}

function sendQuestion (currentQuestion) {
	let answers = '';
	currentQuestion.choices.forEach((answer, idx) => {
		answers += '\n' + alpha[idx] + '. ' + answer;
	});

	let str = currentQuestion.question + answers;
	let str1 = str.replace(/&quot;/gi, '"');
	let questionText = str1.replace(/&#039;/gi, "'");

	sendMessage(questionText);
}

function sendAnother () {
	sendMessage('Do you want another question? (Y/N)');
}

function sendScore () {
	sendMessage(
		`Thanks for playing! You answered ${score} question${score > 1
			? 's'
			: ''} correctly out of ${questionCount}.`
	);
	score = 0;
	questionCount = 0;
}

function sendMessage (messageText) {
	nexmo.channel.send(
		{
			type: 'whatsapp',
			number: process.env.TO_NUMBER,
		},
		{
			type: 'whatsapp',
			number: process.env.WHATSAPP_NUMBER,
		},
		{
			content: {
				type: 'text',
				text: messageText,
			},
		},
		(err, data) => {
			if (err) {
				console.log(err);
			} else {
				console.log(data.message_uuid);
			}
		}
	);
}

function shuffleQuestions (array) {
	array.sort(() => Math.random() - 0.5);
}

function sendError () {
	sendMessage('Sorry, I did not recognise that response. Please try again');
}

module.exports = {
	answeringQuestion,
	checkAnswer,
	sendScore,
	sendMessage,
	sendError,
	generateQuestion,
};
