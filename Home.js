// Scroll reveal
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Count-up
function countUp(el) {
    const target = parseInt(el.dataset.target);
    const suffix = target >= 10000 ? '+' : target === 85 ? '%' : '+';
    const duration = 1600;
    const start = performance.now();
    const step = now => {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(ease * target).toLocaleString('id-ID') + suffix;
        if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting && e.target.dataset.target) {
            countUp(e.target);
            statObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.3 });
document.querySelectorAll('[data-target]').forEach(el => statObserver.observe(el));