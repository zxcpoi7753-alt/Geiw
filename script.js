/* ================= التهيئة والبيانات ================= */
const siteData = {
    nav: [
        { id: 'home', label: '🏠 الرئيسية' },
        { id: 'student', label: '📖 ركن الطالب' },
        { id: 'quiz', label: '🧠 المسابقات' }, // قسم جديد
        { id: 'ranks', label: '🏆 الأوائل' },
        { id: 'schedule', label: '📅 الجداول' },
        { id: 'teachers', label: '👨‍🏫 المعلمون' },
        { id: 'about', label: 'ℹ️ من نحن' },
        { id: 'mobile', label: '📱 التطبيق' }
    ],
    news: [
        { title: "تكريم الطلاب المتميزين لهذا الشهر", date: "15-1", winners: ["سعيد أحمد", "محمد فؤاد"] },
        { title: "فتح باب التسجيل للدورة الصيفية", date: "12-1" }
    ],
    ranks: [
        { ring: "حلقة عمر بن الخطاب", students: ["خالد أحمد", "ياسين عمر"] },
        { ring: "حلقة أبي بكر الصديق", students: ["سعد إبراهيم", "عبدالله علي"] },
        { ring: "حلقة عثمان بن عفان", students: ["بدر ناصر", "ريان يوسف"] }
    ],
    teachers: [
        { name: "الشيخ عبدالله", job: "المشرف العام" },
        { name: "أ. أحمد محمد", job: "معلم حلقة أبي بكر" }
    ],
    schedule: {
        asr: [ { name: "حلقة عمر", time: "4:00 - 5:00 عصراً", days: "السبت - الأربعاء" } ],
        maghrib: [ 
            { name: "حلقة أبي بكر", time: "المغرب - العشاء", days: "يومياً" },
            { name: "حلقة عثمان", time: "المغرب - العشاء", days: "يومياً" }
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNav();
    loadContent();
    setupAccordions();
    setupCalculators();
    initVerseTicker();
    initQuiz(); // تهيئة المسابقات
});

/* ================= 1. المظهر والتنقل ================= */
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-btn').innerText = "🌙 ليلي";
    }
    
    document.getElementById('theme-btn').addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        document.getElementById('theme-btn').innerText = isDark ? "🌙 ليلي" : "☀️ نهاري";
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

function initNav() {
    const nav = document.getElementById('nav-container');
    siteData.nav.forEach((item, idx) => {
        const btn = document.createElement('button');
        btn.className = `nav-btn ${idx === 0 ? 'active' : ''}`;
        btn.innerText = item.label;
        btn.onclick = () => switchSection(item.id, btn);
        nav.appendChild(btn);
    });
}

function switchSection(id, btn) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(`section-${id}`).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ================= 2. تحميل المحتوى ================= */
function loadContent() {
    // الأخبار
    const newsList = document.getElementById('news-list');
    siteData.news.forEach(n => {
        const hasWinners = n.winners && n.winners.length > 0;
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `<strong>📅 ${n.date}</strong><p>${n.title}</p>`;
        
        if (hasWinners) {
            div.style.borderRight = "4px solid var(--accent)";
            div.style.cursor = "pointer";
            div.onclick = () => alert(`🎉 الفائزون:\n${n.winners.join('\n')}`);
        }
        newsList.appendChild(div);
    });

    // الأوائل
    const ranksList = document.getElementById('ranks-list');
    siteData.ranks.forEach(r => {
        const div = document.createElement('div');
        div.className = 'card';
        div.style.borderRight = "4px solid var(--primary)";
        div.innerHTML = `<h3>${r.ring}</h3><ul>${r.students.map(s => `<li>${s}</li>`).join('')}</ul>`;
        ranksList.appendChild(div);
    });

    // المعلمون
    const teachersList = document.getElementById('teachers-list');
    siteData.teachers.forEach(t => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `<strong>${t.name}</strong><br><small style="color:var(--text-sec)">${t.job}</small>`;
        teachersList.appendChild(div);
    });

    // أزرار الجداول
    const createSchedBtn = (ring, containerId) => {
        const btn = document.createElement('button');
        btn.className = 'calc-btn'; 
        btn.innerText = ring.name;
        btn.style.margin = "2px";
        btn.onclick = () => showSchedule(ring);
        document.getElementById(containerId).appendChild(btn);
    };
    siteData.schedule.asr.forEach(r => createSchedBtn(r, 'btns-asr'));
    siteData.schedule.maghrib.forEach(r => createSchedBtn(r, 'btns-maghrib'));
}

