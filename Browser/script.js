"use strict";

// ================================================================ onLoad
window.onload = function () {
  const isMobile = navigator.userAgent.match(
    /(iPhone|Android|BlackBerry|Windows Phone|iPad|iPod)/
  );
  if (isMobile) {
    alert("Hiss! Not available on mobile device... yet.");
    return;
  }

  try {
    Swal.fire({
      imageUrl: "images/startScreen.jpg",
      imageHeight: 350,
      imageAlt: "Start Screen",
      inputLabel: "Select Difficulty",
      footer:
        "<div style='font-weight: bold;color:#7066E0'>Keyboard arrow keys navigate——space bar shoots</div>",
      input: "select",
      inputOptions: {
        1: "Easy",
        2: "Medium",
        3: "Hard",
      },
    }).then((res) => {
      const difSelect = parseInt(res.value)
      const submit = difSelect > 0 && difSelect < 4 ? difSelect : 1;
      start(submit);
    });
  } catch (err) {
    const startMessage = `Enter difficulty #: \n
              1) Easy \n
              2) Medium \n
              3) Hard
              `;
    startEnter(startMessage);

    function startEnter(msg) {
      const go = prompt(msg, "1");
      if (
        go != "" &&
        go != undefined &&
        go != null &&
        go != null &&
        isGo(go) != ""
      ) {
        start(parseInt(isGo(go)));
      } else {
        startEnter("Incorrect Input! \n" + startMessage + " \n" + startMessage);
      }
    }
    function isGo(go) {
      if (
        go.trim().substring(0, 1) == "1" ||
        go.toLowerCase().includes("easy")
      ) {
        return 1;
      }
      if (
        go.trim().substring(0, 1) == "2" ||
        go.toLowerCase().includes("medium")
      ) {
        return 2;
      }
      if (
        go.trim().substring(0, 1) == "3" ||
        go.toLowerCase().includes("hard")
      ) {
        return 3;
      }
      return "";
    }
  }
};

// =======================================================================
// Classes

// ================================== Abstract Classes
class UniversalFunctions {
  getRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
  }
}

// ================================== Pizza Cat
class User extends UniversalFunctions {
  player;
  directions = {
    ArrowDown: false,
    ArrowUp: false,
    ArrowLeft: false,
    ArrowRight: false,
  };
  weapon = { isHold: false, active: [] };
  enemies = [];
  invincible = false;
  x = 10;
  y = window.innerHeight / 2;
  life;
  difficulty;
  score = 0;

  constructor(lives) {
    super();
    this.difficulty = lives;
    this.life = lives === 3 ? 1 : lives === 1 ? 3 : 2;
  }

  create() {
    return new Promise((resolve, reject) => {
      try {
        this.player = document.createElement("img");
        this.player.setAttribute("data-src", "");
        this.player.src = "images/cat-neutral.png";
        this.player.width = 75;
        this.player.id = "pizza-cat";
        this.player.height = 75;
        this.player.style.position = "relative";
        this.player.style.zIndex = 500;
        this.player.style.transform = `translate(${this.x}px, ${this.y}px)`;
        this.player.classList.add("imgNotLoaded");
        document.getElementById("gamePlay").appendChild(this.player);
        if (this.player.complete) {
          this.launchUser();
          return resolve(true);
        } else {
          this.player.addEventListener("load", () => {
            this.launchUser();
            return resolve(true);
          });
        }
      } catch (err) {
        console.log(err);
        return reject();
      }
    });
  }

  launchUser() {
    const domLives = document.getElementById("lives");
    domLives.innerHTML = this.life;
    this.player.classList.add("imgLoaded");
    document.addEventListener("keydown", (e) => this.updateKeyDict(e, this));
    document.addEventListener("keyup", (e) => this.updateKeyDict(e, this));
  }

  updateKeyDict(e, user) {
    //e.preventDefault();
    if (user.life < 1) {
      document.removeEventListener(e.type.toString(), e.currentTarget);
      return;
    }

    const { weapon, x, y, directions, player } = user;
    const k = e.code;
    const type = e.type.toString();
    if (/^Arrow\w+/.test(k)) {
      directions[k] = type === "keydown"; // set boolean true / false
    }
    if (
      k === "Space" &&
      type === "keyup" &&
      !weapon.isHold & (user.weapon.active.length < 15)
    ) {
      weapon.isHold = true;
      setTimeout(() => {
        weapon.isHold = false;
      }, 150);
      const fire = new Fire(x, y + player.height / 2);
      fire.create();
      weapon.active.push(fire);
    }
  }

