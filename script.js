// 1. هيكل البيانات (Data Structure)
const siteData = {
    navItems: [
        { id: 'home', label: 'الرئيسية' },
        { id: 'student', label: 'ركن الطالب' },
        { id: 'ranks', label: 'الأوائل' },
        { id: 'schedule', label: 'الجداول' },
        { id: 'teachers', label: 'المعلمون' },
        { id: 'about', label: 'من نحن' },
        { id: 'mobile', label: 'الجوال' }
    ],
    verses: [
        "وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ",
        "كِتَابٌ أَنزَلْنَاهُ إِلَيْكَ مُبَارَكٌ لِّيَدَّبَّرُوا آيَاتِهِ",
        "إِنَّ الَّذِينَ يَتْلُونَ كِتَابَ اللَّهِ وَأَقَامُوا الصَّلَاةَ",
        "بَلْ هُوَ آيَاتٌ بَيِّنَاتٌ فِي صُدُورِ الَّذِينَ أُوتُوا الْعِلْمَ"
    ],
    news: [
        { title: "بداية التسجيل الصيفي", date: "2024-05-01", hasWinner: false },
        { title: "مسابقة الماهر بالقرآن", date: "2024-05-10", hasWinner: true, winners: ["أحمد علي", "خالد عمر"] }
    ],
    ranks: [
        { name: "عمر خالد", circle: "حلقة أبي بكر", juzu: 15 },
        { name: "سعيد محمد", circle: "حلقة عمر", juzu: 10 },
        { name: "يوسف إبراهيم", circle: "حلقة عثمان", juzu: 5 }
    ],
    teachers: [
        { name: "الشيخ أحمد", role: "مشرف عام" },
        { name: "الأستاذ محمود", role: "معلم التجويد" }
    ],
    schedule: {
        asr: [
            { name: "حلقة الفرقان", days: "الأحد - الثلاثاء", time: "العصر" },
            { name: "حلقة البيان", days: "الخميس", time: "العصر" }
        ],
        maghrib: [
            { name: "حلقة النور", days: "يومياً", time: "المغرب" }
        ]
    }
};

// 2. التهيئة والتشغيل (Initialization)
document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initTheme();
    initVerseTicker();
    renderContent();
    setupCalculators();
});

// --- بناء القوائم والتنقل ---
function initNav() {
    const navContainer = document.getElementById('sticky-nav');
    siteData.navItems.forEach((item, index) => {
        const btn = document.createElement('button');
        btn.className = `nav-btn ${index === 0 ? 'active' : ''}`;
        btn.innerText = item.label;
        btn.onclick = () => navigateTo(item.id, btn);
        navContainer.appendChild(btn);
    });
}

function navigateTo(sectionId, btnElement) {
    // إخفاء الكل
    document.querySelectorAll('section').forEach(sec => sec.style.display = 'none');
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    // إظهار المطلوب
    const target = document.getElementById(sectionId);
    target.style.display = 'block';
    target.classList.add('fade-in'); // تأثير الظهور
    btnElement.classList.add('active');
}

// --- الوضع الليلي ---
function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        toggleBtn.innerText = isDark ? '☀️ نهاري' : '🌙 ليلي';
    });
}

// --- شريط الآيات ---
function initVerseTicker() {
    const ticker = document.getElementById('verse-ticker');
    let idx = 0;
    
    // التحديث الأولي
    ticker.innerText = siteData.verses[0];

    setInterval(() => {
        ticker.style.opacity = 0;
        setTimeout(() => {
            idx = (idx + 1) % siteData.verses.length;
            ticker.innerText = siteData.verses[idx];
            ticker.style.opacity = 1;
        }, 500); // نصف ثانية اختفاء
    }, 8000);
}

// --- توليد المحتوى (DOM) ---
function renderContent() {
    // 1. الأخبار
    const newsContainer = document.getElementById('news-container');
    siteData.news.forEach(news => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<h4>${news.title}</h4><small>${news.date}</small>`;
        
        if (news.hasWinner) {
            card.style.cursor = 'pointer';
            card.onclick = () => {
                alert(`قائمة الفائزين:\n${news.winners.join('\n')}`);
            };
        }
        newsContainer.appendChild(card);
    });

    // 2. الأوائل
    const ranksGrid = document.getElementById('ranks-grid');
    siteData.ranks.forEach(student => {
        const card = document.createElement('div');
        card.className = 'card rank-card';
        card.innerHTML = `<h3>${student.name}</h3><p>${student.circle}</p><small>أتم ${student.juzu} أجزاء</small>`;
        ranksGrid.appendChild(card);
    });

    // 3. المعلمون
    const teachersGrid = document.getElementById('teachers-grid');
    siteData.teachers.forEach(teacher => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<strong>${teacher.name}</strong><br><span style="color:gray">${teacher.role}</span>`;
        teachersGrid.appendChild(card);
    });

    // 4. الجداول
    renderScheduleButtons();
}

