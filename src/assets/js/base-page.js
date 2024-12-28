class BasePage {
  constructor() {}

  onReady() {
    // يمكن تجاوز هذه الدالة في الصفحات الفرعية
  }

  registerEvents() {
    // يمكن تجاوز هذه الدالة في الصفحات الفرعية
  }

  /**
   * لتجنب تحميل الفئات غير المرغوب فيها، إلا إذا كانت الصفحة المطلوبة
   * @param {null|string[]} allowedPages
   * @return {void}
   */
  initiate(allowedPages) {
    const currentPage = salla.config.get('page.slug');
    if (allowedPages && !allowedPages.includes(currentPage)) {
      return app.log(`The Class For (${allowedPages.join(',')}) Skipped.`);
    }

    this.onReady();
    this.registerEvents();
    app.log(`The Class For (${allowedPages?.join(',') || '*'}) Loaded🎉`);
  }

  /**
   * لأننا دمجنا عدة فئات في ملف واحد، لا حاجة لبدء جميعها
   * @param {null|string[]} allowedPages
   * @return {void}
   */
  static initiateWhenReady(allowedPages = null) {
    const initiateClass = () => (new this()).initiate(allowedPages);

    if (window.app?.status === 'ready') {
      initiateClass();
    } else {
      document.addEventListener('theme::ready', initiateClass);
    }
  }
}

export default BasePage;
