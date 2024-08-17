/*
@title: Tower_Defense
@author: Adya
@tags: []
@addedOn: 2024-15-08
*/

const tower = "t";
const enemy = "e";
const fastEnemy = "F";
const armoredEnemy = "a";
const path = "p";
const base = "b";
const projectile = "j";
const fastTower = "f";
const strongTower = "s";

setLegend(
  [tower, bitmap`
................
................
................
......0000000...
.....00.000.0...
....0.....000...
....0.0.0..00...
....0......00...
....0......00...
....00....0.0...
......00000.0...
......0...0.0...
...000000.000...
...00...00000...
....000000......
................`],
  [fastTower, bitmap`
................
................
................
......1111111...
.....11.111.1...
....1.....111...
....1.1.1..11...
....1......11...
....1......11...
....11....1.1...
......11111.1...
......1...1.1...
...111111.111...
...11...11111...
....111111......
................`],
  [strongTower, bitmap`
................
................
................
......2222222...
.....22.222.2...
....2.....222...
....2.2.2..22...
....2......22...
....2......22...
....22....2.2...
......22222.2...
......2...2.2...
...222222.222...
...22...22222...
....222222......
................`],
  [enemy, bitmap`
................
................
................
................
................
.....LLLLLL.....
.....LLLLLL.....
.....LLLLLL.....
.....LLLLLL.....
.....LLLLLL.....
.....LLLLLL.....
................
................
................
................
................`],
  [fastEnemy, bitmap`
................
................
................
................
................
.....FFFFFF.....
.....FFFFFF.....
.....FFFFFF.....
.....FFFFFF.....
.....FFFFFF.....
.....FFFFFF.....
................
................
................
................
................`],
  [armoredEnemy, bitmap`
................
................
................
................
.....1111111....
.....1CCCCC1....
.....1CCCCC1....
.....1CCCCC1....
.....1CCCCC1....
.....1CCCCC1....
.....1111111....
................
................
................
................
................`],
  [path, bitmap`
CCCCCCCCCCCCCCCC
CCCCCCCCCCCCCCCC
CCCCCCCCCCCCCCCC
CCCCCCCCCCCCCCCC
CCCCCCCCCCCCCCCC
CCCCCCCCCCCCCCCC
CCCCCCCCCCCCCCCC
CCCCCCCCCCCCCCCC
CCCCCCCCCCCCCCCC
CCCCCCCCCCCCCCCC
CCCCCCCCCCCCCCCC
CCCCCCCCCCCCCCCC
CCCCCCCCCCCCCCCC
CCCCCCCCCCCCCCCC
CCCCCCCCCCCCCCCC
CCCCCCCCCCCCCCCC`],
  [base, bitmap`
DDDDDDDDDDDDDDDD
D4444444444444D4
D4444444444444D4
D4444444444444D4
D4444444444444D4
D4D44444444444DD
D4D444444444444D
D4D4444444D4444D
D4D444D444D4444D
D4D444D444D4444D
D44D4DD444DD444D
D44D4D4444DD4444
D44D4D44444D444D
D44DDD44444DD44D
D444D4444444D4DD
DDDDDDDDDDDDDDD4`],
  [projectile, bitmap`
..886688........
.88666C8........
.86H66C888......
.88C6CC6688.....
.8866CFF6688....
.86HCF666668....
.86C6FC66668....
.86666C66668....
.88866C66668....
...866C6CCC8....
...8666C6HC8888.
...88886HHC8CC8.
......86HHCCC88.
......88666888..
................
................`]
);

let level = 0;

const levels = [
  map`
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb
bbbppppbbbbbbbbb
bbbpbbpbbbbppppp
bbbpbbpbbbbpbbbb
bbbpbbpbbbbpbbbb
bbbpbbpbbbbpbbbb
ppppbbpbbbbpbbbb
bbbbbbpbbbbpppbb
bbbbbbpbbbbbbpbb
bbbppppbbbbbbpbb
bbbpbbbbbbbbbpbb
bbbpbbbbbbbbbpbb
bbbpppppppppppbb
bbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbb`
];

