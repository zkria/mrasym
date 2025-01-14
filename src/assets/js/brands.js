import BasePage from './base-page';

class Brands extends BasePage {
    onReady() {
        // تعيين الارتفاع الابتدائي للقائمة
        const nav = document.querySelector('#brands-nav'),
              navWrap = document.querySelector('.brands-nav-wrap');
        navWrap.style.height = nav.clientHeight + 'px'; // تعيين ارتفاع العنصر المغلف

        // إضافة حدث عند النقر على عناصر القائمة
        app.onClick('.brands-nav__item', ({target:btn}) => {
            app.all('.brands-nav__item', el => 
                app.toggleElementClassIf(el, 'is-selected', 'unselected', () => el == btn) // تبديل الفئات بناءً على العنصر المحدد
            );
        });

        // إضافة حدث عند التمرير لتغيير حالة القائمة
        window.addEventListener('scroll', () => {
            let scrolAtTop = window.pageYOffset <= 200; // التحقق مما إذا كان التمرير في الأعلى
            app.toggleClassIf('#brands-nav', 'is-not-sticky', 'is-sticky', () => scrolAtTop); // تبديل الفئات بناءً على موضع التمرير
        });
    }
}

// تهيئة الفئة عند جاهزية الصفحة، مع تحديد الصفحات المسموح بها
Brands.initiateWhenReady(['brands.index']);