function showSchedule(ring) {
    document.getElementById('schedule-display').innerHTML = `
        <div class="card" style="animation: fadeIn 0.5s">
            <h3>📌 ${ring.name}</h3>
            <table>
                <tr><th>الأيام</th><th>الوقت</th></tr>
                <tr><td>${ring.days}</td><td>${ring.time}</td></tr>
            </table>
        </div>
    `;
}

function initVerseTicker() {
    const verses = ["وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا", "إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ", "كِتَابٌ أَنزَلْنَاهُ إِلَيْكَ مُبَارَكٌ"];
    const el = document.getElementById('verse-ticker');
    let i = 0;
    setInterval(() => {
        el.style.opacity = 0;
        setTimeout(() => {
            el.innerText = verses[i];
            el.style.opacity = 1;
            i = (i + 1) % verses.length;
        }, 500);
    }, 5000);
    el.innerText = verses[0];
}

/* ================= 3. الحاسبات (ركن الطالب) ================= */
function setupAccordions() {
    const acc = document.getElementsByClassName("accordion-btn");
    for (let i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("active-acc");
            const panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    }
}

// أ. حاسبة الجهد
let calcEffortDays = 0;
function setupCalculators() {
    // إعداد أزرار الأيام للحاسبة 1
    const daysContainer = document.getElementById('days-options');
    [1,2,3,4,5,6,7].forEach(d => {
        let btn = document.createElement('button');
        btn.className = 'calc-btn'; btn.innerText = d === 7 ? "يومياً" : `${d} أيام`;
        btn.onclick = () => {
            calcEffortDays = d;
            document.getElementById('step-1-days').style.display = 'none';
            document.getElementById('step-2-amount').style.display = 'block';
        };
        daysContainer.appendChild(btn);
    });

    // إعداد أزرار الكمية للحاسبة 1
    const amountContainer = document.getElementById('amount-options');
    [{v:0.5, t:"نصف صفحة"}, {v:1, t:"صفحة"}, {v:2, t:"صفحتان"}].forEach(a => {
        let btn = document.createElement('button');
        btn.className = 'calc-btn'; btn.innerText = a.t;
        btn.onclick = () => runEffortCalc(a.v);
        amountContainer.appendChild(btn);
    });

    // إعداد القوائم للحاسبة 2 (الوقت)
    populateSelect('target-days', 1, 30, 'يوم');
    populateSelect('target-months', 1, 12, 'شهر');
    populateSelect('target-years', 1, 5, 'سنة');
    for(let i=1; i<=29; i++) {
        let op = document.createElement('option');
        op.value = i; op.text = i + " جزء";
        document.getElementById('skipped-parts').appendChild(op);
    }
}

function calculateEffortCustom() {
    const val = parseFloat(document.getElementById('custom-pages').value);
    if(val > 0) runEffortCalc(val);
}

function runEffortCalc(pagesPerDay) {
    const totalPages = 604;
    const weekly = calcEffortDays * pagesPerDay;
    const totalDays = (totalPages / weekly) * 7;
    
    const years = Math.floor(totalDays / 365);
    const months = Math.floor((totalDays % 365) / 30);
    const days = Math.floor((totalDays % 365) % 30);

    const res = document.getElementById('result-effort');
    res.style.display = 'block';
    res.innerHTML = `
        <h3>🎉 النتيجة</h3>
        <p>تختم خلال: <strong>${years>0?years+' سنة و ':''}${months} شهر و ${days} يوم</strong></p>
    `;
    document.getElementById('step-2-amount').style.display = 'none';
    document.getElementById('reset-effort').style.display = 'block';
}

function resetEffortCalc() {
    calcEffortDays = 0;
    document.getElementById('step-1-days').style.display = 'block';
    document.getElementById('step-2-amount').style.display = 'none';
    document.getElementById('result-effort').style.display = 'none';
    document.getElementById('reset-effort').style.display = 'none';
}

// ب. حاسبة الوقت
function populateSelect(id, min, max, suffix) {
    const sel = document.getElementById(id);
    let op0 = document.createElement('option'); op0.value=0; op0.text = `0 ${suffix}`; sel.appendChild(op0);
    for(let i=min; i<=max; i++) {
        let op = document.createElement('option');
        op.value=i; op.text = `${i} ${suffix}`;
        sel.appendChild(op);
    }
}

