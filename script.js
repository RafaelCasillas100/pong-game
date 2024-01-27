const ball = document.querySelector("#ball");
const playerPaddle = document.querySelector("#player-paddle");
const computerPaddle = document.querySelector("#computer-paddle");
const playerScore = document.querySelector("#player-score");
const computerScore = document.querySelector("#computer-score");

const INCREMENT_BALL_VELOCITY_X = randomIntFromInterval(0.001, 0.0015);
const INCREMENT_BALL_VELOCITY_Y = randomIntFromInterval(0.001, 0.00125);
const DIFFICULTY_GAME_VALUE = 0.05;

let initialBallVelocity_X = 0.6;
let initialBallVelocity_Y = 0.4;

let ballPosition_X = 50;
let ballPosition_Y = 50;

// CREATING FIRST BALL ANGLE
let angleInRadiants = randomIntFromInterval(0, 2 * Math.PI);
let ballDirection = {
  x: Math.cos(angleInRadiants),
  y: Math.sin(angleInRadiants),
};

function setBallCoordinates() {
  const playerPaddleCoordinates = playerPaddle.getBoundingClientRect();
  const computerPaddleCoordinates = computerPaddle.getBoundingClientRect();

  ball.style.setProperty("--x", ballPosition_X);
  ball.style.setProperty("--y", ballPosition_Y);

  const ballCoordinates = ball.getBoundingClientRect();

  if (
    isCollision(computerPaddleCoordinates, ballCoordinates) ||
    isCollision(playerPaddleCoordinates, ballCoordinates)
  ) {
    ballDirection.x *= -1;
  }
  if (
    ballCoordinates.bottom >= window.innerHeight ||
    ballCoordinates.top <= 0
  ) {
    ballDirection.y *= -1;
  }

  // CHECK WINNER / LOSER
  if (ballCoordinates.right >= window.innerWidth) {
    checkWinner_Looser("playerWins");
  }
  if (ballCoordinates.left <= 0) {
    checkWinner_Looser("computerWins");
  }

  ballPosition_X += ballDirection.x * initialBallVelocity_X;
  ballPosition_Y += ballDirection.y * initialBallVelocity_Y;

  if (initialBallVelocity_X <= 1.6) {
    initialBallVelocity_X += INCREMENT_BALL_VELOCITY_X;
    initialBallVelocity_Y += INCREMENT_BALL_VELOCITY_Y;
  }

  // MOVING COMPUTER PADDLE
  let computerPaddlePosition = parseFloat(
    getComputedStyle(computerPaddle).getPropertyValue("--position")
  );
  let ballPositionInPercentage = (ballCoordinates.y * 100) / window.innerHeight;

  computerPaddlePosition =
    computerPaddlePosition +
    DIFFICULTY_GAME_VALUE * (ballPositionInPercentage - computerPaddlePosition);
  computerPaddle.style.setProperty("--position", computerPaddlePosition);

  window.requestAnimationFrame(setBallCoordinates);
}

function isCollision(paddleCoordinates, ballCoordinates) {
  return (
    paddleCoordinates.left <= ballCoordinates.right &&
    paddleCoordinates.right >= ballCoordinates.left &&
    paddleCoordinates.top <= ballCoordinates.bottom &&
    paddleCoordinates.bottom >= ballCoordinates.top
  );
}

function checkWinner_Looser(winningMessage) {
  if (winningMessage === "playerWins") {
    playerScore.textContent = parseInt(playerScore.textContent) + 1;
  } else {
    computerScore.textContent = parseInt(computerScore.textContent) + 1;
  }

  // RESET VALUES
  initialBallVelocity_X = 0.6;
  initialBallVelocity_Y = 0.4;

  ballPosition_X = 50;
  ballPosition_Y = 50;

  angleInRadiants = randomIntFromInterval(0, 2 * Math.PI);
  ballDirection = {
    x: Math.cos(angleInRadiants),
    y: Math.sin(angleInRadiants),
  };
}

function movePlayerPaddle(event) {
  const convertingPxToPercentage = (event.y * 100) / window.innerHeight;
  playerPaddle.style.setProperty("--position", convertingPxToPercentage);
}

function randomIntFromInterval(min, max) {
  return Math.random() * (max - min) + min;
}

window.addEventListener("mousemove", movePlayerPaddle);
window.requestAnimationFrame(setBallCoordinates);
