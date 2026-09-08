document.addEventListener('DOMContentLoaded', () => {
  const q = (s) => Array.from(document.querySelectorAll(s));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll reveal
  const reveal = q('[data-reveal]');
  const show = (el) => el.classList.add('is-visible');
  if (reduced || !('IntersectionObserver' in window)) {
    reveal.forEach(show);
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          show(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    reveal.forEach((el) => io.observe(el));
    setTimeout(() => reveal.forEach(show), 4000);
  }

  // Hero parallax (transform/opacity only, rAF-throttled)
  const par = document.querySelector('[data-par]');
  if (par && !reduced) {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || document.documentElement.scrollTop || 0;
        const k = parseFloat(par.getAttribute('data-par')) || 0.1;
        par.style.transform = `translate3d(0, ${(y * k).toFixed(2)}px, 0)`;
        par.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.9)));
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Custom cursor (pointer devices only)
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const cursor = document.querySelector('[data-cursor]');
  const dot = document.querySelector('[data-cursordot]');
  const label = document.querySelector('[data-cursorlabel]');

  if (fine && cursor && !reduced) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    const loop = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
      cursor.style.opacity = '1';
    }, { passive: true });
    loop();

    const grow = (on, text) => {
      const size = on ? 56 : 10;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.left = `${-size / 2}px`;
      dot.style.top = `${-size / 2}px`;
      label.textContent = text || 'View';
      label.style.opacity = on ? '1' : '0';
    };

    q('[data-work]').forEach((el) => {
      el.addEventListener('mouseenter', () => grow(true, 'View'));
      el.addEventListener('mouseleave', () => grow(false));
    });
    q('[data-mag], [data-mail]').forEach((el) => {
      el.addEventListener('mouseenter', () => grow(true, '→'));
      el.addEventListener('mouseleave', () => grow(false));
    });
  } else if (cursor) {
    cursor.style.display = 'none';
  }
});
