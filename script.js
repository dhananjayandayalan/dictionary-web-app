// Font and theme DOM configurations

const elements = {
  darkmodeToggle: document.getElementById('darkmode-toggle'),
  body: document.body,
  fontSelect: document.querySelector('.font-select'),
  searchInput: document.getElementById('search-input'),
  searchButton: document.getElementById('search-button'),
  errorText: document.querySelector('.error-text'),
  options: document.querySelectorAll('.option'),
  loadingGif: document.querySelector('.loading-gif'),
  notFound: document.querySelector('.not-found'),
  audioPlayer: document.getElementById('audio-player'),
  playButton: document.querySelector('.play-button'),
  wordEl: document.querySelector('.phonetic h1'),
  phoneticEl: document.querySelector('.phonetic h2'),
  wordSection: document.querySelector('.word'),
  meaningSection: document.querySelector('.meanings'),
  sourceUrlSection: document.querySelector('.source-urls')
};

elements.searchInput.value = '';

// const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// if (isDark) {
//   darkmodeToggle.checked = true;
// } else {
//   darkmodeToggle.checked = false;
// }

elements.darkmodeToggle.checked = window.matchMedia(
  '(prefers-color-scheme: dark)'
).matches;

if (elements.darkmodeToggle.checked) {
  elements.body.classList.add('dark-mode');
}

elements.darkmodeToggle.addEventListener('change', () => {
  elements.body.classList.toggle('dark-mode');
});

for (const option of elements.options) {
  option.addEventListener('click', () => {
    elements.body.removeAttribute('class');
    if (elements.darkmodeToggle.checked) {
      elements.body.classList.add('dark-mode');
    }
    const font =
      option.textContent === 'Serif'
        ? 'serif'
        : option.textContent === 'Mono'
        ? 'mono'
        : 'sans';
    elements.body.classList.add(font);
    elements.fontSelect.value = option.textContent;
    elements.fontSelect.classList.toggle('open');
  });
}

elements.body.classList.add(
  elements.fontSelect.value === 'Serif'
    ? 'serif'
    : elements.fontSelect.value === 'Mono'
    ? 'mono'
    : 'sans'
);

