"use strict";

// ================================================================ onLoad
window.addEventListener("DOMContentLoaded", function () {
  try {
    Swal.fire({
      imageUrl: "images/startScreen.jpg",
      imageAlt: "Start Screen",
      inputLabel: "Select Difficulty",
      allowOutsideClick: false,
      footer:
        "<div class='swal-footer-instructions'>Arrow keys navigate &mdash; Z or X shoots</div>",
      input: "select",
      inputOptions: {
        1: "Easy",
        2: "Medium",
        3: "Hard",
      },
    }).then(function (res) {
      var difSelect = parseInt(res.value);
      var submit = difSelect > 0 && difSelect < 4 ? difSelect : 1;
      start(submit);
    });
  } catch (err) {
    var startMessage =
      "Enter difficulty #: \n  1) Easy \n  2) Medium \n  3) Hard";
    startEnter(startMessage);

    function startEnter(msg) {
      var go = prompt(msg, "1");
      if (go && parseDifficulty(go)) {
        start(parseDifficulty(go));
      } else {
        startEnter("Incorrect Input! \n" + startMessage);
      }
    }

    function parseDifficulty(input) {
      var trimmed = input.trim().toLowerCase();
      if (trimmed.startsWith("1") || trimmed.includes("easy")) return 1;
      if (trimmed.startsWith("2") || trimmed.includes("medium")) return 2;
      if (trimmed.startsWith("3") || trimmed.includes("hard")) return 3;
      return 0;
    }
  }
});

// ================================================================
// Utility
// ================================================================

function getRandomInt(max) {
  return Math.floor(Math.random() * max) + 1;
}

// ================================================================
// Gamepad Manager
// ================================================================

var gamepadState = {
  connected: false,
  axes: [0, 0, 0, 0],
  dpadUp: false,
  dpadDown: false,
  dpadLeft: false,
  dpadRight: false,
  firePressed: false,
  firePrevPressed: false,
};

function pollGamepad() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
  var gp = null;

  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      gp = gamepads[i];
      break;
    }
  }

  if (!gp) {
    if (gamepadState.connected) {
      gamepadState.connected = false;
      showTouchControls();
    }
    return;
  }

  // Left analog stick (axes 0 & 1)
  gamepadState.axes[0] = Math.abs(gp.axes[0]) > 0.15 ? gp.axes[0] : 0;
  gamepadState.axes[1] = Math.abs(gp.axes[1]) > 0.15 ? gp.axes[1] : 0;

  // D-pad buttons (standard mapping: 12=up, 13=down, 14=left, 15=right)
  gamepadState.dpadUp = !!(gp.buttons[12] && gp.buttons[12].pressed);
  gamepadState.dpadDown = !!(gp.buttons[13] && gp.buttons[13].pressed);
  gamepadState.dpadLeft = !!(gp.buttons[14] && gp.buttons[14].pressed);
  gamepadState.dpadRight = !!(gp.buttons[15] && gp.buttons[15].pressed);

  // Fallback for non-standard controllers (d-pad reported on axes 6 & 7)
  if (gp.mapping !== "standard" && gp.axes.length > 7) {
    if (gp.axes[7] < -0.5) gamepadState.dpadUp = true;
    if (gp.axes[7] > 0.5) gamepadState.dpadDown = true;
    if (gp.axes[6] < -0.5) gamepadState.dpadLeft = true;
    if (gp.axes[6] > 0.5) gamepadState.dpadRight = true;
  }

  // Fire button (button 0 = A / Cross)
  gamepadState.firePrevPressed = gamepadState.firePressed;
  gamepadState.firePressed = gp.buttons[0] && gp.buttons[0].pressed;

  // Only hide touch controls once gamepad is actively used (prevents
  // idle/paired Bluetooth controllers from hiding mobile touch UI)
  if (!gamepadState.connected) {
    var active =
      Math.abs(gamepadState.axes[0]) > 0.5 ||
      Math.abs(gamepadState.axes[1]) > 0.5;
    for (var i = 0; i < gp.buttons.length && !active; i++) {
      if (gp.buttons[i] && gp.buttons[i].pressed) active = true;
    }
    if (active) {
      gamepadState.connected = true;
      hideTouchControls();
    }
  }
}

// ================================================================
// Touch Controls Visibility
// ================================================================

function hideTouchControls() {
  var el = document.getElementById("touchControls");
  if (el) el.classList.add("touch-controls-hidden");
}

