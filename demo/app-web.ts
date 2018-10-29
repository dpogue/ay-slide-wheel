import '../src/web-component';

document.addEventListener('DOMContentLoaded', () => {
  const elem = document.querySelector('ay-slide-wheel');
  const update = document.querySelector('#currentVal');
  update.textContent = "0";
  elem.addEventListener('onChange', (evt: CustomEvent) => {
    update.textContent = evt.detail.toString();
  });
});

