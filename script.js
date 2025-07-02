// Default data
let questions = [
  {
    "pytanie": "Co to jest HTML?",
    "odpowiedzi": [
      "Język programowania",
      "Język znaczników",
      "System operacyjny",
      "Framework"
    ],
    "poprawna": "Język znaczników"
  }
];

let currentIndex = 0;
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const correctEl = document.getElementById('correct');
const editForm = document.getElementById('editForm');
const questionInput = document.getElementById('questionInput');
const answersInputs = document.getElementById('answersInputs');
const correctSelect = document.getElementById('correctSelect');

function displayQuestion(index) {
  const q = questions[index];
  if (!q) {
    questionEl.textContent = 'Brak pytań.';
    answersEl.innerHTML = '';
    correctEl.classList.add('hidden');
    return;
  }
  questionEl.textContent = q.pytanie;
  answersEl.innerHTML = q.odpowiedzi
    .map(a => `<div class="border p-2 rounded">${a}</div>`) 
    .join('');
  correctEl.textContent = `Poprawna: ${q.poprawna}`;
  correctEl.classList.add('hidden');
  editForm.classList.add('hidden');
}

document.getElementById('randomBtn').addEventListener('click', () => {
  if (questions.length === 0) return;
  currentIndex = Math.floor(Math.random() * questions.length);
  displayQuestion(currentIndex);
});

document.getElementById('showAnswerBtn').addEventListener('click', () => {
  correctEl.classList.toggle('hidden');
});

document.getElementById('editBtn').addEventListener('click', () => {
  if (!questions[currentIndex]) return;
  editForm.classList.toggle('hidden');
  const q = questions[currentIndex];
  questionInput.value = q.pytanie;
  answersInputs.innerHTML = q.odpowiedzi
    .map((a, i) => `<input class="p-2 border rounded" data-index="${i}" value="${a}">`)
    .join('');
  correctSelect.innerHTML = q.odpowiedzi
    .map(a => `<option value="${a}">${a}</option>`)
    .join('');
  correctSelect.value = q.poprawna;
});

document.getElementById('saveBtn').addEventListener('click', () => {
  const q = questions[currentIndex];
  q.pytanie = questionInput.value;
  const inputs = answersInputs.querySelectorAll('input');
  q.odpowiedzi = Array.from(inputs).map(inp => inp.value);
  q.poprawna = correctSelect.value;
  displayQuestion(currentIndex);
});

document.getElementById('deleteBtn').addEventListener('click', () => {
  if (!questions[currentIndex]) return;
  questions.splice(currentIndex, 1);
  currentIndex = 0;
  displayQuestion(currentIndex);
});

document.getElementById('addBtn').addEventListener('click', () => {
  const newQ = { pytanie: '', odpowiedzi: ['', '', '', ''], poprawna: '' };
  questions.push(newQ);
  currentIndex = questions.length - 1;
  editForm.classList.remove('hidden');
  questionInput.value = '';
  answersInputs.innerHTML = newQ.odpowiedzi
    .map((a, i) => `<input class="p-2 border rounded" data-index="${i}" value="">`)
    .join('');
  correctSelect.innerHTML = newQ.odpowiedzi
    .map(a => `<option value="${a}">${a}</option>`)
    .join('');
  correctSelect.value = '';
});

// File load
const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = evt => {
    try {
      const data = JSON.parse(evt.target.result);
      if (Array.isArray(data)) {
        questions = data;
        currentIndex = 0;
        displayQuestion(currentIndex);
      }
    } catch (err) {
      alert('Niepoprawny JSON');
    }
  };
  reader.readAsText(file);
});

// Download JSON
const downloadLink = document.getElementById('downloadLink');
function updateDownload() {
  const blob = new Blob([JSON.stringify(questions, null, 2)], {
    type: 'application/json'
  });
  downloadLink.href = URL.createObjectURL(blob);
}
setInterval(updateDownload, 1000);

// initial display
displayQuestion(currentIndex);
