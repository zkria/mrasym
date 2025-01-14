/**
 * إنشاء عدسة مكبرة لتكبير الصور.
 *
 * @param imgID معرف الصورة التي سيتم تكبيرها
 * @param zoom قوة التكبير
 * @returns لا شيء
 */
export function zoom(imgID, zoom) {
	/* لا تقم بإنشاء العدسة المكبرة إذا لم يتم تمرير معرف الصورة: */
	if (!imgID) return;
	var img, glass, w, h, bw;
	img = document.getElementById(imgID);
	/* إنشاء العدسة المكبرة: */
	glass = document.createElement('DIV');
	glass.setAttribute('class', 'img-magnifier-glass');
	/* إدراج العدسة المكبرة: */
	img.parentElement.insertBefore(glass, img);
	/* تعيين خصائص الخلفية للعدسة المكبرة: */
	glass.style.backgroundImage = "url('" + img.src + "')";
	glass.style.backgroundRepeat = 'no-repeat';
	glass.style.backgroundSize =
		img.width * zoom + 'px ' + img.height * zoom + 'px';
	bw = 3;
	w = glass.offsetWidth / 2;
	h = glass.offsetHeight / 2;
	/* تنفيذ دالة عند تحريك العدسة المكبرة فوق الصورة: */
	glass.addEventListener('mousemove', moveMagnifier);
	img.addEventListener('mousemove', moveMagnifier);
	/* وأيضًا لشاشات اللمس: */
	glass.addEventListener('touchmove', moveMagnifier);
	img.addEventListener('touchmove', moveMagnifier);
	
	function moveMagnifier(e) {
		var pos, x, y;
		/* منع أي إجراءات أخرى قد تحدث عند التحريك فوق الصورة */
		e.preventDefault();
		/* الحصول على مواضع x و y للمؤشر: */
		pos = getCursorPos(e);
		x = pos.x;
		y = pos.y;
		/* منع العدسة المكبرة من التمركز خارج الصورة: */
		x = Math.max(Math.min(x, img.width - w / zoom), w / zoom);
		y = Math.max(Math.min(y, img.height - h / zoom), h / zoom);
		/* تعيين موضع العدسة المكبرة: */
		glass.style.left = x - w + 'px';
		glass.style.top = y - h + 'px';
		/* عرض ما "ترى" العدسة المكبرة: */
		glass.style.backgroundPosition =
			'-' + (x * zoom - w + bw) + 'px -' + (y * zoom - h + bw) + 'px';
	}
	
	function getCursorPos(e) {
		var a,
			x = 0,
			y = 0;
		e = e || window.event;
		/* الحصول على مواضع x و y للصورة: */
		a = img.getBoundingClientRect();
		/* حساب إحداثيات x و y للمؤشر، بالنسبة للصورة: */
		x = e.pageX - a.left;
		y = e.pageY - a.top;
		/* مراعاة أي تمرير للصفحة: */
		x = x - window.pageXOffset;
		y = y - window.pageYOffset;
		return { x: x, y: y };
	}
}
