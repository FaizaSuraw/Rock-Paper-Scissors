import './RPS.css';

(function () {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;

  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreloadLink(link);
  }

  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        for (const node of mutation.addedNodes) {
          if (node.tagName === "LINK" && node.rel === "modulepreload") {
            processPreloadLink(node);
          }
        }
      }
    }
  }).observe(document, { childList: true, subtree: true });

  function getFetchOptions(link) {
    const options = {};
    if (link.integrity) options.integrity = link.integrity;
    if (link.referrerPolicy) options.referrerPolicy = link.referrerPolicy;

    switch (link.crossOrigin) {
      case "use-credentials":
        options.credentials = "include";
        break;
      case "anonymous":
        options.credentials = "omit";
        break;
      default:
        options.credentials = "same-origin";
    }

    return options;
  }

  function processPreloadLink(link) {
    if (link.ep) return;
    link.ep = true;
    const options = getFetchOptions(link);
    fetch(link.href, options);
  }
})();

// Game Elements
const rockBtn = document.getElementById("rock-choice");
const paperBtn = document.getElementById("paper-choice");
const scissorsBtn = document.getElementById("scissors-choice");

const computerEmoji = document.getElementById("computer-emoji");
const playerEmoji = document.getElementById("player-emoji");
const winnerAnnouncement = document.getElementById("result-announcement");
const scoreboard = document.getElementById("score-display");

let playerChoice, computerChoice;
let computerScore = 0;
let playerScore = 0;

function updateScore(winner) {
  if (winner === "player") {
    playerScore += 1;
  } else if (winner === "computer") {
    computerScore += 1;
  }
  scoreboard.textContent = `computer ${computerScore} ${playerScore} player`;
}

function getComputerChoice() {
  const choices = ["rock", "paper", "scissors"];
  const randomIndex = Math.floor(Math.random() * choices.length);
  const choice = choices[randomIndex];

  switch (choice) {
    case "rock":
      computerEmoji.innerText = "✊";
      break;
    case "paper":
      computerEmoji.innerText = "✋";
      break;
    case "scissors":
      computerEmoji.innerText = "✌️";
      break;
  }

  return choice;
}

rockBtn.addEventListener("click", () => {
  playerEmoji.innerText = "✊";
  playerChoice = "rock";
  computerChoice = getComputerChoice();
  determineWinner(computerChoice, playerChoice);
});

paperBtn.addEventListener("click", () => {
  playerEmoji.innerText = "✋";
  playerChoice = "paper";
  computerChoice = getComputerChoice();
  determineWinner(computerChoice, playerChoice);
});

scissorsBtn.addEventListener("click", () => {
  playerEmoji.innerText = "✌️";
  playerChoice = "scissors";
  computerChoice = getComputerChoice();
  determineWinner(computerChoice, playerChoice);
});

function determineWinner(comp, player) {
  if (comp === player) {
    winnerAnnouncement.textContent = "draw";
  } else if (
    (comp === "rock" && player === "scissors") ||
    (comp === "paper" && player === "rock") ||
    (comp === "scissors" && player === "paper")
  ) {
    winnerAnnouncement.textContent = "computer wins";
    updateScore("computer");
  } else {
    winnerAnnouncement.textContent = "player wins";
    updateScore("player");
  }
}
