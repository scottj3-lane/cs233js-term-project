// Jeremy Scott - 6/6/2024 //

import { addNewCardFromInput, flipCard, createCard, removeCard, resetInputFields, calculateFontSize, uploadListToJSONBin } from './cards.js';

// init
let currentList = null; // track the current list
let lists = {}; // store lists

function getLists() {
  return lists;
}

function saveLists() {
  // save lists & binIds to localstorage
  localStorage.setItem('lists', JSON.stringify(lists));
}

// the event listener
document.addEventListener('DOMContentLoaded', () => {
  loadLists(); // load lists before anything else

  // lists & study tab
  document.getElementById('togglePageButton').onclick = showListsPage;

  showStudyPage();

//////

  // dark mode toggle
  const moonIcon = document.getElementById('icon');
  moonIcon.addEventListener('click', function() {
    toggleDarkMode();
  });

  function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
  }

  // settings icon + flyout
  const settingsIcon = document.getElementById('icon2');
  const settingsFlyout = document.getElementById('settingsFlyout');
  settingsIcon.addEventListener('click', () => {
    if (settingsFlyout.style.display === 'none' || settingsFlyout.style.display === '') {
      settingsFlyout.style.display = 'block';
    } else {
      settingsFlyout.style.display = 'none';
    }
  });

//////


//////

  // Instead of using 2 HTML pages, the page can dynamically update itself

  // update page to show lists
  function showListsPage() {
    const pageContent = document.getElementById('pageContent');
    const togglePageButton = document.getElementById('togglePageButton');

    togglePageButton.textContent = 'Study';

    pageContent.innerHTML = `
      <div class="list-page">
        <h1>Lists</h1>
        <input type="text" id="newListName" placeholder="New list name">
        <button id="createListButton">Create List</button>
        <button id="uploadListButton">Upload cards to selected list</button>
        <div id="listsContainer"></div>
      </div>
    `;

    togglePageButton.onclick = showStudyPage;

    document.getElementById('createListButton').onclick = createList;

    document.getElementById('uploadListButton').onclick = () => {
      const binId = lists[currentList].binId;
      uploadListToJSONBin(binId);
    };

    renderLists();
  }

  // update page to show cards
  function showStudyPage() {
    const pageContent = document.getElementById('pageContent');
    const togglePageButton = document.getElementById('togglePageButton');

    togglePageButton.textContent = 'Lists';

    pageContent.innerHTML = `
      <div class="input-field">
        <input type="text" id="frontContent" placeholder="Front of card">
        <input type="text" id="backContent" placeholder="Back of card">
        <button class="add-button" id="addButton">Add</button>
      </div>
      <div class="card-container" id="cardContainer"></div>
    `;

    document.getElementById('addButton').onclick = addNewCardFromInput;

    togglePageButton.onclick = showListsPage;

    renderCards();
  }

//////

  // create lists
  async function createList() {
    const newListName = document.getElementById('newListName').value.trim();
    if (newListName && !lists[newListName]) {
      // create a new list
      lists[newListName] = [];

      // create a new JSONBin bin and add it to the list
      const binId = await createNewJSONBinBin(newListName);

      lists[newListName].binId = binId;

      // save to localstorage
      saveLists();
s
      renderLists();
    } else { // display error
      showModal('List name already exists or is empty.');
    }
  }

  // create a new bin with JSONBin API call
  async function createNewJSONBinBin(listName) {
    // for testing - should be kept private?
    const apiKey = '$2a$10$PsVyRp6f8ZC8IMd6QNSSde8kUZExlSI8NGpXxqBClHoysVwuKnQLm';

    try {
      const response = await fetch('https://api.jsonbin.io/v3/b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': apiKey
        },
        body: JSON.stringify({ listName }) // send list name as the body
      });

      const result = await response.json();
      console.log('New JSONBin bin created:', result);

      return result.metadata.id; // should get binid
    } catch (error) {
      console.error('Error creating new JSONBin bin:', error);
      alert('Failed to create a new JSONBin bin. Please try again later.');
    }
  }

  // select a list
  function selectList(listName) {
    currentList = listName;
    showStudyPage();
  }

  // delete a list
  function deleteList(listName) {
    showModal(`Are you sure you want to delete the list "${listName}"? This action cannot be undone.`, () => {
      delete lists[listName];
      if (currentList === listName) {
        currentList = null;
      }
      saveLists();
      renderLists();
    });
  }

  // render lists on the lists page and add delete button
  function renderLists() {
    const listsContainer = document.getElementById('listsContainer');
    listsContainer.innerHTML = '';

    for (const listName in lists) {
      const listItem = document.createElement('div');
      listItem.className = 'list-item';
      listItem.innerHTML = `
        ${listName}
        <button class="delete-list-button" data-list-name="${listName}">&times;</button>
      `;
      listItem.onclick = (e) => {
        if (e.target.classList.contains('delete-list-button')) {
          deleteList(listName);
        } else {
          selectList(listName);
        }
      };
      listsContainer.appendChild(listItem);
    }
  }

  // render cards on study page
  function renderCards() {
    const cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = '';

    if (currentList && lists[currentList]) { // gets cards from current list selected
      lists[currentList].forEach(card => {
        createCard(card.front, card.back); // this will render them as an element
      });
    }
  }

  // load list from localstorage
  function loadLists() {
    const storedLists = localStorage.getItem('lists');
    if (storedLists) {
      lists = JSON.parse(storedLists);
    }
  }

//////

  // Function to show a modal dialog
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
  });

//////

export { currentList, getLists, saveLists, lists };
