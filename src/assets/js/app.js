import MobileMenu from 'mmenu-light';
import Swal from 'sweetalert2';
import Anime from './partials/anime';
import initTootTip from './partials/tooltip';
import AppHelpers from "./app-helpers";

class App extends AppHelpers {
  constructor() {
    super();
    window.app = this;
  }

  loadTheApp() {
    this.commonThings();
    this.initiateNotifier();
    this.initiateMobileMenu();
    if (header_is_sticky) {
      this.initiateStickyMenu();
    }
    this.initAddToCart();
    this.initiateAdAlert();
    this.initiateDropdowns();
    this.initiateModals();
    this.initiateCollapse();
    initTootTip();
    this.loadModalImgOnclick();

    salla.comment.event.onAdded(() => window.location.reload());

    this.status = 'ready';
    document.dispatchEvent(new CustomEvent('theme::ready'));
    this.log('Theme Loaded 🎉');
  }

  log(message) {
    salla.log(`ThemeApp(Raed)::${message}`);
    return this;
  }

  loadModalImgOnclick() {
    document.querySelectorAll('.load-img-onclick').forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const modal = document.querySelector(`#${link.dataset.modalId}`);
        const img = modal.querySelector('img');
        const imgSrc = img.dataset.src;
        modal.open();

        if (img.classList.contains('loaded')) return;

        img.src = imgSrc;
        img.classList.add('loaded');
      });
    });
  }

  commonThings() {
    this.cleanContentArticles('.content-entry');
  }

  cleanContentArticles(elementsSelector) {
    const articleElements = document.querySelectorAll(elementsSelector);

    if (articleElements.length) {
      articleElements.forEach(article => {
        article.innerHTML = article.innerHTML.replace(/\&nbsp;/g, ' ');
      });
    }
  }

  copyToClipboard(event) {
    event.preventDefault();
    const aux = document.createElement("input");
    const btn = event.currentTarget;
    aux.setAttribute("value", btn.dataset.content);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    this.toggleElementClassIf(btn, 'copied', 'code-to-copy', () => true);
    setTimeout(() => {
      this.toggleElementClassIf(btn, 'code-to-copy', 'copied', () => true);
    }, 1000);
  }

  initiateNotifier() {
    salla.notify.setNotifier((message, type) => {
      if (typeof message === 'object') {
        return Swal.fire(message).then(type);
      }

      return Swal.mixin({
        toast: true,
        position: salla.config.get('theme.is_rtl') ? 'top-start' : 'top-end',
        showConfirmButton: false,
        timer: 3500,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
      }).fire({
        icon: type,
        title: message,
        showCloseButton: true,
        timerProgressBar: true
      });
    });
  }

  initiateMobileMenu() {
    let menu = this.element("#mobile-menu");
    if (!menu) return;

    menu = new MobileMenu(menu, "(max-width: 1024px)", "( slidingSubmenus: false)");
    salla.lang.onLoaded(() => {
      menu.navigation({ title: salla.lang.get('blocks.header.main_menu') });
    });
    const drawer = menu.offcanvas({ position: salla.config.get('theme.is_rtl') ? "right" : 'left' });

    this.onClick("a[href='#mobile-menu']", event => {
      document.body.classList.add('menu-opened');
      event.preventDefault() || drawer.close() || drawer.open();
    });
    this.onClick(".close-mobile-menu", event => {
      document.body.classList.remove('menu-opened');
      event.preventDefault() || drawer.close();
    });
  }

  initiateStickyMenu() {
    const header = this.element('#mainnav');
    const height = this.element('#mainnav .inner')?.clientHeight;
    if (!header) return;

    window.addEventListener('load', () => setTimeout(() => this.setHeaderHeight(), 500));
    window.addEventListener('resize', () => this.setHeaderHeight());

    window.addEventListener('scroll', () => {
      window.scrollY >= header.offsetTop + height ? header.classList.add('fixed-pinned', 'animated') : header.classList.remove('fixed-pinned');
      window.scrollY >= 200 ? header.classList.add('fixed-header') : header.classList.remove('fixed-header', 'animated');
    }, { passive: true });
  }

  setHeaderHeight() {
    const height = this.element('#mainnav .inner').clientHeight;
    const header = this.element('#mainnav');
    header.style.height = `${height}px`;
  }

  initiateAdAlert() {
    const ad = this.element(".salla-advertisement");
    if (!ad) return;

    if (!salla.storage.get(`statusAd-${ad.dataset.id}`)) {
      ad.classList.remove('hidden');
    }

    this.onClick('.ad-close', event => {
      event.preventDefault();
      salla.storage.set(`statusAd-${ad.dataset.id}`, 'dismissed');

      anime({
        targets: '.salla-advertisement',
        opacity: [1, 0],
        duration: 300,
        height: [ad.clientHeight, 0],
        easing: 'easeInOutQuad',
      });
    });
  }

  initiateDropdowns() {
    this.onClick('.dropdown__trigger', ({ target: btn }) => {
      btn.parentElement.classList.toggle('is-opened');
      document.body.classList.toggle('dropdown--is-opened');

      window.addEventListener('click', ({ target: element }) => {
        if (!element.closest('.dropdown__menu') && element !== btn || element.classList.contains('dropdown__close')) {
          btn.parentElement.classList.remove('is-opened');
          document.body.classList.remove('dropdown--is-opened');
        }
      });
    });
  }

  initiateModals() {
    this.onClick('[data-modal-trigger]', e => {
      const id = `#${e.target.dataset.modalTrigger}`;
      this.removeClass(id, 'hidden');
      setTimeout(() => this.toggleModal(id, true));
    });
    salla.event.document.onClick("[data-close-modal]", e => this.toggleModal(`#${e.target.dataset.closeModal}`, false));
  }

  toggleModal(id, isOpen) {
    this.toggleClassIf(`${id} .s-salla-modal-overlay`, 'ease-out duration-300 opacity-100', 'opacity-0', () => isOpen)
      .toggleClassIf(`${id} .s-salla-modal-body`,
        'ease-out duration-300 opacity-100 translate-y-0 sm:scale-100',
        'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95',
        () => isOpen)
      .toggleElementClassIf(document.body, 'modal-is-open', 'modal-is-closed', () => isOpen);
    if (!isOpen) {
      setTimeout(() => this.addClass(id, 'hidden'), 350);
    }
  }

  initiateCollapse() {
    document.querySelectorAll('.btn--collapse')
      .forEach((trigger) => {
        const content = document.querySelector(`#${trigger.dataset.show}`);
        const state = { isOpen: false };

        const onOpen = () => anime({
          targets: content,
          duration: 225,
          height: content.scrollHeight,
          opacity: [0, 1],
          easing: 'easeOutQuart',
        });

        const onClose = () => anime({
          targets: content,
          duration: 225,
          height: 0,
          opacity: [1, 0],
          easing: 'easeOutQuart',
        });

        const toggleState = (isOpen) => {
          state.isOpen = !isOpen;
          this.toggleElementClassIf(content, 'is-closed', 'is-opened', () => isOpen);
        };

        trigger.addEventListener('click', () => {
          const { isOpen } = state;
          toggleState(isOpen);
          isOpen ? onClose() : onOpen();
        });
      });
  }

  anime(selector, options = null) {
    const anime = new Anime(selector, options);
    return options === false ? anime : anime.play();
  }

  initAddToCart() {
    salla.cart.event.onUpdated(summary => {
      document.querySelectorAll('[data-cart-total]').forEach(el => el.innerText = salla.money(summary.total));
      document.querySelectorAll('[data-cart-count]').forEach(el => el.innerText = salla.helpers.number(summary.count));
    });

    salla.cart.event.onItemAdded((response, prodId) => {
      this.element('salla-cart-summary').animateToCart(this.element(`#product-${prodId} img`));
    });
  }
}

salla.onReady(() => (new App()).loadTheApp());
