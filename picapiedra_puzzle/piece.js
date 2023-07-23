class piece {
  constructor(game, col, row, img) {
    this.game = game;
    this.col = col;
    this.row = row;

    this.originCol = col;
    this.originRow = row;

    this.x = this.col * PIECE_SIZE;
    this.y = this.row  * PIECE_SIZE;

    this.img = img;
  }

  update() {
    let targetX = this.col * PIECE_SIZE;
    let targetY = this.row * PIECE_SIZE;

    if (targetX > this.x) {
      this.x += 5
    }
    else if (targetX < this.x) {
      this.x -= 5
    }

    if (targetY > this.y) {
      this.y += 5
    }
    else if (targetY < this.y) {
      this.y -= 5
    }

    // this.x = this.col * PIECE_SIZE;
    // this.y = (this.row + 1)  * PIECE_SIZE;

  }

  draw() {
    this.game.ctx.beginPath();
    this.game.ctx.lineWidth = "2";
    this.game.ctx.strokeStyle = "blue";
    this.game.ctx.rect(this.x, this.y, PIECE_SIZE, PIECE_SIZE);
    this.game.ctx.stroke();
    // console.log(this.img);
    this.game.ctx.drawImage(
      this.img,
      0,
      0,
      PIECE_SIZE,
      PIECE_SIZE,

      this.x,
      this.y,
      PIECE_SIZE,
      PIECE_SIZE
    )
  }

}