export default function tootTip() {
  const tooltipToggle = document.querySelectorAll('.tooltip-toggle--clickable'),
    closeTooltip = document.querySelectorAll('.close-tooltip');

  // إظهار التلميح إذا كان النوع قابل للنقر
  if (tooltipToggle.length) {
    tooltipToggle.forEach(element => {
      element.addEventListener('click', (e) => {
        e.stopPropagation(); // منع الحدث من الانتقال إلى العناصر الأب
        element.classList.add('visible'); // إضافة فئة "مرئي" للتلميح
      });
    });

    // إخفاء التلميح
    closeTooltip.forEach(element => {
      element.addEventListener('click', (e) => {
        e.stopPropagation(); // منع الحدث من الانتقال إلى العناصر الأب
        element.parentElement.parentElement.classList.remove('visible'); // إزالة فئة "مرئي" من التلميح
      });
    });

    // إخفاء التلميح عند النقر في أي مكان في النافذة
    window.addEventListener('click', () => {
      tooltipToggle.forEach(element => {
        element.classList.remove('visible'); // إزالة فئة "مرئي" من جميع التلميحات
      });
    });
  }
};