function showTouchControls() {
  var el = document.getElementById("touchControls");
  if (el) el.classList.remove("touch-controls-hidden");
}

// ================================================================
// Touch Input Manager
// ================================================================

var touchDirections = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};
var touchFiring = false;

function initTouchControls() {
  var dpad = document.getElementById("touchDpad");
  var activeDpadTouchId = null;
  var upBtn = dpad.querySelector(".touch-dpad-up");
  var downBtn = dpad.querySelector(".touch-dpad-down");
  var leftBtn = dpad.querySelector(".touch-dpad-left");
  var rightBtn = dpad.querySelector(".touch-dpad-right");

  function clearDpadState() {
    touchDirections.ArrowUp = false;
    touchDirections.ArrowDown = false;
    touchDirections.ArrowLeft = false;
    touchDirections.ArrowRight = false;
    if (upBtn) upBtn.classList.remove("touch-dpad-btn-active");
    if (downBtn) downBtn.classList.remove("touch-dpad-btn-active");
    if (leftBtn) leftBtn.classList.remove("touch-dpad-btn-active");
    if (rightBtn) rightBtn.classList.remove("touch-dpad-btn-active");
  }

  function updateDpadFromTouch(touch) {
    var rect = dpad.getBoundingClientRect();
    var centerX = rect.left + rect.width / 2;
    var centerY = rect.top + rect.height / 2;
    var dx = touch.clientX - centerX;
    var dy = touch.clientY - centerY;

    clearDpadState();

    var threshold = rect.width * 0.1;
    if (dx < -threshold) {
      touchDirections.ArrowLeft = true;
      if (leftBtn) leftBtn.classList.add("touch-dpad-btn-active");
    }
    if (dx > threshold) {
      touchDirections.ArrowRight = true;
      if (rightBtn) rightBtn.classList.add("touch-dpad-btn-active");
    }
    if (dy < -threshold) {
      touchDirections.ArrowUp = true;
      if (upBtn) upBtn.classList.add("touch-dpad-btn-active");
    }
    if (dy > threshold) {
      touchDirections.ArrowDown = true;
      if (downBtn) downBtn.classList.add("touch-dpad-btn-active");
    }
  }

  dpad.addEventListener(
    "touchstart",
    function (e) {
      e.preventDefault();
      if (activeDpadTouchId === null) {
        var touch = e.changedTouches[0];
        activeDpadTouchId = touch.identifier;
        updateDpadFromTouch(touch);
      }
    },
    { passive: false }
  );

  dpad.addEventListener(
    "touchmove",
    function (e) {
      e.preventDefault();
      for (var i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === activeDpadTouchId) {
          updateDpadFromTouch(e.changedTouches[i]);
          break;
        }
      }
    },
    { passive: false }
  );

  dpad.addEventListener(
    "touchend",
    function (e) {
      for (var i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === activeDpadTouchId) {
          activeDpadTouchId = null;
          clearDpadState();
          break;
        }
      }
    },
    { passive: false }
  );

  dpad.addEventListener(
    "touchcancel",
    function (e) {
      for (var i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === activeDpadTouchId) {
          activeDpadTouchId = null;
          clearDpadState();
          break;
        }
      }
    },
    { passive: false }
  );

  var fireBtn = document.getElementById("touchFire");
  if (fireBtn) {
    fireBtn.addEventListener(
      "touchstart",
      function (e) {
        e.preventDefault();
        touchFiring = true;
        fireBtn.classList.add("touch-fire-btn-active");
      },
      { passive: false }
    );

    fireBtn.addEventListener(
      "touchend",
      function (e) {
        e.preventDefault();
        touchFiring = false;
        fireBtn.classList.remove("touch-fire-btn-active");
      },
      { passive: false }
    );

    fireBtn.addEventListener(
      "touchcancel",
      function (e) {
        e.preventDefault();
        touchFiring = false;
        fireBtn.classList.remove("touch-fire-btn-active");
      },
      { passive: false }
    );
  }
}

// ================================================================
// Classes
// ================================================================

var isActive = true;

// ================================== Pizza Cat
function User(lives) {
  this.difficulty = lives;
  this.life = lives === 3 ? 1 : lives === 1 ? 3 : 2;
  this.player = null;
  this.directions = {
    ArrowDown: false,
    ArrowUp: false,
    ArrowLeft: false,
    ArrowRight: false,
  };
  this.weapon = { isHold: false, active: [] };
  this.spaceDown = false;
  this.spacePrev = false;
  this.enemies = [];
  this.invincible = false;
  this.x = 10;
  this.y = window.innerHeight / 2;
  this.score = 0;

  this._onKeyDown = null;
  this._onKeyUp = null;
}

