class NavigationMenu extends HTMLElement {
    connectedCallback() {
        salla.onReady()
            .then(() => salla.lang.onLoaded())
            .then(() => {
                this.menus = [];
                this.displayAllText = salla.lang.get('blocks.home.display_all');
                /**
                * تجنب حفظ القائمة في localStorage (افتراضي) عند وجود بيئة تطوير
                * أو عند تعديل الثيم في لوحة التحكم
                */
                const isPreview = salla.config.isDebug();
                const cacheKey = `menus_${salla.lang.locale}`;
                const cachedMenus = salla.storage.getWithTTL(cacheKey, []);

                if (cachedMenus.length > 0 && !isPreview) {
                    this.menus = cachedMenus;
                    return this.render();
                }

                return salla.api.component.getMenus()
                .then(({ data }) => {
                    this.menus = data;
                    !isPreview && salla.storage.setWithTTL(cacheKey, this.menus);
                    return this.render();
                }).catch((error) => salla.logger.error('salla-menu::Error fetching menus', error));
            });
    }

    /** 
    * التحقق مما إذا كانت القائمة تحتوي على عناصر فرعية
    * @param {Object} menu - كائن القائمة
    * @returns {Boolean} - إذا كانت القائمة تحتوي على عناصر فرعية
    */
    hasChildren(menu) {
        return menu?.children?.length > 0;
    }

    /**
    * التحقق مما إذا كانت القائمة تحتوي على منتجات
    * @param {Object} menu - كائن القائمة
    * @returns {Boolean} - إذا كانت القائمة تحتوي على منتجات
    */
    hasProducts(menu) {
        return menu?.products?.length > 0;
    }

    /**
    * الحصول على الفئات لقائمة سطح المكتب
    * @param {Object} menu - كائن القائمة
    * @param {Boolean} isRootMenu - إذا كانت القائمة هي القائمة الجذرية
    * @returns {String} - الفئات المناسبة لقائمة سطح المكتب
    */
    getDesktopClasses(menu, isRootMenu) {
        return `!hidden lg:!block ${isRootMenu ? 'root-level lg:!inline-block' : 'relative'} ${menu.products ? ' mega-menu' : ''}
        ${this.hasChildren(menu) ? ' has-children' : ''}`;
    }

    /**
    * الحصول على قائمة الجوال
    * @param {Object} menu - كائن القائمة
    * @param {String} displayAllText - نص عرض جميع العناصر
    * @returns {String} - كود HTML لقائمة الجوال
    */
    getMobileMenu(menu, displayAllText) {
        const menuImage = menu.image ? `<img src="${menu.image}" class="rounded-full" width="48" height="48" alt="${menu.title}" />` : '';

        return `
        <li class="lg:hidden text-sm font-bold" ${menu.attrs}>
            ${!this.hasChildren(menu) ? `
                <a href="${menu.url}" aria-label="${menu.title || 'category'}" class="text-gray-500 ${menu.image ? '!py-3' : ''}" ${menu.link_attrs}>
                    ${menuImage}
                    <span>${menu.title || ''}</span>
                </a>` :
                `
                <span class="${menu.image ? '!py-3' : ''}">
                    ${menuImage}
                    ${menu.title}
                </span>
                <ul>
                    <li class="text-sm font-bold">
                        <a href="${menu.url}" class="text-gray-500">${displayAllText}</a>
                    </li>
                    ${menu.children.map((subMenu) => this.getMobileMenu(subMenu, displayAllText)).join('')}
                </ul>
            `}
        </li>`;
    }

    /**
    * الحصول على قائمة سطح المكتب
    * @param {Object} menu - كائن القائمة
    * @param {Boolean} isRootMenu - إذا كانت القائمة هي القائمة الجذرية
    * @returns {String} - كود HTML لقائمة سطح المكتب
    */
    getDesktopMenu(menu, isRootMenu) {
        return `
        <li class="${this.getDesktopClasses(menu, isRootMenu)}" ${menu.attrs}>
            <a href="${menu.url}" aria-label="${menu.title || 'category'}" ${menu.link_attrs}>
                <span>${menu.title}</span>
            </a>
            ${this.hasChildren(menu) ? `
                <div class="sub-menu ${this.hasProducts(menu) ? 'w-full left-0 flex' : 'w-56'}">
                    <ul class="${this.hasProducts(menu) ? 'w-56 shrink-0 m-8 rtl:ml-0 ltr:mr-0' : ''}">
                        ${menu.children.map((subMenu) => this.getDesktopMenu(subMenu, false)).join('\n')}
                    </ul>
                    ${this.hasProducts(menu) ? `
                    <salla-products-list
                    source="selected"
                    shadow-on-hover
                    source-value="[${menu.products}]" />` : ''}
                </div>` : ''}
        </li>`;
    }

    /**
    * الحصول على القوائم
    * @returns {String} - كود HTML لجميع القوائم
    */
    getMenus() {
        return this.menus.map((menu) => `
            ${this.getMobileMenu(menu, this.displayAllText)}
            ${this.getDesktopMenu(menu, true)}
        `).join('\n');
    }

    /**
    * عرض قائمة الرأس
    */
    render() {
        this.innerHTML =  `
        <nav id="mobile-menu" class="mobile-menu">
            <ul class="main-menu">${this.getMenus()}</ul>
            <button class="btn--close close-mobile-menu sicon-cancel lg:hidden"></button>
        </nav>
        <button class="btn--close-sm close-mobile-menu sicon-cancel hidden"></button>`;
    }
}

customElements.define('custom-main-menu', NavigationMenu);
