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

    // Single Node Text Looper (3s Interval)
    const titleAnchor = document.getElementById('loop-title-anchor');
    if (titleAnchor) {
        const loopStrings = [
            "In The Field of Industrial Real Estate Development and Management",
            "We Provide Solutions and Services"
        ];
        let loopIdx = 0;

        setInterval(() => {
            // Initiate fade out
            titleAnchor.classList.add('fade-out');

            // Wait for transition to complete before swapping text
            setTimeout(() => {
                loopIdx = (loopIdx + 1) % loopStrings.length;
                titleAnchor.textContent = loopStrings[loopIdx];

                // Jump to physical bottom state instantly
                titleAnchor.classList.remove('fade-out');
                titleAnchor.classList.add('fade-prep');

                // Force layout reflow
                void titleAnchor.offsetWidth;

                // Trigger smooth fade in translation
                titleAnchor.classList.remove('fade-prep');
            }, 800); // 800ms aligns with CSS ease duration
        }, 3800); /* 3000ms hold + 800ms transition */
    }
    // Legacy Single-Page Scroll Spy and Smooth Scrolling disabled to allow multi-page routing.

    // Scroll Storytelling logic
    const storySection = document.getElementById('story-section');
    const storyLines = document.querySelectorAll('.story-line');

    let isStoryTicking = false;
    if (storySection && storyLines.length > 0) {
        window.addEventListener('scroll', () => {
            if (!isStoryTicking) {
                window.requestAnimationFrame(() => {
                    const rect = storySection.getBoundingClientRect();
                    const scrollDistance = -rect.top;
                    const scrollMax = storySection.offsetHeight - window.innerHeight;

                    if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
                        let progress = scrollDistance / scrollMax;
                        progress = Math.max(0, Math.min(1, progress));

                        const lineIndex = Math.floor(progress * storyLines.length);
                        const safeIndex = Math.min(storyLines.length - 1, lineIndex);

                        storyLines.forEach((line, idx) => {
                            if (idx === safeIndex) {
                                line.classList.add('active');
                            } else {
                                line.classList.remove('active');
                            }
                        });
                    } else if (rect.top > 0) {
                        storyLines.forEach(line => line.classList.remove('active'));
                    } else if (rect.bottom < window.innerHeight) {
                        storyLines.forEach((line, idx) => {
                            if (idx === storyLines.length - 1) {
                                line.classList.add('active');
                            } else {
                                line.classList.remove('active');
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
});
