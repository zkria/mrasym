import BasePage from './base-page';
import MobileMenu from 'mmenu-light';

class Products extends BasePage {
    onReady() {
        const productsList = app.element('salla-products-list');
        const urlParams = new URLSearchParams(window.location.search);

        // Set Sort
        if (urlParams.has('sort')) {
            app.element('#product-filter').value = urlParams.get('sort');
        }

        // Sort Products
        app.on('change', '#product-filter', async event => {
            const sortValue = event.currentTarget.value;
            window.history.replaceState(null, null, salla.helpers.addParamToUrl('sort', sortValue));
            productsList.sortBy = sortValue;
            await productsList.reload();
            productsList.setAttribute('filters', `{"sort": "${sortValue}"}`);
        });

        salla.event.once('salla-products-list::products.fetched', res => {
            if (res.title) {
                app.element('#page-main-title').innerHTML = res.title;
            }
        });

        this.initiateMobileMenu();
    }

    initiateMobileMenu() {
        const filters = app.element("#filters-menu");
        const trigger = app.element("a[href='#filters-menu']");
        const close = app.element("button.close-filters");

        if (!filters) return;

        const menu = new MobileMenu(filters, "(max-width: 1024px)", "( slidingSubmenus: false )");
        const drawer = menu.offcanvas({ position: salla.config.get('theme.is_rtl') ? "right" : 'left' });

        app.onClick(trigger, event => {
            event.preventDefault();
            drawer.open();
        });

        app.onClick(close, event => {
            event.preventDefault();
            drawer.close();
        });
    }
}

Products.initiateWhenReady(['products.index']);
