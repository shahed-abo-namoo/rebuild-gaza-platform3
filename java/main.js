document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
    initializeCalculator();
    initializeSmoothScrolling();
    initializeScrollHeader();
    initializeActiveNav();
});


function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('show');
        });
        
        
        const navLinks = document.querySelectorAll('#mainNav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mainNav.classList.remove('show');
                
            
                navLinks.forEach(item => item.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
}

// حاسبة التكاليف
function initializeCalculator() {
    const calculateBtn = document.getElementById('calculateBtn');
    const resultBox = document.getElementById('resultBox');
    const costResult = document.getElementById('costResult');
    
    if (calculateBtn && resultBox && costResult) {
        calculateBtn.addEventListener('click', function() {
            calculateCost();
        });
        
        // حساب التكلفة عند تغيير أي حقل
        const inputs = document.querySelectorAll('#area, #damage, #floors, #quality');
        inputs.forEach(input => {
            input.addEventListener('change', function() {
                calculateCost();
            });
        });
        
        // حساب التكلفة الأولية عند تحميل الصفحة
        calculateCost();
    }
}

function calculateCost() {
    const area = parseInt(document.getElementById('area').value) || 120;
    const damage = parseInt(document.getElementById('damage').value) || 2;
    const floors = parseInt(document.getElementById('floors').value) || 2;
    const quality = parseInt(document.getElementById('quality').value) || 2;
    
    // سعر المتر الأساسي (شيكل)
    const BASE_PRICE = 800;
    
    // عوامل التعديل
    const damageFactors = {
        1: 0.6,  // أضرار طفيفة
        2: 1.0,  // أضرار متوسطة
        3: 1.5   // أضرار جسيمة
    };
    
    const qualityFactors = {
        1: 0.8,  // اقتصادية
        2: 1.0,  // متوسطة
        3: 1.3   // عالية
    };
    
    // كل طابق إضافي يزيد التكلفة 20%
    const floorFactor = 1 + (floors - 1) * 0.2;
    
    // حساب التكلفة
    const totalCost = Math.round(
        area * BASE_PRICE * 
        damageFactors[damage] * 
        floorFactor * 
        qualityFactors[quality]
    );
    
    
    const formattedCost = totalCost.toLocaleString('ar-PS');
    
    // عرض النتيجة
    const resultBox = document.getElementById('resultBox');
    const costResult = document.getElementById('costResult');
    
    costResult.textContent = `${formattedCost} شيكل`;
    resultBox.style.display = 'block';
    
    resultBox.style.animation = 'none';
    setTimeout(() => {
        resultBox.style.animation = 'fadeIn 0.5s ease';
    }, 10);
    
    // تحديث السعر بناءً على العوامل
    updateCostBreakdown(area, damage, floors, quality, totalCost);
}

function updateCostBreakdown(area, damage, floors, quality, totalCost) {
    // يمكن إضافة تفاصيل أكثر عن التكلفة هنا
    console.log(`حساب التكلفة:
    - المساحة: ${area} م²
    - حالة الأضرار: ${getDamageText(damage)}
    - عدد الطوابق: ${floors}
    - جودة المواد: ${getQualityText(quality)}
    - التكلفة الإجمالية: ${totalCost.toLocaleString()} شيكل`);
}

function getDamageText(damage) {
    const damageTexts = {
        1: "أضرار طفيفة",
        2: "أضرار متوسطة",
        3: "أضرار جسيمة"
    };
    return damageTexts[damage] || "غير محدد";
}

function getQualityText(quality) {
    const qualityTexts = {
        1: "اقتصادية",
        2: "متوسطة",
        3: "عالية"
    };
    return qualityTexts[quality] || "متوسطة";
}


function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initializeScrollHeader() {
    const header = document.querySelector('header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
            } else {
                header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }
        });
    }
}

// تحديث الرابط النشط أثناء التمرير
function initializeActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#mainNav a');
    
    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', function() {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollY >= (sectionTop - 150)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
}


function checkElementExists(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`العنصر ${selector} غير موجود في الصفحة`);
        return false;
    }
    return true;
}


window.addEventListener('load', function() {
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
 
    const animatedElements = document.querySelectorAll('.engineer-card, .contact-card, .timeline-content');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // تحميل البيانات بشكل ديناميكي (يمكن توسيعها لاحقًا)
    loadEngineersData();
});

// دالة محاكاة لتحميل بيانات المهندسين (يمكن استبدالها بطلب API)
function loadEngineersData() {
    const engineersData = [
        {
            name: "م. أحمد محمود",
            specialty: "مهندس إنشائي",
            description: "خبرة 15 عامًا في التصميم الإنشائي وتقييم الأضرار. متخصص في إعادة تأهيل المباني المتضررة.",
            phone: "0599-123456",
            email: "ahmed@engineers.ps",
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            name: "م. سارة خالد",
            specialty: "مهندسة معمارية",
            description: "متخصصة في تصميم المساكن المستدامة ومنخفضة التكلفة. تقدم استشارات مجانية للأسر المتضررة.",
            phone: "0599-654321",
            email: "sara@engineers.ps",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            name: "م. محمد حسن",
            specialty: "مهندس مدني",
            description: "خبرة في إدارة مشاريع إعادة الإعمار، متخصص في تقدير الكميات والتكاليف والجدولة الزمنية.",
            phone: "0599-112233",
            email: "mohamed@engineers.ps",
            image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
    ];
    
    console.log('تم تحميل بيانات المهندسين:', engineersData.length, 'مهندس');
}