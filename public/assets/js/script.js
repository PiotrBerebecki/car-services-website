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

//   elementDOM.addEventListener('click', showBOXModel);


  var readMoreButton = document.querySelector('#home-text-button');
    if(readMoreButton) {
        readMoreButton.addEventListener('click', showMoreText);
    }
  

  function showMoreText() {
      
      var textArea = document.querySelector('#home-text');
      textArea.style.display = "block";
      readMoreButton.style.display = "none";

  }


}());

$(document).ready(function() {
    $("#lightSlider").lightSlider({
        item: 1,
        gallery: false,
        pager: false,
        useCSS: false,
        auto: true,
        loop: true
    }); 

    $('#recensionSlider').lightSlider({
        item: 2,
        vertical: true,
        adaptiveHeight: true,
        gallery: false,
        pager: false,
        verticalHeight: 240,
        auto: true,
        loop: true
    })



});
