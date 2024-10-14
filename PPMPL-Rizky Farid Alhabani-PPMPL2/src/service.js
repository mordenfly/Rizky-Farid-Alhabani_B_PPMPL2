// src/service.js
const Repository = require('./repository');
const SecondaryRepository = require('./secondaryRepository');

class Service {
    constructor() {
        this.repository = new Repository();
        this.primaryRepository = new Repository(); 
        this.secondaryRepository = new SecondaryRepository(); 
    }

    getAllItems() {
        return this.repository.getAllItems();
    }

    getItemById(id) {
        let item = this.primaryRepository.getItemById(id);
        if (!item ) { 
            item = this.secondaryRepository.getItemById(id);
        }
        if (!item) {
            throw new Error('Item not found in both repositories');
        }
        return item;
    }

    addItem(name) {
    // Get the existing items from the repository
    const allItems = this.repository.getAllItems();
    
    // Calculate the new ID based on the current number of items
    const newId = allItems.length + 1;
    
    // Create a new item with the computed ID
    const newItem = { id: newId, name };
    
    // Add the new item to the repository
    return this.repository.addItem(newItem);
}

    // Metode baru untuk menghapus item
    deleteItem(id) {
        let deleted = this.primaryRepository.deleteItemById(id);
        if (!deleted) { // Jika tidak ada di primary, coba di secondary
            deleted = this.secondaryRepository.deleteItemById(id);
        }
        if (!deleted) {
            throw new Error('Item not found in both repositories');
        }
        return true;
    }
}

module.exports = Service;


