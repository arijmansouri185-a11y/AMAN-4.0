// ================= AMAN 4.0 =================
// Competition Edition
// Digital Safety Platform

// ================= USER STORAGE =================

function getUser() {
  const data = localStorage.getItem("amanUser");
  return data ? JSON.parse(data) : null;
}

function saveUser(user) {
  localStorage.setItem("amanUser", JSON.stringify(user));
}


// ================= NAVIGATION =================

function showPage(pageId) {

  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  const page = document.getElementById(pageId);

  if (!page) return;

  page.classList.add("active");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (pageId === "dashboard") {
    updateDashboard();
  }

  if (pageId === "challenges") {
    renderChallenges();
  }
}


// ================= NAVBAR =================

function updateNavbar() {

  const user = getUser();

  const loginButton = document.getElementById("loginButton");
  const dashboardButton = document.getElementById("dashboardButton");

  if (user) {

    loginButton.classList.add("hidden");
    dashboardButton.classList.remove("hidden");

  } else {

    loginButton.classList.remove("hidden");
    dashboardButton.classList.add("hidden");

  }
}


// ================= REGISTER =================

function register() {

  const name =
    document.getElementById("registerName").value.trim();

  const email =
    document.getElementById("registerEmail").value.trim();

  const password =
    document.getElementById("registerPassword").value;

  const error =
    document.getElementById("registerError");

  error.textContent = "";

  if (!name || !email || !password) {

    error.textContent =
      "⚠️ عمّري الخانات الكل.";

    return;
  }

  if (!email.includes("@")) {

    error.textContent =
      "⚠️ دخّلي بريد إلكتروني صحيح.";

    return;
  }

  if (password.length < 8) {

    error.textContent =
      "⚠️ كلمة السر لازم تكون 8 أحرف على الأقل.";

    return;
  }

  const user = {

    name: name,

    email: email,

    // Prototype only.
    // لا تستعملي كلمة سر حقيقية هنا.
    password: password,

    xp: 0,

    completed: [],

    badges: []

  };

  saveUser(user);

  updateNavbar();

  document.getElementById("registerName").value = "";
  document.getElementById("registerEmail").value = "";
  document.getElementById("registerPassword").value = "";

  alert("🎉 مرحبًا بك في AMAN!");

  showPage("dashboard");
}


// ================= LOGIN =================

function login() {

  const email =
    document.getElementById("loginEmail").value.trim();

  const password =
    document.getElementById("loginPassword").value;

  const error =
    document.getElementById("loginError");

  const user = getUser();

  error.textContent = "";

  if (!user) {

    error.textContent =
      "❌ ما عندكش حساب. اعملي حساب أولًا.";

    return;
  }

  if (
    user.email !== email ||
    user.password !== password
  ) {

    error.textContent =
      "❌ البريد الإلكتروني أو كلمة السر غير صحيحة.";

    return;
  }

  document.getElementById("loginEmail").value = "";
  document.getElementById("loginPassword").value = "";

  updateNavbar();

  showPage("dashboard");
}


// ================= LOGOUT =================

function logout() {

  localStorage.removeItem("amanUser");

  updateNavbar();

  showPage("home");
}


// ================= LEVEL SYSTEM =================

function calculateLevel(xp) {

  if (xp >= 1000) return 5;
  if (xp >= 600) return 4;
  if (xp >= 300) return 3;
  if (xp >= 100) return 2;

  return 1;
}


function calculateProgress(xp) {

  const level = calculateLevel(xp);

  const levels = {
    1: 100,
    2: 300,
    3: 600,
    4: 1000,
    5: 1000
  };

  if (level === 5) return 100;

  const previousLevelXP = {
    1: 0,
    2: 100,
    3: 300,
    4: 600
  };

  const start = previousLevelXP[level];

  const end = levels[level];

  return Math.min(
    100,
    Math.round(
      ((xp - start) / (end - start)) * 100
    )
  );
}


// ================= BADGES =================

const badgeList = [

  {
    icon: "🛡️",
    name: "First Defender",
    requirement: 1
  },

  {
    icon: "🧭",
    name: "Cyber Explorer",
    requirement: 3
  },

  {
    icon: "🎣",
    name: "Phishing Hunter",
    requirement: 5
  },

  {
    icon: "🏆",
    name: "Cyber Guardian",
    requirement: 8
  },

  {
    icon: "👑",
    name: "AMAN Master",
    requirement: 10
  }

];


