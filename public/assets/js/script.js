console.clear();

// Show borders of all DOM elements on click
(function() {
  const bodyDOM = document.querySelector('body');
  const bodyElementsDOM = bodyDOM.querySelectorAll('*');
  const elementDOM = document.querySelector('.company-strapline');

  const showBOXModel = () => {
    bodyElementsDOM.forEach(el => {
      el.classList.toggle('border');
    });
  };

  elementDOM.addEventListener('click', showBOXModel);
}());
