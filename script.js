/* =========================
   AMAN 4.0 - SCRIPT
========================= */


/* =========================
   USER SYSTEM
========================= */

function getUser() {

  const data = localStorage.getItem("amanUser");

  return data ? JSON.parse(data) : null;
}


function saveUser(user) {

  localStorage.setItem(
    "amanUser",
    JSON.stringify(user)
  );
}


/* =========================
   PAGE NAVIGATION
========================= */

function showPage(pageId) {

  const pages = document.querySelectorAll(".page");

  pages.forEach(function(page) {
    page.classList.remove("active");
  });

  const page = document.getElementById(pageId);

  if (page) {
    page.classList.add("active");
  }

  window.scrollTo(0, 0);

  if (pageId === "dashboard") {
    updateDashboard();
  }

  if (pageId === "challenges") {
    renderChallenges();
  }

  if (pageId === "safety") {
    startSafetyCheck();
  }
}


/* =========================
   DARK MODE
========================= */

function toggleDarkMode() {

  document.body.classList.toggle("dark");

  localStorage.setItem(
    "amanDark",
    document.body.classList.contains("dark")
  );
}


/* =========================
   REGISTER
========================= */

function register() {

  const name =
    document
      .getElementById("registerName")
      .value
      .trim();

  const email =
    document
      .getElementById("registerEmail")
      .value
      .trim();

  const password =
    document
      .getElementById("registerPassword")
      .value;

  const error =
    document.getElementById("registerError");


  error.innerText = "";


  if (!name || !email || !password) {

    error.innerText =
      "⚠️ عمّري الخانات الكل.";

    return;
  }


  if (password.length < 6) {

    error.innerText =
      "⚠️ كلمة السر لازم تكون 6 أحرف على الأقل.";

    return;
  }


  const user = {

    name: name,

    email: email,

    password: password,

    xp: 0,

    completed: [],

    badges: []

  };


  saveUser(user);

  updateNavigation();


  alert(
    "🎉 مرحبًا " +
    name +
    "! تم إنشاء حسابك."
  );


  showPage("dashboard");
}


/* =========================
   LOGIN
========================= */

function login() {

  const email =
    document
      .getElementById("loginEmail")
      .value
      .trim();

  const password =
    document
      .getElementById("loginPassword")
      .value;

  const error =
    document.getElementById("loginError");

  const user = getUser();


  error.innerText = "";


  if (!user) {

    error.innerText =
      "❌ ما عندكش حساب. اعملي حساب أولًا.";

    return;
  }


  if (
    user.email !== email ||
    user.password !== password
  ) {

    error.innerText =
      "❌ البريد الإلكتروني أو كلمة السر غير صحيحة.";

    return;
  }


  updateNavigation();

  showPage("dashboard");
}


/* =========================
   NAVIGATION
========================= */

function updateNavigation() {

  const user = getUser();

  const loginButton =
    document.getElementById("loginButton");

  const dashboardButton =
    document.getElementById("dashboardButton");


  if (user) {

    loginButton.classList.add("hidden");

    dashboardButton.classList.remove("hidden");

  } else {

    loginButton.classList.remove("hidden");

    dashboardButton.classList.add("hidden");
  }
}


/* =========================
   LEVEL SYSTEM
========================= */

function calculateLevel(xp) {

  if (xp >= 1000) return 5;

  if (xp >= 600) return 4;

  if (xp >= 300) return 3;

  if (xp >= 100) return 2;

  return 1;
}


function calculateProgress(xp) {

  return Math.min(
    100,
    (xp % 100) 
  );
}


/* =========================
   BADGES
========================= */

function updateBadges(user) {

  if (
    user.completed.length >= 1 &&
    !user.badges.includes("First Defender")
  ) {

    user.badges.push("First Defender");
  }


  if (
    user.completed.length >= 3 &&
    !user.badges.includes("Cyber Explorer")
  ) {

    user.badges.push("Cyber Explorer");
  }


  if (
    user.completed.length >= 5 &&
    !user.badges.includes("Phishing Hunter")
  ) {

    user.badges.push("Phishing Hunter");
  }


  if (
    user.completed.length >= 8 &&
    !user.badges.includes("Cyber Guardian")
  ) {

    user.badges.push("Cyber Guardian");
  }


  if (
    user.completed.length >= 10 &&
    !user.badges.includes("AMAN Master")
  ) {

    user.badges.push("AMAN Master");
  }
}


