// secondaryRepository.js
class SecondaryRepository {
    constructor() {
        this.data = [
            { id: 3, name: 'Item 3' },
            { id: 4, name: 'Item 4' },
        ];
    }
  
    getItemById(id) {
        return this.data.find(item => item.id === id);
    }
  
    // Metode baru untuk menghapus item berdasarkan ID
    deleteItemById(id) {
        const index = this.data.findIndex(item => item.id === id);
        if (index !== -1) {
            this.data.splice(index, 1);
            return true;
        }
        return false;
    }
  }
  
  module.exports = SecondaryRepository;
  