User.prototype.create = function () {
  this.player = document.createElement("img");
  this.player.setAttribute("data-src", "");
  this.player.src = "images/cat-neutral.png";
  var isMobile = Math.min(window.innerWidth, window.innerHeight) <= 600;
  var playerSize = isMobile ? 50 : 75;
  this.player.width = playerSize;
  this.player.id = "pizza-cat";
  this.player.height = playerSize;
  this.player.classList.add("player-sprite", "img-not-loaded");
  this.player.style.transform =
    "translate(" + this.x + "px, " + this.y + "px)";
  document.getElementById("gamePlay").appendChild(this.player);

  if (this.player.complete) {
    this.launchUser();
  } else {
    var self = this;
    this.player.addEventListener("load", function () {
      self.launchUser();
    });
  }
};

User.prototype.launchUser = function () {
  var domLives = document.getElementById("lives");
  domLives.textContent = this.life;
  this.player.classList.add("img-loaded");

  var self = this;
  this._onKeyDown = function (e) {
    self.updateKeyDict(e);
  };
  this._onKeyUp = function (e) {
    self.updateKeyDict(e);
  };
  document.addEventListener("keydown", this._onKeyDown);
  document.addEventListener("keyup", this._onKeyUp);

  initTouchControls();
};

User.prototype.removeListeners = function () {
  if (this._onKeyDown)
    document.removeEventListener("keydown", this._onKeyDown);
  if (this._onKeyUp) document.removeEventListener("keyup", this._onKeyUp);
};

User.prototype.updateKeyDict = function (e) {
  if (!isActive) return;

  var k = e.code;
  var type = e.type;

  var isFireKey =
    k === "Space" || k === "KeyZ" || k === "KeyX" || k === "ShiftLeft";

  // Prevent browser defaults (scroll, history nav) for game keys
  if (/^Arrow\w+/.test(k) || isFireKey) {
    e.preventDefault();
  }

  if (/^Arrow\w+/.test(k)) {
    this.directions[k] = type === "keydown";
  }

  // Track fire key state — edge is detected in the game loop
  if (isFireKey) {
    this.spaceDown = type === "keydown";
  }
};

User.prototype.fireWeapon = function () {
  if (!isActive || this.weapon.isHold || this.weapon.active.length >= 15)
    return;

  this.weapon.isHold = true;
  var self = this;
  setTimeout(function () {
    if (!isActive) return;
    self.weapon.isHold = false;
  }, 150);

  var fire = new Fire(this.x, this.y + this.player.height / 2);
  fire.create();
  this.weapon.active.push(fire);
};

User.prototype.addNewEnemy = function (speed) {
  if (!isActive) return;
  var isRotate = getRandomInt(10) % 2 === 0 && this.score > 6000;
  var newEnemy = new Enemy(speed, this.difficulty, isRotate);
  newEnemy.create();
  this.enemies.push(newEnemy);
};

