console.clear();

// Show borders of all DOM elements on click
(function() {
  var bodyDOM = document.querySelector('body');
  var bodyElementsDOM = bodyDOM.getElementsByTagName('*');
  var elementDOM = document.querySelector('.company-strapline');

  var showBOXModel = function() {
    [].forEach.call(bodyElementsDOM, function(el) {
      
      el.classList.toggle('border');
    });
  };

  elementDOM.addEventListener('click', showBOXModel);
}());
