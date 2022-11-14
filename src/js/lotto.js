import { DEFAULT_LOTTO_STATE } from '../constant.js';
import { checkRandom, makeRandomNumbers } from '../utils/index.js';

class Lotto {
  constructor({ $target }) {
    this.$target = $target;
    this.state = {
      ...DEFAULT_LOTTO_STATE,
    };

    this.initialize();
  }

  onConfirm() {
    const IS_CONFIRM =
      this.state.moneyAmount >= 1000 && this.state.moneyAmount <= 100000;
    const IS_ALERT = this.state.moneyAmount % 1000 !== 0;

    if (IS_ALERT) {
      window.alert('로또 구입 금액을 1,000원 단위로 입력해 주세요.');
      this.setState({ ...this.state, moneyAmount: null });
      return;
    }

    if (IS_CONFIRM) {
      const RANDOM_NUMBERS = checkRandom(
        makeRandomNumbers(this.state.moneyAmount)
      );

      this.setState({
        ...this.state,
        lottoPurchaseNumber: this.state.moneyAmount / 1000,
        randomNumbers: RANDOM_NUMBERS,
        isVisibleResult: true,
      });
    }
  }

  onTypeAmount(value) {
    if (!Number.isInteger(Number(value))) return;
    this.setState({ ...this.state, moneyAmount: Number(value) });
  }

  onToggle() {
    this.setState({ ...this.state, isToggle: !this.state.isToggle });
  }

  setState(nextState) {
    this.state = nextState;
    this.render();
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
    const wrapper = this.$target.querySelector('#purchased-result');

    if (!this.state.isVisibleResult) {
      wrapper.style.display = 'none';
      return;
    }

    wrapper.querySelector(
      '[data-id=result-text]'
    ).innerText = `총 ${this.state.lottoPurchaseNumber}개를 구매하였습니다.`;

    wrapper.querySelector('[data-id=lotto-image-wrapper]').innerHTML = `
      ${this.state.randomNumbers
        .map((randomNumber) => {
          return `
            <li>
              <span class="mx-1 text-4xl" data-id="lotto-image">🎟️ </span>
              <span class="lotto-number" data-id="lotto-number">
                ${randomNumber.join(' ')}
              </span>
            </li>
        `;
        })
        .join('')}
    `;
    if (wrapper.style.display !== 'block') wrapper.style.display = 'block';
  }

  renderCheckResultForm() {
    const wrapper = this.$target.querySelector('#check-result');

    if (!this.state.isVisibleResult) {
      wrapper.style.display = 'none';
      return;
    }

    if (wrapper.style.display !== 'block') wrapper.style.display = 'block';
  }

  renderInput() {
    const IS_BLANK = this.state.moneyAmount === 0;

    this.$target.querySelector('[data-id=lotto-number-input]').value = IS_BLANK
      ? null
      : this.state.moneyAmount;
  }

  render() {
    this.renderResult();
    this.renderCheckResultForm();
    this.renderToggle();
    this.renderInput();
  }

  addEventListener() {
    this.$target.addEventListener('click', (event) => {
      if (event.target.dataset.id === 'lotto-submit-button') {
        this.onConfirm();
      }
    });

    this.$target
      .querySelector('[data-id=number-toggle-button]')
      .addEventListener('click', () => {
        this.onToggle();
      });

    this.$target.addEventListener('input', (event) => {
      if (event.target.dataset.id === 'lotto-number-input') {
        this.onTypeAmount(event.target.value);
      }
    });
  }

  initialize() {
    this.render();
    this.addEventListener();
  }
}

export default Lotto;