function renderScheduleButtons() {
    const asrContainer = document.getElementById('asr-btns');
    const maghribContainer = document.getElementById('maghrib-btns');
    const display = document.getElementById('schedule-display');

    // دالة مساعدة لإنشاء أزرار الجدول
    const createBtn = (circle, container) => {
        const btn = document.createElement('button');
        btn.className = 'nav-btn'; // نعيد استخدام نفس ستايل الأزرار
        btn.style.margin = '2px';
        btn.innerText = circle.name;
        btn.onclick = () => {
            display.innerHTML = `
                <div class="card fade-in">
                    <table>
                        <thead><tr><th>اليوم</th><th>الوقت</th></tr></thead>
                        <tbody><tr><td>${circle.days}</td><td>${circle.time}</td></tr></tbody>
                    </table>
                </div>
            `;
        };
        container.appendChild(btn);
    };

    siteData.schedule.asr.forEach(c => createBtn(c, asrContainer));
    siteData.schedule.maghrib.forEach(c => createBtn(c, maghribContainer));
}


// --- الآلات الحاسبة (منطق معقد) ---

// 1. إعداد القوائم المنسدلة (Accordions)
function setupCalculators() {
    const acc = document.getElementsByClassName("accordion-header");
    for (let i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.parentElement.classList.toggle("active");
        });
    }
    setupEffortCalculator();
}

// 2. حاسبة الجهد (خطة ختمي)
function setupEffortCalculator() {
    const daysContainer = document.getElementById('days-options');
    const amountContainer = document.getElementById('amount-options');
    const resultBox = document.getElementById('result-box-effort');
    let selectedDays = 0;

    // توليد أزرار الأيام (1-7)
    for(let i=1; i<=7; i++) {
        let btn = document.createElement('button');
        btn.className = 'calc-btn';
        btn.innerText = `${i} أيام`;
        btn.onclick = () => {
            selectedDays = i;
            document.getElementById('step-1-days').style.display = 'none';
            document.getElementById('step-2-amount').style.display = 'flex'; // استخدام فليكس للأزرار
        };
        daysContainer.appendChild(btn);
    }

    // توليد أزرار الكمية
    const amounts = [
        { label: 'نصف وجه', val: 0.5 },
        { label: 'وجه واحد', val: 1 },
        { label: 'وجهين', val: 2 }
    ];

    amounts.forEach(amt => {
        let btn = document.createElement('button');
        btn.className = 'calc-btn';
        btn.innerText = amt.label;
        btn.onclick = () => {
            calculateEffort(selectedDays, amt.val);
        };
        amountContainer.appendChild(btn);
    });
}

function calculateEffort(daysPerWeek, pagesPerDay) {
    const totalPages = 604;
    const weeklyPages = daysPerWeek * pagesPerDay;
    const totalWeeks = totalPages / weeklyPages;
    
    // تحويل الأسابيع إلى سنوات وأشهر وأيام تقريبياً
    const totalDays = totalWeeks * 7;
    const years = Math.floor(totalDays / 365);
    const months = Math.floor((totalDays % 365) / 30);
    const days = Math.floor((totalDays % 365) % 30);

    const resBox = document.getElementById('result-box-effort');
    resBox.style.display = 'block';
    resBox.innerHTML = `
        <strong>تختم القرآن خلال:</strong><br>
        ${years > 0 ? years + ' سنة و ' : ''} ${months} شهر و ${days} يوم
    `;
}

// 3. حاسبة الوقت (دليل الختم)
function calculateTimePlan() {
    const unit = document.getElementById('time-unit').value;
    const value = parseFloat(document.getElementById('time-value').value);
    const doneJuz = parseFloat(document.getElementById('juz-done').value) || 0;
    
    if(!value) return alert('أدخل المدة');

    // تحويل المدة لأيام
    let totalDays = value;
    if(unit === 'months') totalDays = value * 30;
    if(unit === 'years') totalDays = value * 365;

    // المتبقي من المصحف
    const totalPages = 604;
    const pagesDone = doneJuz * 20; // الجزء 20 صفحة تقريباً
    const pagesLeft = totalPages - pagesDone;

    let dailyPages = pagesLeft / totalDays;
    let msg = "";

    if (dailyPages < 1) {
        // تحويل لأسطر
        let lines = Math.ceil(dailyPages * 15); // الصفحة 15 سطر
        msg = `${lines} أسطر يومياً`;
    } else {
        msg = `${Math.ceil(dailyPages)} صفحة يومياً`;
    }

    const resBox = document.getElementById('result-box-time');
    resBox.style.display = 'block';
    resBox.innerHTML = `
        <p class="fade-in">المطلوب لإتمام الختمة:</p>
        <h3 style="color:var(--primary)">${msg}</h3>
        <small>استعن بالله ولا تعجز</small>
    `;
}
