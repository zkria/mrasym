import BasePage from './base-page';

class ThankYou extends BasePage {
    onReady() {
        this.animateThanksItems();
        this.handleInvoiceForm();
    }

    animateThanksItems() {
        app.anime('.thanks-item', { translateX: [20, 0] });
    }

    handleInvoiceForm() {
        const form = app.element('#invoice-form');
        if (!form) return;

        salla.order.event.onInvoiceSent(res => {
            form.innerHTML = res.data.message;
            form.classList.add('sent');
        });
    }
}

ThankYou.initiateWhenReady(['thank-you']);
