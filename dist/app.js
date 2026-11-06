"use strict";
const toast = document.querySelector('.toast');
const dialog = document.querySelector('#manual');
let timer;
for (const item of document.querySelectorAll('.gifts li')) {
  const text = item.querySelector('.gift-text');
  const button = document.createElement('button');
  button.type = 'button'; button.className = 'copy'; button.textContent = 'Копировать';
  button.setAttribute('aria-label', `Скопировать: ${text.querySelector('h3').textContent}`);
  button.addEventListener('click', async () => {
    const value = `${text.querySelector('h3').textContent} — ${text.querySelector('p').textContent}`;
    try {
      await navigator.clipboard.writeText(value);
      button.dataset.copied = ''; button.textContent = 'Скопировано';
      clearTimeout(timer); toast.textContent = 'Идея скопирована'; toast.classList.add('visible');
      timer = setTimeout(() => toast.classList.remove('visible'), 2200);
      setTimeout(() => { delete button.dataset.copied; button.textContent = 'Копировать'; }, 2200);
    } catch {
      const field = dialog.querySelector('textarea'); field.value = value;
      dialog.showModal(); field.focus(); field.select();
    }
  });
  item.append(button);
}
