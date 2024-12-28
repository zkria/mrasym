import AnimeJS from 'animejs';

window.anime = AnimeJS;

class Anime {
    constructor(selector, options = {}) {
        this.defaultOptions = {
            targets: selector,
            opacity: [0, 1],
            delay: (el, i) => i * 100,
            duration: 2000,
            loop: false,
            complete: null,
            start: null,
        };
        this.options = { ...this.defaultOptions, ...options };
    }

    /**
     * @param {object} options
     * @return {Anime}
     */
    setOptions(options) {
        if (options && typeof options === 'object') {
            this.options = { ...this.options, ...options };
        }
        return this;
    }

    /**
     * @param {string} key
     * @param {*} value
     * @return {Anime}
     */
    set(key, value) {
        this.options[key] = value;
        return this;
    }

    /**
     * إعادة تعيين الخيارات إلى القيم الافتراضية
     * @return {Anime}
     */
    reset() {
        this.options = { ...this.defaultOptions, targets: this.options.targets };
        return this;
    }

    /**
     * @param {number} number
     * @return {Anime}
     */
    stagger(number) {
        this.set('delay', AnimeJS.stagger(number));
        return this;
    }

    /**
     * تشغيل الرسوم المتحركة مع خيارات إضافية
     * @param {object} additionalOptions
     * @return {AnimeJS}
     */
    play(additionalOptions = {}) {
        if (!this.validateTargets()) {
            console.error('No matching elements found for the selector:', this.options.targets);
            return;
        }
        const combinedOptions = { ...this.options, ...additionalOptions };

        // تنفيذ دالة البدء إذا كانت موجودة
        if (typeof combinedOptions.start === 'function') {
            combinedOptions.start();
        }

        const animation = AnimeJS(combinedOptions);
        
        // تنفيذ دالة الإكمال إذا كانت موجودة
        if (typeof combinedOptions.complete === 'function') {
            animation.finished.then(combinedOptions.complete);
        }
        
        return animation;
    }

    /**
     * إيقاف الرسوم المتحركة
     * @return {void}
     */
    stop() {
        AnimeJS.remove(this.options.targets);
    }

    /**
     * إيقاف الرسوم المتحركة مؤقتًا
     * @return {void}
     */
    pause() {
        console.warn('Pause functionality is not directly supported. Use stop() to remove animations.');
    }

    /**
     * التحقق من وجود عناصر مطابقة
     * @return {boolean}
     */
    validateTargets() {
        const targets = document.querySelectorAll(this.options.targets);
        return targets.length > 0;
    }
}

export default Anime;
