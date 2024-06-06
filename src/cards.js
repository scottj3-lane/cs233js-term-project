// Jeremy Scott - 6/6/2024 //

import { currentList, getLists, saveLists } from './general.js';

// Function to show a modal dialog - reused  from general.js
function showModal(message, onConfirm) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-body">
        <p>${message}</p>
      </div>
      <div class="modal-footer">
        <button class="modal-button ok">OK</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('.ok').onclick = () => {
    if (onConfirm) {
      onConfirm();
    }
    document.body.removeChild(modal);
  };

    modal.style.display = 'block';
  }

// Flip toggle
export function flipCard(card) {
  card.classList.toggle('flipped');
}

// Add new card from input fields
export function addNewCardFromInput() {
  const lists = getLists(); // gets the list you selected

  const frontInput = document.getElementById('frontContent').value.trim();
  const backInput = document.getElementById('backContent').value.trim();

  // check if input fields are not empty
  if (frontInput !== '' && backInput !== '') {
    if (currentList) {
      // create card object
      const newCard = { front: frontInput, back: backInput };

      // add card to the current list
      lists[currentList].push(newCard);

      // save to localstorage
      saveLists();

      // create card on page
      createCard(frontInput, backInput);

      // reset
      resetInputFields();
    } else {
      showModal('No list selected.');
    }
  }
}

// Add a new card from provided text
export function addNewCardFromText(frontText, backText) {
  createCard(frontText, backText);
}

// Remove a card
export function removeCard(card) {
  const lists = getLists();

  const cardContainer = document.getElementById('cardContainer');
  cardContainer.removeChild(card); // removes card

  const frontText = card.querySelector('.card-front').textContent;
  const backText = card.querySelector('.card-back').textContent;

  const list = lists[currentList];  // removes card from list
  const cardIndex = list.findIndex(card => card.front === frontText && card.back === backText);

  if (cardIndex !== -1) {
    list.splice(cardIndex, 1);
    saveLists();
  }
}

// Reset input fields
export function resetInputFields() {
  document.getElementById('frontContent').value = '';
  document.getElementById('backContent').value = '';
}

// Display card on page - creates a container for each card
export function createCard(frontText, backText) {
  const cardContainer = document.getElementById('cardContainer');
  const card = document.createElement('div');
  card.className = 'card';

  const cardInner = document.createElement('div');
  cardInner.className = 'card-container';

  const front = document.createElement('div');
  front.className = 'card-front';
  front.textContent = frontText;
  front.style.fontSize = calculateFontSize(front, frontText) + 'px';

  const back = document.createElement('div');
  back.className = 'card-back';
  back.textContent = backText;
  back.style.fontSize = calculateFontSize(back, backText) + 'px';

  const deleteButton = document.createElement('div');
  deleteButton.className = 'delete-button';
  deleteButton.innerHTML = '&times;';
  deleteButton.addEventListener('click', (e) => {
    e.stopPropagation();
    removeCard(card);
  });

  cardInner.appendChild(front);
  cardInner.appendChild(back);
  card.appendChild(deleteButton);
  card.appendChild(cardInner);
  cardContainer.appendChild(card);

  card.addEventListener('click', () => flipCard(card));
}

// Calculate font size dynamically
export function calculateFontSize(element, text) {
  let fontSize = 24;

  let cardWidth = 300;
  let cardHeight = 200;

  // creates a non-visual element for measuring text
  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');

  context.font = `${fontSize}px Arial`;

  let textWidth = context.measureText(text).width;

  // check if text fits the card
  while ((textWidth > cardWidth || fontSize > cardHeight) && fontSize > 12) {
    fontSize--;
    context.font = `${fontSize}px Arial`;
    textWidth = context.measureText(text).width;
  }

  return fontSize;
}

// Fetch data from the current list
function getCurrentListData() {
  const lists = getLists();
  const currentListData = lists[currentList];
  return currentListData;
}

// Upload list data to JSONBin using a binId
export async function uploadListToJSONBin(binId) {
  const apiKey = '$2a$10$PsVyRp6f8ZC8IMd6QNSSde8kUZExlSI8NGpXxqBClHoysVwuKnQLm';

  const url = `https://api.jsonbin.io/v3/b/${binId}`;

  const currentListData = getCurrentListData();

  if (currentListData) {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': apiKey
        },
        body: JSON.stringify({ listData: currentListData })
      });

      const result = await response.json();
      console.log('Success:', result);
      showModal('List uploaded successfully!');
    } catch (error) {
      console.error('Error:', error);
      showModal('Failed to upload list. Please try again later.');
    }
  } else {
    showModal('Selected list does not exist or is empty.');
  }
}
