document.documentElement.classList.add('js');

const revealItems = document.querySelectorAll('[data-reveal], .legal-page section');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && !reduceMotion) {
	const revealObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('is-visible');
				observer.unobserve(entry.target);
			}
		});
	}, { threshold: 0.14, rootMargin: '0px 0px -48px 0px' });

	revealItems.forEach((item) => revealObserver.observe(item));
} else {
	revealItems.forEach((item) => item.classList.add('is-visible'));
}

if (!reduceMotion && 'animate' in HTMLElement.prototype) {
	document.addEventListener('click', (event) => {
		if (!(event.target instanceof Element)) return;
		const control = event.target.closest('a, button, summary');
		if (!control || control.matches(':disabled, [aria-disabled="true"]')) return;

		control.animate(
			[
				{ scale: '1', offset: 0 },
				{ scale: '.965', offset: .3 },
				{ scale: '1.018', offset: .72 },
				{ scale: '1', offset: 1 }
			],
			{ duration: 380, easing: 'cubic-bezier(.2,.8,.2,1)' }
		);
	});
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

document.querySelectorAll('.mobile-menu a').forEach((link) => {
	link.addEventListener('click', () => link.closest('details').removeAttribute('open'));
});