const currentLevel = levels[level];
setMap(currentLevel);

setSolids([tower, path, base]);

// Tower Placement
const upgradeCost = 50;
const fastTowerCost = 30;
const strongTowerCost = 50;

// Define the path
const pathCoordinates = [
  {x: 0, y: 7}, {x: 1, y: 7}, {x: 2, y: 7}, {x: 3, y: 7},
  {x: 3, y: 6}, {x: 3, y: 5}, {x: 3, y: 4}, {x: 3, y: 3},
  {x: 3, y: 2}, {x: 4, y: 2}, {x: 5, y: 2}, {x: 6, y: 2},
  {x: 6, y: 3}, {x: 6, y: 4}, {x: 6, y: 5}, {x: 6, y: 6},
  {x: 6, y: 7}, {x: 6, y: 8}, {x: 6, y: 9}, {x: 6, y: 10},
  {x: 5, y: 10}, {x: 4, y: 10}, {x: 3, y: 10}, {x: 3, y: 11},
  {x: 3, y: 12}, {x: 3, y: 13}, {x: 4, y: 13}, {x: 5, y: 13}, 
  {x: 6, y: 13}, {x: 7, y: 13}, {x: 8, y: 13}, {x: 9, y: 13},   
  {x: 10, y: 13}, {x: 11, y: 13}, {x: 12, y: 13}, {x: 13, y: 13}, 
  {x: 13, y: 12}, {x: 13, y: 11}, {x: 13, y: 10}, {x: 13, y: 9},  
  {x: 13, y: 8}, {x: 12, y: 8}, {x: 11, y: 8}, {x: 11, y: 7},
  {x: 11, y: 6}, {x: 11, y: 5}, {x: 11, y: 4}, {x: 11, y: 3},
  {x: 12, y: 3}, {x: 13, y: 3}, {x: 14, y: 3}, {x: 15, y: 3} 
];

// Set inputs
onInput("i", () => {
  const t = getFirst(tower);
  if (resources >= upgradeCost && t) {
    t.range += 1; // Increase tower range
    t.damage += 1; // Increase tower damage
    resources -= upgradeCost;
    addText(`Resources: ${resources}`, { x: 1, y: 2, color: color`3` });
  }
});

onInput("j", () => {
  const p = getFirst(tower);
  if (resources >= fastTowerCost && getTile(p.x, p.y).every(t => t.type !== fastTower)) {
    addSprite(p.x, p.y, fastTower);
    resources -= fastTowerCost;
    addText(`Resources: ${resources}`, { x: 1, y: 2, color: color`3` });
  }
});

onInput("l", () => {
  const p = getFirst(tower);
  if (resources >= strongTowerCost && getTile(p.x, p.y).every(t => t.type !== strongTower)) {
    addSprite(p.x, p.y, strongTower);
    resources -= strongTowerCost;
    addText(`Resources: ${resources}`, { x: 1, y: 2, color: color`3` });
  }
});

// Enemy Waves
let wave = 0;
let enemyCount = 5;

// Spawn different enemy types
function spawnEnemies() {
  for (let i = 0; i < enemyCount; i++) {
    if (getAll(enemy).length < 20) { // Cap the number of enemies
      const enemyType = Math.random() < 0.5 ? fastEnemy : armoredEnemy;
      addSprite(0, 7, enemyType); // Spawn enemies at the start of the path
    }
  }
  wave++;
  enemyCount += 2; // Increase enemy count for the next wave
}

setInterval(() => {
  spawnEnemies();
}, 15000); // Spawn a new wave every 15 seconds

// Adjust intervals for performance optimization
setInterval(() => {
  moveEnemies();
}, 1000); // Move enemies every 1000ms

