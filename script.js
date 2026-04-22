
// Hamburger
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.onclick = () => navLinks.classList.toggle('open');

// Case expand
function toggleCase(card) {
  const expand = card.querySelector('.case-expand');
  expand.classList.toggle('open');
}

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
reveals.forEach(r => io.observe(r));

// Quiz
const questions = [
  {
    q: "An employee reports clicking a link in an email that asked them to 'verify' their Office 365 credentials. The page looked legitimate. What is the FIRST action you should take?",
    opts: ["Send a company-wide phishing awareness email", "Reset the user's credentials and revoke active sessions immediately", "Run antivirus on their computer", "Ask the employee to change their password themselves"],
    correct: 1,
    exp: "Correct! Immediately resetting credentials and revoking sessions prevents an attacker who captured credentials from establishing persistence or accessing data."
  },
  {
    q: "Your SIEM alerts on 50,000 failed login attempts against your VPN in 10 minutes from 200 different IP addresses. What attack is most likely occurring?",
    opts: ["Ransomware deployment", "Credential stuffing / brute force", "SQL injection", "DNS poisoning"],
    correct: 1,
    exp: "Correct! Distributed login failures across many IPs with high velocity is a classic credential stuffing or distributed brute-force attack pattern."
  },
  {
    q: "A third-party software update is about to be deployed to 2,000 endpoints. Which control BEST protects against a supply chain attack?",
    opts: ["Run the update outside business hours", "Verify the cryptographic signature of the update package before deployment", "Test on 5 machines first", "Notify the vendor you are deploying"],
    correct: 1,
    exp: "Correct! Code signing verification ensures the update was not tampered with after leaving the vendor — a key defense against SolarWinds-style supply chain attacks."
  },
  {
    q: "You discover an S3 bucket containing customer data has been publicly accessible for 30 days. Regulatory breach notification is required within 72 hours. What should happen FIRST?",
    opts: ["Fix the misconfiguration and notify leadership", "Delete the bucket to remove all evidence", "Fix the misconfiguration, preserve evidence, then engage legal and begin notification process", "Wait to see if any data was actually accessed"],
    correct: 2,
    exp: "Correct! The immediate technical fix must be paired with evidence preservation for forensics, and legal/compliance notified to begin the regulatory notification clock."
  },
  {
    q: "Network logs show a server sending 800MB of encrypted data to an external IP at 3AM daily. EDR shows no malware. The server runs legitimate business apps. What is this MOST likely?",
    opts: ["Normal backup process", "A living-off-the-land exfiltration using a legitimate process", "Network equipment misconfiguration", "A developer testing an API"],
    correct: 1,
    exp: "Correct! Stealthy exfiltration often uses legitimate tools and encrypted channels to evade detection — this pattern warrants immediate investigation of the process making those connections."
  },
  {
    q: "To implement Zero Trust, which principle is MOST fundamental?",
    opts: ["Stronger firewall rules at the perimeter", "Never trust, always verify — authenticate and authorize every request regardless of network location", "All traffic must be encrypted with TLS 1.3", "All users must use hardware security keys"],
    correct: 1,
    exp: "Correct! Zero Trust's core principle is eliminating implicit trust based on network location. Every access request is authenticated and authorized regardless of whether it comes from inside or outside the perimeter."
  }
];

let current = 0, score = 0, answered = false;

function renderQ() {
  answered = false;
  const q = questions[current];
  document.getElementById('quizQ').textContent = q.q;
  document.getElementById('quizProg').textContent = `Question ${current+1} of ${questions.length}`;
  document.getElementById('progressFill').style.width = `${((current+1)/questions.length)*100}%`;
  document.getElementById('nextBtn').style.display = 'none';
  document.getElementById('quizFeedback').className = 'quiz-feedback';
  document.getElementById('quizFeedback').textContent = '';
  const letters = ['A','B','C','D'];
  const opts = document.getElementById('quizOpts');
  opts.innerHTML = q.opts.map((o, i) => `
    <button class="quiz-opt" onclick="answerQ(${i})">
      <span class="quiz-opt-letter">${letters[i]}</span>${o}
    </button>`).join('');
}

function answerQ(idx) {
  if(answered) return;
  answered = true;
  const q = questions[current];
  const opts = document.querySelectorAll('.quiz-opt');
  opts[q.correct].classList.add('correct');
  if(idx !== q.correct) opts[idx].classList.add('wrong');
  else score++;
  const fb = document.getElementById('quizFeedback');
  fb.textContent = (idx === q.correct ? '✓ ' : '✗ ') + q.exp;
  fb.className = 'quiz-feedback show ' + (idx === q.correct ? 'ok' : 'err');
  if(current < questions.length - 1) document.getElementById('nextBtn').style.display = '';
  else {
    setTimeout(() => showResult(), 800);
  }
}

function nextQ() {
  current++;
  renderQ();
}

function showResult() {
  document.getElementById('quizOpts').innerHTML = '';
  document.getElementById('quizQ').textContent = '';
  document.getElementById('quizFeedback').className = 'quiz-feedback';
  document.getElementById('nextBtn').style.display = 'none';
  document.getElementById('quizProg').textContent = '';
  const r = document.getElementById('quizResult');
  r.style.display = 'block';
  document.getElementById('scoreDisplay').textContent = `${score} / ${questions.length}`;
  const msgs = ['Keep studying — review the case studies above!', 'Good foundation — focus on incident response.', 'Solid understanding of security fundamentals!', 'Excellent! Security-minded thinking.'];
  document.getElementById('scoreMsg').textContent = msgs[Math.min(Math.floor(score/2), 3)];
}

function resetQuiz() {
  current = 0; score = 0;
  document.getElementById('quizResult').style.display = 'none';
  renderQ();
}

renderQ();