User.prototype.move = function (dt) {
  if (!isActive) return;

  // Base speed: 1.5px per ~4ms (approx original tick rate) → ~375 px/s
  var speed = 375;
  var dist = speed * dt;

  // Merge keyboard + touch + gamepad directions
  var left =
    this.directions.ArrowLeft ||
    touchDirections.ArrowLeft ||
    gamepadState.dpadLeft ||
    gamepadState.axes[0] < -0.15;
  var right =
    this.directions.ArrowRight ||
    touchDirections.ArrowRight ||
    gamepadState.dpadRight ||
    gamepadState.axes[0] > 0.15;
  var up =
    this.directions.ArrowUp ||
    touchDirections.ArrowUp ||
    gamepadState.dpadUp ||
    gamepadState.axes[1] < -0.15;
  var down =
    this.directions.ArrowDown ||
    touchDirections.ArrowDown ||
    gamepadState.dpadDown ||
    gamepadState.axes[1] > 0.15;

  // Gamepad analog stick gives variable speed
  var hMag = gamepadState.connected ? Math.abs(gamepadState.axes[0]) : 1;
  var vMag = gamepadState.connected ? Math.abs(gamepadState.axes[1]) : 1;
  // If keyboard or touch override, use full magnitude
  if (
    this.directions.ArrowLeft ||
    this.directions.ArrowRight ||
    touchDirections.ArrowLeft ||
    touchDirections.ArrowRight ||
    gamepadState.dpadLeft ||
    gamepadState.dpadRight
  )
    hMag = 1;
  if (
    this.directions.ArrowUp ||
    this.directions.ArrowDown ||
    touchDirections.ArrowUp ||
    touchDirections.ArrowDown ||
    gamepadState.dpadUp ||
    gamepadState.dpadDown
  )
    vMag = 1;

  if (left) {
    this.x -= dist * hMag;
    if (this.x < 0) this.x = 0;
  }
  if (right && !left) {
    this.x += dist * hMag;
    var maxX = window.innerWidth - this.player.width;
    if (this.x > maxX) this.x = maxX;
  }
  if (up) {
    this.y -= dist * vMag;
    this.player.src = "images/cat-up.png";
    if (this.y < 0) this.y = 0;
  }
  if (down && !up) {
    this.y += dist * vMag;
    this.player.src = "images/cat-down.png";
    var maxY = window.innerHeight - this.player.height;
    if (this.y > maxY) this.y = maxY;
  }
  if (!down && !up) {
    this.player.src = "images/cat-neutral.png";
  }

  this.player.style.transform =
    "translate(" + this.x + "px, " + this.y + "px)";
};

User.prototype.loseLife = function () {
  if (!isActive) return;
  this.life--;
  var domLives = document.getElementById("lives");
  domLives.textContent = this.life;
  if (this.life > 0) {
    this.invincible = true;
    this.player.classList.add("blink-animation");
    var self = this;
    setTimeout(function () {
      if (!isActive) return;
      self.player.classList.remove("blink-animation");
      self.invincible = false;
    }, 1000);
  }
};

User.prototype.addScore = function () {
  if (this.score >= 9999999900 || !isActive) return;
  this.score += 100;
  var domScore = document.getElementById("score");
  domScore.textContent = this.score;
  if (this.score % 5000 === 0) {
    this.life++;
    var domLives = document.getElementById("lives");
    domLives.textContent = this.life;
  }
};

// ================================== Bullet
function Fire(userX, userY) {
  this.x = userX;
  this.y = userY;
  this.player = null;
}

Fire.prototype.create = function () {
  if (!isActive) return;
  this.player = document.createElement("img");
  this.player.setAttribute("data-src", "");
  this.player.id = "peperoni_" + getRandomInt(100000);
  var isMobile = Math.min(window.innerWidth, window.innerHeight) <= 600;
  var bulletSize = isMobile ? 17 : 25;
  this.player.width = bulletSize;
  this.player.height = bulletSize;
  this.player.src = "images/p1.png";
  this.player.classList.add("fire-sprite");
  this.player.style.transform =
    "translate(" + this.x + "px, " + this.y + "px)";
  document.getElementById("gamePlay").appendChild(this.player);
};

Fire.prototype.move = function (user, dt) {
  if (!isActive) return;
  // ~375 px/s bullet speed
  this.x += 375 * dt;
  this.player.style.transform =
    "translate(" + this.x + "px, " + this.y + "px)";

  if (this.x >= window.innerWidth + this.player.width || this.x >= 1500) {
    this.player.classList.add("fade-out");
    var self = this;
    setTimeout(function () {
      if (!isActive) return;
      var el = document.getElementById(self.player.id);
      if (el) el.remove();
      var idx = user.weapon.active.indexOf(self);
      if (idx > -1) user.weapon.active.splice(idx, 1);
    }, 250);
  }
};

// ================================== Enemies
function Enemy(speedIncrease, life, rotate) {
  this.speed = 1 + (speedIncrease || 0);
  this.life = life || 1;
  this.rotate = rotate || false;
  this.x = 0;
  this.y = 0;
  this.initialY = 0;
  this.player = null;
  this.reverse = false;
}

