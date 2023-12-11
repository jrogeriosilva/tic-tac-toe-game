/**
 * Cria uma instância do jogo com o tamanho do tabuleiro e o modo de jogo especificados.
 * @class
 * @classdesc Representa um jogo da velha.
 * @memberof Game
 * @constructor
 * @param {number} size - O tamanho do tabuleiro do jogo.
 * @param {number} mode - O modo de jogo (1 para jogador contra jogador, 2 para jogador contra IA).
 */
class TicTacToe {
  constructor(size, mode) {
    this.someBodyWin = false
    this.size = size;
    this.mode = mode;
    this.currentPlayer = 'X';
    this.winningCells = [];
    this.validGameModes = [1, 2]
    this.initializeGame();
  }


  /**
 * Inicializa o jogo verificando o tamanho do tabuleiro e o modo de jogo.
 * Exibe alertas e redireciona para a página inicial se as configurações forem inválidas.
 * Cria o tabuleiro do jogo se as configurações forem válidas.
 * @memberof Game
 * @function initializeGame
 * @returns {void}
 */
  initializeGame() {
    if (parseInt(this.size) < 3 || parseInt(this.size) > 10) {
      alert("Tamanho Invalido, por favor, insira um valor entre 3 e 10")
      window.location.href = `index.html`
    }

    if (!this.validGameModes.includes(parseInt(this.mode))) {
      alert("Modo Invalido, por favor, insira um Modo Valido: entre 1 e 2")
      window.location.href = `index.html`
    }

    this.createGameBoard();
  }

  /**
 * Cria um tabuleiro de jogo dinâmico no elemento HTML com o id 'game'.
 * @memberof Game
 * @function createGameBoard
 * @param {number} size - O tamanho do tabuleiro (número de linhas e colunas).
 * @returns {void}
 */
  createGameBoard() {
    const gameContainer = document.getElementById('game');
    gameContainer.innerHTML = '';

    for (let i = 0; i < this.size; i++) {
      const row = document.createElement('div');
      row.className = 'row';

      for (let j = 0; j < this.size; j++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.setAttribute('data-row', i);
        cell.setAttribute('data-column', j);
        cell.addEventListener('click', (event) => this.cellClicked(event));

        row.appendChild(cell);
      }

      gameContainer.appendChild(row);
    }
  }

  /**
 * Implementa a jogada da inteligência artificial (IA) no jogo.
 * A IA escolhe uma célula vazia aleatória para jogar 'O'.
 * Verifica se há um empate ou um vencedor após a jogada.
 * @memberof Game
 * @function iaPlays
 * @returns {void}
 */
  iaPlays() {
    if (this.someBodyWin) {
      return;
    }

    const emptyCells = document.querySelectorAll('.cell:empty');
    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    let randomEmptyCell = emptyCells[randomIndex];

    randomEmptyCell.textContent = "O"
    randomEmptyCell.style.color = "#00ADB5";

    const row = randomEmptyCell.getAttribute('data-row');
    const column = randomEmptyCell.getAttribute('data-column');

    if (this.checkDraw()) {
      let resetButton = document.getElementById('reset-button');
      resetButton.textContent = `Empate 🗘`;
    }

    if (this.hasAWinner(row, column)) {
      this.highlightWinner();
    }
  }

  /**
 * Manipula o evento de clique em uma célula do tabuleiro.
 * Atualiza o estado do jogo com base na célula clicada.
 * Verifica se há um empate ou um vencedor após a jogada.
 * @memberof Game
 * @function cellClicked
 * @param {Event} event - O objeto de evento associado ao clique na célula.
 * @returns {void}
 */
  cellClicked(event) {
    const clickedCell = event.target;
    const row = clickedCell.getAttribute('data-row');
    const column = clickedCell.getAttribute('data-column');

    if (clickedCell.textContent !== '' || this.someBodyWin) {
      return;
    }

    clickedCell.textContent = this.currentPlayer;
    clickedCell.style.color = this.currentPlayer === 'X' ? '#EEEEEE' : '#00ADB5';

    if (this.checkDraw()) {
      let resetButton = document.getElementById('reset-button');
      resetButton.textContent = `Empate 🗘`;
    }

    if (this.hasAWinner(row, column)) {
      this.highlightWinner();
    }

    if (parseInt(this.mode) === 1) {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }

    this.iaPlayed = false;

    if (parseInt(this.mode) === 2 && !this.iaPlayed) {
      this.iaPlays();
    }
  }


