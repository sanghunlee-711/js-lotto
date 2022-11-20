import {
  ALERT,
  DEFAULT_LOTTO_STATE,
  MAX_LOTTO_PRICE,
  MIN_LOTTO_PRICE,
} from '../constants.js';
import { makeLottoNumbers } from '../utils/index.js';

class Lotto {
  constructor({ $target }) {
    this.$target = $target;
    this.$resultWrapper = $target.querySelector('#purchased-result');
    this.$checkWrapper = $target.querySelector('#check-result');
    this.$modal = $target.querySelector('.modal');
    this.$numberInput = $target.querySelector('[data-id=lotto-number-input]');
    this.$submitButton = $target.querySelector('[data-id=lotto-submit-button]');
    this.$winningNumbers = $target.querySelectorAll('.winning-number');

    this.state = {
      ...DEFAULT_LOTTO_STATE,
    };

    this.initialize();
  }

  setState(nextState) {
    console.log({ nextState });
    this.state = nextState;
    this.render();
  }

  onConfirm() {
    const isOverPirce = this.state.moneyAmount > MAX_LOTTO_PRICE;
    const isConfirm =
      this.state.moneyAmount >= MIN_LOTTO_PRICE &&
      this.state.moneyAmount <= MAX_LOTTO_PRICE;
    const isAlert = this.state.moneyAmount % MIN_LOTTO_PRICE !== 0;

    if (isOverPirce) {
      window.alert(ALERT.OVER_MAX_VALUE);
      this.setState({ ...this.state, moneyAmount: null });
      return;
    }

    if (isAlert) {
      window.alert(ALERT.TYPE_THOUSAND_UNIT);
      this.setState({ ...this.state, moneyAmount: null });
      return;
    }

    if (isConfirm) {
      const randomNumbers = makeLottoNumbers(this.state.moneyAmount);

      this.setState({
        ...this.state,
        lottoPurchaseNumber: this.state.moneyAmount / MIN_LOTTO_PRICE,
        randomNumbers,
        isVisibleResult: true,
      });
    }
  }

  onEnter(event) {
    event.preventDefault();
    this.onConfirm();
  }

  onTypeAmount(value) {
    if (!Number.isInteger(Number(value))) return;
    this.setState({ ...this.state, moneyAmount: Number(value) });
  }

  onToggle() {
    this.setState({ ...this.state, isToggle: !this.state.isToggle });
  }

  onModalShow({ isVisibleModal }) {
    this.setState({ ...this.state, isVisibleModal });
  }
  onTypeWinning({ value, index }) {
    this.setState({
      ...this.state,
      winningNumbers: this.state.winningNumbers.map((el, originIndex) =>
        index === originIndex ? value : el
      ),
    });
  }

  renderModal() {
    if (this.state.isVisibleModal) {
      this.$modal.classList.add('open');
    }

    if (!this.state.isVisibleModal) {
      this.$modal.classList.remove('open');
    }
  }

  renderToggle() {
    this.$target
      .querySelectorAll('.lotto-number')
      .forEach(
        (element) =>
          (element.style.display = this.state.isToggle ? 'inline' : 'none')
      );
  }

  renderResult() {
    if (!this.state.isVisibleResult) {
      this.$resultWrapper.style.display = 'none';
      return;
    }

    this.$resultWrapper.querySelector(
      '[data-id=result-text]'
    ).innerText = `총 ${this.state.lottoPurchaseNumber}개를 구매하였습니다.`;

    this.$resultWrapper.querySelector(
      '[data-id=lotto-image-wrapper]'
    ).innerHTML = `
      ${this.state.randomNumbers
        .map((randomNumber) => {
          return `
            <li class="lotto-list">
              <span class="mx-1 text-4xl" data-id="lotto-image">🎟️</span>
              <span class="lotto-number" data-id="lotto-number">
                ${randomNumber.join(' ')}
              </span>
            </li>
        `;
        })
        .join('')}
    `;
    if (this.$resultWrapper.style.display !== 'block') {
      this.$resultWrapper.style.display = 'block';
    }
  }

  renderCheckResultForm() {
    if (!this.state.isVisibleResult) {
      this.$checkWrapper.style.display = 'none';
      return;
    }

    if (this.$checkWrapper.style.display !== 'block') {
      this.$checkWrapper.style.display = 'block';
    }
  }

  renderInput() {
    const isBlank =
      this.state.moneyAmount === 0 || this.state.moneyAmount === null;

    if (isBlank) {
      this.$numberInput.value = null;
    }

    if (!isBlank) {
      this.$numberInput.value = this.state.moneyAmount;
    }
  }

  renderButton() {
    const isBlank =
      this.state.moneyAmount === 0 || this.state.moneyAmount === null;

    if (isBlank) this.$submitButton.setAttribute('disabled', '');
    if (!isBlank) this.$submitButton.removeAttribute('disabled');
  }

  render() {
    this.renderResult();
    this.renderCheckResultForm();
    this.renderToggle();
    this.renderInput();
    this.renderButton();
    this.renderModal();
  }

  addEventListener() {
    this.$target.addEventListener('click', (event) => {
      if (event.target.dataset.id === 'lotto-submit-button') {
        this.onConfirm();
      }

      if (event.target.dataset.id === 'number-toggle-button') {
        this.onToggle();
      }
      if (event.target.dataset.id === 'open-result-modal-button') {
        this.onModalShow({ isVisibleModal: true });
      }

      if (event.target.dataset.id === 'modal-close-button') {
        this.onModalShow({ isVisibleModal: false });
      }
    });

    this.$target.addEventListener('input', (event) => {
      if (event.target.dataset.id === 'lotto-number-input') {
        this.onTypeAmount(event.target.value);
      }
    });

    this.$target.addEventListener('keydown', (event) => {
      if (
        event.target.dataset.id === 'lotto-number-input' &&
        event.key === 'Enter'
      ) {
        this.onEnter(event);
      }
    });

    Array.from(this.$target.getElementsByClassName('winning-number')).forEach(
      (eachInput, winningNumbersIndex) => {
        eachInput.addEventListener('focusout', (event) => {
          this.onTypeWinning({
            value: event.target.value,
            index: winningNumbersIndex,
          });
        });
      }
    );

    this.$target.addEventListener('focusout', (event) => {
      if (event.target.classList.contains('bonus-number')) {
        const BONUS_NUMBER_STATE_INDEX = 6;
        this.onTypeWinning({
          value: event.target.value,
          index: BONUS_NUMBER_STATE_INDEX,
        });
      }
    });
  }

  initialize() {
    this.render();
    this.addEventListener();
  }
}

export default Lotto;
