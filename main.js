// =============================================
// SPLASH SCREEN — impc.vn style (Final)
// Chỉ hiển thị khi: lần đầu vào web HOẶC reload trang
// KHÔNG hiển thị khi: navigate từ trang khác về Trang chủ
// =============================================
(function initSplash() {
    const splash = document.getElementById('splash-screen');
    if (!splash) return;

    // Detect xem đây có phải là reload không
    const navEntry = performance.getEntriesByType('navigation')[0];
    const isReload = navEntry ? navEntry.type === 'reload' : performance.navigation.type === 1;

    // Detect xem splash đã được hiển thị trong session này chưa
    const alreadyShown = sessionStorage.getItem('splashShown');

    // Nếu KHÔNG phải reload VÀ đã từng hiện splash → skip (navigate nội bộ)
    if (!isReload && alreadyShown) {
        splash.classList.add('splash-done');
        document.body.classList.remove('splash-active');
        // Không cần animation, hiện content ngay
        return;
    }

    // Đánh dấu splash đã hiện trong session này
    sessionStorage.setItem('splashShown', '1');

    // Khoá scroll trong lúc splash đang hiển thị
    document.body.style.overflow = 'hidden';

    const HOLD_MS     = 1400;  // Giữ sau khi logo rise xong
    const LINE_MS     = 500;   // Thời gian line thu về giữa
    const SPLIT_MS    = 550;   // Thời gian split reveal (bg panels bay ra)

    setTimeout(() => {
        // Bước 1: Logo sink + Line shrink (đồng thời)
        splash.classList.add('splash-exit');

        // Bước 2: Sau khi line thu xong → Split Reveal bắt đầu
        setTimeout(() => {
            splash.classList.add('splash-split');

            // Bước 3: Sau khi bg panels bay hết → dọn dẹp DOM + reveal content
            setTimeout(() => {
                splash.classList.add('splash-done');
                document.body.style.overflow = '';

                // Trigger page content fade-in
                document.body.classList.remove('splash-active');
                document.body.classList.add('page-reveal');
            }, SPLIT_MS);

        }, LINE_MS);

    }, HOLD_MS);
})();

