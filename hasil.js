// Scroll reveal
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Count-up score
function countUp(el, target, suffix, duration) {
    const start = performance.now();
    const step = now => {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(ease * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

const scoreObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            countUp(document.getElementById('scoreNum'), 82, '%', 1400);
            scoreObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.3 });
scoreObserver.observe(document.querySelector('.highlight'));

// Skill bar animation
const barObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.fill').forEach(fill => {
                fill.style.width = fill.dataset.width + '%';
            });
            barObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.2 });
document.querySelectorAll('.card:not(.highlight)').forEach(c => barObserver.observe(c));