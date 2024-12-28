import BasePage from './base-page'; // استيراد الفئة الأساسية للصفحات
import MobileMenu from 'mmenu-light'; // استيراد مكتبة القائمة الجوالة

class Products extends BasePage {
    onReady() {
        let productsList = app.element('salla-products-list'), // الحصول على قائمة المنتجات
            urlParams = new URLSearchParams(window.location.search); // الحصول على معلمات URL

        // تعيين الفرز
        if (urlParams.has('sort')) {
            app.element('#product-filter').value = urlParams.get('sort'); // تعيين قيمة فلتر المنتجات بناءً على معلمات URL
        }

        // فرز المنتجات
        app.on('change', '#product-filter', async event => {
            window.history.replaceState(null, null, salla.helpers.addParamToUrl('sort', event.currentTarget.value)); // تحديث عنوان URL مع معلمة الفرز
            productsList.sortBy = event.currentTarget.value; // تعيين طريقة الفرز
            await productsList.reload(); // إعادة تحميل قائمة المنتجات
            productsList.setAttribute('filters', `{"sort": "${event.currentTarget.value}"}`); // تعيين الفلاتر في قائمة المنتجات
        });

        // حدث عند جلب المنتجات
        salla.event.once('salla-products-list::products.fetched', res => {
            res.title && (app.element('#page-main-title').innerHTML = res.title); // تعيين عنوان الصفحة إذا كان موجودًا
        });

        this.initiateMobileMenu(); // تهيئة القائمة الجوالة
    }

    initiateMobileMenu() {
        let filters = app.element("#filters-menu"), // الحصول على عنصر قائمة الفلاتر
            trigger = app.element("a[href='#filters-menu']"), // الحصول على زر تفعيل القائمة
            close = app.element("button.close-filters"); // الحصول على زر إغلاق القائمة

        if (!filters) {
            return; // إذا لم يكن هناك فلاتر، لا تفعل شيئًا
        }
        filters = new MobileMenu(filters, "(max-width: 1024px)", "( slidingSubmenus: false)"); // تهيئة القائمة الجوالة
        const drawer = filters.offcanvas({ position: salla.config.get('theme.is_rtl') ? "right" : 'left' }); // تعيين موضع القائمة

        // إضافة حدث عند النقر على زر تفعيل القائمة
        trigger.addEventListener('click', event => {
            document.body.classList.add('filters-opened'); // إضافة فئة لفتح الفلاتر
            event.preventDefault() || drawer.close() || drawer.open(); // فتح القائمة
        });

        // إضافة حدث عند النقر على زر إغلاق القائمة
        close.addEventListener('click', event => {
            document.body.classList.remove('filters-opened'); // إزالة فئة الفلاتر المفتوحة
            event.preventDefault() || drawer.close(); // إغلاق القائمة
        });

        // حدث عند تغيير الفلاتر
        salla.event.on('salla-filters::changed', filters => {
            if (!Object.entries(filters).length) {
                return; // إذا لم يكن هناك فلاتر، لا تفعل شيئًا
            }
            document.body.classList.remove('filters-opened'); // إزالة فئة الفلاتر المفتوحة
            drawer.close(); // إغلاق القائمة
        });
    }
}

Products.initiateWhenReady([ // تهيئة الفئة عند جاهزية الصفحة، مع تحديد الصفحات المسموح بها
    'product.index',
    'product.index.latest',
    'product.index.offers', 
    'product.index.search',
    'product.index.tag',
]);
