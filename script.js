// Font and theme DOM configurations

const darkmodeToggle = document.getElementById('darkmode-toggle');
const body = document.getElementsByTagName('body')[0];
const fontSelect = document.getElementsByClassName('font-select')[0];
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const errorText = document.getElementsByClassName('error-text')[0];
const options = document.getElementsByTagName('li');
const loadingGif = document.getElementsByClassName('loading-gif')[0];
const notFound = document.getElementsByClassName('not-found')[0];
const audioPlayer = document.getElementById('audio-player');
const playButton = document.getElementsByClassName('play-button')[0];
const wordEl = document.querySelector('.phonetic h1');
const phoneticEl = document.querySelector('.phonetic h2');

const wordSection = document.getElementsByClassName('word')[0];
const meaningSection = document.getElementsByClassName('meanings')[0];
const sourceUrlSection = document.getElementsByClassName('source-urls')[0];

searchInput.value = '';

const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// if (isDark) {
//   darkmodeToggle.checked = true;
// } else {
//   darkmodeToggle.checked = false;
// }

// if (darkmodeToggle.checked) {
//   body.classList.add('dark-mode');
// }

darkmodeToggle.addEventListener('change', () => {
  body.classList.toggle('dark-mode');
});

for (let i = 0; i < options.length; i++) {
  options[i].addEventListener('click', () => {
    body.removeAttribute('class');
    if (darkmodeToggle.checked) {
      body.classList.add('dark-mode');
    }
    body.classList.add(
      options[i].textContent === 'Serif'
        ? 'serif'
        : options[i].textContent === 'Mono'
        ? 'mono'
        : 'sans'
    );
    fontSelect.value = options[i].textContent;
    fontSelect.classList.toggle('open');
  });
}

body.classList.add(
  fontSelect.value === 'Serif'
    ? 'serif'
    : fontSelect.value === 'Mono'
    ? 'mono'
    : 'sans'
);

fontSelect.addEventListener('click', () => {
  fontSelect.classList.toggle('open');
});

// font.addEventListener('click', () => {
//   body.removeAttribute('class');
//   if (darkmodeToggle.checked) {
//     body.classList.add('dark-mode');
//   }
//   if (font.value !== 'sans-serif') {
//     body.classList.add(font.value);
//   }
// });

searchButton.addEventListener('click', () => searchResult());

searchInput.onfocus = (event) => {
  event.preventDefault();
  removeMessage();
};

searchInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter' && document.activeElement === searchInput) {
    event.preventDefault();
    searchResult();
  }
});

const removeMessage = () => {
  if (!errorText.classList.contains('hide')) {
    errorText.classList.add('hide');
    searchInput.removeAttribute('style');
  }
};

const searchResult = async () => {
  if (!searchInput.value) {
    errorText.classList.remove('hide');
    searchInput.style.outline = '1px solid #ff5252';
  } else {
    const data = await fetchData(searchInput.value);
    if (Array.isArray(data)) {
      const { word, phonetic, phonetics, meanings, sourceUrls } = data[0];
      renderData(word, phonetic, phonetics, meanings, sourceUrls);
    }
  }
};

const fetchData = async (text) => {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${text}`;

  !notFound.classList.contains('hide') && notFound.classList.toggle('hide');
  !wordSection.classList.contains('hide') && wordSection.classList.add('hide');
  !meaningSection.classList.contains('hide') &&
    meaningSection.classList.add('hide');
  !sourceUrlSection.classList.contains('hide') &&
    sourceUrlSection.classList.add('hide');

  loadingGif.classList.toggle('hide');
  try {
    const response = await fetch(url);
    if (response.status !== 200) {
      const responseData = await response.json();
      notFound.classList.toggle('hide');
      loadingGif.classList.toggle('hide');
      return responseData;
    } else {
      removeMessage();
      !notFound.classList.contains('hide') && notFound.classList.toggle('hide');
      wordSection.classList.remove('hide');
      meaningSection.classList.remove('hide');
      sourceUrlSection.classList.remove('hide');

      loadingGif.classList.toggle('hide');
      return await response.json();
    }
  } catch (err) {
    console.log(err);
    return {
      error: 500,
      title: 'severe error',
      message: 'could not reach dictionary api'
    };
  }
};

const renderData = (word, phonetic, phonetics, meanings, sourceUrls) => {
  renderPhonetics(word, phonetic, phonetics);
};

const renderPhonetics = (word, phonetic = '', phonetics) => {
  wordEl.innerHTML = word;

  const { text, audio } = phonetics.reduce((initial, data) => {
    const { text, audio } = data;

    if (text && audio && Object.keys(initial).length === 1) {
      initial = { ...initial, text, audio };
    } else {
      initial = { ...initial, text, audio };
    }

    return initial;
  }, {});

  phoneticEl.innerHTML = text ?? phonetic;

  if (audio) {
    audioPlayer.setAttribute('src', audio);
    playButton.classList.remove('hide');
  } else {
    !playButton.classList.contains('hide') && playButton.classList.add('hide');
    audioPlayer.removeAttribute('src');
    audioPlayer.setAttribute('muted', true);
  }
};

playButton.addEventListener('click', () => {
  audioPlayer.controls = true;
  audioPlayer.play();
});
