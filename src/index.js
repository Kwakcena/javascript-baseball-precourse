const USER_INPUT_LENGTH = 3;

export default class BaseballGame {
  constructor() {
    this.$result = document.getElementById('result');

    this.$userInput = document.getElementById('user-input');
    this.$userInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        this.handleClickSubmit();
      }
    });

    this.$submit = document.getElementById('submit');
    this.$submit.addEventListener('click', this.handleClickSubmit);

    this.computerInputNumbers = this.createComputerInputNumbers();
  }

  handleClickRestartGame = () => {
    this.computerInputNumbers = this.createComputerInputNumbers();
    this.$userInput.value = '';
    this.$result.innerHTML = '';
  }

  createComputerInputNumbers = () => {
    const _numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let _computerNumbers = '';
    while (_computerNumbers.length !== USER_INPUT_LENGTH) {
      const randomIndex = Math.floor(Math.random() * _numbers.length);
      _computerNumbers += _numbers[randomIndex];
      _numbers.splice(randomIndex, 1);
    }

    return _computerNumbers;
  }

  handleClickSubmit = () => {
    const _userInputNumbers = this.$userInput.value;

    if (this.isPossible(_userInputNumbers)) {
      this.play(this.computerInputNumbers, _userInputNumbers);
      this.$userInput.select();
      return;
    }
    return this.randerErrorMessage('잘못된 입력입니다. 다시 입력해주세요');
  }

  isThreeDigitNumbers = (numbers) => {
    return /^[1-9]{3}$/g.test(numbers);
  }

  isNotDuplicate = (numbers) => {
    function compareNumberIndex(number) {
      return numbers.indexOf(number) === numbers.lastIndexOf(number);
    }
    return numbers.split('').every(compareNumberIndex);
  }

  isPossible = (numbers) => {
    if (this.isThreeDigitNumbers(numbers) && this.isNotDuplicate(numbers)) {
      return true;
    }
    return false;
  }

  randerErrorMessage = (message) => {
    alert(message);
    this.$userInput.value = '';
    this.$userInput.focus();
  }

  getStrikeCount = (computerInputNumbers, userInputNumbers) => {
    function process(strikeCount, number, computerIndex) {
      const _userIndex = userInputNumbers.indexOf(number);
      if (_userIndex == computerIndex) {
        return strikeCount + 1;
      }
      return strikeCount;
    }
    return computerInputNumbers.split('').reduce(process, 0);
  }

  getBallCount = (computerInputNumbers, userInputNumbers) => {
    function process(ballCount, number, computerIndex) {
      const _userIndex = userInputNumbers.indexOf(number);
      if (_userIndex === -1 || _userIndex === computerIndex) {
        return ballCount;
      }
      return ballCount + 1;
    }
    return computerInputNumbers.split('').reduce(process, 0);
  }

  isCorrect = (strikeCount) => strikeCount === USER_INPUT_LENGTH;

  renderCorrectMessage = () => {
    this.$result.innerHTML = `
      <p>🎉 <strong>정답을 맞추셨습니다!</strong> 🎉</p>
      <p>
        게임을 새로 시작하시겠습니까?
        <button id="game-restart-button">게임 재시작</button>
      </p>
    `;

    const $gameRestartButton = document.querySelector('#game-restart-button');
    $gameRestartButton.addEventListener('click', this.handleClickRestartGame);
  }

  renderGameResult = (strike, ball) => {
    let _resultText = '';

    if (strike === 0 && ball === 0) {
      _resultText = '낫띵';
    }
    if (ball) {
      _resultText += `${ball}볼`;
    }
    if (strike) {
      _resultText += ` ${strike}스트라이크`;
    }

    this.$result.innerHTML = `<p>${_resultText}</p>`;
  }

  play = (computerInputNumbers, userInputNumbers) => {
    const _ballCount = this.getBallCount(computerInputNumbers, userInputNumbers);
    const _strikeCount = this.getStrikeCount(computerInputNumbers, userInputNumbers);

    return this.isCorrect(_strikeCount) ?
      this.renderCorrectMessage() :
      this.renderGameResult(_strikeCount, _ballCount);
  }
}

new BaseballGame();
