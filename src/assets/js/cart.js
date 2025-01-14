import BasePage from './base-page';

class Cart extends BasePage {
    onReady() {
        // تحديث DOM بناءً على الأحداث
        salla.event.cart.onUpdated(data => this.updateCartPageInfo(data)); // تسجيل حدث تحديث السلة

        app.watchElements({
            couponCodeInput: '#coupon-input', // حقل إدخال رمز القسيمة
            couponBtn: '#coupon-btn', // زر القسيمة
            couponError: '#coupon-error', // عنصر عرض خطأ القسيمة
            subTotal: '#sub-total', // إجمالي الفرعي
            orderOptionsTotal: '#cart-options-total', // إجمالي خيارات الطلب
            totalDiscount: '#total-discount', // إجمالي الخصم
            shippingCost: '#shipping-cost', // تكلفة الشحن
            freeShipping: '#free-shipping', // الشحن المجاني
            freeShippingBar: '#free-shipping-bar', // شريط الشحن المجاني
            freeShippingMsg: '#free-shipping-msg', // رسالة الشحن المجاني
            freeShipApplied: '#free-shipping-applied' // حالة تطبيق الشحن المجاني
        });

        this.initiateCoupon(); // تهيئة القسيمة
        this.initSubmitCart(); // تهيئة زر تقديم السلة
    }

    initSubmitCart() {
        let submitBtn = document.querySelector('#cart-submit'); // زر تقديم السلة
        let cartForms = document.querySelectorAll('form[id^="item-"]'); // جميع نماذج العناصر في السلة
        
        if (!submitBtn) {
            return; // إذا لم يكن هناك زر تقديم، لا تفعل شيئًا
        }
        
        app.onClick(submitBtn, event => {
            let isValid = true; // متغير للتحقق من صحة النماذج
            cartForms.forEach(form => {
                isValid = isValid && form.reportValidity(); // التحقق من صحة كل نموذج
                if (!isValid) {
                    event.preventDefault(); // منع تقديم النموذج إذا كان غير صالح
                    salla.notify.error(salla.lang.get('common.messages.required_fields')); // عرض رسالة خطأ
                    return;
                }
            });
    
            if (isValid) {
                /** @type HTMLSallaButtonElement */
                let btn = event.currentTarget; // الزر الذي تم النقر عليه
                salla.config.get('user.type') == 'guest' ? salla.cart.submit() : btn.load().then(() => salla.cart.submit()); // تقديم السلة
            }
        });
    }

    updateCartOptions(options) {
      if (!options || !options.length) return; // إذا لم تكن هناك خيارات، لا تفعل شيئًا

      const arrayTwoId = options.map((item) => (item.id)); // استخراج معرفات الخيارات

      document.querySelectorAll('.cart-options form')?.forEach((form) => {
        if (!arrayTwoId.includes(parseInt(form.id.value))) {
          form.remove(); // إزالة النماذج غير الموجودة في الخيارات
        }
      });
    }
    
    /**
     * @param {import("@salla.sa/twilight/types/api/cart").CartSummary} cartData
     */
    updateCartPageInfo(cartData) {
        // إذا تم حذف العناصر ولم يتبق أي عناصر، أعد تحميل الصفحة
        if (!cartData.count) {
            // مسح خيارات السلة من DOM قبل إعادة تحميل الصفحة
            document.querySelector('.cart-options')?.remove();
            return window.location.reload(); // إعادة تحميل الصفحة
        }

        // تحديث DOM لخيارات السلة
        this.updateCartOptions(cartData?.options);
        // تحديث بيانات كل عنصر
        cartData.items?.forEach(item => this.updateItemInfo(item));

        app.subTotal.innerText = salla.money(cartData.sub_total); // تحديث الإجمالي الفرعي
        if (app.orderOptionsTotal) app.orderOptionsTotal.innerText = salla.money(cartData.options_total); // تحديث إجمالي خيارات الطلب
        
        app.toggleElementClassIf(app.totalDiscount, 'discounted', 'hidden', () => !!cartData.discount) // تبديل حالة الخصم
            .toggleElementClassIf(app.shippingCost, 'has_shipping', 'hidden', () => !!cartData.real_shipping_cost) // تبديل حالة تكلفة الشحن
            .toggleElementClassIf(app.freeShipping, 'has_free', 'hidden', () => !!cartData.free_shipping_bar); // تبديل حالة الشحن المجاني

        app.totalDiscount.querySelector('b').innerText = '- ' + salla.money(cartData.discount); // تحديث قيمة الخصم
        app.shippingCost.querySelector('b').innerText = salla.money(cartData.real_shipping_cost); // تحديث تكلفة الشحن

        if (!cartData.free_shipping_bar) {
            return; // إذا لم يكن هناك شحن مجاني، لا تفعل شيئًا
        }

        let isFree = cartData.free_shipping_bar.has_free_shipping; // التحقق مما إذا كان هناك شحن مجاني
        app.toggleElementClassIf(app.freeShippingBar, 'active', 'hidden', () => !isFree) // تبديل حالة شريط الشحن المجاني
            .toggleElementClassIf(app.freeShipApplied, 'active', 'hidden', () => isFree); // تبديل حالة تطبيق الشحن المجاني

        app.freeShippingMsg.innerHTML = isFree
            ? salla.lang.get('pages.cart.has_free_shipping') // رسالة الشحن المجاني
            : salla.lang.get('pages.cart.free_shipping_alert', { amount: salla.money(cartData.free_shipping_bar.remaining) }); // رسالة تنبيه الشحن المجاني
        app.freeShippingBar.children[0].style.width = cartData.free_shipping_bar.percent + '%'; // تحديث عرض شريط الشحن المجاني
    }

