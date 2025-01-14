import BasePage from './base-page'; // استيراد الفئة الأساسية للصفحات

class Testimonials extends BasePage {
    onReady() {
        // فرز الشهادات
        app.on('change', '#testimonials-filter', event => 
            window.location.href = salla.helpers.addParamToUrl('sort', event.target.value) // تحديث عنوان URL مع معلمة الفرز
        );
        
        let urlParams = new URLSearchParams(window.location.search); // الحصول على معلمات URL
        if (urlParams.has('sort')) {
            app.element('#testimonials-filter').value = urlParams.get('sort'); // تعيين قيمة فلتر الشهادات بناءً على معلمات URL
        }
    }
}

Testimonials.initiateWhenReady(['store.testimonials']); // تهيئة الفئة عند جاهزية الصفحة، مع تحديد الصفحات المسموح بها
