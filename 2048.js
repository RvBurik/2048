canvasWidth = 400;
canvasHeight = canvasWidth;
RIGHT = 39;
LEFT = 37;
UP = 38;
DOWN = 40;


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
    if(keyCode === RIGHT){ }
    else if (keyCode === LEFT) console.log("LEFT");
    else if (keyCode === UP) { this.moveTilesToDirection();}
    else if(keyCode === DOWN) console.log("DOWN");
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
      this.merging(tiles[i]);
    }
    this.setNewGameTiles(1);
  }

  function merging(row){
    debugger;

    moveAllTilesOverAfterSwipe(row);

    for(let i = 0; i < row.length - 1; i++){
      let hoofdRow = row[i];
      let secondRow =  row[i+1];
      if(secondRow === undefined){ debugger;}
      if(isAbleToMerge(hoofdRow, secondRow)){
        merge([hoofdRow, secondRow])
      }
    }
    moveAllTilesOverAfterSwipe(row);
    resetForNextRound(row);
  }

  function getIndexOfFirstNotZeroTile(row){
    for(let i = 0; i < row.length; i++){
      if(row[i].value !== 0){
        return i;
      }
    }
    return null;
  }

  function merge(tiles){
    if(tiles[0].value !== 0){ tiles[0].mergedInRound = true}
    tiles[0].value += tiles[1].value;
    tiles[1].value = 0;
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

  function moveAllTilesOverAfterSwipe(row){
    let indexOfFirstNotZeroTile = getIndexOfFirstNotZeroTile(row);
    if(indexOfFirstNotZeroTile === null){ return; }

    let tilesToRemove = getZeroTiles(row);

    tilesToRemove.forEach(tile => { 
      let index = row.findIndex(element => element === tile);
      row.splice(index, 1);
      row.push(tile);
    });
    debugger;
    row.forEach((tile, index) => tile.j = index);
  }



  function getAllTilesFromRow(row, biggerThanZero){
    return row.filter(function(element){ return biggerThanZero ? element.value > 0 : element.value === 0});
  }

  function getZeroTiles(row){
    let arr = [];
    row.forEach(tile => {
      if(tile.value === 0) arr.push(tile);
    });
    return arr;
  };

  function getRandomZeroTile(){
    let r1 = floor(random(0, this.tiles.length));
    let r2 = floor(random(0, this.tiles[r1].length));
    let randomlyChosenTile = this.tiles[r1][r2];
    return randomlyChosenTile.value === 0 ? randomlyChosenTile : this.getRandomZeroTile();
  }

  class Tile {
      value;
      i;
      j;
      mergedInRound = false;

      constructor(i, j){
        this.i = i;
        this.j = j;
        this.value = 0;
      }
  }