// Tower Attacks with Animation
setInterval(() => {
  getAll(tower).forEach(t => {
    const enemiesInRange = getAll(enemy).filter(e => Math.abs(e.x - t.x) <= 3 && Math.abs(e.y - t.y) <= 3);
    if (enemiesInRange.length > 0) {
      const target = enemiesInRange[0];
      addSprite(t.x, t.y, projectile);
      setTimeout(() => {
        getTile(target.x, target.y).forEach(t => {
          if (t.type === projectile) t.remove();
        });
      }, 500); // Faster attack speed
    }
  });
}, 1000); // Boost lasts for 10 seconds

// Move Enemies with Animation
function moveEnemies() {
  getAll(enemy).forEach(e => {
    const currentPos = { x: e.x, y: e.y };
    const nextPosIndex = pathCoordinates.findIndex(pos => pos.x === currentPos.x && pos.y === currentPos.y) + 1;
    if (nextPosIndex < pathCoordinates.length) {
      const nextPos = pathCoordinates[nextPosIndex];
      e.x = nextPos.x;
      e.y = nextPos.y;
    } else {
      e.remove(); // Remove enemy if it reaches the end of the path
    }
  });
}

setInterval(() => {
  moveEnemies();
}, 1000); // Move enemies every 1000ms


// Tower Placement
let resources = 100; // Starting resources
const towerCost = 20; // Cost of each tower

onInput("i", () => {
  const p = getFirst(tower);
  if (resources >= towerCost && getTile(p.x, p.y).every(t => t.type !== tower)) {
    addSprite(p.x, p.y, tower);
    resources -= towerCost;
    addText(`Resources: ${resources}`, { x: 1, y: 2, color: color`3` });
  }
});

// Tower Attacks with Animation
setInterval(() => {
  getAll(tower).forEach(t => {
    const enemiesInRange = getAll(enemy).filter(e => Math.abs(e.x - t.x) <= 3 && Math.abs(e.y - t.y) <= 3);
    if (enemiesInRange.length > 0) {
      const target = enemiesInRange[0];
      addSprite(t.x, t.y, projectile);
      setTimeout(() => {
        getTile(target.x, target.y).forEach(t => {
          if (t.type === projectile) t.remove();
        });
      }, 500); // Faster attack speed
    }
  });
}, 1000); // Boost lasts for 10 seconds

// Move Enemies with Animation
function moveEnemies() {
  getAll(enemy).forEach(e => {
    const currentPos = { x: e.x, y: e.y };
    const nextPosIndex = pathCoordinates.findIndex(pos => pos.x === currentPos.x && pos.y === currentPos.y) + 1;
    if (nextPosIndex < pathCoordinates.length) {
      const nextPos = pathCoordinates[nextPosIndex];
      e.x = nextPos.x;
      e.y = nextPos.y;
    } else {
      e.remove(); // Remove enemy if it reaches the end of the path
    }
  });
}

setInterval(() => {
  moveEnemies();
}, 1000); // Move enemies every 1000ms

// Special Ability: Boost Attack Speed
const boostCooldown = 20000; // 20 seconds cooldown
let boostActive = false;

onInput("k", () => {
  if (!boostActive) {
    boostActive = true;
    setInterval(() => {
      getAll(tower).forEach(t => {
        const enemiesInRange = getAll(enemy).filter(e => Math.abs(e.x - t.x) <= 3 && Math.abs(e.y - t.y) <= 3);
        if (enemiesInRange.length > 0) {
          const target = enemiesInRange[0];
          addSprite(t.x, t.y, projectile);
          setTimeout(() => {
            getTile(target.x, target.y).forEach(t => {
              if (t.type === projectile) t.remove();
            });
          }, 500); // Faster attack speed
        }
      });
    }, 1000); // Boost lasts for 10 seconds

    setTimeout(() => {
      boostActive = false;
    }, boostCooldown); // Reset cooldown
  }
});