Enemy.prototype.create = function () {
  if (!isActive) return;
  this.player = document.createElement("img");
  this.player.setAttribute("data-src", "");
  this.player.classList.add("enemy-sprite");
  this.player.id = "enemy_" + getRandomInt(100000);

  var imgNum = getRandomInt(4);
  var img =
    imgNum === 1
      ? "donut"
      : imgNum === 2
        ? "cookie"
        : imgNum === 3
          ? "cupcake"
          : "burger";
  this.player.src = "images/" + img + ".png";

  var dimensionsNum = getRandomInt(3);
  var isMobile = Math.min(window.innerWidth, window.innerHeight) <= 600;
  var dimensions;
  if (isMobile) {
    dimensions = dimensionsNum === 3 ? 75 : dimensionsNum === 2 ? 60 : 45;
  } else {
    dimensions = dimensionsNum === 3 ? 125 : dimensionsNum === 2 ? 100 : 75;
  }
  this.player.width = dimensions;
  this.player.height = dimensions;
  this.life += dimensionsNum - 1;

  this.x = window.innerWidth + dimensions;
  this.y = getRandomInt(window.innerHeight - dimensions);
  this.initialY = this.y;

  // Position via left/top so CSS transform is free for spin animation
  this.player.style.left = this.x + "px";
  this.player.style.top = this.y + "px";

  // Random z-axis spin: speed tier 1–5, ~50% chance counter-clockwise
  this.player.classList.add("enemy-spin", "spin-speed-" + getRandomInt(5));
  if (getRandomInt(2) === 1) {
    this.player.classList.add("enemy-spin-reverse");
  }

  document.getElementById("gamePlay").appendChild(this.player);
};

Enemy.prototype.collision = function (obj) {
  if (!isActive) return false;
  return (
    obj.x < this.x + this.player.width &&
    obj.x > this.x &&
    obj.y < this.y + this.player.height &&
    obj.y + obj.player.height > this.y
  );
};

Enemy.prototype.move = function (user, dt) {
  if (!isActive) return;

  // Speed increases with score tier (this.speed = 1 + speedIncrease from spawn)
  // Base ~250 px/s at speed=1, scaling up to ~2250 px/s at speed=9
  var moveDist = this.speed * 250 * dt;
  this.x -= moveDist;

  if (this.rotate) {
    var waveDist = 250 * dt;
    if (!this.reverse) {
      this.y += waveDist;
      if (
        this.y >= this.initialY + 250 ||
        this.y >= window.innerHeight - this.player.height
      ) {
        this.reverse = true;
      }
    }
    if (this.reverse) {
      this.y -= waveDist;
      if (this.y <= this.initialY || this.y <= 0) {
        this.reverse = false;
      }
    }
  }

  var enemyElement = document.getElementById(this.player.id);

  if (this.x < -250 && isActive) {
    if (enemyElement) enemyElement.remove();
    var idx = user.enemies.indexOf(this);
    if (idx > -1) user.enemies.splice(idx, 1);
    return;
  }

  this.player.style.left = this.x + "px";
  this.player.style.top = this.y + "px";

  // Player collision
  if (!user.invincible && isActive && this.collision(user)) {
    user.loseLife();
    var eIdx = user.enemies.indexOf(this);
    if (eIdx > -1) user.enemies.splice(eIdx, 1);
    if (user.life > 0 && enemyElement) {
      enemyElement.src = "images/boom.png";
      enemyElement.style.animation = "none";
      setTimeout(function () {
        if (!isActive) return;
        if (enemyElement) enemyElement.remove();
      }, 250);
    }
    if (user.life < 1 && enemyElement) {
      enemyElement.remove();
    }
    return;
  }

  // Bullet collision
  var self = this;
  user.weapon.active.forEach(function (shot) {
    if (!isActive) return;
    if (self.collision(shot)) {
      var fireElement = document.getElementById(shot.player.id);
      if (fireElement) fireElement.remove();
      var sIdx = user.weapon.active.indexOf(shot);
      if (sIdx > -1) user.weapon.active.splice(sIdx, 1);
      self.life--;
      if (self.life > 0) {
        self.player.style.opacity = 0;
        setTimeout(function () {
          if (!isActive) return;
          self.player.style.opacity = 1;
        }, 100);
      }
      if (self.life <= 0 && isActive) {
        user.addScore();
        var eIdx2 = user.enemies.indexOf(self);
        if (eIdx2 > -1) user.enemies.splice(eIdx2, 1);
        if (enemyElement) {
          enemyElement.src = "images/boom.png";
          enemyElement.style.animation = "none";
          setTimeout(function () {
            if (enemyElement) enemyElement.remove();
          }, 250);
        }
      }
    }
  });
};

// ================================================================
// Start Game
// ================================================================

