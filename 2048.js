canvasWidth = 400;
canvasHeight = canvasWidth;

tiles = [];

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    this.initializeGame();
    this.keyPressed();
  }
  
  function draw() {
    background(220);  
    drawTiles();
  }

  function drawTiles(){
    for(let i = 0; i < tiles.length; i++){
      for(let j = 0; j < tiles[i].length; j++){
        rect(i * 100, j * 100, canvasWidth / 4, canvasHeight / 4); 
        if(tiles[i][j].value !== 0){
          text(tiles[i][j].value, i * 100 + 50, j * 100 + 50);
          textAlign(CENTER, CENTER);
          textSize(64);
          stroke(5);
        }
      }
    }
  }

  function keyPressed(){
    if(keyCode === 39){ this.moveTilesToDirection(); this.setNewGameTiles(1);}
    else if (keyCode === 37) console.log("LEFT");
    else if (keyCode === 38) console.log("UP");
    else if(keyCode === 40) console.log("DOWN");
  }

  function generateTiles(){
    for(let i = 0; i < 4; i++){
      let arr = [4];
      for(let j = 0; j < 4; j++){
        arr[j] = new Tile(i, j);
      }
      tiles.push(arr);
    }
  }


  function initializeGame(){
    this.generateTiles();
    this.setNewGameTiles(2);
  }

  function getRandomTwoOrFour(){
    return random() > 0.5 ? 2 : 4;
  }

  function setNewGameTiles(n){
    for(let i = 0; i < n; i++){
      this.getRandomZeroTile().value = getRandomTwoOrFour();
    }
  }

  function moveTilesToDirection(direction){
    for(let i = 0; i < tiles.length; i++){
      this.merging(tiles[i])
    }
  }

  function merging(row){
    debugger;
    for(let i = row.length-1 ; i >= 1 ; i--){
      if(isAbleToMerge(row[i], row[i-1])){
        this.merge([row[i], row[i-1]]);
      }
    }
    this.resetForNextRound(row);
  }

  function merge(tiles){
    if(tiles[1].value !== 0){ tiles[1].mergedInRound = true};

    tiles[1].value = tiles[1].value + tiles[0].value;
    tiles[0].value = 0;
  }

  function resetForNextRound(row){
    row.forEach(element => {
      element.mergedInRound=false;
    });
  }

  function isAbleToMerge(a, b){
    debugger;
    if(b.value===0) return true;
    return (a.value===b.value) && (!a.mergedInRound && !b.mergedInRound) ? true : false;
  }

  function getRandomZeroTile(){
    let r1 = floor(random(0, this.tiles.length));
    let r2 = floor(random(0, this.tiles[r1].length));
    let randomlyChosenTile = this.tiles[r1][r2];
    return randomlyChosenTile.value === 0 ? randomlyChosenTile : this.getRandomZeroTile();
  }

  class Tile {
      value = 0;
      i;
      j;
      mergedInRound = false;

      constructor(i, j){
        this.i = i;
        this.j = j;
      }
  }