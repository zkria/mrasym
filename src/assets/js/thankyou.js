import BasePage from './base-page'; // استيراد الفئة الأساسية للصفحات

class ThankYou extends BasePage {
    onReady() {
        // إضافة تأثير الرسوم المتحركة لعناصر الشكر
        app.anime('.thanks-item', {translateX: [20, 0]}); // تحريك العناصر من اليمين إلى موضعها الأصلي

        let form = document.querySelector('#invoice-form'); // الحصول على نموذج الفاتورة
        // حدث عند إرسال الفاتورة
        salla.order.event.onInvoiceSent(res => {
            form.innerHTML = res.data.message; // تحديث محتوى النموذج برسالة الفاتورة
            form.classList.add('sent'); // إضافة فئة "تم الإرسال" للنموذج
        });
    }
}

ThankYou.initiateWhenReady(['thank-you']); // تهيئة الفئة عند جاهزية الصفحة، مع تحديد الصفحات المسموح بها