function renderBadges(user) {

  const container =
    document.getElementById(
      "badgesContainer"
    );


  container.innerHTML = "";


  const badges = [

    ["🛡️", "First Defender"],

    ["🧭", "Cyber Explorer"],

    ["🎣", "Phishing Hunter"],

    ["🏆", "Cyber Guardian"],

    ["👑", "AMAN Master"]

  ];


  badges.forEach(function(badge) {

    const div =
      document.createElement("div");


    div.className = "badge";


    if (
      !user.badges.includes(badge[1])
    ) {

      div.classList.add("locked");
    }


    div.innerHTML =

      "<div style='font-size:30px'>" +
      badge[0] +
      "</div>" +

      "<strong>" +
      badge[1] +
      "</strong>";


    container.appendChild(div);

  });
}


/* =========================
   DASHBOARD
========================= */

function updateDashboard() {

  const user = getUser();


  if (!user) {

    showPage("register");

    return;
  }


  document.getElementById(
    "welcomeMessage"
  ).innerText =
    "👋 مرحبًا " +
    user.name +
    "!";


  document.getElementById(
    "xpValue"
  ).innerText =
    user.xp;


  document.getElementById(
    "levelValue"
  ).innerText =
    calculateLevel(user.xp);


  document.getElementById(
    "challengeValue"
  ).innerText =
    user.completed.length;


  document.getElementById(
    "badgeValue"
  ).innerText =
    user.badges.length;


  document.getElementById(
    "progressText"
  ).innerText =
    user.xp +
    " XP";


  document.getElementById(
    "progressBar"
  ).style.width =
    calculateProgress(user.xp) +
    "%";


  renderBadges(user);
}


/* =========================
   CYBER CHALLENGES
========================= */

const challenges = [

  {
    icon: "🎣",
    title: "Phishing",
    question:
      "رسالة تقول إنك ربحت هاتفًا وتطلب الضغط على رابط.",
    correct:
      "نتثبت من مصدر الرسالة وما نضغطش.",
    xp: 100
  },


  {
    icon: "🔐",
    title: "Account Security",
    question:
      "شخص يطلب رمز التحقق الذي وصلك في SMS.",
    correct:
      "ما نشاركش رمز التحقق.",
    xp: 100
  },


  {
    icon: "🔒",
    title: "Privacy",
    question:
      "صورة فيها اسم المدرسة ومعلومات عن مكانك.",
    correct:
      "نخفي المعلومات الحساسة قبل النشر.",
    xp: 125
  },


  {
    icon: "📱",
    title: "App Security",
    question:
      "تطبيق بسيط يطلب صلاحيات كثيرة بدون سبب.",
    correct:
      "نراجع الصلاحيات ونرفض غير الضروري.",
    xp: 125
  },


  {
    icon: "🧠",
    title: "Social Engineering",
    question:
      "شخص ينتحل شخصية صديقك ويطلب مساعدة عاجلة.",
    correct:
      "نتثبت من هويته عبر وسيلة أخرى.",
    xp: 150
  },


  {
    icon: "📶",
    title: "Wi-Fi Security",
    question:
      "شبكة Wi-Fi باسم مشابه للشبكة الرسمية.",
    correct:
      "نتثبت من اسم الشبكة الرسمي.",
    xp: 150
  },


  {
    icon: "🔑",
    title: "Password Security",
    question:
      "هل نستعمل نفس كلمة السر في كل الحسابات؟",
    correct:
      "لا، نستعمل كلمات سر مختلفة.",
    xp: 150
  },


  {
    icon: "🌐",
    title: "URL Security",
    question:
      "رابط يشبه موقعًا معروفًا لكن اسم النطاق مختلف.",
    correct:
      "نتثبت من الموقع الرسمي.",
    xp: 175
  },


  {
    icon: "🎭",
    title: "Identity",
    question:
      "شخص يعرف معلومات عنك ويدعي أنه موظف رسمي.",
    correct:
      "نتثبت من هويته عبر قناة رسمية.",
    xp: 200
  },


  {
    icon: "🔄",
    title: "Updates",
    question:
      "الجهاز يطلب تحديثًا أمنيًا رسميًا.",
    correct:
      "نحدّث الجهاز من الإعدادات الرسمية.",
    xp: 200
  }

];


