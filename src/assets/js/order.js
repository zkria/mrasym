import BasePage from './base-page'; // استيراد الفئة الأساسية للصفحات

class Order extends BasePage {
    onReady() {
        // إضافة حدث عند النقر على زر إعادة الطلب
        app.onClick('salla-button#btn-reorder', ({currentTarget: btn}) => 
            btn.load() // بدء تحميل الزر
                .then(() => salla.order.createCartFromOrder()) // إنشاء سلة جديدة من الطلب
                .then(() => btn.stop()) // إيقاف تحميل الزر
                .then(() => app.element('#reorder-modal').hide()) // إخفاء نافذة إعادة الطلب
        );

        // إضافة حدث عند النقر على زر تأكيد الإلغاء
        app.onClick('salla-button#confirm-cancel', ({currentTarget: btn}) => 
            btn.load() // بدء تحميل الزر
                .then(() => salla.order.cancel()) // إلغاء الطلب
                .then(() => btn.stop() && app.element('#modal-order-cancel').hide()) // إيقاف تحميل الزر وإخفاء نافذة إلغاء الطلب
                .then(() => window.location.reload()) // إعادة تحميل الصفحة
                .catch(() => btn.stop() && app.element('#modal-order-cancel').hide()) // في حالة حدوث خطأ، إيقاف تحميل الزر وإخفاء نافذة إلغاء الطلب
        );
    }
}

Order.initiateWhenReady(['customer.orders.single']); // تهيئة الفئة عند جاهزية الصفحة، مع تحديد الصفحات المسموح بها