function updateBadges(user) {

  badgeList.forEach(badge => {

    if (
      user.completed.length >= badge.requirement &&
      !user.badges.includes(badge.name)
    ) {

      user.badges.push(badge.name);

    }

  });

}


function renderBadges(user) {

  const container =
    document.getElementById("badgesContainer");

  container.innerHTML = "";

  badgeList.forEach(badge => {

    const unlocked =
      user.badges.includes(badge.name);

    const card =
      document.createElement("div");

    card.className =
      "badge-card";

    if (!unlocked) {
      card.classList.add("locked");
    }

    card.innerHTML = `

      <div>${badge.icon}</div>

      <strong>
        ${badge.name}
      </strong>

      <small>
        ${unlocked
          ? "✓ Unlocked"
          : "🔒 Locked"}
      </small>

    `;

    container.appendChild(card);

  });
}


// ================= DASHBOARD =================

function updateDashboard() {

  const user = getUser();

  if (!user) {

    showPage("register");

    return;
  }

  updateBadges(user);

  saveUser(user);

  document.getElementById("welcomeMessage")
    .textContent =
    `👋 مرحبًا ${user.name}!`;

  document.getElementById("xpValue")
    .textContent = user.xp;

  document.getElementById("levelValue")
    .textContent =
    calculateLevel(user.xp);

  document.getElementById("challengeValue")
    .textContent =
    user.completed.length;

  document.getElementById("badgeValue")
    .textContent =
    user.badges.length;

  document.getElementById("progressText")
    .textContent =
    `${user.xp} XP`;

  document.getElementById("progressBar")
    .style.width =
    `${calculateProgress(user.xp)}%`;

  renderBadges(user);
}


// ================= CHALLENGES =================

const challenges = [

  {
    icon: "🎣",
    category: "Phishing",
    title: "رسالة ربح مشبوهة",
    description:
      "وصلتك رسالة تقول إنك ربحت هاتفًا وتطلب منك الضغط على رابط.",
    correct:
      "نتثبت من المصدر وما نضغطش على الرابط.",
    xp: 100
  },

  {
    icon: "🔐",
    category: "Account Security",
    title: "رمز التحقق",
    description:
      "شخص يطلب منك رمز التحقق الذي وصلك في SMS.",
    correct:
      "ما نشاركش رمز التحقق مع أي شخص.",
    xp: 100
  },

  {
    icon: "🔒",
    category: "Privacy",
    title: "معلومات شخصية",
    description:
      "صورة فيها اسم المدرسة ومعلومات عن مكانك.",
    correct:
      "نتأكد من عدم ظهور المعلومات الحساسة قبل النشر.",
    xp: 125
  },

  {
    icon: "📱",
    category: "App Security",
    title: "صلاحيات التطبيق",
    description:
      "تطبيق بسيط يطلب صلاحيات كثيرة بدون سبب واضح.",
    correct:
      "نراجع الصلاحيات ونرفض غير الضروري منها.",
    xp: 125
  },

  {
    icon: "🧠",
    category: "Social Engineering",
    title: "صديق في حالة طارئة",
    description:
      "شخص ينتحل شخصية صديقك ويطلب مساعدة عاجلة.",
    correct:
      "نتثبت من هويته باستعمال وسيلة أخرى.",
    xp: 150
  },

  {
    icon: "📶",
    category: "Wi-Fi Security",
    title: "شبكة Wi-Fi مشبوهة",
    description:
      "شبكة Wi-Fi تحمل اسمًا مشابهًا للشبكة الرسمية.",
    correct:
      "نتثبت من اسم الشبكة الرسمي قبل الاتصال.",
    xp: 150
  },

  {
    icon: "🔑",
    category: "Password Security",
    title: "كلمات السر",
    description:
      "هل من الأفضل استعمال نفس كلمة السر في كل الحسابات؟",
    correct:
      "لا، نستعمل كلمات سر مختلفة للحسابات المهمة.",
    xp: 150
  },

  {
    icon: "🌐",
    category: "URL Security",
    title: "رابط مشابه",
    description:
      "رابط يشبه موقعًا معروفًا لكن اسم النطاق مختلف.",
    correct:
      "نتثبت من اسم النطاق والموقع الرسمي.",
    xp: 175
  },

  {
    icon: "🎭",
    category: "Identity",
    title: "شخص يدعي أنه موظف",
    description:
      "شخص يعرف بعض المعلومات عنك ويدعي أنه موظف رسمي.",
    correct:
      "نتثبت من هويته عبر قناة رسمية.",
    xp: 200
  },

  {
    icon: "🔄",
    category: "Updates",
    title: "تحديث أمني",
    description:
      "الجهاز يعرض تحديثًا أمنيًا رسميًا.",
    correct:
      "نحدّث الجهاز من الإعدادات أو المصدر الرسمي.",
    xp: 200
  }

];


