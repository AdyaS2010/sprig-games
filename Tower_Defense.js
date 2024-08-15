/*
@title: Tower_Defense
@author: Adya
@tags: []
@addedOn: 2024-15-08
*/

const tower = "t";
const enemy = "e";
const path = "p";
const base = "b";
const projectile = "j";
const player = "P"; // Adding player for tower placement

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
  [enemy, bitmap`
................
................
................
....111111......
...11....11.....
...1.33.3.1.....
...1.33.33.1....
...1.......1....
...1..3....1....
...11.33...1....
....1..333.1....
....11....11....
.....111111.....
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
................`],
  [player, bitmap`
................
................
................
.......0........
.....00.000.....
....0.....00....
....0.0.0..0....
....0......0....
....0......0....
....00....0.....
......00000.....
......0...0.....
....000...000...
................
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

setPushables({
  [player]: []
});

onInput("w", () => {
  const p = getFirst(player);
  if (p) p.y -= 1; // Move up
});

onInput("a", () => {
  const p = getFirst(player);
  if (p) p.x -= 1; // Move left
});

onInput("s", () => {
  const p = getFirst(player);
  if (p) p.y += 1; // Move down
});

onInput("d", () => {
  const p = getFirst(player);
  if (p) p.x += 1; // Move right
});

// Enemy Movement
setInterval(() => {
  getAll(enemy).forEach(e => {
    e.x += 1;
    if (e.x >= 15) e.x = 0; // Loop enemy movement
  });
}, 500);

// Tower Placement
let resources = 100; // Starting resources
const towerCost = 20;

onInput("i", () => {
  const p = getFirst(player);
  if (p && resources >= towerCost && getTile(p.x, p.y).every(t => t.type !== tower)) {
    addSprite(p.x, p.y, tower);
    resources -= towerCost;
    addText(`Resources: ${resources}`, { x: 1, y: 2, color: color`3` });
  }
});
