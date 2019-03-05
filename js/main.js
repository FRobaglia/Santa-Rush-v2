let santa = {
  DOM: document.querySelector(".santa"),
  currentJump: 0,
  canJump: true,
  reachedTop: false,
  gravity: 5
};

let initialGround = document.querySelector(".initial-ground");

let keyIsPressed = {};

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

function santaJump() {
  if (keyIsPressed[38] && santa.canJump) {

    if (!santa.reachedTop) {
    santa.currentJump -= 12;
    santa.DOM.style.transform = `translateY(${santa.currentJump}px)`;
    }

    if (santa.currentJump < -300) {
      santa.reachedTop = true;
      setTimeout(() => {
        santa.canJump = false;
        santa.reachedTop = false;
      }, 500);
      santa.DOM.style.transform = `translateY(${santa.currentJump}px)`;
    }
  } else {
    santa.reachedTop = false;
    santa.canJump = false;
    if (!collisionBetween(santa.DOM, initialGround)) {
      santa.currentJump += 8;
      santa.DOM.style.transform = `translateY(${santa.currentJump}px)`;
    } else {
      santa.canJump = true;
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

function init() {
  gameLoop();
}

function gameLoop() {
  santaJump();
  setTimeout(gameLoop, 10);
}

init();
