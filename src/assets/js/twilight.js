/**\
 * سيتولى نظام سلا الخلفي عملية حقن Twilight في صفحات الثيم الخاصة بك.
 * هذا الملف مخصص فقط لأغراض IDE، ولا ينبغي أن يكون في مخرجات حزمة Webpack.
 *
 * 🚨 تضمين هذا الملف في حزمة Webpack قد يتسبب في مشاكل غير متوقعة.
 *
 * إذا كنت تستخدم Webpack، تأكد من إضافة قواعد الاستبعاد في webpack.config.js.
 *
 * {
 *     test: /\.js$/,
 *     exclude: [
 *         ....
 *         asset('js/twilight.js') // استبعاد هذا الملف
 *         ....
 *     ]
 * };
 *
 */
import {applyPolyfills, defineCustomElements as SallaWebComponents} from '@salla.sa/twilight-components/loader'; // استيراد الدوال اللازمة من مكتبة Twilight

applyPolyfills().then(() => {
    SallaWebComponents(window); // تعريف العناصر المخصصة في نافذة المتصفح
});