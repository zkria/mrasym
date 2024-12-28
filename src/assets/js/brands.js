import BasePage from './base-page';

class Brands extends BasePage {
  onReady() {
    // تعيين الارتفاع الابتدائي
    const nav = document.querySelector('#brands-nav');
    const navWrap = document.querySelector('.brands-nav-wrap');
    if (nav && navWrap) {
      navWrap.style.height = `${nav.clientHeight}px`;
    }

    app.onClick('.brands-nav__item', ({ target: btn }) => {
      app.all('.brands-nav__item', el => app.toggleElementClassIf(el, 'is-selected', 'unselected', () => el === btn));
    });

    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  handleScroll() {
    const scrollAtTop = window.pageYOffset <= 200;
    app.toggleClassIf('#brands-nav', 'is-not-sticky', 'is-sticky', () => scrollAtTop);
  }
}

Brands.initiateWhenReady(['brands.index']);
