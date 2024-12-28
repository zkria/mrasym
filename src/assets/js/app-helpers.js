export default class AppHelpers {

  /**
   * تبديل الفئات بين العناصر بناءً على شرط معين.
   * @param {string} selector - محدد العناصر
   * @param {array<string>} classes1 - الفئات الأولى
   * @param {array<string>} classes2 - الفئات الثانية
   * @param callback - دالة شرطية تحدد أي الفئات يجب إضافتها
   */
  toggleClassIf(selector, classes1, classes2, callback) {
    document.querySelectorAll(selector).forEach(element => this.toggleElementClassIf(element, classes1, classes2, callback));
    return this;
  }

  /**
   * تبديل الفئات لعناصر معينة بناءً على شرط معين.
   * @param {HTMLElement} element - العنصر المستهدف
   * @param {array<string>} classes1 - الفئات الأولى
   * @param {array<string>} classes2 - الفئات الثانية
   * @param callback - دالة شرطية تحدد أي الفئات يجب إضافتها
   */
  toggleElementClassIf(element, classes1, classes2, callback) {
    classes1 = Array.isArray(classes1) ? classes1 : classes1.split(' ');
    classes2 = Array.isArray(classes2) ? classes2 : classes2.split(' ');
    let isClasses1 = callback(element);
    element?.classList.remove(...(isClasses1 ? classes2 : classes1));
    element?.classList.add(...(isClasses1 ? classes1 : classes2));
    return this;
  }

  /**
   * الحصول على العنصر بناءً على المحدد.
   * @param {string|HTMLElement} selector - المحدد أو العنصر
   * @return {null|HTMLElement} - العنصر المستهدف أو null
   */
  element(selector) {
    if (typeof selector == 'object') {
      return selector;
    }
    if (selector === '.total-price' || selector === '.before-price') {
      return document.querySelectorAll(selector);
    }
    return document.querySelector(selector);
  }

  /**
   * مراقبة عنصر معين وتخزينه في خاصية.
   * @param {string} name - اسم الخاصية
   * @param {string} selector - محدد العنصر
   * @return {Helpers} - كائن AppHelpers
   */
  watchElement(name, selector) {
    this[name] = this.element(selector);
    return this;
  }

  /**
   * مراقبة مجموعة من العناصر وتخزينها.
   * @param {Object.<string, string>} elements - كائن يحتوي على أسماء العناصر ومحدداتها
   */
  watchElements(elements) {
    Object.entries(elements).forEach(element => this.watchElement(element[0], element[1]));
    return this;
  }

  /**
   * إضافة حدث إلى عنصر معين.
   * @param {string} action - نوع الحدث (مثل 'click')
   * @param {string|HTMLElement} element - المحدد أو العنصر
   * @param {function} callback - دالة رد الفعل عند حدوث الحدث
   * @param {object|undefined} options - خيارات إضافية للحدث
   * @return {AppHelpers} - كائن AppHelpers
   */
  on(action, element, callback, options = {}) {
    if (typeof element == 'object') {
      this.element(element).addEventListener(action, callback, options);
      return this;
    }

    // إذا كان المحدد، يتم إضافة الحدث إلى جميع العناصر
    document.querySelectorAll(element).forEach(el => el.addEventListener(action, callback, options));
    return this;
  }

  /**
   * إضافة حدث click إلى عنصر معين.
   * @param {string|HTMLElement} element - المحدد أو العنصر
   * @param {function} callback - دالة رد الفعل عند حدوث الحدث
   * @return {AppHelpers} - كائن AppHelpers
   */
  onClick(element, callback) {
    return this.on('click', element, callback);
  }

  /**
   * إضافة حدث keyup إلى عنصر معين.
   * @param {string|HTMLElement} element - المحدد أو العنصر
   * @param {function} callback - دالة رد الفعل عند حدوث الحدث
   * @return {AppHelpers} - كائن AppHelpers
   */
  onKeyUp(element, callback) {
    return this.on('keyup', element, callback);
  }

  /**
   * تنفيذ دالة معينة على جميع العناصر المحددة.
   * @param {string|HTMLElement} element - المحدد أو العنصر
   * @param {function} callback - دالة يتم تنفيذها على كل عنصر
   * @return {AppHelpers} - كائن AppHelpers
   */
  all(element, callback) {
    document.querySelectorAll(element).forEach(callback);
    return this;
  }

  /**
   * إخفاء عنصر معين.
   * @param {string|HTMLElement} element - المحدد أو العنصر
   * @return {AppHelpers} - كائن AppHelpers
   */
  hideElement(element) {
    this.element(element).style.display = 'none';
    return this;
  }

  /**
   * إظهار عنصر معين.
   * @param {string|HTMLElement} element - المحدد أو العنصر
   * @param {string} display - نوع العرض (افتراضي هو 'block')
   * @return {AppHelpers} - كائن AppHelpers
   */
  showElement(element, display = 'block') {
    this.element(element).style.display = display;
    return this;
  }

  /**
   * 💡 يمكنك تمرير عدة فئات: this.removeClass(element, 'class_1', 'class_2', ...)
   * @param {string|HTMLElement} element - المحدد أو العنصر
   * @param {string} className - اسم الفئة
   * @return {AppHelpers} - كائن AppHelpers
   */
  removeClass(element, className) {
    this.element(element).classList.remove(...Array.from(arguments).slice(1));
    return this;
  }

  /**
   * 💡 يمكنك تمرير عدة فئات: this.addClass(element, 'class_1', 'class_2', ...)
   * @param {string|HTMLElement} element - المحدد أو العنصر
   * @param {string} className - اسم الفئة
   * @return {AppHelpers} - كائن AppHelpers
   */
  addClass(element, className) {
    this.element(element).classList.add(...Array.from(arguments).slice(1));
    return this;
  }
}