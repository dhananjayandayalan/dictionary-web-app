// Font and theme DOM configurations

const darkmode_toggle = document.getElementById('darkmode-toggle');
const body = document.getElementsByTagName('body')[0];
const font = document.getElementById('font');

const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (isDark) {
  darkmode_toggle.checked = true;
} else {
  darkmode_toggle.checked = false;
}

if (darkmode_toggle.checked) {
  body.classList.add('dark-mode');
}

darkmode_toggle.addEventListener('change', () => {
  body.classList.toggle('dark-mode');
});

if (font.value != 'sans-serif') {
  body.classList.add(font.value + '');
}

font.addEventListener('click', () => {
  body.removeAttribute('class');
  if (darkmode_toggle.checked) {
    body.classList.add('dark-mode');
  }
  if (font.value !== 'sans-serif') {
    body.classList.add(font.value);
  }
});
