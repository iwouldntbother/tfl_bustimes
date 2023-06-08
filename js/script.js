let URL = 'http://countdown.api.tfl.gov.uk/interfaces/ura/instant_V1';
let localData;

let noCellsX = 500;
let width = window.innerWidth;
let height = window.innerHeight;

let testCell;
let testGrid;

const updateData = (data) => {
  localData = JSON.parse('[' + data.replaceAll('\n', ',') + ']');
  console.log(localData.length);
  // httpGet(URL);
};

const httpGet = (theUrl) => {
  console.log('Requesting data');
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open('GET', theUrl, false);
  xmlHttp.send(null);
  return updateData(xmlHttp.responseText);
};

function setup() {
  createCanvas(width, height);
  testCell = new Cell(500, 500, 1);
  testGrid = new Grid(width, height);
  httpGet(URL);
  // setInterval(() => {
  //   httpGet(URL);
  // }, 60000);
}

function draw() {
  background(0);
  textAlign(CENTER, CENTER);
  colorMode(HSB);
  if (localData) {
    testGrid.update();
    testGrid.draw();
  } else {
    text('Loading...', 500, 500);
  }
}

testData = [1, 1, 1, 1];

class Grid {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.cells = [];
  }

  update() {
    this.cells = [];
    let j = 0;
    for (let i = 1; i < localData.length; i++) {
      if ((i - 1) * (width / noCellsX) >= width * (j + 1)) {
        j++;
      }

      this.cells.push(
        new Cell(
          (i - 1) * (width / noCellsX) - j * ((width / noCellsX) * noCellsX),
          j * (width / noCellsX),
          width / noCellsX,
          i
        )
      );
    }
  }

  draw() {
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].draw();
    }
  }
}

const getColourValue = (time) => {
  let now = new Date().getTime();
  let secondsUntil = ((time - now) / 1000).toFixed(0);
  return secondsUntil;
};

class Cell {
  constructor(x, y, size, index) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.index = index;
  }

  draw() {
    push();
    noStroke();
    // Red to Green
    fill(
      map(getColourValue(localData[this.index][3]), 0, 1800, 90, 0),
      100,
      100
    );
    // Orange (TFL Dot-Matrix)
    // fill(
    //   35,
    //   100,
    //   map(getColourValue(localData[this.index][3]), 0, 1800, 100, 0)
    // );
    rect(this.x, this.y, this.size, this.size);
    // ellipse(this.x, this.y, this.size * 0.85, this.size * 0.85);
    pop();
  }
}
