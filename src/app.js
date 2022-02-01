const StorageController = (function () {
  return {
    storeItem: function(item) {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      }
      else {
        items = JSON.parse(localStorage.getItem("items"));
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItemsFromStorage: function() {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      }
      else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updateItemStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach((item, index) => {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
        localStorage.setItem("items", JSON.stringify(items));
      })
    },
    deleteItemFromStorage: function(id) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach((item, index) => {
        if (id === item.id) {
          items.splice(index, 1);
        }
        localStorage.setItem("items", JSON.stringify(items));
      })
    },
    clearItemsFromStorage: function() {
      localStorage.removeItem("items");
    }
  }
})();

const ItemController = (function () {
  const Item = function (id, name, calorie) {
    this.id = id;
    this.name = name;
    this.calorie = calorie;
  }
  const data = {
    items: StorageController.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }
  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calorie) {
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      calorie = parseInt(calorie);
      newItem = new Item(ID, name, calorie);
      data.items.push(newItem);
      console.log(newItem);
      return newItem;
    },
    getTotalCalories: function () {
      let total = 0;
      data.items.forEach((item) => {
        total += item.calorie;
      })
      data.totalCalories = total;
      return data.totalCalories;
    },
    getItemById: function (id) {
      let found = null;
      data.items.forEach((item) => {
        if (item.id === id) {
          found = item;
        }
      })
      return found;
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    updateItem: function (name, calorie) {
      calorie = parseInt(calorie);
      let found = null;
      data.items.forEach((item) => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calorie = calorie;
          found = item;
        }
      });
      return found;
    },
    clearAllItems: function () {
      data.items = [];
    },
    deleteItem: function (id) {
      ids = data.items.map((item) => {
        return item.id;
      })
      const index = ids.indexOf(id);
      data.items.splice(index, 1);
    }
  }
})();