    /**
     * @param {import("@salla.sa/twilight/types/api/cart").CartItem} item
     */
    updateItemInfo(item) {
        // الحصول على العناصر الخاصة بهذا العنصر
        let cartItem = document.querySelector('#item-' + item.id);
        if (!cartItem) {
            salla.log(`لا يمكن الحصول على عنصر السلة DOM للعنصر ${item.id}!`); // تسجيل خطأ
            return;
        }
        let totalElement = cartItem.querySelector('.item-total'), // عنصر إجمالي السعر
            priceElement = cartItem.querySelector('.item-price'), // عنصر سعر العنصر
            regularPriceElement = cartItem.querySelector('.item-regular-price'), // عنصر السعر العادي
            offerElement = cartItem.querySelector('.offer-name'), // عنصر اسم العرض
            offerIconElement = cartItem.querySelector('.offer-icon'), // عنصر أيقونة العرض
            hasSpecialPrice = item.offer || item.special_price > 0; // التحقق مما إذا كان هناك سعر خاص

        let total = salla.money(item.total); // الحصول على إجمالي السعر
        if (total !== totalElement.innerText) {
            totalElement.innerText = total; // تحديث إجمالي السعر
            app.anime(totalElement, { scale: [.88, 1] }); // إضافة تأثير الرسوم المتحركة
        }

        app.toggleElementClassIf(offerElement, 'offer-applied', 'hidden', () => hasSpecialPrice) // تبديل حالة عرض السعر الخاص
            .toggleElementClassIf(offerIconElement, 'offer-applied', 'hidden', () => hasSpecialPrice) // تبديل حالة أيقونة العرض
            .toggleElementClassIf(regularPriceElement, 'offer-applied', 'hidden', () => hasSpecialPrice) // تبديل حالة السعر العادي
            .toggleElementClassIf(priceElement, 'text-red-400', 'text-sm text-gray-400', () => hasSpecialPrice); // تبديل حالة سعر العنصر

        priceElement.innerText = salla.money(item.price); // تحديث سعر العنصر
        if (hasSpecialPrice) {
            offerElement.innerText = item.offer.names; // تحديث اسم العرض
            regularPriceElement.innerText = salla.money(item.product_price); // تحديث السعر العادي
        }
    }

    //=================== طريقة القسيمة ========================//
    initiateCoupon() {
        if (!app.couponCodeInput) {
            return; // إذا لم يكن هناك حقل إدخال رمز القسيمة، لا تفعل شيئًا
        }

        app.onKeyUp(app.couponCodeInput, event => {
            event.keyCode === 13 && app.couponBtn.click(); // تنفيذ زر القسيمة عند الضغط على Enter
            app.couponError.value = ''; // مسح رسالة الخطأ
            app.removeClass(app.couponCodeInput, 'has-error'); // إزالة فئة الخطأ
        });

        app.onClick(app.couponBtn, event => {
            // إذا كان زر القسيمة يحتوي على فئة `btn--danger`، فهذا يعني أنه لإزالة القسيمة
            let hasCoupon = app.couponBtn.classList.contains('btn--danger'); // التحقق مما إذا كان هناك قسيمة
            /** @type HTMLSallaButtonElement */
            let btn = event.currentTarget; // الزر الذي تم النقر عليه
            if (!hasCoupon && !app.couponCodeInput.value.length) {
                this.showCouponError('* ' + salla.lang.get('pages.checkout.enter_coupon')); // عرض رسالة خطأ إذا لم يتم إدخال رمز القسيمة
                return;
            }
            btn.load() // تحميل الزر
                .then(() => hasCoupon ? salla.cart.deleteCoupon() : salla.cart.addCoupon(app.couponCodeInput.value)) // إضافة أو إزالة القسيمة
                .then(res => this.toggleCoupon(res, !hasCoupon)) // تبديل حالة القسيمة
                .catch(err => this.showCouponError(err.response?.data?.error.message, !hasCoupon)) // عرض رسالة خطأ إذا حدث خطأ
                .finally(() => btn.stop()); // إيقاف تحميل الزر
        });
    }

    /**
     * @param {CartResponse.update} res
     * @param {boolean} applied
     */
    toggleCoupon(res, applied) {
        app.couponError.innerText = ''; // مسح رسالة الخطأ
        app.couponCodeInput.value = applied ? app.couponCodeInput.value : ''; // تعيين قيمة حقل إدخال القسيمة
        app.couponCodeInput.toggleAttribute('disabled', applied); // تعطيل حقل إدخال القسيمة إذا تم تطبيق القسيمة

        app.toggleElementClassIf(app.couponBtn, ['btn--danger', 'has-coupon'], ['btn-default', 'has-not-coupon'], () => applied) // تبديل حالة زر القسيمة
            .toggleElementClassIf(app.couponBtn, ['btn-default', 'has-not-coupon'], ['btn--danger', 'has-coupon'], () => !applied) // تبديل حالة زر القسيمة
            .hideElement(app.couponBtn.querySelector(applied ? 'span' : 'i')) // إخفاء العنصر المناسب
            .showElement(app.couponBtn.querySelector(applied ? 'i' : 'span')) // إظهار العنصر المناسب
            .removeClass(app.couponCodeInput, 'has-error'); // إزالة فئة الخطأ
    }

    showCouponError(message, isApplying = true) {
        app.couponError.innerText = message || salla.lang.get('pages.checkout.error_occurred'); // عرض رسالة الخطأ
        isApplying ? app.addClass(app.couponCodeInput, 'has-error') : null; // إضافة فئة الخطأ إذا كانت القسيمة قيد التطبيق
    }
}

Cart.initiateWhenReady(['cart']); // تهيئة الفئة عند جاهزية الصفحة