let currentChallenge = 0;

let answered = false;


/* =========================
   RENDER CHALLENGES
========================= */

function renderChallenges() {

  const user = getUser();

  const container =
    document.getElementById(
      "challengeContainer"
    );


  container.innerHTML = "";


  challenges.forEach(
    function(challenge, index) {

      const completed =
        user &&
        user.completed.includes(index);


      const card =
        document.createElement("div");


      card.className =
        "challenge";


      card.innerHTML =

        "<span class='challenge-tag'>" +
        challenge.title +
        "</span>" +

        "<h3>" +
        challenge.icon +
        " " +
        challenge.title +
        "</h3>" +

        "<p>" +
        challenge.question +
        "</p>" +

        "<div class='challenge-footer'>" +

        "<b style='color:#e05296'>" +
        "⭐ " +
        challenge.xp +
        " XP" +
        "</b>" +

        "<button " +
        "class='challenge-button' " +
        "onclick='startChallenge(" +
        index +
        ")'>" +

        (
          completed
          ? "🔄 إعادة"
          : "🚀 ابدأ"
        ) +

        "</button>" +

        "</div>";


      container.appendChild(card);

    }
  );
}


/* =========================
   START CHALLENGE
========================= */

function startChallenge(index) {

  currentChallenge = index;

  answered = false;


  const challenge =
    challenges[index];


  document.getElementById(
    "quizCategory"
  ).innerText =
    challenge.title;


  document.getElementById(
    "quizXP"
  ).innerText =
    "Challenge • +" +
    challenge.xp +
    " XP";


  document.getElementById(
    "quizQuestion"
  ).innerText =
    challenge.question;


  document.getElementById(
    "quizNumber"
  ).innerText =
    "السؤال 1 من 1";


  document.getElementById(
    "quizProgress"
  ).style.width =
    "0%";


  document.getElementById(
    "quizFeedback"
  ).classList.add("hidden");


  document.getElementById(
    "nextQuizButton"
  ).classList.add("hidden");


  const answers =
    document.getElementById(
      "quizAnswers"
    );


  answers.innerHTML = "";


  let options = [

    challenge.correct,

    "أعمل العكس بدون ما نتثبت.",

    "نعطي معلوماتي لأي شخص يطلبها."

  ];


  options.sort(
    () => Math.random() - 0.5
  );


  options.forEach(
    function(option) {

      const button =
        document.createElement("button");


      button.className =
        "answer";


      button.innerText =
        option;


      button.onclick =
        function() {

          answerChallenge(option);
        };


      answers.appendChild(button);

    }
  );


  showPage("quiz");
}


/* =========================
   ANSWER CHALLENGE
========================= */

function answerChallenge(option) {

  if (answered) return;

  answered = true;


  const challenge =
    challenges[currentChallenge];


  const correct =
    option === challenge.correct;


  const buttons =
    document.querySelectorAll(
      "#quizAnswers .answer"
    );


  buttons.forEach(
    function(button) {

      button.disabled = true;
    }
  );


  const feedback =
    document.getElementById(
      "quizFeedback"
    );


  if (correct) {

    feedback.innerHTML =
      "✅ <strong>إجابة صحيحة!</strong><br>" +
      challenge.correct;

  } else {

    feedback.innerHTML =
      "❌ <strong>موش الاختيار الأكثر أمانًا.</strong><br>" +
      "الأفضل: " +
      challenge.correct;
  }


  feedback.classList.remove(
    "hidden"
  );


  document.getElementById(
    "quizProgress"
  ).style.width =
    "100%";


  document.getElementById(
    "nextQuizButton"
  ).classList.remove(
    "hidden"
  );
}


/* =========================
   FINISH CHALLENGE
========================= */

function finishQuiz() {

  const user = getUser();

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
    "🎉 ممتاز! ربحتِ +" +
    challenge.xp +
    " XP"
  );


  showPage("dashboard");
}


