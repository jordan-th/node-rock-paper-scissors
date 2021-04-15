const readline = require('readline-sync');
const VALID_MOVES = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
const MESSAGES = {
  bestOfStage: "Let's play! Best of how many rounds?",
  bestOfStageInvalid: "Invalid entry. Choose an odd integer between 0 and 10.",
  moveStage: `Choose one: ${VALID_MOVES.join(', ')}`,
  moveStageInvalid: "Invalid entry. Pro tip: For Scissors or Spock, enter" +
    " more than the first letter.",
  replayStage: 'Would you like to play again? y/n',
  replayStageInvalid: "Invalid entry. Type 'y' or 'n'.",
};
const KEY_WINS = {
  rock : ['lizard', 'scissors'],
  paper : ['rock', 'spock'],
  scissors : ['lizard', 'paper'],
  lizard : ['spock', 'paper'],
  spock : ['rock', 'scissors'],
};
const KEY_LOSES = {
  rock : ['paper', 'spock'],
  paper : ['scissors', 'lizard'],
  scissors : ['rock', 'spock'],
  lizard : ['rock', 'scissors'],
  spock : ['paper', 'lizard'],
};

function getUserInput(stage, validityTest) {
  prompt(MESSAGES[stage]);
  let userResponse = readline.question();
  while (validityTest(userResponse)) {
    prompt(MESSAGES[`${stage}Invalid`]);
    userResponse = readline.question();
  }
  return userResponse;
}

function prompt(message) {
  console.log(`=> ${message}`);
}

function isInvalidBestOf(entry) {
  return (
    entry.trimStart() === '' ||
    Number.isNaN(parseInt(entry, 10)) ||
    !Number.isInteger(parseFloat(entry)) ||
    parseInt(entry, 10) <= 0 ||
    parseInt(entry, 10) >= 10 ||
    parseInt(entry, 10) % 2 === 0
  );
}

function isNoWinnerYet(scoresObj, limit) {
  return (
    (scoresObj['user'] < Math.ceil(limit / 2)) &&
    (scoresObj['cpu'] < Math.ceil(limit / 2))
  );
}

function isInvalidMove(entry) {
  entry = entry.toLowerCase();
  return (
    entry.trimStart() === '' ||
    entry === 's' ||
    !VALID_MOVES.some(validMove => entry === validMove.slice(0, entry.length))
  );
}

function getFullWordFormat(partial) {
  return (
    VALID_MOVES.find(element => partial === element.slice(0, partial.length))
  );
}

function generateChoice() {
  let randomIndex = Math.floor(Math.random() * VALID_MOVES.length);
  return VALID_MOVES[randomIndex];
}

function updateScore(choice, cpuChoice, scoresObj) {
  if (KEY_WINS[choice].includes(cpuChoice)) {
    scoresObj['user'] += 1;
  } else if (KEY_LOSES[choice].includes(cpuChoice)) {
    scoresObj['cpu'] += 1;
  }
}

function displayWinner(scoresObj) {
  if (scoresObj['user'] > scoresObj['cpu']) {
    prompt("You win!");
  } else if (scoresObj['cpu'] > scoresObj['user']) {
    prompt("You lose :'(");
  } else {
    prompt("It's a tie!");
  }
}

function isInvalidYN(entry) {
  entry = entry.toLowerCase();
  return (entry !== 'n' && entry !== 'y');
}

function isDonePlaying(entry) {
  return entry.toLowerCase() === 'n';
}

while (true) {
  console.clear();

  let scores = { user: 0, cpu: 0 };

  let bestOutOf = parseFloat(getUserInput('bestOfStage', isInvalidBestOf));
  prompt(`Win ${Math.ceil(bestOutOf / 2)} out of ${bestOutOf} to win.`);

  while (isNoWinnerYet(scores, bestOutOf)) {
    let userChoice = getUserInput('moveStage', isInvalidMove);
    userChoice = getFullWordFormat(userChoice.toLowerCase());

    let cpuChoice = generateChoice();

    prompt(`You chose ${userChoice}, computer chose ${cpuChoice}.`);

    updateScore(userChoice, cpuChoice, scores);

    prompt(`The score is Human: ${scores['user']}, Computer: ${scores['cpu']}.`);
  }

  displayWinner(scores);

  let replayChoice = getUserInput('replayStage', isInvalidYN);

  if (isDonePlaying(replayChoice)) break;
}