document.addEventListener('DOMContentLoaded', () => {
    // Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Activate reveal elements based on scroll
    const reveals = document.querySelectorAll('.reveal');


    // Legacy Single-Page Scroll Spy and Smooth Scrolling disabled to allow multi-page routing.

    // ===== SCROLL STORYTELLING — Interactive Scroll-Scrubbing =====
    const storySection = document.getElementById('story-section');
    const quoteTextContainer = document.querySelector('.quote-text');
    let storyLines = [];
    let allStoryWords = [];
    let isStoryTicking = false;

    function buildStoryLines() {
        if (!quoteTextContainer) return;

        let fullText = "";
        if (typeof getTranslationValue === 'function') {
            fullText = getTranslationValue('Trang chủ.Section 2.content');
        }

        if (!fullText) {
            fullText = "Dựa trên nền tảng chuyên môn vững chắc, IMPC mang đến hệ sinh thái dịch vụ trọn gói từ thi công đến vận hành. Chúng tôi đồng hành cùng khách hàng xuyên suốt vòng đời dự án, cam kết chất lượng vượt trội và giá trị tài sản bền vững.";
        }

        // Strip HTML line-break tags before splitting
        fullText = fullText.replace(/<br\s*\/?>/gi, ' ');

        quoteTextContainer.innerHTML = ''; // clear

        // Generate a <span> for every word
        const words = fullText.split(/\s+/).filter(w => w.length > 0);
        words.forEach(word => {
            const span = document.createElement('span');
            span.className = 'story-word story-line';
            span.textContent = word;
            quoteTextContainer.appendChild(span);
            quoteTextContainer.appendChild(document.createTextNode(' '));
        });

        // Collect all word spans for scroll-scrubbing
        allStoryWords = Array.from(quoteTextContainer.querySelectorAll('.story-word'));

        // Also group by line (for optional future use)
        storyLines = [];
        let currentLine = [];
        let currentOffset = -1;
        allStoryWords.forEach(span => {
            if (currentOffset === -1 || Math.abs(span.offsetTop - currentOffset) > 10) {
                if (currentLine.length > 0) storyLines.push(currentLine);
                currentLine = [span];
                currentOffset = span.offsetTop;
            } else {
                currentLine.push(span);
            }
        });
        if (currentLine.length > 0) storyLines.push(currentLine);
    }

    function updateStoryScrub() {
        if (!storySection || allStoryWords.length === 0) return;

        const rect = storySection.getBoundingClientRect();
        const sectionH = storySection.offsetHeight; // e.g. 250vh
        const viewH = window.innerHeight;

        // The "scrollable distance" for this section is (sectionH - viewH).
        // Progress = how far we've scrolled past the section's top edge.
        // rect.top = 0  → section top just hit viewport top  (start)
        // rect.top = -(sectionH - viewH) → section bottom just hit viewport bottom (end)
        const scrollable = sectionH - viewH;

        // When rect.top <= 0 we're inside the sticky zone.
        // rawProgress: 0 at entry, 1 at exit.
        const rawProgress = scrollable > 0 ? -rect.top / scrollable : 0;
        const progress = Math.min(1, Math.max(0, rawProgress));

        // Light up words proportionally to scroll progress
        const total = allStoryWords.length;
        const activeCount = Math.round(progress * total);

        allStoryWords.forEach((span, i) => {
            if (i < activeCount) {
                span.classList.add('active');
            } else {
                span.classList.remove('active');
            }
        });
    }

    // Build initially
    buildStoryLines();

    // Rebuild on language change, then re-scrub
    window.addEventListener('language-changed', () => { buildStoryLines(); updateStoryScrub(); });
    window.addEventListener('i18n-ready',       () => { buildStoryLines(); updateStoryScrub(); });

    // Hook into scroll
    if (storySection) {
        window.addEventListener('scroll', () => {
            if (!isStoryTicking) {
                window.requestAnimationFrame(() => {
                    updateStoryScrub();
                    isStoryTicking = false;
                });
                isStoryTicking = true;
            }
        }, { passive: true });

        // Run once on load in case page loads mid-scroll
        updateStoryScrub();
    }

    // Timeline Scroll Logic
    const timelineSection = document.getElementById('history-section');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const progressLine = document.getElementById('timeline-progress');
    const timelineContainer = document.getElementById('timeline');
    const historyTitle = document.querySelector('.history-title');
    const historyLeft = document.querySelector('.history-left');

    let isTimelineTicking = false;
    if (timelineSection && progressLine && timelineItems.length > 0) {
        window.addEventListener('scroll', () => {
            if (!isTimelineTicking) {
                window.requestAnimationFrame(() => {
                    const containerRect = timelineContainer.getBoundingClientRect();
                    const drawStart = window.innerHeight * 0.6;
                    const progress = drawStart - containerRect.top;

                    if (progress > 0) {
                        const maxLineHeight = timelineContainer.offsetHeight - 48;
                        const constrainedProgress = Math.min(maxLineHeight, progress);
                        progressLine.style.height = `${constrainedProgress}px`;

                        let isLastActive = false;

                        // Optimize layout thrashing by calculating absolute top from parent bounds
                        const containerTop = containerRect.top;

                        timelineItems.forEach((item, idx) => {
                            // Using offsetTop preserves performance vs getBoundingClientRect() inside loop
                            const itemAbsoluteTop = containerTop + item.offsetTop;

                            if (itemAbsoluteTop + 20 < drawStart) {
                                item.classList.add('active');
                                if (idx === timelineItems.length - 1) {
                                    isLastActive = true;
                                }
                            } else {
                                item.classList.remove('active');
                            }
                        });

                        if (isLastActive && historyTitle && historyLeft) {
                            if (!historyTitle.classList.contains('unfixed')) {
                                const titleRect = historyTitle.getBoundingClientRect();
                                const leftRect = historyLeft.getBoundingClientRect();
                                const offsetTop = titleRect.top - leftRect.top;

                                historyTitle.style.position = 'absolute';
                                historyTitle.style.top = `${offsetTop}px`;
                                historyTitle.classList.add('unfixed');
                            }
                        } else if (!isLastActive && historyTitle && historyTitle.classList.contains('unfixed')) {
                            historyTitle.style.position = 'sticky';
                            historyTitle.style.top = '120px';
                            historyTitle.classList.remove('unfixed');
                        }

                    } else {
                        progressLine.style.height = '0px';
                        timelineItems.forEach(item => item.classList.remove('active'));

                        if (historyTitle && historyTitle.classList.contains('unfixed')) {
                            historyTitle.style.position = 'sticky';
                            historyTitle.style.top = '120px';
                            historyTitle.classList.remove('unfixed');
                        }
                    }
                    isTimelineTicking = false;
                });
                isTimelineTicking = true;
            }
        });
    }

    // Culture Absolute Yo-Yo Scroll Animation has been removed since the layout changed to 3 floating cards

    // ===== STAT COUNTER ANIMATION =====
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    if (statNumbers.length > 0) {
        const animateCounter = (el) => {
            const target = parseInt(el.getAttribute('data-target'), 10);
            const suffix = el.getAttribute('data-suffix') || '';
            const duration = 2000; // 2 seconds
            const startTime = performance.now();

            const update = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // easeOutQuad for smooth deceleration
                const eased = 1 - (1 - progress) * (1 - progress);
                const current = Math.floor(eased * target);
                el.textContent = current + suffix;

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    el.textContent = target + suffix;
                }
            };

            requestAnimationFrame(update);
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(el => counterObserver.observe(el));
    }

    // ===== BACK TO TOP BUTTON =====
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== PROJECT STACK SCROLL MONITOR =====
    const projectStack = document.querySelector('.projects-cards-vertical-stack');
    if (projectStack) {
        projectStack.addEventListener('scroll', () => {
            if (projectStack.scrollTop > 10) {
                projectStack.classList.add('is-scrolling');
            } else {
                projectStack.classList.remove('is-scrolling');
            }
        });
    }

    // ===== PROJECT MODAL LOGIC =====
    const projectModal = document.getElementById('projectModal');
    const closeProjectModal = document.getElementById('closeProjectModal');
    const projectCardBtns = document.querySelectorAll('.project-card-btn');

    if (projectModal && closeProjectModal) {
        // Open modal
        projectCardBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent jump to top
                
                // Trích xuất tên Dự án từ Card hiện tại và gán vào Modal Title
                const card = btn.closest('.project-card');
                if (card) {
                    const projectName = card.querySelector('.project-name').textContent;
                    const modalTitle = projectModal.querySelector('.project-modal-title');
                    if (modalTitle) {
                        modalTitle.textContent = projectName;
                    }
                }

                projectModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            });
        });

        // Close modal via button
        closeProjectModal.addEventListener('click', () => {
            projectModal.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close modal by clicking outside the box
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                projectModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close modal via Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && projectModal.classList.contains('active')) {
                projectModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ===== CULTURE ROW: direction-aware slide =====
    document.querySelectorAll('.culture-row').forEach(row => {
        row.addEventListener('mouseenter', (e) => {
            const rect = row.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;
            // Mouse came from above or below?
            row.setAttribute('data-dir', e.clientY < midY ? 'down' : 'up');
        });

        row.addEventListener('mouseleave', (e) => {
            const rect = row.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;
            row.setAttribute('data-dir', e.clientY < midY ? 'up' : 'down');
        });
    });

    // ===== CULTURE ROW: Mobile Sliding Background =====
    const cultureRowsContainer = document.querySelector('.culture-rows');
    const cultureRowItems = document.querySelectorAll('.culture-row');
    const mobileBg = document.querySelector('.culture-mobile-bg');

    if (cultureRowsContainer && cultureRowItems.length > 0 && mobileBg) {
        let isCultureTicking = false;
        
        const updateCultureBg = () => {
            if (window.innerWidth > 768) {
                mobileBg.style.display = 'none';
                return;
            }
            mobileBg.style.display = 'block';
            
            const viewCenter = window.innerHeight / 2;
            let closestRow = cultureRowItems[0];
            let minDistance = Infinity;
            
            cultureRowItems.forEach(row => {
                const rect = row.getBoundingClientRect();
                const rowCenter = rect.top + rect.height / 2;
                const distance = Math.abs(viewCenter - rowCenter);
                
                if (distance < minDistance) {
                    minDistance = distance;
                    closestRow = row;
                }
            });
            
            if (closestRow) {
                // Update active classes
                cultureRowItems.forEach(r => r.classList.remove('active-mobile'));
                closestRow.classList.add('active-mobile');
                
                // Move background
                mobileBg.style.transform = `translateY(${closestRow.offsetTop}px)`;
                mobileBg.style.height = `${closestRow.offsetHeight}px`;
            }
        };

        window.addEventListener('scroll', () => {
            if (!isCultureTicking) {
                window.requestAnimationFrame(() => {
                    updateCultureBg();
                    isCultureTicking = false;
                });
                isCultureTicking = true;
            }
        }, { passive: true });
        
        // Initial setup and resize handler
        window.addEventListener('resize', updateCultureBg);
        setTimeout(updateCultureBg, 100);
    }
});
