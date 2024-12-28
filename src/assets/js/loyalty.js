import BasePage from './base-page';

class Loyalty extends BasePage {
    onReady() {
        const count = parseInt(app.element(".count-anime")?.dataset?.count || 0, 10);

        const timeline = new anime.timeline();

        timeline.add({
            targets: '.loyality-item',
            opacity: [0, 1],
            translateX: [20, 0],
            delay: (el, i) => i * 100,
        }).add({
            targets: '.star-anime',
            opacity: [0, 1],
            rotate: [50, 0],
            duration: 4000,
            delay: (el, i) => i * 100,
        }, '-=1000').add({
            targets: '.count-anime',
            innerText: [0, count],
            duration: 2000,
            easing: "linear",
            round: true,
            delay: (el, i) => i * 150,
        }, '-=3700').add({
            targets: '.btn-anime',
            opacity: [0, 1],
            duration: 2000,
            translateX: [20, 0],
            delay: (el, i) => i * 100,
        }, '-=3200');
    }
}

Loyalty.initiateWhenReady(['loyalty']);