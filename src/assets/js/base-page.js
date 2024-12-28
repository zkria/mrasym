class BasePage {
  constructor() {
    // تهيئة الكائن
  }

  onReady() {
    // دالة يتم استدعاؤها عند جاهزية الصفحة
  }

  registerEvents() {
    // دالة لتسجيل الأحداث
  }

  /**
   * لتجنب تحميل الفئات غير المرغوب فيها، ما لم تكن الصفحة المطلوبة
   * @param {null|string[]} allowedPages - الصفحات المسموح بها
   * @return {*}
   */
  initiate(allowedPages) {
    if (allowedPages && !allowedPages.includes(salla.config.get('page.slug'))) {
      return app.log(`تم تخطي الفئة للصفحات (${allowedPages.join(',')}).`); // تسجيل تخطي الفئة
    }

    this.onReady(); // استدعاء دالة onReady
    this.registerEvents(); // تسجيل الأحداث
    app.log(`تم تحميل الفئة للصفحات (${allowedPages?.join(',') || '*'}) 🎉`); // تسجيل تحميل الفئة
  };
}

/**
 * نظرًا لأننا دمجنا عدة فئات في ملف واحد، فلا حاجة لتهيئة جميعها
 */
BasePage.initiateWhenReady = function (allowedPages = null) {
  if (window.app?.status === 'ready') {
    (new this).initiate(allowedPages); // تهيئة الفئة إذا كانت جاهزة
  } else {
    document.addEventListener('theme::ready', () => (new this).initiate(allowedPages)); // تسجيل حدث عند جاهزية الثيم
  }
}

export default BasePage; // تصدير الفئة
