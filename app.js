/* =========================================================
   Kuis AI - 10 soal pilihan ganda
   Alur: 1 soal per layar, urutan soal diacak, skor di akhir.
   ========================================================= */

const QUESTIONS = [
  {
    q: "Model machine learning dilatih untuk memprediksi apakah seorang nasabah akan gagal bayar. Data latihnya sudah punya label 'gagal bayar' dan 'lancar'. Ini termasuk pendekatan apa?",
    options: [
      "Unsupervised learning",
      "Supervised learning klasifikasi",
      "Reinforcement learning",
      "Clustering"
    ],
    answer: 1,
    why: "Adanya label membuatnya supervised, dan outputnya berupa kategori biner sehingga masuk klasifikasi."
  },
  {
    q: "Sebuah LLM diminta merangkum dokumen audit internal. Jawabannya lancar, tapi menyebut nomor pasal yang tidak ada di dokumen. Istilah paling tepat untuk fenomena ini?",
    options: [
      "Overfitting",
      "Data leakage",
      "Hallucination",
      "Underfitting"
    ],
    answer: 2,
    why: "Model menghasilkan teks yang terdengar meyakinkan tapi tidak berdasar sumber. Overfitting soal terlalu hafal data latih, bukan soal mengarang isi jawaban."
  },
  {
    q: "Tim ingin chatbot menjawab pertanyaan berdasarkan 200 SOP perusahaan yang sering berubah. Pendekatan paling masuk akal?",
    options: [
      "Fine-tuning ulang model setiap SOP berubah",
      "Menaruh seluruh SOP di system prompt",
      "RAG: retrieve potongan SOP relevan lalu sisipkan ke context",
      "Menaikkan temperature agar jawaban lebih bervariasi"
    ],
    answer: 2,
    why: "RAG memisahkan pengetahuan dari model, jadi update dokumen cukup di index tanpa training ulang. Opsi B boros context, opsi D justru memperbesar risiko mengarang."
  },
  {
    q: "Model klasifikasi mendapat akurasi 99% di data train, tapi hanya 62% di data test. Apa masalah paling mungkin dan solusinya?",
    options: [
      "Underfitting, tambah kompleksitas model",
      "Overfitting, regularisasi dan tambah data validasi",
      "Data leakage, hapus kolom target",
      "Learning rate terlalu kecil, naikkan"
    ],
    answer: 1,
    why: "Gap besar antara train dan test adalah ciri overfitting. Penanganannya: regularisasi, augmentasi data, early stopping, atau model lebih sederhana."
  },
  {
    q: "Kamu ingin mencari dokumen yang maknanya mirip dengan query, bukan sekadar cocok kata kunci. Representasi apa yang dipakai?",
    options: [
      "One-hot encoding per kata",
      "Embedding vector dan kemiripan cosine",
      "Hash MD5 dari teks dokumen",
      "Frekuensi kata mentah tanpa normalisasi"
    ],
    answer: 1,
    why: "Embedding menempatkan teks di ruang vektor, sehingga kedekatan makna bisa diukur dengan cosine similarity meski kata yang dipakai berbeda."
  },
  {
    q: "Kamu butuh output LLM yang konsisten dan tidak kreatif untuk ekstraksi field dari dokumen. Pengaturan yang tepat?",
    options: [
      "Temperature rendah, mendekati 0",
      "Temperature tinggi, di atas 1",
      "Naikkan top_p ke 1 dan temperature ke 2",
      "Matikan system prompt"
    ],
    answer: 0,
    why: "Temperature rendah mempersempit sampling ke token paling mungkin, sehingga output lebih deterministik dan cocok untuk ekstraksi terstruktur."
  },
  {
    q: "Tim sudah mencoba few-shot prompt dan hasilnya masih sering meleset pada gaya penulisan yang sangat spesifik. Kapan fine-tuning jadi pilihan yang wajar?",
    options: [
      "Selalu, fine-tuning lebih baik daripada prompting",
      "Kalau butuh pengetahuan terbaru yang berubah tiap minggu",
      "Kalau ada banyak contoh berlabel dan gaya/keputusan model perlu dipaksa konsisten",
      "Kalau ingin menghemat biaya inference"
    ],
    answer: 2,
    why: "Fine-tuning mengubah perilaku model lewat contoh, cocok untuk gaya dan pola keputusan yang konsisten. Pengetahuan yang cepat berubah lebih tepat lewat RAG."
  },
  {
    q: "Dataset deteksi fraud sangat tidak seimbang: 0,5% transaksi fraud. Kenapa akurasi saja menyesatkan?",
    options: [
      "Karena akurasi hanya bisa dipakai untuk regresi",
      "Karena model yang selalu menebak 'bukan fraud' sudah dapat akurasi 99,5%",
      "Karena akurasi tidak bisa dihitung pada data biner",
      "Karena akurasi selalu lebih rendah dari F1"
    ],
    answer: 1,
    why: "Pada data timpang, baseline 'tebak kelas mayoritas' sudah terlihat bagus. Metrik yang lebih informatif: precision, recall, F1, atau PR-AUC."
  },
  {
    q: "Kamu melakukan standardisasi fitur pada seluruh dataset, lalu baru membaginya menjadi train dan test. Apa risikonya?",
    options: [
      "Tidak ada risiko, urutan tidak berpengaruh",
      "Data leakage, karena statistik test ikut memengaruhi proses training",
      "Model jadi underfitting",
      "Standardisasi harus dilakukan setelah model dilatih"
    ],
    answer: 1,
    why: "Mean dan standar deviasi seharusnya hanya dihitung dari train, lalu diterapkan ke test. Menghitung dari seluruh data membuat informasi test bocor ke training."
  },
  {
    q: "Agen AI diminta menjawab 'harga saham BBCA hari ini'. Cara paling tepat agar jawabannya akurat?",
    options: [
      "Andalkan pengetahuan internal model",
      "Naikkan temperature agar model lebih yakin",
      "Beri akses tool/function call ke API harga saham real-time",
      "Minta model menebak berdasarkan tren historis di data latih"
    ],
    answer: 2,
    why: "Pengetahuan model punya cutoff dan tidak memuat data real-time. Tool calling membuat agen mengambil data aktual alih-alih mengarang."
  }
];