elements.fontSelect.addEventListener('click', () => {
  elements.fontSelect.classList.toggle('open');
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

elements.searchButton.addEventListener('click', () => searchResult());

elements.searchInput.addEventListener('input', () => {
  removeMessage();
});

elements.searchInput.addEventListener('keypress', (event) => {
  if (
    event.key === 'Enter' &&
    document.activeElement === elements.searchInput
  ) {
    event.preventDefault();
    searchResult();
  }
});

const removeMessage = () => {
  if (!elements.errorText.classList.contains('hide')) {
    elements.errorText.classList.add('hide');
    elements.searchInput.removeAttribute('style');
  }
};

const searchResult = async () => {
  if (!elements.searchInput.value) {
    elements.errorText.classList.remove('hide');
    elements.searchInput.style.outline = '1px solid #ff5252';
  } else {
    const data = await fetchData(elements.searchInput.value);
    if (Array.isArray(data)) {
      const { word, phonetic, phonetics, meanings, sourceUrls } = data[0];
      renderData(word, phonetic, phonetics, meanings, sourceUrls);
    }
  }
};

const fetchData = async (text) => {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${text}`;

  preFetchingActions();
  try {
    const response = await fetch(url);
    if (response.status !== 200) {
      throw new Error('No Data Found');
    } else {
      fetchSuccessActions();
      return await response.json();
    }
  } catch (err) {
    elements.notFound.classList.remove('hide');
    elements.loadingGif.classList.toggle('hide');
    console.error(err);
  }
};

const preFetchingActions = () => {
  !elements.notFound.classList.contains('hide') &&
    elements.notFound.classList.add('hide');
  !elements.wordSection.classList.contains('hide') &&
    elements.wordSection.classList.add('hide');
  !elements.meaningSection.classList.contains('hide') &&
    elements.meaningSection.classList.add('hide');
  !elements.sourceUrlSection.classList.contains('hide') &&
    elements.sourceUrlSection.classList.add('hide');

  elements.loadingGif.classList.toggle('hide');
};

const fetchSuccessActions = () => {
  removeMessage();
  !elements.notFound.classList.contains('hide') &&
    elements.notFound.classList.add('hide');
  elements.wordSection.classList.remove('hide');
  elements.meaningSection.classList.remove('hide');
  elements.sourceUrlSection.classList.remove('hide');

  elements.loadingGif.classList.toggle('hide');
};

const renderData = (word, phonetic, phonetics, meanings, sourceUrls) => {
  renderPhonetics(word, phonetic, phonetics);
  while (elements.meaningSection.firstChild) {
    elements.meaningSection.removeChild(elements.meaningSection.firstChild);
  }
  renderMeanings(meanings);
  renderSourceUrls(sourceUrls, () => {
    const el = document.querySelectorAll('.source-urls ul');
    if (el.length > 1) {
      elements.sourceUrlSection.removeChild(el[0]);
    }
  });
};

const renderPhonetics = (word, phonetic = '', phonetics) => {
  elements.wordEl.innerHTML = word;

  const { text, audio } = phonetics.reduce((initial, data) => {
    const { text, audio } = data;

    if (text && audio && Object.keys(initial).length === 1) {
      initial = { ...initial, text, audio };
    } else {
      initial = { ...initial, text, audio };
    }

    return initial;
  }, {});

  elements.phoneticEl.innerHTML = text ?? phonetic;

  if (audio) {
    elements.audioPlayer.setAttribute('src', audio);
    elements.playButton.classList.remove('hide');
  } else {
    !elements.playButton.classList.contains('hide') &&
      elements.playButton.classList.add('hide');
    elements.audioPlayer.removeAttribute('src');
    elements.audioPlayer.setAttribute('muted', true);
  }
};

elements.playButton.addEventListener('click', () => {
  elements.audioPlayer.controls = true;
  elements.audioPlayer.play();
});

const renderMeanings = (meanings) => {
  for (const meaning of meanings) {
    const containerDiv = document.createElement('div');

    const h2Meaning = document.createElement('h2');
    h2Meaning.textContent = meaning.partOfSpeech;
    containerDiv.appendChild(h2Meaning);

    const h3Meaning = document.createElement('h3');
    h3Meaning.textContent = 'Meaning';
    containerDiv.appendChild(h3Meaning);

    const ulMeanings = document.createElement('ul');
    for (const definition of meaning.definitions) {
      const li = document.createElement('li');
      const h4 = document.createElement('h4');
      h4.textContent = definition.definition;
      li.appendChild(h4);
      if (definition.example) {
        const p = document.createElement('p');
        p.textContent = `"${definition.example}"`;
        definition.example && li.appendChild(p);
      }
      ulMeanings.appendChild(li);
    }
    containerDiv.appendChild(ulMeanings);

    const divSynonyms = document.createElement('div');
    divSynonyms.classList.add('synonyms');

    const h3Synonyms = document.createElement('h3');
    h3Synonyms.textContent = 'Synonyms';

    if (meaning.synonyms.length !== 0) {
      const ulSynonyms = document.createElement('ul');
      for (const synonym of meaning.synonyms) {
        const liSynonym = document.createElement('li');
        const aSynonym = document.createElement('a');
        aSynonym.href = 'javascript:void(0);';
        aSynonym.textContent = synonym;
        liSynonym.appendChild(aSynonym);
        ulSynonyms.appendChild(liSynonym);
      }

      divSynonyms.appendChild(h3Synonyms);
      divSynonyms.appendChild(ulSynonyms);

      containerDiv.appendChild(divSynonyms);
    }

    if (meaning.antonyms.length !== 0) {
      const divAntonyms = document.createElement('div');
      divAntonyms.classList.add('antonyms');

      const h3Antonyms = document.createElement('h3');
      h3Antonyms.textContent = 'Antonyms';

      const ulAntonyms = document.createElement('ul');
      for (const antonym of meaning.antonyms) {
        const liAntonyms = document.createElement('li');
        const aAntonyms = document.createElement('a');
        aAntonyms.href = 'javascript:void(0);';
        aAntonyms.textContent = antonym;
        liAntonyms.appendChild(aAntonyms);
        ulAntonyms.appendChild(liAntonyms);
      }

      divAntonyms.appendChild(h3Antonyms);
      divAntonyms.appendChild(ulAntonyms);

      containerDiv.appendChild(divAntonyms);
    }

    elements.meaningSection.appendChild(containerDiv);
  }
};

const renderSourceUrls = (sourceUrls, callback) => {
  const ul = document.createElement('ul');

  for (const sourceUrl of sourceUrls) {
    const li = document.createElement('li');

    const a = document.createElement('a');
    a.href = sourceUrl;
    a.target = '_blank';

    const anchorText = document.createTextNode(sourceUrl);
    const img = document.createElement('img');
    img.src = './assets/images/icon-new-window.svg';
    img.setAttribute('aria-hidden', 'true');

    a.appendChild(anchorText);
    a.appendChild(img);

    li.appendChild(a);

    ul.appendChild(li);
  }

  elements.sourceUrlSection.appendChild(ul);

  callback();
};