function calculateTimePlan() {
    const d = parseInt(document.getElementById('target-days').value);
    const m = parseInt(document.getElementById('target-months').value);
    const y = parseInt(document.getElementById('target-years').value);
    const skip = parseInt(document.getElementById('skipped-parts').value);
    
    const totalDays = d + (m*30) + (y*365);
    if(totalDays === 0) return alert('الرجاء تحديد المدة');

    const remainingPages = (30 - skip) * 20;
    const daily = remainingPages / totalDays;
    
    let msg = daily < 1 ? `${Math.ceil(daily*15)} أسطر` : `${Math.ceil(daily)} صفحات`;

    const res = document.getElementById('result-time');
    res.style.display = 'block';
    res.innerHTML = `
        <h3>🎯 خطتك اليومية</h3>
        <p>المطلوب منك: <strong style="color:var(--primary); font-size:1.3em">${msg}</strong> يومياً</p>
    `;
}

/* ================= 4. المسابقات (جديد!) ================= */
// قاعدة بيانات مصغرة للمسابقات (للتوضيح)
const quizData = [
    { text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", surah: "الفاتحة", ayah: 2, juz: 1, next: "الرَّحْمَٰنِ الرَّحِيمِ" },
    { text: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", surah: "البقرة", ayah: 255, juz: 3, next: "لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ" },
    { text: "قُلْ هُوَ اللَّهُ أَحَدٌ", surah: "الإخلاص", ayah: 1, juz: 30, next: "اللَّهُ الصَّمَدُ" },
    { text: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", surah: "الكوثر", ayah: 1, juz: 30, next: "فَصَلِّ لِرَبِّكَ وَانْحَرْ" },
    { text: "عَمَّ يَتَسَاءَلُونَ", surah: "النبأ", ayah: 1, juz: 30, next: "عَنِ النَّبَإِ الْعَظِيمِ" }
];

let currentAnswer = {};

function initQuiz() {
    const juzSel = document.getElementById('quiz-juz');
    juzSel.innerHTML = '<option value="0">كل الأجزاء</option>';
    [1, 3, 30].forEach(j => { // أمثلة للأجزاء
        let op = document.createElement('option');
        op.value = j; op.text = `الجزء ${j}`;
        juzSel.appendChild(op);
    });
}

function updateQuizSurahs() {
    // يمكن تطوير هذا الجزء لفلترة السور بناء على الجزء المختار
}

function generateQuestion() {
    const juz = parseInt(document.getElementById('quiz-juz').value);
    const type = document.getElementById('quiz-type').value;
    
    // تصفية الأسئلة المتاحة
    let pool = quizData;
    if (juz !== 0) pool = quizData.filter(q => q.juz === juz);
    
    if (pool.length === 0) {
        alert("لا توجد أسئلة متاحة لهذا الجزء في قاعدة البيانات التجريبية");
        return;
    }

    const q = pool[Math.floor(Math.random() * pool.length)];
    let qTxt = "", aTxt = "";

    if (type === 'complete') {
        qTxt = `أكمل الآية التي تلي:<br><strong style="color:var(--primary)">${q.text}</strong>`;
        aTxt = q.next;
    } else if (type === 'surah_name') {
        qTxt = `في أي سورة تقع هذه الآية؟<br><strong style="color:var(--primary)">${q.text}</strong>`;
        aTxt = `سورة ${q.surah}`;
    } else {
        qTxt = `ما رقم هذه الآية؟<br><strong style="color:var(--primary)">${q.text}</strong>`;
        aTxt = `الآية رقم ${q.ayah}`;
    }

    document.getElementById('quiz-area').style.display = 'block';
    document.getElementById('question-text').innerHTML = qTxt;
    document.getElementById('answer-box').style.display = 'none';
    document.getElementById('show-answer-btn').style.display = 'inline-block';
    
    currentAnswer = { main: aTxt, detail: `سورة ${q.surah} - آية ${q.ayah}` };
}

function showAnswer() {
    document.getElementById('show-answer-btn').style.display = 'none';
    document.getElementById('answer-box').style.display = 'block';
    document.getElementById('answer-text').innerText = currentAnswer.main;
    document.getElementById('answer-details').innerText = currentAnswer.detail;
}
