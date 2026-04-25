// =============================================
// SPLASH SCREEN — impc.vn style (Final)
// =============================================
(function initSplash() {
    const splash = document.getElementById('splash-screen');
    if (!splash) return;

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

    // Scroll Storytelling logic
    const storySection = document.getElementById('story-section');
    const quoteTextContainer = document.querySelector('.quote-text');
    let storyLines = document.querySelectorAll('.story-line');
    let isStoryTicking = false;

    function buildStoryLines() {
        if (!quoteTextContainer) return;
        
        let fullText = "";
        if (typeof getTranslationValue === 'function') {
            fullText = getTranslationValue('Trang chủ.Section 2.content');
        }
        
        if (!fullText) {
            fullText = "Dựa trên nền tảng chuyên môn vững chắc, IMPC mang đến <br> hệ sinh thái dịch vụ trọn gói từ thi công đến vận hành. Chúng <br> tôi đồng hành cùng khách hàng xuyên suốt vòng đời dự án, <br> cam kết chất lượng vượt trội và giá trị tài sản bền vững.";
        }

        quoteTextContainer.innerHTML = ''; // clear

        // Generate span for every word
        const words = fullText.split(' ');
        words.forEach(word => {
            if (word.trim() === '') return;
            const span = document.createElement('span');
            span.className = 'story-word story-line'; // keep story-line class for CSS transitional attributes
            span.textContent = word;
            quoteTextContainer.appendChild(span);
            quoteTextContainer.appendChild(document.createTextNode(' '));
        });

        // Calculate offsetTop line barriers
        const spans = Array.from(quoteTextContainer.querySelectorAll('.story-word'));
        storyLines = [];
        let currentLine = [];
        let currentOffset = -1;

        spans.forEach(span => {
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

    // Build initially
    buildStoryLines();

    // Rebuild on language change
    window.addEventListener('language-changed', buildStoryLines);
    window.addEventListener('i18n-ready', buildStoryLines);

    if (storySection) {
        window.addEventListener('scroll', () => {
            if (!isStoryTicking && storyLines.length > 0) {
                window.requestAnimationFrame(() => {
                    const rect = storySection.getBoundingClientRect();
                    const scrollDistance = -rect.top;
                    const scrollMax = storySection.offsetHeight - window.innerHeight;

                    if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
                        let progress = scrollDistance / scrollMax;
                        progress = Math.max(0, Math.min(1, progress));

                        const lineIndex = Math.floor(progress * storyLines.length);
                        const safeIndex = Math.min(storyLines.length - 1, lineIndex);

                        storyLines.forEach((lineArr, idx) => {
                            if (idx === safeIndex) {
                                lineArr.forEach(span => span.classList.add('active'));
                            } else {
                                lineArr.forEach(span => span.classList.remove('active'));
                            }
                        });
                    } else if (rect.top > 0) {
                        storyLines.forEach(lineArr => lineArr.forEach(span => span.classList.remove('active')));
                    } else if (rect.bottom < window.innerHeight) {
                        storyLines.forEach((lineArr, idx) => {
                            if (idx === storyLines.length - 1) {
                                lineArr.forEach(span => span.classList.add('active'));
                            } else {
                                lineArr.forEach(span => span.classList.remove('active'));
                            }
                        });
                    }
                    isStoryTicking = false;
                });
                isStoryTicking = true;
            }
        });
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

    // Culture Absolute Yo-Yo Scroll Animation
    const cultureSection = document.getElementById('culture');
    const cultureItems = document.querySelectorAll('.culture-item');
    const cultureStar = document.querySelector('.culture-sticky-star');
    const cultureContainer = document.querySelector('.culture-timeline');
    let isCultureTicking = false;

    if (cultureSection && cultureItems.length > 0 && cultureStar && cultureContainer) {
        window.addEventListener('scroll', () => {
            if (!isCultureTicking) {
                window.requestAnimationFrame(() => {
                    const containerTop = cultureContainer.getBoundingClientRect().top;
                    const TOP_LIMIT = 150;
                    const MIDDLE_LIMIT = window.innerHeight * 0.5;

                    const itemYs = Array.from(cultureItems).map(item => item.offsetTop + item.offsetHeight / 2);
                    const vYs = itemYs.map(y => containerTop + y);

                    let targetVy = vYs[0]; // default attached to Item 0

                    if (vYs[0] >= TOP_LIMIT) {
                        targetVy = vYs[0];
                    }
                    else if (vYs[0] < TOP_LIMIT && vYs[1] > MIDDLE_LIMIT) {
                        const totalScroll = (itemYs[1] - MIDDLE_LIMIT) - (itemYs[0] - TOP_LIMIT);
                        const passed = TOP_LIMIT - vYs[0];
                        let p = passed / totalScroll;
                        p = Math.max(0, Math.min(1, p));
                        targetVy = TOP_LIMIT + p * (MIDDLE_LIMIT - TOP_LIMIT);
                    }
                    else if (vYs[1] <= MIDDLE_LIMIT && vYs[1] >= TOP_LIMIT) {
                        targetVy = vYs[1];
                    }
                    else if (vYs[1] < TOP_LIMIT && vYs[2] > MIDDLE_LIMIT) {
                        const totalScroll = (itemYs[2] - MIDDLE_LIMIT) - (itemYs[1] - TOP_LIMIT);
                        const passed = TOP_LIMIT - vYs[1];
                        let p = passed / totalScroll;
                        p = Math.max(0, Math.min(1, p));
                        targetVy = TOP_LIMIT + p * (MIDDLE_LIMIT - TOP_LIMIT);
                    }
                    else if (vYs[2] <= MIDDLE_LIMIT) {
                        targetVy = vYs[2]; // Locks to the final item and scrolls completely out of view
                    }

                    // Apply star position natively using translate3d for hardware acceleration
                    const absoluteY = targetVy - containerTop;
                    cultureStar.style.transform = `translate(-50%, -50%) translate3d(0, ${absoluteY}px, 0)`;

                    // Dynamic fade for text blocks based on strict distance to the Star!
                    cultureItems.forEach((item, idx) => {
                        const distance = Math.abs(vYs[idx] - targetVy);
                        if (distance < window.innerHeight * 0.3) {
                            item.classList.add('active');
                        } else {
                            item.classList.remove('active');
                        }
                    });

                    isCultureTicking = false;
                });
                isCultureTicking = true;
            }
        });
    }

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
});
