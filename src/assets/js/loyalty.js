import BasePage from './base-page'; // استيراد الفئة الأساسية للصفحات

class Loyalty extends BasePage {
    onReady() {
        let count = app.element(".count-anime")?.dataset?.count || 0; // الحصول على قيمة العد من عنصر العد المتحرك أو تعيينها إلى 0
        (new anime.timeline()).add({
            targets: '.loyality-item', // تحديد العناصر المستهدفة
            opacity: [0, 1], // تغيير الشفافية من 0 إلى 1
            translateX: [20, 0], // تحريك العناصر من اليمين إلى موضعها الأصلي
            delay: function (el, i) {
                return i * 100; // تأخير كل عنصر بناءً على ترتيبه
            },
        }).add({
            targets: '.star-anime', // تحديد العناصر المستهدفة
            opacity: [0, 1], // تغيير الشفافية من 0 إلى 1
            rotate: [50, 0], // تدوير العناصر من 50 درجة إلى 0
            duration: 4000, // مدة الرسوم المتحركة
            delay: function (el, i) {
                return i * 100; // تأخير كل عنصر بناءً على ترتيبه
            },
        }, '-=1000').add({
            targets: `.count-anime`, // تحديد عنصر العد المتحرك
            innerText: [0, count], // تغيير النص الداخلي من 0 إلى قيمة العد
            duration: 2000, // مدة الرسوم المتحركة
            easing: "linear", // نوع التسهيل
            round: true, // تقريب القيمة
            delay: function (el, i) {
                return i * 150; // تأخير كل عنصر بناءً على ترتيبه
            },
        }, '-=3700').add({
            targets: '.btn-anime', // تحديد العناصر المستهدفة
            opacity: [0, 1], // تغيير الشفافية من 0 إلى 1
            duration: 2000, // مدة الرسوم المتحركة
            translateX: [20, 0], // تحريك العناصر من اليمين إلى موضعها الأصلي
            delay: function (el, i) {
                return i * 100; // تأخير كل عنصر بناءً على ترتيبه
            },
        }, '-=3200'); // بدء الرسوم المتحركة قبل 3200 مللي ثانية من نهاية الرسوم المتحركة السابقة
    }
}

Loyalty.initiateWhenReady(['loyalty']); // تهيئة الفئة عند جاهزية الصفحة، مع تحديد الصفحات المسموح بها