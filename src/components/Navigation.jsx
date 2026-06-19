import { useEffect, useRef, useState } from 'react';

export default function Navigation({ categories = [] }) {
    const wrapRef = useRef(null);
    const navRef = useRef(null);
    const stateRef = useRef({ tl: null, isOpen: false, enterEnd: 0 });
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { href: '/', label: 'Home' },
        ...categories.map((cat) => ({ href: `/${cat.slug}`, label: cat.name })),
        { href: '/videos', label: 'Videos' },
        { href: '/arts-books', label: 'Arts Books' },
    ];

    const secondaryLinks = [
        { href: '/about', label: 'About Me' },
        { href: '/contact', label: 'Contact' },
    ];

    useEffect(() => {
        let cancelled = false;

        import('gsap').then((mod) => {
            if (cancelled) return;
            const gsap = mod.gsap || mod.default;
            const wrap = wrapRef.current;
            const nav = navRef.current;
            if (!wrap || !nav) return;

            const bg = wrap.querySelector('.pp-nav-bg');
            const panels = wrap.querySelectorAll('.pp-nav-panel');
            const items = wrap.querySelectorAll('.pp-nav-item');
            const secondary = wrap.querySelector('.pp-nav-secondary');
            const divider = wrap.querySelector('.pp-divider');
            const barTop = wrap.querySelector('.bar-top');
            const barBot = wrap.querySelector('.bar-bot');

            gsap.set(nav, { visibility: 'hidden' });
            gsap.set(bg, { opacity: 0 });
            gsap.set(secondary, { opacity: 0, y: 10 });
            gsap.set(divider, { scaleX: 0 });

            const tl = gsap
                .timeline({ paused: true })
                .set(nav, { visibility: 'visible', pointerEvents: 'auto' })

                .to(bg, {
                    opacity: 1, duration: 0.4,
                    ease: 'power2.out', easeReverse: 'power4.out',
                }, 0)

                .fromTo(panels, {
                    x: '110%', y: 0, rotation: 0,
                }, {
                    x: '0%', y: 0, duration: 0.6,
                    ease: 'back.out(1.4)', easeReverse: 'power3.in',
                    stagger: 0.08,
                }, 0)

                .fromTo(items, {
                    opacity: 0, x: -20,
                }, {
                    opacity: 1, x: 0, duration: 1,
                    ease: 'expo.out', easeReverse: 'power3.in',
                    stagger: 0.04,
                }, 0.1)

                .fromTo(barTop, {
                    attr: { x1: 3, y1: 8, x2: 21, y2: 8 },
                }, {
                    attr: { x1: 5, y1: 5, x2: 19, y2: 19 },
                    duration: 0.35, ease: 'back.out(1.4)', easeReverse: 'power3.out',
                }, 0.06)
                .fromTo(barBot, {
                    attr: { x1: 3, y1: 16, x2: 21, y2: 16 },
                }, {
                    attr: { x1: 19, y1: 5, x2: 5, y2: 19 },
                    duration: 0.35, ease: 'back.out(1.4)', easeReverse: 'power3.out',
                }, 0.06)

                .to(secondary, {
                    opacity: 1, y: 0, duration: 0.3,
                    ease: 'power3.out', easeReverse: 'power4.out',
                }, 0.35)

                .to(divider, {
                    scaleX: 1, duration: 0.4,
                    ease: 'power2.out', easeReverse: 'power3.in',
                }, 0.3)

                .addPause();

            stateRef.current.enterEnd = tl.duration();

            tl
                .to(barTop, {
                    attr: { x1: 3, y1: 8, x2: 21, y2: 8 },
                    duration: 0.2, ease: 'power3.in',
                })
                .to(barBot, {
                    attr: { x1: 3, y1: 16, x2: 21, y2: 16 },
                    duration: 0.2, ease: 'power3.in',
                }, '<')
                .to(panels, {
                    y: '110vh', rotation: 'random(-20, 20)',
                    duration: 0.9, ease: 'power3.in',
                    stagger: { from: 'end', each: 0.03 },
                }, '<')
                .to(bg, {
                    opacity: 0, duration: 0.3, ease: 'power2.in',
                }, '<0.1')
                .set(nav, { visibility: 'hidden', pointerEvents: 'none' });

            stateRef.current.tl = tl;
        });

        return () => {
            cancelled = true;
            if (stateRef.current.tl) {
                stateRef.current.tl.revert();
                stateRef.current.tl = null;
            }
            document.body.style.overflow = '';
        };
    }, []);

    function toggle() {
        const s = stateRef.current;
        if (!s.tl) return;

        s.isOpen = !s.isOpen;
        setIsOpen(s.isOpen);
        document.body.style.overflow = s.isOpen ? 'hidden' : '';

        if (s.isOpen) {
            if (s.tl.time() >= s.enterEnd) {
                s.tl.timeScale(1).restart();
            } else {
                s.tl.timeScale(1).play();
            }
        } else {
            if (s.tl.time() < s.enterEnd) {
                s.tl.timeScale(1.5).reverse();
            } else {
                s.tl.timeScale(1).play();
            }
        }
    }

    useEffect(() => {
        function onKey(e) {
            if (e.key === 'Escape' && stateRef.current.isOpen) toggle();
        }
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    return (
        <div ref={wrapRef}>
            <button
                type="button"
                onClick={toggle}
                className="pp-menu-toggle"
                aria-expanded={isOpen}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-controls="pp-nav"
            >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <line className="bar bar-top" x1="3" y1="8" x2="21" y2="8"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line className="bar bar-bot" x1="3" y1="16" x2="21" y2="16"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </button>

            <div ref={navRef} id="pp-nav" className="pp-nav" role="dialog" aria-modal="true" aria-label="Navigation">
                <div className="pp-nav-bg" onClick={() => { if (stateRef.current.isOpen) toggle(); }} />

                <div className="pp-nav-panel pp-nav-main">
                    <ul className="pp-nav-list">
                        {navLinks.map((item) => (
                            <li key={item.href} className="pp-nav-item">
                                <a href={item.href} className="pp-nav-link">
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="pp-divider" />

                    <div className="pp-nav-secondary">
                        {secondaryLinks.map((item) => (
                            <a key={item.href} href={item.href} className="pp-nav-secondary-link">
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div>

                <div className="pp-nav-panel pp-nav-footer">
                    <span className="pp-nav-copy">&copy; Pablo Pinxit Visual Artist</span>
                </div>
            </div>
        </div>
    );
}
