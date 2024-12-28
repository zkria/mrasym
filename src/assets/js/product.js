import 'lite-youtube-embed'; // استيراد مكتبة لتضمين فيديوهات يوتيوب
import BasePage from './base-page'; // استيراد الفئة الأساسية للصفحات
import Fslightbox from 'fslightbox'; // استيراد مكتبة Fslightbox للعرض التفاعلي
window.fslightbox = Fslightbox; // تعيين مكتبة Fslightbox في نافذة المتصفح
import { zoom } from './partials/image-zoom'; // استيراد دالة التكبير من ملف الصورة

class Product extends BasePage {
    onReady() {
        // مراقبة العناصر المهمة في الصفحة
        app.watchElements({
            totalPrice: '.total-price', // عنصر السعر الإجمالي
            beforePrice: '.before-price', // عنصر السعر السابق
            startingPriceTitle: '.starting-price-title', // عنوان السعر الابتدائي
        });

        this.initProductOptionValidations(); // تهيئة التحقق من خيارات المنتج

        if(imageZoom){
            // استدعاء الدالة عند جاهزية الصفحة
            this.initImagesZooming(); // تهيئة التكبير للصور
            // الاستماع لتغيير حجم الشاشة
            window.addEventListener('resize', () => this.initImagesZooming()); // إعادة تهيئة التكبير عند تغيير حجم الشاشة
        }
    }

    initProductOptionValidations() {
      // إضافة حدث عند تغيير خيارات المنتج
      document.querySelector('.product-form')?.addEventListener('change', function(){
        this.reportValidity() && salla.product.getPrice(new FormData(this)); // التحقق من صحة النموذج والحصول على السعر
      });
    }

    initImagesZooming() {
      // تخطي إذا كانت الشاشة ليست بحجم سطح المكتب أو إذا تم إنشاء مكبر الزجاج مسبقًا
      const imageZoom = document.querySelector('.image-slider .magnify-wrapper.swiper-slide-active .img-magnifier-glass');
      if (window.innerWidth < 1024 || imageZoom) return; // إذا كانت الشاشة صغيرة أو تم إنشاء المكبر، لا تفعل شيئًا
      setTimeout(() => {
          // تعيين تأخير بعد الانتهاء من تغيير الحجم، وبدء إنشاء المكبر
          const image = document.querySelector('.image-slider .swiper-slide-active img'); // الحصول على الصورة النشطة
          zoom(image?.id, 2); // استدعاء دالة التكبير
      }, 250);
  
      // إضافة حدث لتغيير الشريحة في السلايدر
      document.querySelector('salla-slider.details-slider').addEventListener('slideChange', (e) => {
          // تعيين تأخير حتى تصبح الفئة النشطة جاهزة
          setTimeout(() => {
              const imageZoom = document.querySelector('.image-slider .swiper-slide-active .img-magnifier-glass');
    
              // إذا تم إنشاء مكبر الزجاج مسبقًا، تخطى
              if (window.innerWidth < 1024 || imageZoom) return; // إذا كانت الشاشة صغيرة أو تم إنشاء المكبر، لا تفعل شيئًا
              const image = document.querySelector('.image-slider .magnify-wrapper.swiper-slide-active img'); // الحصول على الصورة النشطة
              zoom(image?.id, 2); // استدعاء دالة التكبير
          }, 250);
      });
    }

    registerEvents() {
      // تسجيل حدث عند تحديث السعر
      salla.product.event.onPriceUpdated((res) => {
        let data = res.data,
            is_on_sale = data.has_sale_price && data.regular_price > data.price; // التحقق مما إذا كان هناك سعر مخفض

        app.startingPriceTitle?.classList.add('hidden'); // إخفاء عنوان السعر الابتدائي

        // تحديث الأسعار في الصفحة
        app.totalPrice.forEach((el) => {el.innerText = salla.money(data.price)}); // تحديث السعر الإجمالي
        app.beforePrice.forEach((el) => {el.innerText = salla.money(data.regular_price)}); // تحديث السعر السابق

        // تبديل حالة عرض السعر المخفض
        app.toggleClassIf('.price_is_on_sale','showed','hidden', () => is_on_sale);
        app.toggleClassIf('.starting-or-normal-price','hidden','showed', () => is_on_sale);

        app.anime('.total-price', { scale: [0.88, 1] }); // إضافة تأثير الرسوم المتحركة للسعر الإجمالي
      });

      // إضافة حدث عند النقر على زر "عرض المزيد"
      app.onClick('#btn-show-more', e => app.all('#more-content', div => {
        e.target.classList.add('is-expanded'); // إضافة فئة التمديد
        div.style = `max-height:${div.scrollHeight}px`; // تعيين ارتفاع العنصر
      }) || e.target.remove()); // إزالة الزر إذا لم يكن هناك محتوى
    }
}

Product.initiateWhenReady(['product.single']); // تهيئة الفئة عند جاهزية الصفحة، مع تحديد الصفحات المسموح بها
