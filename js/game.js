let santa = {
  DOM: document.querySelector(".santa"),
  jump: {
    currentJump: 0,
    canJump: true,
    reachedTop: false
  },
  canThrowGift: true,
  lifes: 3
};

let a = 0;

let fireplaces = [];
let gifts = [];
let grounds = [];
let keyIsPressed = {};

let fireplaceGen;

let invisible = document.querySelector(".invisible");
let currentGround = {
  DOM: document.querySelector(".initial-ground"),
  translateX: 0
};
let leftBorder = document.querySelector('.left-border');
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

function groundGeneration() {
  let ground = {
    DOM: document.createElement("div"),
    translateX: 0
  };
  ground.DOM.classList.add("ground");
  game.append(ground.DOM);

  grounds.push(ground);

  groundGen = setTimeout(fireplaceGeneration, Math.random() * 2 + 1 * 1000);
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
    fireplaceGeneration, (Math.random() * 3 + 0.5) * 1000);
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
  currentGround.translateX -= 4;
  currentGround.DOM.style.transform = `translateX(${currentGround.translateX}px)`;
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
      }

      if (collisionBetween(gift.DOM, invisible)) {
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

function gameLoop() {
  checkGiftCollision();
  santaJump();
  moveLevel();
  setTimeout(gameLoop, 10);
}

init();