function start(diffType) {
  diffType = diffType || 1;
  isActive = true;

  var user = new User(parseInt(diffType));
  user.create();

  var time = 180;
  var minutes = 2;
  var seconds = 59;

  var timer = setInterval(function () {
    if (!isActive) return clearInterval(timer);
    time--;
    if (time < 1) {
      minutes = 0;
      seconds = 0;
      return clearInterval(timer);
    }
    if (time % 60 === 0) {
      minutes--;
      seconds = 59;
    } else {
      seconds--;
    }
    var timerDisplay = document.getElementById("time");
    timerDisplay.textContent =
      minutes + ":" + (seconds > 9 ? seconds : "0" + seconds);
  }, 1000);

  // Touch fire — track hold state for repeat fire
  var touchFireHold = false;
  var touchFireCooldown = false;

  var lastTime = performance.now();

  function gameLoop(now) {
    if (!isActive) {
      endGame(user, minutes, seconds);
      return;
    }

    var dt = (now - lastTime) / 1000; // delta in seconds
    // Clamp dt to avoid huge jumps on tab-switch
    if (dt > 0.1) dt = 0.1;
    lastTime = now;

    // Poll gamepad
    pollGamepad();

    // Gamepad fire (on button-down edge)
    if (
      gamepadState.firePressed &&
      !gamepadState.firePrevPressed
    ) {
      user.fireWeapon();
    }

    // Keyboard fire (on space-down edge)
    if (user.spaceDown && !user.spacePrev) {
      user.fireWeapon();
    }
    user.spacePrev = user.spaceDown;

    // Touch fire — fire repeatedly while held
    if (touchFiring && !touchFireCooldown) {
      user.fireWeapon();
      touchFireCooldown = true;
      setTimeout(function () {
        touchFireCooldown = false;
      }, 150);
    }

    // Check end conditions
    if (user.life < 1 || time < 1) {
      isActive = false;
    }

    // Move user
    user.move(dt);

    // Move bullets
    for (var i = user.weapon.active.length - 1; i >= 0; i--) {
      user.weapon.active[i].move(user, dt);
    }

    // Spawn enemies
    spawnEnemies(user);

    // Move enemies
    for (var j = user.enemies.length - 1; j >= 0; j--) {
      user.enemies[j].move(user, dt);
    }

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
}

// ================================================================
// Enemy Spawning Logic
// ================================================================

function spawnEnemies(user) {
  var s = user.score;
  var len = user.enemies.length;

  // Separate if-blocks (not else-if) so overlapping ranges at high scores
  // can spawn multiple enemies per frame, matching the original design.
  if (s <= 2000 && len < 5) user.addNewEnemy(0);
  if (s > 2000 && s <= 4000 && len < 10) user.addNewEnemy(0.5);
  if (s > 4000 && s <= 6000 && len < 10) user.addNewEnemy(1);
  if (s > 6000 && s <= 8000 && len < 15) user.addNewEnemy(1.5);
  if (s > 8000 && s <= 10000 && len < 15) user.addNewEnemy(2);
  if (s > 10000 && s <= 12000 && len < 20) user.addNewEnemy(3);
  if (s > 12000 && s <= 14000 && len < 20) user.addNewEnemy(4);
  if (s > 14000 && len < 25) user.addNewEnemy(6);
  if (s > 16000 && len < 25) user.addNewEnemy(8);
}

// ================================================================
// End Game
// ================================================================

function endGame(user, minutes, seconds) {
  user.removeListeners();
  user.directions = {
    ArrowDown: false,
    ArrowUp: false,
    ArrowLeft: false,
    ArrowRight: false,
  };
  user.spaceDown = false;

  var killPizzaCat = document.getElementById("pizza-cat");
  if (killPizzaCat) killPizzaCat.src = "images/boom.png";

  var timeStr = minutes + ":" + (seconds > 9 ? seconds : "0" + seconds);

  setTimeout(function () {
    var aftermath = document.getElementById("gamePlay");
    if (aftermath) aftermath.style.display = "none";
    gameOver(user.score, timeStr);
  }, 250);
}

function gameOver(score, time) {
  try {
    Swal.fire({
      imageUrl: "images/exitScreen.jpg",
      imageAlt: "Game Over",
      text: "Score: " + score + " pts. | Time: " + time,
      timer: 5000,
      confirmButtonText: "Play Again!",
    }).then(function () {
      location.reload();
    });
  } catch (err) {
    alert("Game Over!\nPlay Again?");
    location.reload();
  }
}
