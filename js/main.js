let santa = {
  DOM: document.querySelector(".santa"),
  jump: {
    currentJump: 0,
    canJump: true,
    reachedTop: false
  },
  canUseGift: true,
  lifes: 3
};

let fireplaces = [];
let gifts = [];
let keyIsPressed = {};

let fireplaceGen;

let initialGround = document.querySelector(".initial-ground");
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
      }, 300);
      santa.DOM.style.transform = `translateY(${santa.jump.currentJump}px)`;
    }
  } else {
    santa.jump.reachedTop = false;
    santa.jump.canJump = false;
    if (!collisionBetween(santa.DOM, initialGround)) {
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

function fireplaceGeneration() {
  let fireplace = {
    DOM: document.createElement("div"),
    translateX: 0
  };
  fireplace.DOM.classList.add("fireplace");
  game.append(fireplace.DOM);

  fireplaces.push(fireplace);

  let timeNext = Math.random() * 2 + 1;
  fireplaceGen = setTimeout(fireplaceGeneration, timeNext * 1000);
}

function moveLevel() {
  for (let i = 0; i < fireplaces.length; i++) {
    const fireplace = fireplaces[i];
    fireplace.translateX -= 4;
    fireplace.DOM.style.transform = `translateX(${fireplace.translateX}px)`;
  }
  for (let i = 0; i < gifts.length; i++) {
    const gift = gifts[i];
    gift.translateY += 4;
    gift.DOM.style.transform = `translate(90px, ${gift.translateY}px)`;
  }
}

document.addEventListener("keypress", function(event) {
  if (event.keyCode === 32 && santa.canUseGift) {
    santa.canUseGift = false;
    let gift = {
      DOM: document.createElement("div"),
      translateY: getInfo(santa.DOM).y + 100
    };
    gift.DOM.classList.add("gift");
    gift.DOM.style.transform = `translate(90px, ${gift.translateY}px)`;
    game.append(gift.DOM);
    gifts.push(gift);

    setTimeout(() => {
      santa.canUseGift = true;
    }, 500);
  }
});

function checkGiftCollsion() {
  for (let i = 0; i < gifts.length; i++) {
    const gift = gifts[i];
    for (let j = 0; j < fireplaces.length; j++) {
      const fireplace = fireplaces[j];
      if (collisionBetween(gift.DOM, fireplace.DOM)) {
        gift.DOM.remove();
      } 
      
      if (collisionBetween(gift.DOM, initialGround)) {
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
  checkGiftCollsion();
  santaJump();
  moveLevel();
  setTimeout(gameLoop, 10);
}

init();