/* ---------- state ---------- */
let order = [];        // urutan indeks soal setelah diacak
let current = 0;       // posisi soal saat ini
let answers = {};      // { posisi: index opsi terpilih }

/* ---------- elemen ---------- */
const el = {
  quiz: document.getElementById("quizScreen"),
  result: document.getElementById("resultScreen"),
  counter: document.getElementById("counter"),
  bar: document.getElementById("progressBar"),
  tag: document.getElementById("qTag"),
  qText: document.getElementById("qText"),
  options: document.getElementById("options"),
  hint: document.getElementById("hint"),
  prev: document.getElementById("prevBtn"),
  next: document.getElementById("nextBtn"),
  scoreBig: document.getElementById("scoreBig"),
  statCorrect: document.getElementById("statCorrect"),
  statWrong: document.getElementById("statWrong"),
  statPct: document.getElementById("statPct"),
  statGrade: document.getElementById("statGrade"),
  msg: document.getElementById("scoreMsg"),
  review: document.getElementById("review"),
  retry: document.getElementById("retryBtn"),
  theme: document.getElementById("themeBtn")
};

/* ---------- util ---------- */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const LETTERS = ["A", "B", "C", "D"];

/* ---------- render soal ---------- */
function renderQuestion() {
  const qIndex = order[current];
  const data = QUESTIONS[qIndex];

  el.counter.textContent = `Soal ${current + 1} dari ${QUESTIONS.length}`;
  el.tag.textContent = `Soal ${current + 1}`;
  el.qText.textContent = data.q;
  el.bar.style.width = `${((current + 1) / QUESTIONS.length) * 100}%`;

  el.options.innerHTML = "";
  data.options.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option" + (answers[current] === i ? " selected" : "");
    btn.innerHTML = `<span class="key">${LETTERS[i]}</span><span class="label"></span>`;
    btn.querySelector(".label").textContent = text;
    btn.addEventListener("click", () => selectOption(i));
    el.options.appendChild(btn);
  });

  el.prev.disabled = current === 0;
  const isLast = current === QUESTIONS.length - 1;
  el.next.textContent = isLast ? "Submit" : "Next";
  el.next.disabled = answers[current] === undefined;
  el.hint.textContent = answers[current] === undefined
    ? "Pilih satu jawaban untuk lanjut."
    : "Jawaban tersimpan. Lanjut ke soal berikutnya.";
}

function selectOption(i) {
  answers[current] = i;
  [...el.options.children].forEach((node, idx) => {
    node.classList.toggle("selected", idx === i);
  });
  el.next.disabled = false;
  el.hint.textContent = "Jawaban tersimpan. Lanjut ke soal berikutnya.";
}

