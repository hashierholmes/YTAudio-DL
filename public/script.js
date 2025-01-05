const form = document.getElementById('downloadForm');
const processingMessage = document.getElementById('processingMessage');

form.addEventListener('submit', function () {
  processingMessage.style.display = 'block';
});