// Font and theme DOM configurations

const darkmodeToggle = document.getElementById('darkmode-toggle');
const body = document.getElementsByTagName('body')[0];
const fontSelect = document.getElementsByClassName('font-select')[0];
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const errorText = document.getElementsByClassName('error-text')[0];
const options = document.getElementsByTagName('li');

searchInput.value = '';

const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (isDark) {
  darkmodeToggle.checked = true;
} else {
  darkmodeToggle.checked = false;
}

if (darkmodeToggle.checked) {
  body.classList.add('dark-mode');
}

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

searchButton.addEventListener('click', () => {
  if (!searchInput.value) {
    errorText.classList.remove('hide');
    searchInput.style.outline = '1px solid #ff5252';
  } else {
    searchInput.value = '';
  }
});

searchInput.onfocus = (event) => {
  if (!errorText.classList.contains('hide')) {
    errorText.classList.add('hide');
    searchInput.removeAttribute('style');
  }
};
