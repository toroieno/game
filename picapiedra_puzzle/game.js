class game {
  constructor() {
    this.init();
    this.loadImage();
    this.loop();
    this.listenMouseEvent();
  }
  
  init() {
    const content = document.querySelector('#content');
    
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = GAME_WIDTH;
    this.canvas.height = GAME_HEIGHT;
    
    this.img = null;
    this.pieces = [];
    
    this.selectedPiece = {};
    this.emptyPiece = {row: 0, col: 0}
    
    content.appendChild(this.canvas);
  }

  loadImage() {
    this.img = new Image();
    this.img.onload = () => {
      this.startGame();
    }
    
    this.img.src = 'conan-movie26.jpg';
  }

  listenMouseEvent() {
    this.canvas.addEventListener('mousedown', (event) => this.mouseDown(event));
    this.canvas.addEventListener('mouseup', (event) => this.mouseUp(event));

  }
  
  getMousePos(evt) {
    var rect = this.canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    }
  }

  getCorByMousePosition(mousePos) {
    return {
      col: Math.floor(mousePos.x / PIECE_SIZE),
      row: Math.floor(mousePos.y / PIECE_SIZE),
    }
  }

  mouseDown(event) {
    let mousePos = this.getMousePos(event);

    this.selectedPiece = this.getCorByMousePosition(mousePos);
  }

  mouseUp(event) {
    let mousePos = this.getMousePos(event);
    let mouseUpCor = this.getCorByMousePosition(mousePos);

    // check to empty piece
    if (
      mouseUpCor.row != this.emptyPiece.row || 
      mouseUpCor.col != this.emptyPiece.col
    ) {
      return;
    }
    
    // check near empty piece
    if (
      (
        this.selectedPiece.row == this.emptyPiece.row &&
        Math.abs(this.selectedPiece.col - this.emptyPiece.col) == 1 
      ) ||
      (
        this.selectedPiece.col == this.emptyPiece.col &&
        Math.abs(this.selectedPiece.row - this.emptyPiece.row) == 1 
      )
    ) {
      // swap object in data
      this.swapPiece(this.selectedPiece, mouseUpCor);
    }
  }

  swapPiece(piece1, piece2) {
    let temp = this.pieces[piece1.row][piece1.col];
    this.pieces[piece2.row][piece2.col] = temp;
    this.pieces[piece1.row][piece1.col] = null;
    
    this.pieces[piece2.row][piece2.col].row = piece2.row
    this.pieces[piece2.row][piece2.col].col = piece2.col
    // 
    this.emptyPiece = piece1;

    this.checkGameState();
  }

  checkGameState() {
    console.log(this.pieces);
    let success = true
    for (let row = 1; row < 6; row++) {
      for (let col = 0; col < 3; col++) {
        if (
          (
            row == this.emptyPiece.row && 
            col == this.emptyPiece.col
          ) || 
          (
            this.pieces[row][col].originRow != row || 
            this.pieces[row][col].originCol != col 
          )
        ) {
          success = false
        }
      }
    }
    
    if (success) {
      alert('game de vl');
    }
  }

  randomMove() {
    let r = Math.round(Math.random() * 3);

    let willMove = null;

    switch(r) {
      case 0:
        if (this.emptyPiece.row > 2) {
          willMove = {row: this.emptyPiece.row - 1, col: this.emptyPiece.col};
        }
        break;
      case 1:
        if (this.emptyPiece.row < 5) {
          willMove = {row: this.emptyPiece.row + 1, col: this.emptyPiece.col};
        }
        break;
      case 2:
        if (this.emptyPiece.col > 0 && this.emptyPiece.row != 0) {
          willMove = {row: this.emptyPiece.row, col: this.emptyPiece.col - 1};
        }
        break;
      case 3:
        if (this.emptyPiece.col < 2 && this.emptyPiece.row != 0) {
          willMove = {row: this.emptyPiece.row, col: this.emptyPiece.col + 1};
        }
        break;
    }

    if (willMove != null) {
      console.log(willMove);
      this.swapPiece(willMove, this.emptyPiece)
    }
  }

  startGame() {
    // create pieces
    this.pieces = Array.from({ length: 6 }, () => Array(3).fill(null));

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 3; col++) {
        
        // create img for piece
        let pieceCanvas = document.createElement('canvas');
        pieceCanvas.width = PIECE_SIZE;
        pieceCanvas.height = PIECE_SIZE;
        let pieceCtx = pieceCanvas.getContext('2d');
      
        pieceCtx.drawImage(
          this.img,
          col * PIECE_SIZE,
          row * PIECE_SIZE,
          PIECE_SIZE,
          PIECE_SIZE,

          0,
          0,
          PIECE_SIZE,
          PIECE_SIZE
        )

        // document.body.appendChild(pieceCanvas);

        // create piece
        let newPiece = new piece(this, col, row + 1, pieceCanvas);
        this.pieces[row + 1][col] = newPiece;
      }
    }

    // random pieces
    for (let rt = 0; rt < 100; rt++) {
      this.randomMove();
    }
  }

  loop() {
    this.update();
    this.draw();

    setTimeout(() => {
      this.loop();
    }, 20)
  }

  update() {
    this.pieces.forEach(row => {
      row.forEach(piece => {
        if (piece !== null) {
          piece.update()
        }
      })
    })
  }

  draw() {
    // clear screen
    this.ctx.fillStyle = 'blue';
    this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(100, 0, 200, 100);

    // Define text properties (font, color, alignment, etc.)
    this.ctx.font = "16px Arial"; // Set the font size and family
    this.ctx.fillStyle = "white"; // Set the text color
    this.ctx.textAlign = "center"; // Set the horizontal alignment to center

    // Calculate the position to center the text within the rectangle
    const rectWidth = 200;
    const rectHeight = 100;
    const textX = 100 + rectWidth / 2;
    const textY = rectHeight / 2 + 8; // Adding 8 to vertically center the text (adjust as needed)

    // Fill the text inside the rectangle
    this.ctx.fillText("Conan movie 26", textX, textY);

    this.pieces.forEach(row => {
      row.forEach(piece => {
        if (piece !== null) {
          piece.draw()
        }
      })
    })
  }

}

var g = new game();