const UIController = (function () {
  const uiSelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addButton: ".add-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories",
    updateButton: ".update-btn",
    deleteButton: ".delete-btn",
    backButton: ".back-btn",
    clearButton: ".clear-btn"
  }
  return {
    getSelectors: function () {
      return uiSelectors;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(uiSelectors.itemNameInput).value,
        calories: document.querySelector(uiSelectors.itemCaloriesInput).value
      }
    },
    populateItemList: function (items) {
      let html = "";
      items.forEach((item) => {
        html += `
          <li class="collection-item" id="item-${item.id}">
            <strong>${item.name}: <strong> <em>${item.calorie} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          </li>
        `;
      })
      document.querySelector(uiSelectors.itemList).innerHTML = html;
    },
    hideList: function () {
      document.querySelector(uiSelectors.itemList).style.display = "none";
    },
    addItemToList: function (item) {
      document.querySelector(uiSelectors.itemList).style.display = "block";
      const li = document.createElement("li");
      li.className = "collection-item";
      li.id = `item-${item.id}`;
      li.innerHTML = `
        <strong>${item.name}: <strong> <em>${item.calorie} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      `;
      document.querySelector(uiSelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    clearFields: function () {
      document.querySelector(uiSelectors.itemNameInput).value = ""
      document.querySelector(uiSelectors.itemCaloriesInput).value = "";
    },
    showTotalCalories: function (totalCalories) {
      document.querySelector(uiSelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function () {
      UIController.clearFields();
      document.querySelector(uiSelectors.updateButton).style.display = "none";
      document.querySelector(uiSelectors.deleteButton).style.display = "none";
      document.querySelector(uiSelectors.backButton).style.display = "none";
      document.querySelector(uiSelectors.addButton).style.display = "inline";
    },
    addItemToForm: function () {
      document.querySelector(uiSelectors.itemNameInput).value = ItemController.getCurrentItem().name;
      document.querySelector(uiSelectors.itemCaloriesInput).value = ItemController.getCurrentItem().calorie;
      this.showEditState();
    },
    showEditState: function () {
      document.querySelector(uiSelectors.updateButton).style.display = "inline";
      document.querySelector(uiSelectors.deleteButton).style.display = "inline";
      document.querySelector(uiSelectors.backButton).style.display = "inline";
      document.querySelector(uiSelectors.addButton).style.display = "none";
    },
    updateListItems: function (updatedItem) {
      let listItems = document.querySelectorAll(uiSelectors.listItems);
            listItems = Array.from(listItems);
            listItems.forEach(function (listItem) {
                const itemId = listItem.getAttribute("id");
                if (itemId === `item-${updatedItem.id}`) {
                    document.querySelector(`#${itemId}`).innerHTML = `<strong>${updatedItem.name}: </strong> <em>${updatedItem.calorie} Calories</em>
                    <a href="#" class="secondary-content">
                      <i class="edit-item fa fa-pencil"></i>
                    </a>`
                }
            })
    },
    deleteListItem: function (id) {
      const itemId = `#item-${id}`;
      const item = document.querySelector(itemId);
      item.remove();
    },
    clearItems: function () {
      let listItems = document.querySelectorAll(uiSelectors.listItems);
      listItems = Array.from(listItems);
      listItems.forEach((item) => {
        item.remove();
      })
    }
  }
})();

const App = (function (ItemController, UIController, StorageController) {
  const loadEventListeneres = function () {
    const uiSelectors = UIController.getSelectors();
    document.querySelector(uiSelectors.addButton).addEventListener("click", itemAddSubmit);
    document.querySelector(uiSelectors.itemList).addEventListener("click", itemEditClick);
    document.querySelector(uiSelectors.updateButton).addEventListener("click", itemUpdateClick);
    document.querySelector(uiSelectors.backButton).addEventListener("click", UIController.clearEditState());
    document.querySelector(uiSelectors.deleteButton).addEventListener("click", itemDeleteSubmit);
    document.querySelector(uiSelectors.clearButton).addEventListener("click", clearAllItemsClick);
  }

  const itemAddSubmit = function (e) {
    e.preventDefault();
    const input = UIController.getItemInput();
    if (input.name !== "" && input.calories !== "") {
      const newItem = ItemController.addItem(input.name, input.calories);
      UIController.addItemToList(newItem);
      const totalCalories = ItemController.getTotalCalories();
      UIController.showTotalCalories(totalCalories);
      StorageController.storeItem(newItem);
      UIController.clearFields();
    }
  }

  const itemEditClick = function (e) {
    e.preventDefault();
    if (e.target.classList.contains("edit-item")) {
      //console.log("Edit button was tapped");
      const listId = e.target.parentNode.parentNode.parentNode.parentNode.id;
      const listIdArray = listId.split('-');
      const id = parseInt(listIdArray[1]);
      const itemToEdit = ItemController.getItemById(id);
      ItemController.setCurrentItem(itemToEdit);
      UIController.addItemToForm();
    }
  }

  const itemUpdateClick = function (e) {
    e.preventDefault();
    const input = UIController.getItemInput();
    const updatedItem = ItemController.updateItem(input.name, input.calories);
    UIController.updateListItems(updatedItem);
    const totalCalories = ItemController.getTotalCalories();
    UIController.showTotalCalories(totalCalories);
    StorageController.updateItemStorage(updatedItem);
    UIController.clearEditState();
  }

  itemDeleteSubmit = function(e) {
    e.preventDefault();
    const currentItem = ItemController.getCurrentItem();
    ItemController.deleteItem(currentItem.id);
    UIController.deleteListItem(currentItem.id);
    const totalCalories = ItemController.getTotalCalories();
    UIController.showTotalCalories(totalCalories);
    StorageController.deleteItemFromStorage(currentItem.id);
    UIController.clearEditState();
  }

  clearAllItemsClick = function(e) {
    e.preventDefault();
    ItemController.clearAllItems();
    UIController.clearItems();
    const totalCalories = ItemController.getTotalCalories();
    UIController.showTotalCalories(totalCalories);
    StorageController.clearItemsFromStorage();
    UIController.clearEditState();
    UIController.hideList();
  }

  return {
    init: function () {
      UIController.clearEditState();
      const items = ItemController.getItems();
      if (items.length === 0) {
        UIController.hideList();
      } else {
        UIController.populateItemList(items);
        const totalCalories = ItemController.getTotalCalories();
        UIController.showTotalCalories(totalCalories);
      }
      loadEventListeneres();
    }
  }
})(ItemController, UIController, StorageController);

App.init();