  addNewEnemy(speed) {
    if(this.life < 1) return;
    const isRotate = super.getRandomInt(10) % 2 === 0 && this.score > 6000;
    const newEnemy = new Enemy(speed, this.difficulty, isRotate);
    newEnemy.create();
    this.enemies.push(newEnemy);
  }

  move() {
    if(this.life < 1) return;
    const dist = 0.75;
    if (this.directions.ArrowLeft) {
      this.x -= dist;
      if (this.x <= 0) {
        this.x = 0;
      }
    }
    if (this.directions.ArrowUp) {
      this.y -= dist;
      this.player.src = "images/cat-up.png";
      if (this.y <= 0) {
        this.y = 0;
      }
    }
    if (this.directions.ArrowRight && !this.directions.ArrowLeft) {
      this.x += dist;
      if (this.x >= window.innerWidth - this.player.width) {
        this.x = window.innerWidth - this.player.width;
      }
    }
    if (this.directions.ArrowDown && !this.directions.ArrowUp) {
      this.y += dist;
      this.player.src = "images/cat-down.png";
      if (this.y >= window.innerHeight - this.player.height) {
        this.y = window.innerHeight - this.player.height;
      }
    }
    if (!this.directions.ArrowDown && !this.directions.ArrowUp) {
      this.player.src = "images/cat-neutral.png";
    }
    this.player.style.transform = `translate(${this.x}px, ${this.y}px)`;
  }

  loseLife() {
    if(this.life < 1 ) return;
    this.life--;
    const domLives = document.getElementById("lives");
    domLives.innerHTML = this.life;
    if (this.life > 0) {
      this.invincible = true;
      this.player.classList.add("blinkAnimation");
      setTimeout(() => {
        this.player.classList.remove("blinkAnimation");
        this.invincible = false;
      }, 1000);
    }
  }

  killCat() {
    delete this;
    const killPizzaCat = document.getElementById("pizza-cat");
    killPizzaCat.src = "images/boom.png";
    const aftermath = document.getElementById("gamePlay");
      setTimeout(() => {
        aftermath.remove();
      }, 250);
  }

  addScore() {
    if(this.score >= 9999999900) return;
    this.score += 100;
    const domScore = document.getElementById("score");
    domScore.innerHTML = this.score;
  }
}

// ================================== Bullet
class Fire extends UniversalFunctions {
  x;
  y;
  player;
  constructor(userX, UserY) {
    super();
    this.x = userX;
    this.y = UserY;
  }
  create() {
    this.player = document.createElement("img");
    this.player.setAttribute("data-src", "");
    this.player.id = `peperoni_${super.getRandomInt(100000)}`;
    this.player.width = 25;
    this.player.height = 25;
    this.player.src = "images/p1.png";
    this.player.style.position = "absolute";
    this.player.style.zIndex = 400;
    this.player.style.transform = `translate(${this.x}px, ${this.y}px)`;
    document.getElementById("gamePlay").appendChild(this.player);
  }
  move(user) {
    this.player.style.transform = `translate(${this.x}px, ${this.y}px)`;
    this.x += 1.5;
    if (this.x >= window.innerWidth + this.player.width || this.x >= 1500) {
      this.player.classList.add("fadeOut");
      setTimeout(() => {
        const fireElement = document.getElementById(this.player.id);
        fireElement.remove();
        user.weapon.active.splice(user.weapon.active.indexOf(this), 1);
      }, 250);
    }
  }
}

// ================================== Enemies

class Enemy extends UniversalFunctions {
  x;
  y;
  initialY;
  player;
  speed = 1;
  life;
  rotate;
  reverse = false;
  constructor(speedIncrease = 0, life = 1, rotate = false) {
    super();
    this.speed += speedIncrease;
    this.life = life;
    this.rotate = rotate;
  }

  create() {
    this.player = document.createElement("img");
    this.player.setAttribute("data-src", "");
    this.player.style.position = "absolute";
    this.player.style.zIndex = 500;
    this.player.id = `enemy_${super.getRandomInt(100000)}`;
    // image
    const imgNum = super.getRandomInt(4);
    const img =
      imgNum === 1
        ? "donut"
        : imgNum === 2
        ? "cookie"
        : imgNum === 3
        ? "cupcake"
        : "burger";
    this.player.src = `images/${img}.png`;
    // size
    const dimensionsNum = super.getRandomInt(3);
    const dimensions =
      dimensionsNum === 3 ? 125 : dimensionsNum === 2 ? 100 : 75;
    this.player.width = dimensions;
    this.player.height = dimensions;
    this.life += dimensionsNum - 1;
    // direction
    this.x = window.innerWidth + dimensions;
    this.y = super.getRandomInt(window.innerHeight - dimensions);
    this.initialY = this.y;

    this.player.style.transform = `translate(${this.x}px, ${this.y}px)`;
    // add to document
    document.getElementById("gamePlay").appendChild(this.player);
  }