function renderChallenges() {

  const container =
    document.getElementById("challengeContainer");

  container.innerHTML = "";

  const user = getUser();

  challenges.forEach((challenge, index) => {

    const completed =
      user &&
      user.completed.includes(index);

    const card =
      document.createElement("article");

    card.className =
      "challenge-card";

    card.innerHTML = `

      <div class="challenge-icon">
        ${challenge.icon}
      </div>

      <small>
        ${challenge.category}
      </small>

      <h3>
        ${challenge.title}
      </h3>

      <p>
        ${challenge.description}
      </p>

      <div class="challenge-bottom">

        <span class="xp-label">
          ⭐ ${challenge.xp} XP
        </span>

        <button
          class="challenge-button"
          onclick="startChallenge(${index})"
        >
          ${completed
            ? "🔄 إعادة"
            : "🚀 ابدأ"}
        </button>

      </div>

    `;

    container.appendChild(card);

  });
}


// ================= QUIZ =================

let currentChallenge = null;
let quizAnswered = false;


function startChallenge(index) {

  currentChallenge = index;

  quizAnswered = false;

  const challenge =
    challenges[index];

  document.getElementById("quizCategory")
    .textContent =
    challenge.category;

  document.getElementById("quizXP")
    .textContent =
    `+${challenge.xp} XP`;

  document.getElementById("quizNumber")
    .textContent =
    "السؤال 1 من 1";

  document.getElementById("quizProgress")
    .style.width = "0%";

  document.getElementById("quizQuestion")
    .textContent =
    challenge.description;

  document.getElementById("quizFeedback")
    .classList.add("hidden");

  document.getElementById("nextQuizButton")
    .classList.add("hidden");

  const answers =
    document.getElementById("quizAnswers");

  answers.innerHTML = "";

  const options = [

    challenge.correct,

    "نضغط على الرابط فورًا بدون ما نتثبت.",

    "نعطي معلوماتي لأي شخص يطلبها."

  ];

  options.sort(() => Math.random() - 0.5);

  options.forEach(option => {

    const button =
      document.createElement("button");

    button.textContent = option;

    button.onclick = () =>
      answerChallenge(option);

    answers.appendChild(button);

  });

  showPage("quiz");
}


function answerChallenge(answer) {

  if (quizAnswered) return;

  quizAnswered = true;

  const challenge =
    challenges[currentChallenge];

  const correct =
    answer === challenge.correct;

  const buttons =
    document.querySelectorAll(
      "#quizAnswers button"
    );

  buttons.forEach(button => {

    button.disabled = true;

  });

  const feedback =
    document.getElementById("quizFeedback");

  if (correct) {

    feedback.innerHTML =
      `
      <strong>✅ إجابة صحيحة!</strong>
      <br>
      ${challenge.correct}
      `;

  } else {

    feedback.innerHTML =
      `
      <strong>❌ موش الاختيار الأكثر أمانًا.</strong>
      <br>
      الأفضل: ${challenge.correct}
      `;

  }

  feedback.classList.remove("hidden");

  document.getElementById("quizProgress")
    .style.width = "100%";

  document.getElementById("nextQuizButton")
    .classList.remove("hidden");
}


// ================= FINISH QUIZ =================

function finishQuiz() {

  const user = getUser();

  if (!user) {

    showPage("register");

    return;
  }

  const challenge =
    challenges[currentChallenge];

  if (
    !user.completed.includes(
      currentChallenge
    )
  ) {

    user.completed.push(
      currentChallenge
    );

    user.xp += challenge.xp;

  }

  updateBadges(user);

  saveUser(user);

  alert(
    `🎉 ممتاز!\n+${challenge.xp} XP`
  );

  updateDashboard();

  showPage("dashboard");
}