// Enemy Health and Damage
let enemyHealth = 3;

afterInput(() => {
  getAll(projectile).forEach(p => {
    const enemiesHit = getTile(p.x, p.y).filter(t => t.type === enemy || t.type === fastEnemy || t.type === armoredEnemy);
    enemiesHit.forEach(e => {
      enemyHealth -= 1;
      if (enemyHealth <= 0) {
        e.remove();
        enemyHealth = 3; // Reset health for next enemy
        resources += 10; // Earn resources for defeating an enemy
        addText(`Resources: ${resources}`, { x: 1, y: 2, color: color`3` });
      }
    });
  });
});

// Achievements
let achievements = {
  firstTower: false,
  firstKill: false,
  wave10: false
};

function checkAchievements() {
  if (!achievements.firstTower && getAll(tower).length > 0) {
    achievements.firstTower = true;
    resources += 50; // Reward for placing the first tower
    addText('Achievement: First Tower!', { x: 1, y: 3, color: color`2` });
  }

  if (!achievements.firstKill && getAll(enemy).length === 0) {
    achievements.firstKill = true;
    resources += 50; // Reward for first kill
    addText('Achievement: First Kill!', { x: 1, y: 4, color: color`2` });
  }

  if (!achievements.wave10 && wave >= 10) {
    achievements.wave10 = true;
    resources += 100; // Reward for reaching wave 10
    addText('Achievement: Wave 10!', { x: 1, y: 5, color: color`2` });
  }
}

setInterval(() => {
  checkAchievements();
}, 1000); // Check achievements every second

// Sound Effects
const placeTowerSound = new Audio('place_tower.mp3');
const attackSound = new Audio('attack.mp3');
const enemyDeathSound = new Audio('enemy_death.mp3');

onInput("i", () => {
  const p = getFirst(tower);
  if (resources >= towerCost && getTile(p.x, p.y).every(t => t.type !== tower)) {
    addSprite(p.x, p.y, tower);
    resources -= towerCost;
    addText(`Resources: ${resources}`, { x: 1, y: 2, color: color`3` });
    placeTowerSound.play(); // Play sound effect for placing tower
  }
});

setInterval(() => {
  getAll(tower).forEach(t => {
    const enemiesInRange = getAll(enemy).filter(e => Math.abs(e.x - t.x) <= 3 && Math.abs(e.y - t.y) <= 3);
    if (enemiesInRange.length > 0) {
      const target = enemiesInRange[0];
      addSprite(t.x, t.y, projectile);
      attackSound.play(); // Play sound effect for attacking
      setTimeout(() => {
        getTile(target.x, target.y).forEach(t => {
          if (t.type === projectile) t.remove();
        });
      }, 500);
    }
  });
}, 2000);

afterInput(() => {
  getAll(projectile).forEach(p => {
    const enemiesHit = getTile(p.x, p.y).filter(t => t.type === enemy || t.type === fastEnemy || t.type === armoredEnemy);
    enemiesHit.forEach(e => {
      enemyHealth -= 1;
      if (enemyHealth <= 0) {
        e.remove();
        enemyHealth = 3; // Reset health for next enemy
        resources += 10; // Earn resources for defeating an enemy
        addText(`Resources: ${resources}`, { x: 1, y: 2, color: color`3` });
        enemyDeathSound.play(); // Play sound effect for enemy death
      }
    });
  });
});

// Game Mechanics
function gameOver() {
  addText('Game Over', { x: 5, y: 7, color: color`2` });
  setTimeout(() => {
    level = 0;
    resources = 100;
    setMap(levels[level]);
  }, 3000); // Restart game after 3 seconds
}

afterInput(() => {
  const enemiesAtBase = getTile(14, 14).filter(t => t.type === enemy);
  if (enemiesAtBase.length > 0) {
    gameOver();
  }
});
