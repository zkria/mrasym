import BasePage from './base-page';

class Testimonials extends BasePage {
    onReady() {
        this.initTestimonialsFilter();
    }

    initTestimonialsFilter() {
        // Sort Testimonials
        app.on('change', '#testimonials-filter', event => {
            window.location.href = salla.helpers.addParamToUrl('sort', event.target.value);
        });

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('sort')) {
            app.element('#testimonials-filter').value = urlParams.get('sort');
        }
    }
}

Testimonials.initiateWhenReady(['store.testimonials']);