/* ---------- navigasi ---------- */
function goNext() {
  if (answers[current] === undefined) return;
  if (current < QUESTIONS.length - 1) {
    current++;
    renderQuestion();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    submitQuiz();
  }
}

function goPrev() {
  if (current === 0) return;
  current--;
  renderQuestion();
}

/* ---------- hasil ---------- */
function submitQuiz() {
  let correct = 0;
  const total = QUESTIONS.length;

  order.forEach((qIndex, pos) => {
    if (answers[pos] === QUESTIONS[qIndex].answer) correct++;
  });

  const wrong = total - correct;
  const pct = Math.round((correct / total) * 100);

  el.scoreBig.textContent = correct;
  el.statCorrect.textContent = correct;
  el.statWrong.textContent = wrong;
  el.statPct.textContent = pct + "%";
  el.statGrade.textContent = gradeOf(pct);
  el.msg.textContent = messageOf(pct);

  el.review.innerHTML = "";
  order.forEach((qIndex, pos) => {
    const data = QUESTIONS[qIndex];
    const picked = answers[pos];
    const isRight = picked === data.answer;

    const item = document.createElement("div");
    item.className = "rev-item " + (isRight ? "right" : "wrong");

    const qEl = document.createElement("div");
    qEl.className = "rev-q";
    qEl.textContent = `${pos + 1}. ${data.q}`;

    const line = document.createElement("div");
    line.className = "rev-line";
    line.innerHTML = `Jawabanmu: <b></b> · Kunci: <b></b>`;
    const bs = line.querySelectorAll("b");
    bs[0].textContent = picked === undefined
      ? "tidak dijawab"
      : `${LETTERS[picked]}. ${data.options[picked]}`;
    bs[1].textContent = `${LETTERS[data.answer]}. ${data.options[data.answer]}`;

    const why = document.createElement("div");
    why.className = "rev-why";
    why.textContent = data.why;

    item.append(qEl, line, why);
    el.review.appendChild(item);
  });

  el.quiz.classList.add("hidden");
  el.result.classList.remove("hidden");
  el.bar.style.width = "100%";
  el.counter.textContent = `${total} soal selesai`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function gradeOf(pct) {
  if (pct === 100) return "Sempurna";
  if (pct >= 80) return "Sangat baik";
  if (pct >= 60) return "Cukup";
  if (pct >= 40) return "Perlu review";
  return "Dasar";
}

function messageOf(pct) {
  if (pct === 100) return "Semua benar. Pemahaman konsep AI kamu solid, lanjut ke topik yang lebih teknis.";
  if (pct >= 80) return "Kuat. Sisa yang salah biasanya di detail metrik atau kapan pakai fine-tuning vs RAG.";
  if (pct >= 60) return "Cukup. Baca ulang pembahasan di bawah, terutama soal yang menyangkut evaluasi model.";
  if (pct >= 40) return "Masih banyak yang meleset. Fondasi konsepnya perlu dirapikan dulu sebelum masuk praktik.";
  return "Coba ulangi setelah membaca ulang dasar supervised learning, overfitting, dan cara kerja LLM.";
}

/* ---------- reset ---------- */
function startQuiz() {
  order = shuffle([...QUESTIONS.keys()]);
  current = 0;
  answers = {};
  el.result.classList.add("hidden");
  el.quiz.classList.remove("hidden");
  renderQuestion();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- tema ---------- */
function applyTheme(mode) {
  document.documentElement.setAttribute("data-theme", mode);
  el.theme.textContent = mode === "dark" ? "☀" : "◐";
  try { localStorage.setItem("quiz-theme", mode); } catch (e) {}
}

function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem("quiz-theme"); } catch (e) {}
  if (saved) return applyTheme(saved);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");
}

/* ---------- events ---------- */
el.next.addEventListener("click", goNext);
el.prev.addEventListener("click", goPrev);
el.retry.addEventListener("click", startQuiz);
el.theme.addEventListener("click", () => {
  const now = document.documentElement.getAttribute("data-theme");
  applyTheme(now === "dark" ? "light" : "dark");
});

document.addEventListener("keydown", (e) => {
  if (el.quiz.classList.contains("hidden")) return;
  const n = parseInt(e.key, 10);
  if (n >= 1 && n <= 4) {
    const btn = el.options.children[n - 1];
    if (btn) btn.click();
  }
  if (e.key === "Enter") goNext();
});

/* ---------- init ---------- */
initTheme();
startQuiz();
