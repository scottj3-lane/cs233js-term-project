// Jeremy Scott - 3/18/2024
let cardIndex = 0;
/*
//
// base64 sharing system
//

// encode to base64
function encodeCards() {

  // get created cards
  let cardContainer = document.getElementById('cardContainer');
  let cards = cardContainer.querySelectorAll('.card');

  let cardsData = [];

  // iterate each card
  // stored as: front: "fronttext", back: "backtext" for each card
  cards.forEach(card => {
    let frontText = card.querySelector('.card-front').textContent;
    let backText = card.querySelector('.card-back').textContent;

    cardsData.push({
      front: frontText,
      back: backText
    });
  });

  // cardsData becomes a JSON string, which is then encoded to base64
  let cardsJson = JSON.stringify(cardsData);
  let cardsBase64 = btoa(cardsJson);

  let sharecode = '?cards=' + encodeURIComponent(cardsBase64);

  alert("Copy and paste this and add it after index.html:\n" + sharecode);
}

// decode from string in url
function extractCardsFromUrl() {
  // this gets the current URL
  let urlParams = new URLSearchParams(window.location.search);
  // this looks specifically for "?cards="
  let cardsBase64 = urlParams.get('cards');

  if (cardsBase64) {
    let cardsJson = atob(cardsBase64);
    let cardsData = JSON.parse(cardsJson);
  
    // iterate each card and sends it to createCard
    cardsData.forEach(cardData => {
      let frontInput = cardData.front;
      let backInput = cardData.back;

      createCard(frontInput, backInput);
    });
  }
}

function createCard(frontText, backText) {
  cardIndex++;

  let card = document.createElement('div');
  card.classList.add('card');
  card.setAttribute('onclick', 'flipCard(this)');

  // delete a card
  let deleteButton = document.createElement('div');
  deleteButton.classList.add('delete-button');
  deleteButton.innerHTML = '&times;';
  deleteButton.setAttribute('onclick', 'removeCard(this.parentNode)');

  // the card itself
  let cardInner = document.createElement('div');
  cardInner.classList.add('card-container');

  let cardFront = document.createElement('div');
  cardFront.classList.add('card-front');
  cardFront.textContent = frontText;

  let cardBack = document.createElement('div');
  cardBack.classList.add('card-back');
  cardBack.textContent = backText;

  // call calculate font size
  let fontSizeFront = calculateFontSize(cardFront, frontText);
  let fontSizeBack = calculateFontSize(cardBack, backText);

  // apply font size
  cardFront.style.fontSize = fontSizeFront + 'px';
  cardBack.style.fontSize = fontSizeBack + 'px';

  // creates a card and resets input field
  cardInner.appendChild(cardFront);
  cardInner.appendChild(cardBack);

  card.appendChild(deleteButton);
  card.appendChild(cardInner);

  cardContainer.appendChild(card);
}
*/

//
// cards
//
function flipCard(card) {
  card.classList.toggle('flipped');
}

function addNewCardFromInput() {
  let frontInput = document.getElementById('frontContent').value.trim();
  let backInput = document.getElementById('backContent').value.trim();

  if (frontInput !== '' && backInput !== '') {
    createCard(frontInput, backInput);
    resetInputFields();
  } else {
    alert('Please enter both front and back content for the card.');
  }
}

function addNewCardFromText(frontText, backText) {
  createCard(frontText, backText);
}

function removeCard(card) {
  let cardContainer = document.getElementById('cardContainer');
  cardContainer.removeChild(card);
}

function resetInputFields() {
  document.getElementById('frontContent').value = '';
  document.getElementById('backContent').value = '';
}


// BUG:
// for every long strings with no spaces, the text will overflow
function calculateFontSize(element, text) {
  // Set a base font size
  let fontSize = 24;

  // Set the card width and height
  let cardWidth = 300;
  let cardHeight = 200;

  // create a non-visual element for measuring text
  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');

  let textWidth = context.measureText(text).width;
  
  // check if text fits the card
  while ((textWidth > cardWidth || fontSize > cardHeight) && fontSize > 12) {
    fontSize--;
  }

  return fontSize;
}
