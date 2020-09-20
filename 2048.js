canvasWidth = 400;
canvasHeight = canvasWidth;
RIGHT = 39;
LEFT = 37;
UP = 38;
DOWN = 40;

preSwipeTiles = [];
tiles = [];

  function setup() {
      createCanvas(canvasWidth, canvasHeight);
      this.initializeGame();
      this.keyPressed();
  }
  
  function draw() {
    drawTiles();
  }

  function drawTiles(){
    for(let i = 0; i < tiles.length; i++){
      for(let j = 0; j < tiles[i].length; j++){
        fill('rgb(' + tiles[i][j].getColor()[1] + ')');
        rect(i * 100, j * 100, canvasWidth / 4, canvasHeight / 4); 
        if(tiles[i][j].value !== 0){
          let colors = tiles[i][j].getColor();
          fill('rgb(' + colors[2] + ')');
          text(tiles[i][j].value, i * 100 + 50, j * 100 + 50);
          textAlign(CENTER, CENTER);
          textSize(64);
          stroke(5);
        }
      }
    }
  }

  function keyPressed(){
    if(keyCode === 39){ 
      right();
      setNewGameTiles(1, false);
    }
    else if (keyCode === 37) {
      left();     
      setNewGameTiles(1), false;
    }
    else if (keyCode === UP) { 
      up();
      setNewGameTiles(1, false);
    }
    else if(keyCode === DOWN) {
      down();
      setNewGameTiles(1, false);
    };
  }


function copyTiles(){
  preSwipeTiles = JSON.parse(JSON.stringify(tiles))
}


  function tilesDidNotMove(){
    if(preSwipeTiles.length == 0) return false;
    for(let i=0; i<tiles.length;i++){
      for(let j=0; j< tiles.length; j++){
        if(tiles[i][j].value !== preSwipeTiles[i][j].value){
          return false;
        }
      }
    }
    return true;
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
    this.setNewGameTiles(2, true);
  }

  function getRandomTwoOrFour(){
    return random() > 0.5 ? 2 : 4;
  }

  function setNewGameTiles(n, init){
    if(!tilesDidNotMove()){
      for(let i = 0; i < n; i++){
        this.getRandomZeroTile().value = getRandomTwoOrFour();
      }
    }
    if(!init){
      copyTiles();
    }
  }

  function up(){
    for(let i = 0; i < tiles.length; i++){
      this.merging(tiles[i]);
    }
  }

  function down(){
    for(i = 0; i < tiles.length; i++){
      tiles[i].reverse();
      merging(tiles[i]);
      tiles[i].reverse();
    }
  }

  function left(){   
    tiles = spinRight();
    for(let i = 0; i < tiles.length; i++){
      merging(tiles[i]);
    }
    tiles = spinLeft();
  }

  function right(){
    tiles = spinLeft();
    for(let i = 0; i < tiles.length; i++){
      merging(tiles[i]);
    }
    tiles = spinRight();
  }

  function spinRight(){
    let spinnedTiles = [];
    for(let i = tiles.length - 1; i >= 0; i--){
      let row = [];
      for(let j = 0; j < tiles.length; j++){
        row.push(tiles[j][i]);
      }
      spinnedTiles.push(row);
    }
    return spinnedTiles;
  }

  function spinLeft(){
    let spinnedTiles = [];
    for(let i=0; i < tiles.length; i++){
      let row = [];
      for(let j=tiles.length-1; j >= 0; j--){
        row.push(tiles[j][i]);
      }
      spinnedTiles.push(row);
    }
    return spinnedTiles;
  }

  function merging(row){

    moveAllTilesOverAfterSwipe(row);

    for(let i = 0; i < row.length - 1; i++){
      let hoofdRow = row[i];
      let secondRow =  row[i+1];
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

      colors = [[0, '199, 186, 174', '199, 186, 174'],
                [2, '231, 221, 211', '114, 106, 98'], 
                [4, '230, 217, 195', '114, 106, 98'],
                [8, '233, 171, 117', '240, 238, 235'],
                [16, '236, 143, 96', '240, 238, 235'],
                [32, '236, 118, 93', '240, 238, 235'],
                [64, '224, 82, 54', '240, 238, 235'],
                [128, '236, 211, 104', '240, 238, 235'],
                [256, '234, 203, 74', '240, 238, 235']  
              ];


      constructor(i, j){
        this.i = i;
        this.j = j;
        this.value = 0;
      }

      getColor() {
        for(let i = 0; i < this.colors.length; i++){
          if(this.colors[i][0] === this.value){
              return this.colors[i];
          }
       } 
      }

      getString(){
        return "value:" + this.value + ", i:"+this.i+", j:"+this.j;
      }
  }