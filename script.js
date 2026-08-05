/**
 * aicafe.tw - Website Interactive Logic
 * Handles interactive cards, smooth scrolling, navigation behavior,
 * mouse tracker effects, email copy, and mailto redirection form submission.
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Navigation Elements & Scroll Behavior
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky Navbar on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Hamburger Menu Toggle
    menuToggle.addEventListener('click', () => {
        const isOpen = menuToggle.classList.toggle('open');
        navMenu.classList.toggle('open', isOpen);
    });

    // Close Menu when clicking Nav Links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });

    // 2. Active Link Observer on Scroll
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies screen center
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${id}` || (id === 'home' && href === '#')) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // 3. Hover Radial Glow Effect (Interactive Mouse Tracker on Cards)
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Set CSS Custom Properties for cursor location
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 4. Interactive Accordion for Service Cards
    const toggleButtons = document.querySelectorAll('.btn-card-toggle');
    
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid triggering double click side-effects
            const card = btn.closest('.service-card');
            const isActive = card.classList.toggle('active');
            
            // Toggle Button Text and SVG Orientation
            const btnText = btn.querySelector('.btn-text');
            if (isActive) {
                btnText.textContent = '收合詳細說明';
            } else {
                btnText.textContent = '展開詳細說明';
            }
        });
    });

    // 5. Toast Notification Controller
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    let toastTimeout = null;

    function showToast(message) {
        toastMessage.textContent = message;
        toastContainer.classList.add('show');
        
        // Reset any existing timeout
        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }
        
        toastTimeout = setTimeout(() => {
            toastContainer.classList.remove('show');
        }, 3000);
    }

    // 6. Copy Email to Clipboard
    const copyEmailBtn = document.getElementById('btn-copy-email');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const emailValue = document.getElementById('email-text').textContent.trim();
            
            // Clipboard API
            navigator.clipboard.writeText(emailValue)
                .then(() => {
                    showToast('📧 已成功複製電子郵件信箱到剪貼簿！');
                })
                .catch((err) => {
                    console.error('Failed to copy text: ', err);
                    // Fallback for older browsers
                    const tempInput = document.createElement('input');
                    tempInput.value = emailValue;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    try {
                        document.execCommand('copy');
                        showToast('📧 已成功複製電子郵件信箱到剪貼簿！');
                    } catch (e) {
                        showToast('複製失敗，請手動複製信箱。');
                    }
                    document.body.removeChild(tempInput);
                });
        });
    }

    // 7. Contact Form Submitting & Email Client唤起
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop page reload

            // Collect Form Values
            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const service = document.getElementById('contactService').value;
            const message = document.getElementById('contactMessage').value.trim();

            if (!name || !email || !service || !message) {
                showToast('❌ 請完整填寫所有必要欄位。');
                return;
            }

            // Construct mailto Link parameters
            const recipient = 'iossunx@gmail.com';
            const subject = encodeURIComponent(`[aicafe.tw 官網諮詢] - ${service} - ${name}`);
            
            const bodyContent = 
`您好，我對貴司的客製化服務有興趣，以下是我的需求資料：

==================================================
【聯絡姓名 / 貴司名稱】
${name}

【聯絡電子信箱】
${email}

【諮詢服務項目】
${service}

【詳細需求說明】
${message}
==================================================

本信件由 aicafe.tw 官方聯絡表單自動生成。請點擊發送以傳送需求。`;

            const body = encodeURIComponent(bodyContent);
            const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;

            // Trigger mail client opening
            window.location.href = mailtoUrl;

            // Feedback toast to user
            showToast('🚀 已成功喚起 Email 軟體，請於您的信箱點擊「傳送」信件！');

            // Optionally reset form
            contactForm.reset();
        });
    }
});

// 8. Google Translate Widget Dynamic Initialization
window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
        pageLanguage: 'zh-TW',
        includedLanguages: 'en,ja,ko',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
};

(function() {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(script);
})();