  /**
 * Verifica se o jogador atual tem uma sequência vencedora após a última jogada.
 * Chama funções auxiliares para verificar diagonais, linhas e colunas.
 * @memberof Game
 * @function hasAWinner
 * @param {number} row - A linha da última jogada.
 * @param {number} column - A coluna da última jogada.
 * @returns {boolean} - true se o jogador atual tiver uma sequência vencedora, false caso contrário.
 */
  hasAWinner(row, column) {
    const playerSymbol = this.currentPlayer;

    if (this.checkDiagonals(row, column, playerSymbol) || this.checkRow(row, playerSymbol) || this.checkColumn(column, playerSymbol)) {
      return true;
    }

    return false;
  }

  /**
 * Verifica se há uma sequência vencedora na linha da última jogada para o jogador atual.
 * @memberof Game
 * @function checkRow
 * @param {number} cellRow - A linha da última jogada.
 * @param {string} playerSymbol - O símbolo do jogador atual ('X' ou 'O').
 * @returns {boolean} - true se houver uma sequência vencedora na linha, false caso contrário.
 */
  checkRow(cellRow, playerSymbol) {
    let points = 0;
    this.winningCells = [];

    for (let i = 0; i < this.size; i++) {
      const cell = document.querySelector(`[data-row="${cellRow}"][data-column="${i}"]`);

      if (cell && cell.textContent !== playerSymbol) {
        points = 0;
        this.winningCells = [];
      }

      if (cell && cell.textContent === playerSymbol) {
        points++;
        this.winningCells.push(cell);
      }

      if (points >= 3) {
        return true;
      }
    }

    return false;
  }

  /**
 * Verifica se há uma sequência vencedora na coluna da última jogada para o jogador atual.
 * @memberof Game
 * @function checkColumn
 * @param {number} cellCol - A coluna da última jogada.
 * @param {string} playerSymbol - O símbolo do jogador atual ('X' ou 'O').
 * @returns {boolean} - true se houver uma sequência vencedora na coluna, false caso contrário.
 */
  checkColumn(cellCol, playerSymbol) {
    let points = 0;
    this.winningCells = [];

    for (let i = 0; i < this.size; i++) {
      const cell = document.querySelector(`[data-row="${i}"][data-column="${cellCol}"]`);

      if (cell && cell.textContent !== playerSymbol) {
        points = 0;
        this.winningCells = [];
      }

      if (cell && cell.textContent === playerSymbol) {
        points++;
        this.winningCells.push(cell);
      }

      if (points >= 3) {
        return true;
      }
    }

    return false;
  }


  /**
 * Retorna as coordenadas do início da diagonal primária, dado um ponto na diagonal.
 * @memberof Game
 * @function startPrimaryDiagonal
 * @param {number} row - A coordenada da linha do ponto na diagonal.
 * @param {number} col - A coordenada da coluna do ponto na diagonal.
 * @returns {Array<number>} - Um array contendo as coordenadas [row, col] do início da diagonal primária.
 */
  startPrimaryDiagonal(row, col) {
    if (row == 0 && col == 0) {
      return [row, col]
    }

    while (row > 0 || col > 0) {
      row--
      col--

      if (row <= 0 || col <= 0) {
        return [row, col]
      }
    }
  }


  /**
   * Retorna as coordenadas do início da diagonal secundária, dado um ponto na diagonal.
   * @memberof Game
   * @function startSecundaryDiagonal
   * @param {number} row - A coordenada da linha do ponto na diagonal.
   * @param {number} col - A coordenada da coluna do ponto na diagonal.
   * @param {number} size - O tamanho do tabuleiro (número de linhas e colunas).
   * @returns {Array<number>} - Um array contendo as coordenadas [row, col] do início da diagonal secundária.
   */
  startSecundaryDiagonal(row, col, size) {
    while (row <= size - 1 || col <= size - 1) {
      row--
      col++

      if (row <= 0 || col >= size - 1) {
        return [row, col]
      }
    }
  }


