let isDarkMode = false;

// === تبديل الوضع الليلي/النهاري ===
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    const btn = document.getElementById('theme-btn');
    btn.innerText = isDarkMode ? "🌙 ليلي" : "☀️ نهاري";
}

// === تفعيل القوائم المنسدلة (Accordions) ===
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

// === تعبئة قوائم الاختيار لدليل الختم ===
function populateSelect(id, min, max, labelSuffix) {
    const select = document.getElementById(id);
    let optionZero = document.createElement("option");
    optionZero.value = 0;
    optionZero.text = "0 " + labelSuffix;
    select.appendChild(optionZero);

    for(let i=min; i<=max; i++) {
        if(i===0) continue;
        let option = document.createElement("option");
        option.value = i;
        option.text = i + " " + labelSuffix;
        select.appendChild(option);
    }
}

// تشغيل التعبئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    populateSelect('current-hifz', 0, 29, "جزء");
    populateSelect('daily-capacity', 1, 20, "وجه");
});

// === حساب موعد الختم ===
function calculateKhatm() {
    const currentHifz = parseInt(document.getElementById('current-hifz').value);
    const dailyFaces = parseInt(document.getElementById('daily-capacity').value);
    const restDays = parseInt(document.getElementById('review-days').value);

    const resultDiv = document.getElementById('khatm-result');
    
    if (dailyFaces === 0) {
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = "يرجى اختيار كم وجهاً ستحفظ يومياً!";
        return;
    }

    // القرآن 604 وجه - (الحفظ الحالي * 20 وجه)
    const remainingFaces = 604 - (currentHifz * 20);
    
    if (remainingFaces <= 0) {
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = "ما شاء الله! أنت خاتم للقرآن أو قريب جداً.";
        return;
    }

    // أيام الحفظ الفعلية في الأسبوع
    const workDaysPerWeek = 7 - restDays;
    const facesPerWeek = dailyFaces * workDaysPerWeek;
    
    // عدد الأسابيع المطلوبة
    const weeksNeeded = remainingFaces / facesPerWeek;
    const totalDays = Math.ceil(weeksNeeded * 7);

    // حساب التاريخ
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + totalDays);
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = endDate.toLocaleDateString('ar-SA', options);

    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <strong>بإذن الله ستختم القرآن في:</strong><br>
        <span style="font-size:1.3rem; color:var(--primary-color)">${dateString}</span><br>
        <small>(بعد حوالي ${totalDays} يوماً)</small>
    `;
}

// ==========================================
// === كود مسابقة القرآن (الاختبار) ===
// ==========================================

let quranData = {};
let currentQuizAnswer = "";

// تحميل ملف البيانات (لاحظ المسار الجديد هنا)
fetch('assets/data/quran.json')
    .then(response => response.json())
    .then(data => {
        quranData = data;
        console.log("تم تحميل بيانات القرآن بنجاح");
    })
    .catch(error => console.error('Error loading Quran data:', error));

function getRandomAyah() {
    // اختيار سورة عشوائية (من 1 إلى 114)
    const surahKeys = Object.keys(quranData);
    const randomSurahNum = surahKeys[Math.floor(Math.random() * surahKeys.length)];
    const surah = quranData[randomSurahNum];

    // اختيار آية عشوائية من السورة
    const randomAyahIndex = Math.floor(Math.random() * surah.ayahs.length);
    const ayahObj = surah.ayahs[randomAyahIndex];

    // تحديد الجزء (تقريبي لأن الملف لا يحتوي على معلومات الأجزاء بدقة لكل آية، سنحسبها تقريبياً أو نلغي سؤال الجزء إذا لم تتوفر البيانات)
    // للمشروع البسيط سنركز على اسم السورة وإكمال الآية
    
    // محاولة إيجاد الآية التالية للإكمال
    let nextAyahText = "نهاية السورة";
    if (randomAyahIndex + 1 < surah.ayahs.length) {
        nextAyahText = surah.ayahs[randomAyahIndex + 1].text;
    } else {
        // إذا كانت آخر آية، نأخذ أول آية من السورة التالية (اختياري)
        // للتبسيط سنكتفي برسالة
    }

    return {
        text: ayahObj.text,
        surahName: surah.name,
        ayahNum: ayahObj.num,
        nextAyah: nextAyahText,
        surahNum: randomSurahNum
    };
}

function newQuestion(type) {
    if (Object.keys(quranData).length === 0) {
        alert("جارٍ تحميل البيانات، يرجى الانتظار قليلاً...");
        return;
    }

    const randomAyah = getRandomAyah();
    let qText = "";
    let aText = "";

    // منطق الأسئلة
    if (type === 'complete') {
        qText = `أكمل الآية التي تلي:<br><br> <span style="color:var(--primary-color)">${randomAyah.text}</span>`;
        aText = randomAyah.nextAyah;
    } else if (type === 'surah_name') {
        qText = `هذه الآية في أي سورة؟<br><br> <span style="color:var(--primary-color)">${randomAyah.text}</span>`;
        aText = `سورة ${randomAyah.surahName}`;
    } else if (type === 'ayah_num') {
        qText = `ما هو رقم هذه الآية؟<br><br> <span style="color:var(--primary-color)">${randomAyah.text}</span>`;
        aText = `الآية رقم ${randomAyah.ayahNum}`;
    } else if (type === 'which_juz') {
        // سؤال الجزء يحتاج بيانات إضافية، سنحوله لسؤال عن السورة مؤقتاً أو نستخدم منطق تقريبي
        // سنعرض رقم السورة بدلاً من الجزء للتبسيط في هذا الإصدار
        qText = `ما هو رقم ترتيب سورة ( ${randomAyah.surahName} ) في المصحف؟`;
        aText = `السورة رقم ${randomAyah.surahNum}`;
    }

    // عرض في الشاشة
    document.getElementById('quiz-area').style.display = 'block';
    document.getElementById('question-text').innerHTML = qText;
    document.getElementById('answer-box').style.display = 'none';
    document.getElementById('show-answer-btn').style.display = 'inline-block';
    
    // حفظ الإجابة
    currentQuizAnswer = aText;
    document.getElementById('answer-text').innerHTML = currentQuizAnswer;
}

function showAnswer() {
    document.getElementById('answer-box').style.display = 'block';
    document.getElementById('show-answer-btn').style.display = 'none';
}
