const popularQueries = document.querySelectorAll('.vs-sg-query-item');
const searchWrapper = document.querySelector('.form[action="/search"] .vs-sg-search-suggestions-wrapper');
const imageSearchWrapper = document.querySelector('.vs-search-bar-modal');

popularQueries.forEach(query => {
  query.addEventListener('click', () => {
    // const queryText = query.textContent;
    // const searchInput = document.querySelector('.form[action="/search"] input[name="q"]');
    // searchInput.value = queryText;
    searchWrapper.style.display = 'none';
    imageSearchWrapper.style.display = 'none';
  });
});