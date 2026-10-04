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

const mobileNav = document.querySelector('.mobile-nav');
const closeMobileNav = () => mobileNav?.removeAttribute('open');

document.querySelectorAll('.mobile-menu a').forEach((link) => {
	link.addEventListener('click', closeMobileNav);
});

document.addEventListener('click', (event) => {
	if (!(event.target instanceof Element)) return;
	if (!mobileNav || !mobileNav.hasAttribute('open')) return;

	const clickedInsideMobileNav = event.target.closest('.mobile-nav');
	if (!clickedInsideMobileNav) {
		closeMobileNav();
	}
}, true);

window.addEventListener('scroll', () => {
	if (mobileNav && mobileNav.hasAttribute('open')) {
		closeMobileNav();
	}
}, { passive: true });

const legalReturnStorageKey = 'lerob-startklar-legal-return';
if (!document.querySelector('.legal-page')) {
	try {
		sessionStorage.removeItem(legalReturnStorageKey);
	} catch {}
}

document.querySelectorAll('a[href="impressum.html"], a[href="datenschutz.html"]').forEach((link) => {
	link.addEventListener('click', () => {
		try {
			sessionStorage.setItem(legalReturnStorageKey, window.location.href);
		} catch {}
	});
});

if (document.querySelector('.legal-page') && window.matchMedia('(max-width: 850px)').matches) {
	let touchStart = null;

	document.addEventListener('touchstart', (event) => {
		const touch = event.changedTouches[0];
		touchStart = { x: touch.clientX, y: touch.clientY };
	}, { passive: true });

	document.addEventListener('touchend', (event) => {
		if (!touchStart) return;

		const touch = event.changedTouches[0];
		const deltaX = touch.clientX - touchStart.x;
		const deltaY = touch.clientY - touchStart.y;
		touchStart = null;

		if (deltaX < 80 || Math.abs(deltaX) < Math.abs(deltaY) * 1.3) return;

		const referrer = document.referrer ? new URL(document.referrer) : null;
		let hasInternalNavigation = false;
		try {
			hasInternalNavigation = Boolean(sessionStorage.getItem(legalReturnStorageKey));
		} catch {}

		if ((referrer?.origin === window.location.origin || hasInternalNavigation) && window.history.length > 1) {
			try {
				sessionStorage.removeItem(legalReturnStorageKey);
			} catch {}
			window.history.back();
		} else {
			window.location.assign('index.html');
		}
	}, { passive: true });
}