  collision(obj) {
    return (
      obj.x < this.x + this.player.width &&
      obj.x > this.x &&
      obj.y < this.y + this.player.height &&
      obj.y + obj.player.height > this.y
    );
  }

  move(user) {
    this.x--;
    if (this.rotate) {
      if (!this.reverse) {
        this.y++;
        if (
          this.y === this.initialY + 250 ||
          this.y >= window.innerHeight - this.player.height
        ) {
          this.reverse = true;
        }
      }
      if (this.reverse) {
        this.y--;
        if (this.y <= this.initialY || this.y <= 0) {
          this.reverse = false;
        }
      }
    }

    const enemyElement = document.getElementById(this.player.id);

    if (this.x < -250) {
      enemyElement.remove();
      return user.enemies.splice(user.enemies.indexOf(this), 1);
    }

    this.player.style.transform = `translate(${this.x}px, ${this.y}px)`;

    // player collision
    if (!user.invincible) {
      if (this.collision(user, this)) {
        user.loseLife();
        user.enemies.splice(user.enemies.indexOf(this), 1);
        if (user.life > 0) {
          enemyElement.src = "images/boom.png";
          setTimeout(() => {
            enemyElement.remove();
          }, 250);
        }
        if (user.life < 1) {
          enemyElement.remove();
        }
      }
    }
    // bullet collision
    user.weapon.active.forEach((shot) => {
      if (this.collision(shot, this)) {
        var fireElement = document.getElementById(shot.player.id);
        fireElement.remove();
        user.weapon.active.splice(user.weapon.active.indexOf(shot), 1);
        this.life--;
        if (this.life > 0) {
          this.player.style.opacity = 0;
          setTimeout(() => {
            this.player.style.opacity = 1;
          }, 100);
        }
        if (this.life <= 0) {
          user.addScore();
          user.enemies.splice(user.enemies.indexOf(this), 1);
          enemyElement.src = "images/boom.png";
          setTimeout(() => {
            enemyElement.remove();
          }, 250);
        }
      }
    });
  }
}

// ========================================================================================
// Start Game

function start(diffType=1) {
  const user = new User(parseInt(diffType));
  user.create().then(() => {
    const gameInterval = setInterval(() => {
      // =================================== end game if user dead
      if(user.life <1){
        user.killCat();
        clearInterval(gameInterval);
        return gameOver();
      }
      // =================================== move user
      user.move();
      // =================================== move bullets
      if (user.weapon.active.length > 0) {
        user.weapon.active.forEach((fire) => {
          fire.move(user);
        });
      }

      // =================================== spawn enemies

      if (user.score <= 2000 && user.enemies.length < 5) {
        user.addNewEnemy(0);
      }
      if (user.score > 2000 && user.score <= 4000 && user.enemies.length < 10) {
        user.addNewEnemy(0.5);
      }
      if (user.score > 4000 && user.score <= 6000 && user.enemies.length < 10) {
        user.addNewEnemy(1);
      }
      if (user.score > 6000 && user.score <= 8000 && user.enemies.length < 10) {
        user.addNewEnemy(1.5);
      }
      if (
        user.score > 8000 &&
        user.score <= 10000 &&
        user.enemies.length < 15
      ) {
        user.addNewEnemy(2);
      }
      if (
        user.score > 10000 &&
        user.score <= 12000 &&
        user.enemies.length < 15
      ) {
        user.addNewEnemy(3);
      }
      if (
        user.score > 12000 &&
        user.score <= 14000 &&
        user.enemies.length < 15
      ) {
        user.addNewEnemy(4);
      }
      if (user.score > 14000 && user.enemies.length < 15) {
        user.addNewEnemy(5);
      }
      // =================================== move enemies
        user.enemies.forEach((antagonist) => {
          antagonist.move(user);
        });
    }, 1);
  });
}

function gameOver() {
  try {
    Swal.fire({
      imageUrl: "images/exitScreen.jpg",
      imageHeight: 350,
      imageAlt: "Game Over",
      timer: 5000,
      confirmButtonText:'<i class="fa fa-thumbs-up"></i> Play Again!',
    }).then(() => {
      location.reload();
    });
  } catch (err) {
    alert("Game Over!\nPlay Again?");
    location.reload();
  }
}