  /**
 * Verifica se há uma sequência vencedora nas diagonais para o jogador atual.
 * Chama funções auxiliares para verificar a diagonal primária e secundária.
 * @memberof Game
 * @function checkDiagonals
 * @param {number} row - A coordenada da linha do último ponto jogado.
 * @param {number} col - A coordenada da coluna do último ponto jogado.
 * @param {string} playerSymbol - O símbolo do jogador atual ('X' ou 'O').
 * @returns {boolean} - true se houver uma sequência vencedora nas diagonais, false caso contrário.
 */
  checkDiagonals(row, col, playerSymbol) {
    if (this.checkPrimaryDiagonal(row, col, playerSymbol) || this.checkSecundaryDiagonal(row, col, playerSymbol)) {
      return true;
    }
  }

  /**
 * Verifica se há uma sequência vencedora na diagonal primária para o jogador atual.
 * @memberof Game
 * @function checkPrimaryDiagonal
 * @param {number} row - A coordenada da linha do último ponto jogado.
 * @param {number} col - A coordenada da coluna do último ponto jogado.
 * @param {string} playerSymbol - O símbolo do jogador atual ('X' ou 'O').
 * @returns {boolean} - true se houver uma sequência vencedora na diagonal primária, false caso contrário.
 */
  checkPrimaryDiagonal(row, col, playerSymbol) {
    let points = 0;
    this.winningCells = [];

    const startDiagonal = this.startPrimaryDiagonal(row, col);

    for (let i = startDiagonal[0], j = startDiagonal[1]; i < parseInt(this.size) || j < parseInt(this.size) - 1; i++, j++) {
      const cell = document.querySelector(`[data-row="${i}"][data-column="${j}"]`);

      if (cell && cell.textContent !== playerSymbol) {
        points = 0;
        this.winningCells = [];
      }

      if (cell && cell.textContent === playerSymbol) {
        points++;
        this.winningCells.push(cell);
      }

      if (points >= 3) {
        return true;
      }

    }
    return false;
  }

  /**
 * Verifica se há uma sequência vencedora na diagonal secundária para o jogador atual.
 * @memberof Game
 * @function checkSecundaryDiagonal
 * @param {number} row - A coordenada da linha do último ponto jogado.
 * @param {number} col - A coordenada da coluna do último ponto jogado.
 * @param {string} playerSymbol - O símbolo do jogador atual ('X' ou 'O').
 * @returns {boolean} - true se houver uma sequência vencedora na diagonal secundária, false caso contrário.
 */
  checkSecundaryDiagonal(row, col, playerSymbol) {
    let points = 0;
    this.winningCells = [];

    const startDiagonal = this.startSecundaryDiagonal(row, col, this.size);

    for (let i = startDiagonal[0], j = startDiagonal[1]; (i < parseInt(this.size)) || (j >= 0); i++, j--) {
      const cell = document.querySelector(`[data-row="${i}"][data-column="${j}"]`);

      if (cell && cell.textContent !== playerSymbol) {
        points = 0;
        this.winningCells = [];
      }

      if (cell && cell.textContent === playerSymbol) {
        points++;
        this.winningCells.push(cell);
      }

      if (points >= 3) {
        return true;
      }

    }
    return false;
  }

  /**
 * Destaca as células que compõem a sequência vencedora e exibe a mensagem de vitória.
 * @memberof Game
 * @function highlightWinner
 * @returns {void}
 */
  highlightWinner() {
    this.someBodyWin = true;

    this.winningCells.forEach(cell => {
      cell.classList.add('winning-cell');
    });

    let resetButton = document.getElementById('reset-button');
    resetButton.textContent = `${this.currentPlayer} Venceu! 🗘`;
  }

  /**
 * Verifica se o jogo resultou em um empate (sem vencedor e todas as células preenchidas).
 * @memberof Game
 * @function checkDraw
 * @returns {boolean} - true se o jogo resultar em empate, false caso contrário.
 */
  checkDraw() {
    const cells = document.querySelectorAll('.cell');
    let filledCells = 0;

    cells.forEach(cell => {
      if (cell.textContent !== '') {
        filledCells++;
      }
    });

    return filledCells === this.size * this.size && !this.someBodyWin;
  }

}
const urlParams = new URLSearchParams(window.location.search);

const size = urlParams.get('size');
const mode = urlParams.get('mode');

const ticTacToeGame = new TicTacToe(size, mode)