/* =========================
   SAFETY CHECK
========================= */

const safetyQuestions = [

  {
    question:
      "وصلتك رسالة من شخص مجهول فيها رابط. ماذا تفعلين؟",

    answers: [

      "أضغط على الرابط مباشرة.",

      "أتثبت من المصدر قبل فتحه.",

      "أرسل الرابط لأصدقائي."

    ],

    correct: 1
  },


  {
    question:
      "شخص طلب منك رمز التحقق الذي وصلك في SMS. ماذا تفعلين؟",

    answers: [

      "أعطيه الرمز.",

      "أنشره في مجموعة.",

      "لا أشارك رمز التحقق."

    ],

    correct: 2
  },


  {
    question:
      "ما الأفضل لحماية حساباتك؟",

    answers: [

      "نفس كلمة السر لكل الحسابات.",

      "كلمات سر مختلفة وقوية.",

      "كلمة سر سهلة."

    ],

    correct: 1
  }

];


let currentSafetyQuestion = 0;

let safetyScore = 0;


/* =========================
   START SAFETY CHECK
========================= */

function startSafetyCheck() {

  currentSafetyQuestion = 0;

  safetyScore = 0;

  renderSafetyQuestion();
}


/* =========================
   RENDER SAFETY QUESTION
========================= */

function renderSafetyQuestion() {

  const question =
    safetyQuestions[
      currentSafetyQuestion
    ];


  document.getElementById(
    "safetyQuestionNumber"
  ).innerText =
    "السؤال " +
    (currentSafetyQuestion + 1) +
    " من " +
    safetyQuestions.length;


  document.getElementById(
    "safetyProgress"
  ).style.width =
    (
      (currentSafetyQuestion /
      safetyQuestions.length) *
      100
    ) +
    "%";


  document.getElementById(
    "safetyQuestion"
  ).innerText =
    question.question;


  const answers =
    document.getElementById(
      "safetyAnswers"
    );


  answers.innerHTML = "";


  question.answers.forEach(
    function(answer, index) {

      const button =
        document.createElement("button");


      button.className =
        "answer";


      button.innerText =
        answer;


      button.onclick =
        function() {

          answerSafety(index);
        };


      answers.appendChild(button);

    }
  );


  document.getElementById(
    "safetyResult"
  ).classList.add(
    "hidden"
  );
}


/* =========================
   ANSWER SAFETY
========================= */

function answerSafety(index) {

  const question =
    safetyQuestions[
      currentSafetyQuestion
    ];


  const buttons =
    document.querySelectorAll(
      "#safetyAnswers .answer"
    );


  buttons.forEach(
    function(button) {

      button.disabled = true;
    }
  );


  const result =
    document.getElementById(
      "safetyResult"
    );


  if (index === question.correct) {

    safetyScore++;

    result.innerHTML =
      "✅ إجابة صحيحة!";

  } else {

    result.innerHTML =
      "❌ موش الإجابة الأكثر أمانًا.";
  }


  result.classList.remove(
    "hidden"
  );


  setTimeout(
    function() {

      currentSafetyQuestion++;


      if (
        currentSafetyQuestion <
        safetyQuestions.length
      ) {

        renderSafetyQuestion();

      } else {

        finishSafetyCheck();
      }

    },
    1000
  );
}


/* =========================
   SAFETY RESULT
========================= */

function finishSafetyCheck() {

  const result =
    document.getElementById(
      "safetyResult"
    );


  result.innerHTML =

    "🏆 <strong>كملتي Safety Check!</strong><br><br>" +

    "نتيجتك: " +

    safetyScore +

    " / " +

    safetyQuestions.length;


  result.classList.remove(
    "hidden"
  );


  document.getElementById(
    "safetyProgress"
  ).style.width =
    "100%";
}


/* =========================
   LOGOUT
========================= */

function logout() {

  localStorage.removeItem(
    "amanUser"
  );


  updateNavigation();

  showPage("home");
}


/* =========================
   STARTUP
========================= */

if (
  localStorage.getItem(
    "amanDark"
  ) === "true"
) {

  document.body.classList.add(
    "dark"
  );
}


updateNavigation();

showPage("home");
