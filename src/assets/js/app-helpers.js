export default class AppHelpers {

  /**
   * @param {string} selector
   * @param {array<string>} classes1
   * @param {array<string>} classes2
   * @param {function} callback
   * @return {AppHelpers}
   */
  toggleClassIf(selector, classes1, classes2, callback) {
    document.querySelectorAll(selector).forEach(element => this.toggleElementClassIf(element, classes1, classes2, callback));
    return this;
  }

  /**
   * @param {HTMLElement} element
   * @param {array<string>} classes1
   * @param {array<string>} classes2
   * @param {function} callback
   * @return {AppHelpers}
   */
  toggleElementClassIf(element, classes1, classes2, callback) {
    classes1 = Array.isArray(classes1) ? classes1 : classes1.split(' ');
    classes2 = Array.isArray(classes2) ? classes2 : classes2.split(' ');
    const isClasses1 = callback(element);
    element.classList.remove(...(isClasses1 ? classes2 : classes1));
    element.classList.add(...(isClasses1 ? classes1 : classes2));
    return this;
  }

  /**
   * @param {string|HTMLElement} selector
   * @return {null|HTMLElement|NodeList}
   */
  element(selector) {
    if (typeof selector === 'object') {
      return selector;
    }
    if (selector === '.total-price' || selector === '.before-price') {
      return document.querySelectorAll(selector);
    }
    return document.querySelector(selector);
  }

  /**
   * @param {string} name
   * @param {string} selector
   * @return {AppHelpers}
   */
  watchElement(name, selector) {
    this[name] = this.element(selector);
    return this;
  }

  /**
   * @param {Object.<string, string>} elements
   * @return {AppHelpers}
   */
  watchElements(elements) {
    Object.entries(elements).forEach(([name, selector]) => this.watchElement(name, selector));
    return this;
  }

  /**
   * @param {string} action
   * @param {string|HTMLElement} element
   * @param {function} callback
   * @param {object} [options={}]
   * @return {AppHelpers}
   */
  on(action, element, callback, options = {}) {
    const elements = typeof element === 'object' ? [this.element(element)] : document.querySelectorAll(element);
    elements.forEach(el => el.addEventListener(action, callback, options));
    return this;
  }

  /**
   * @param {string|HTMLElement} element
   * @param {function} callback
   * @return {AppHelpers}
   */
  onClick(element, callback) {
    return this.on('click', element, callback);
  }

  /**
   * @param {string|HTMLElement} element
   * @param {function} callback
   * @return {AppHelpers}
   */
  onKeyUp(element, callback) {
    return this.on('keyup', element, callback);
  }

  /**
   * @param {string|HTMLElement} element
   * @param {function} callback
   * @return {AppHelpers}
   */
  all(element, callback) {
    document.querySelectorAll(element).forEach(callback);
    return this;
  }

  /**
   * @param {string|HTMLElement} element
   * @return {AppHelpers}
   */
  hideElement(element) {
    this.element(element).style.display = 'none';
    return this;
  }

  /**
   * @param {string|HTMLElement} element
   * @param {string} [display='block']
   * @return {AppHelpers}
   */
  showElement(element, display = 'block') {
    this.element(element).style.display = display;
    return this;
  }

  /**
   * 💡 you can pass multi classes: this.removeClass(element, 'class_1', 'class_2', ...)
   * @param {string|HTMLElement} element
   * @param {...string} classNames
   * @return {AppHelpers}
   */
  removeClass(element, ...classNames) {
    this.element(element).classList.remove(...classNames);
    return this;
  }

  /**
   * 💡 you can pass multi classes: this.addClass(element, 'class_1', 'class_2', ...)
   * @param {string|HTMLElement} element
   * @param {...string} classNames
   * @return {AppHelpers}
   */
  addClass(element, ...classNames) {
    this.element(element).classList.add(...classNames);
    return this;
  }

  /**
   * @param {string|HTMLElement} element
   * @param {string} attribute
   * @param {string} value
   * @return {AppHelpers}
   */
  setAttribute(element, attribute, value) {
    this.element(element).setAttribute(attribute, value);
    return this;
  }

  /**
   * @param {string|HTMLElement} element
   * @param {string} attribute
   * @return {string}
   */
  getAttribute(element, attribute) {
    return this.element(element).getAttribute(attribute);
  }

  /**
   * @param {string|HTMLElement} element
   * @param {string} attribute
   * @return {AppHelpers}
   */
  removeAttribute(element, attribute) {
    this.element(element).removeAttribute(attribute);
    return this;
  }
}