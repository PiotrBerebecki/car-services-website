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
        speed: 3000,
        auto: true,
        loop: true
    }); 

    console.log("reported screen width");
    console.log(window.screen.width);

    var recesionSliderHeight = 240;

    if(window.screen.width < 500) {
        recesionSliderHeight = 340;
    }

    

    $('#recensionSlider').lightSlider({
        item: 2,
        vertical: true,
        adaptiveHeight: true,
        gallery: false,
        pager: false,
        speed: 5000,
        verticalHeight: recesionSliderHeight,
        auto: true,
        loop: true
    })

    $('#recensionSliderSide').lightSlider({
        item: 2,
        vertical: true,
        adaptiveHeight: true,
        gallery: false,
        pager: false,
        speed: 5000,
        verticalHeight: 340,
        auto: true,
        loop: true
    })



});
