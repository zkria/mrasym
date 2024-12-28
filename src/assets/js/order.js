import BasePage from './base-page';

class Order extends BasePage {
    onReady() {
        this.initReorderButton();
        this.initCancelOrderButton();
    }

    initReorderButton() {
        app.onClick('salla-button#btn-reorder', async ({ currentTarget: btn }) => {
            try {
                await btn.load();
                await salla.order.createCartFromOrder();
                btn.stop();
                app.element('#reorder-modal').hide();
            } catch (error) {
                btn.stop();
                console.error('Error reordering:', error);
            }
        });
    }

    initCancelOrderButton() {
        app.onClick('salla-button#confirm-cancel', async ({ currentTarget: btn }) => {
            try {
                await btn.load();
                await salla.order.cancel();
                btn.stop();
                app.element('#modal-order-cancel').hide();
                window.location.reload();
            } catch (error) {
                btn.stop();
                app.element('#modal-order-cancel').hide();
                console.error('Error cancelling order:', error);
            }
        });
    }
}

Order.initiateWhenReady(['customer.orders.single']);
