let santa = {
  DOM: document.querySelector(".santa"),
  jump: {
    currentJump: 0,
    canJump: true,
    reachedTop: false
  },
  canThrowGift: true,
  lifes: 3,
  score: 0
};

let speed = 10;
let a = 0;

let fireplaces = [];
let gifts = [];
let grounds = [];
let keyIsPressed = {};

let firstCheckpoint = false;
let secondCheckpoint = false;
let thirdCheckpoint = false;
let fourthCheckpoint = false;
let fifthCheckpoint = false;
let lastCheckpoint = false;

let fireplaceGen;
let groundGen;

let invisible = document.querySelector(".invisible");
let currentGround = {
  DOM: document.querySelector(".initial-ground"),
  translateX: 0
};

grounds.push(currentGround);

let leftBorder = document.querySelector(".left-border");
let bottomBorder = document.querySelector(".bottom-border");
let game = document.querySelector(".game");

function santaJump() {
  if (keyIsPressed[38] && santa.jump.canJump) {
    if (!santa.jump.reachedTop) {
      santa.jump.currentJump -= 6;
      santa.DOM.style.transform = `translateY(${santa.jump.currentJump}px)`;
    }

    if (santa.jump.currentJump < -300) {
      santa.jump.reachedTop = true;
      setTimeout(() => {
        santa.jump.canJump = false;
        santa.jump.reachedTop = false;
      }, 150);
      santa.DOM.style.transform = `translateY(${santa.jump.currentJump}px)`;
    }
  } else {
    santa.jump.reachedTop = false;
    santa.jump.canJump = false;
    if (!collisionBetween(santa.DOM, currentGround.DOM)) {
      santa.jump.currentJump += 4;
      santa.DOM.style.transform = `translateY(${santa.jump.currentJump}px)`;
      if (collisionBetween(santa.DOM, bottomBorder)) {
        // gameOver();
      }
    } else {
      santa.jump.canJump = true;
    }
  }
}

function getInfo(el) {
  let elProperties = el.getBoundingClientRect();

  return {
    left: elProperties.left,
    top: elProperties.top,
    x: elProperties.x,
    y: elProperties.y,
    width: elProperties.width,
    height: elProperties.height
  };
}

function collisionBetween(el1, el2) {
  if (
    getInfo(el1).x < getInfo(el2).x + getInfo(el2).width &&
    getInfo(el1).x + getInfo(el1).width > getInfo(el2).x &&
    getInfo(el1).y < getInfo(el2).y + getInfo(el2).height &&
    getInfo(el1).height + getInfo(el1).y > getInfo(el2).y
  ) {
    return true;
  } else {
    return false;
  }
}

function fireplaceGeneration() {
  let fireplace = {
    DOM: document.createElement("div"),
    translateX: 0
  };
  fireplace.DOM.classList.add("fireplace");
  game.append(fireplace.DOM);
  fireplaces.push(fireplace);

  fireplaceGen = setTimeout(
    fireplaceGeneration,
    (Math.random() * 3 + 0.5) * 1000
  );
}

function moveLevel() {
  // moving fireplaces
  for (let i = 0; i < fireplaces.length; i++) {
    const fireplace = fireplaces[i];
    fireplace.translateX -= 4;
    fireplace.DOM.style.transform = `translateX(${fireplace.translateX}px)`;
    if (collisionBetween(fireplace.DOM, leftBorder)) {
      fireplace.DOM.remove();
    }
  }
  // moving gifts
  for (let i = 0; i < gifts.length; i++) {
    const gift = gifts[i];
    gift.translateY += 5;
    gift.DOM.style.transform = `translateY(${gift.translateY}px)`;
  }
}

document.addEventListener("keypress", function(event) {
  if (event.keyCode === 32 && santa.canThrowGift) {
    santa.canThrowGift = false;
    let gift = {
      DOM: document.createElement("div"),
      translateY: getInfo(santa.DOM).y + 100
    };
    gift.DOM.classList.add("gift");
    gift.DOM.style.transform = `translateY(${gift.translateY}px)`;
    game.append(gift.DOM);
    gifts.push(gift);

    setTimeout(() => {
      santa.canThrowGift = true;
    }, 200);
  }
});

function checkGiftCollision() {
  for (let i = 0; i < gifts.length; i++) {
    const gift = gifts[i];
    for (let j = 0; j < fireplaces.length; j++) {
      const fireplace = fireplaces[j];
      if (collisionBetween(gift.DOM, fireplace.DOM)) {
        gift.DOM.remove();
        santa.score += 500;
      }

      for (let i = 0; i < grounds.length; i++) {
        const ground = grounds[i];
        if (
          collisionBetween(gift.DOM, ground.DOM) ||
          collisionBetween(gift.DOM, bottomBorder)
        ) {
          gift.DOM.remove();
          santa.lifes--;
          if (santa.lifes <= 0) {
            document.getElementById("crossThree").classList.add("isLost");
            // gameOver();
          } else if (santa.lifes === 2) {
            document.getElementById("crossOne").classList.add("isLost");
          } else if (santa.lifes === 1) {
            document.getElementById("crossTwo").classList.add("isLost");
          }
        }
      }
    }
  }
}

function init() {
  gameLoop();
  fireplaceGeneration();
  window.addEventListener(
    "keydown",
    event => {
      keyIsPressed[event.keyCode] = true;
    },
    true
  );
  window.addEventListener(
    "keyup",
    event => {
      keyIsPressed[event.keyCode] = false;
    },
    true
  );
}

function updateScore() {
  santa.score += 0.5;
  document.getElementById("score").innerHTML = Math.floor(santa.score);
  if (santa.score > 5000 && !firstCheckpoint) {
    firstCheckpoint = true;
    speed -= 1;
  }
  if (santa.score > 10000 && !secondCheckpoint) {
    secondCheckpoint = true;
    speed -= 1;
  }
  if (santa.score > 20000 && !thirdCheckpoint) {
    thirdCheckpoint = true;
    speed -= 1;
  }
  if (santa.score > 50000 && !fourthCheckpoint) {
    fourthCheckpoint = true;
    speed -= 1;
  }
  if (santa.score > 75000 && !fifthCheckpoint) {
    fifthCheckpoint = true;
    speed -= 1;
  }
  if (santa.score > 100000 && !lastCheckpoint) {
    lastCheckpoint = true;
    speed -= 2;
  }
}
function gameLoop() {
  checkGiftCollision();
  santaJump();
  updateScore();
  moveLevel();
  setTimeout(gameLoop, speed);
}

init();