// ================= SAFETY CHECK =================

const safetyQuestions = [

  {
    question:
      "هل تستعملين كلمة سر مختلفة للحسابات المهمة؟",

    answers: [
      "نعم، نستعمل كلمات سر مختلفة.",
      "لا، نفس كلمة السر لكل شيء."
    ],

    safe: 0
  },

  {
    question:
      "وصلتك رسالة فيها رابط غريب وتطلب منك تسجيل الدخول بسرعة. ماذا تفعلين؟",

    answers: [
      "نتثبت من المصدر والرابط قبل أي شيء.",
      "نضغط مباشرة لأن الرسالة مستعجلة."
    ],

    safe: 0
  },

  {
    question:
      "شخص يطلب منك رمز التحقق الذي وصلك في SMS.",

    answers: [
      "ما نعطيهولوش.",
      "نعطيهوله إذا قال إنه من الدعم."
    ],

    safe: 0
  },

  {
    question:
      "قبل نشر صورة، فيها اسم مدرستك ومكانك. ماذا تفعلين؟",

    answers: [
      "نتأكد من إزالة المعلومات الحساسة.",
      "ننشرها عادي."
    ],

    safe: 0
  }

];


let safetyIndex = 0;
let safetyScore = 0;


function startSafetyCheck() {

  safetyIndex = 0;
  safetyScore = 0;

  document.getElementById("safetyResult")
    .classList.add("hidden");

  renderSafetyQuestion();
}


function renderSafetyQuestion() {

  const question =
    safetyQuestions[safetyIndex];

  document.getElementById("safetyQuestion")
    .textContent =
    question.question;

  document.getElementById("safetyQuestionNumber")
    .textContent =
    `السؤال ${safetyIndex + 1} من ${safetyQuestions.length}`;

  document.getElementById("safetyProgress")
    .style.width =
    `${(safetyIndex / safetyQuestions.length) * 100}%`;

  const container =
    document.getElementById("safetyAnswers");

  container.innerHTML = "";

  question.answers.forEach(
    (answer, index) => {

      const button =
        document.createElement("button");

      button.className =
        "answer-btn";

      button.textContent =
        answer;

      button.onclick = () =>
        answerSafety(index);

      container.appendChild(button);

    }
  );
}


function answerSafety(answerIndex) {

  const question =
    safetyQuestions[safetyIndex];

  if (
    answerIndex === question.safe
  ) {

    safetyScore++;

  }

  safetyIndex++;

  if (
    safetyIndex <
    safetyQuestions.length
  ) {

    renderSafetyQuestion();

  } else {

    finishSafetyCheck();

  }
}


function finishSafetyCheck() {

  document.getElementById("safetyProgress")
    .style.width = "100%";

  const result =
    document.getElementById("safetyResult");

  let title = "";
  let message = "";

  if (safetyScore === 4) {

    title = "🏆 ممتاز!";

    message =
      "عندك وعي رقمي قوي. كمّلي هكّا وواصلي التطور.";

  } else if (safetyScore >= 2) {

    title = "🌟 باهي برشا!";

    message =
      "عندك أساس جيد، أما فما حاجات أخرى تنجمي تتعلميها.";

  } else {

    title = "💡 البداية هي الأهم!";

    message =
      "جربي Learn Hub والتحديات باش تطوري وعيك الرقمي.";

  }

  result.innerHTML = `

    <h3>${title}</h3>

    <p>
      نتيجتك:
      <strong>
        ${safetyScore}/${safetyQuestions.length}
      </strong>
    </p>

    <p>
      ${message}
    </p>

    <button
      class="primary-btn"
      onclick="startSafetyCheck()"
    >
      🔄 إعادة الاختبار
    </button>

  `;

  result.classList.remove("hidden");
}


// ================= DARK MODE =================

function toggleDarkMode() {

  document.body.classList.toggle("dark");

  localStorage.setItem(
    "amanDark",
    document.body.classList.contains("dark")
  );

}


function loadDarkMode() {

  const dark =
    localStorage.getItem("amanDark");

  if (dark === "true") {

    document.body.classList.add("dark");

  }

}


// ================= INITIALIZATION =================

document.addEventListener(
  "DOMContentLoaded",
  function () {

    loadDarkMode();

    updateNavbar();

    startSafetyCheck();

    renderChallenges();

  }
);
