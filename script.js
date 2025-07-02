let questions = [];

let currentIndex = 0;
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const correctEl = document.getElementById('correct');
const editForm = document.getElementById('editForm');
const questionInput = document.getElementById('questionInput');
const answersInputs = document.getElementById('answersInputs');
const correctSelect = document.getElementById('correctSelect');

async function loadQuestions() {
  try {
    const res = await fetch('questions.json');
    if (res.ok) {
      questions = await res.json();
    }
  } catch (e) {
    console.error('Błąd wczytywania questions.json', e);
  }
  if (questions.length === 0) {
    questions = [
      {
        numer: 1,
        pytanie: 'Co to jest HTML?',
        odpowiedzi: {
          '1': 'Język programowania',
          '2': 'Język znaczników',
          '3': 'System operacyjny',
          '4': 'Framework'
        },
        poprawna: '2'
      }
    ];
  }
  displayQuestion(0);
}

function displayQuestion(index) {
  const q = questions[index];
  if (!q) {
    questionEl.textContent = 'Brak pytań.';
    answersEl.innerHTML = '';
    correctEl.classList.add('hidden');
    return;
  }
  questionEl.textContent = q.pytanie;
  answersEl.innerHTML = Object.entries(q.odpowiedzi)
    .map(
      ([key, text]) =>
        `<button class="answer border p-2 rounded cursor-pointer" data-key="${key}">${text}</button>`
    )
    .join('');
  correctEl.textContent = `Poprawna: ${q.odpowiedzi[q.poprawna] || ''}`;
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

answersEl.addEventListener('click', e => {
  const btn = e.target.closest('.answer');
  if (!btn) return;
  const key = btn.dataset.key;
  const q = questions[currentIndex];
  correctEl.classList.remove('hidden');
  if (key === q.poprawna) {
    btn.classList.add('bg-green-200');
  } else {
    btn.classList.add('bg-red-200');
  }
});

document.getElementById('editBtn').addEventListener('click', () => {
  if (!questions[currentIndex]) return;
  editForm.classList.toggle('hidden');
  const q = questions[currentIndex];
  questionInput.value = q.pytanie;
  answersInputs.innerHTML = Object.entries(q.odpowiedzi)
    .map(
      ([key, text]) =>
        `<input class="p-2 border rounded" data-key="${key}" value="${text}">`
    )
    .join('');
  correctSelect.innerHTML = Object.entries(q.odpowiedzi)
    .map(([key, text]) => `<option value="${key}">${text}</option>`)
    .join('');
  correctSelect.value = q.poprawna;
});

document.getElementById('saveBtn').addEventListener('click', () => {
  const q = questions[currentIndex];
  q.pytanie = questionInput.value;
  const inputs = answersInputs.querySelectorAll('input');
  q.odpowiedzi = {};
  inputs.forEach(inp => {
    q.odpowiedzi[inp.dataset.key] = inp.value;
  });
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
  const newNumber = questions.length
    ? Math.max(...questions.map(q => q.numer || 0)) + 1
    : 1;
  const newQ = {
    numer: newNumber,
    pytanie: '',
    odpowiedzi: { '1': '', '2': '', '3': '', '4': '' },
    poprawna: '1'
  };
  questions.push(newQ);
  currentIndex = questions.length - 1;
  editForm.classList.remove('hidden');
  questionInput.value = '';
  answersInputs.innerHTML = Object.entries(newQ.odpowiedzi)
    .map(
      ([key, text]) =>
        `<input class="p-2 border rounded" data-key="${key}" value="${text}">`
    )
    .join('');
  correctSelect.innerHTML = Object.entries(newQ.odpowiedzi)
    .map(([key, text]) => `<option value="${key}">${text}</option>`)
    .join('');
  correctSelect.value = newQ.poprawna;
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

// initial load
loadQuestions();
