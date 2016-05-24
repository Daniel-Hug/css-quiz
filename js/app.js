/* Table of Contents

 - question data
 - game state data
 - event listeners
 - modules
 - DOM renderers
 - start game

*/




// Question data
var questions = [
	{
		questionHTML: 'What\'s this called: <code>selector { property: value; }</code>',
		answerOptionsHTML: [
			'block',
			'rule',
			'declaration',
			'function'
		],
		correctAnswerKey: 1
	}
];




// game state data
var game = {
	currentQuestionKey: 0
}




// event listeners

$('.start-btn').click(function() {
	startGame();
});

$('.answer-form').submit(function(event) {
	event.preventDefault();
	var userGuessKey = parseInt(this.option.value, 10);
	makeGuess(userGuessKey);
});

function makeGuess(userGuessKey) {
	var currentQuestion = questions[game.currentQuestionKey];
	var isCorrect = currentQuestion.correctAnswerKey === userGuessKey;

	guessLog.push(isCorrect);
	console.log('right: ' + isCorrect);

	// no more questions
	if (game.currentQuestionKey === questions.length - 1) {
		console.log('game over')
	} else {
		game.currentQuestionKey++;
		renderQuestion(questions[game.currentQuestionKey])
	}
}




// modules

var guessLog = (function() {
	var $list = $('.guess-log');
	var items;
	var nextI = 0;

	function renderItem(question) {
		return dom({
			el: 'li',
			_className: 'untried',
			_innerHTML: question.questionHTML
		});
	}

	return {
		reset: function(questions) {
			items = questions.map(renderItem);
			$list.empty().append(dom(items));
			nextI = 0;
		},
		push: function(isCorrect) {
			var item = items[nextI];
			item.classList.remove('untried');
			item.classList.add(isCorrect ? 'correct' : 'incorrect');
			nextI++;
		}
	};
})();




// DOM renderers

var renderQuestion = (function() {
	var $questionHeading = $('.question-text');
	var $answerOptionsList = $('.answer-options');

	return function renderQuestion(questionData) {
		$questionHeading.innerHTML = questionData.questionHTML;
		var items = questionData.answerOptionsHTML.map(renderAnswerOption);
		$answerOptionsList.empty().append(dom(items));
	};
})();


/*
<li>
	<label>
		<input type="radio" name="option">
		<span class="answer-option-text">declaration</span>
	</label>
</li>
*/
function renderAnswerOption(answerOptionHTML, i) {
	return dom({
		el: 'li',
		kids: [{
			el: 'label',
			kids: [
				{ el: 'input', type: 'radio', name: 'option', value: i },
				{
					el: 'span',
					_className: 'answer-option-text',
					_innerHTML: answerOptionHTML
				}
			]
		}]
	});
}




// start game

function startGame() {
	var firstQuestion = questions[0];
	renderQuestion(firstQuestion);
	guessLog.reset(questions);
}
startGame();