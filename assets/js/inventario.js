class InventoryManager {
    constructor() {
        this.products = {};
    }

    addProduct(name, quantity) {
        if (this.products[name]) {
            this.products[name] += quantity;
        } else {
            this.products[name] = quantity;
        }
    }

    removeProduct(name, quantity) {
        if (this.products[name]) {
            this.products[name] -= quantity;
            if (this.products[name] <= 0) {
                delete this.products[name];
            }
        }
    }

    checkStock(name) {
        return this.products[name] || 0;
    }

    listAvailableProducts() {
        return Object.entries(this.products)
            .filter(([_, quantity]) => quantity > 0)
            .map(([name, quantity]) => ({ name, quantity }));
    }

    async initializeFromDatabase() {
        const data = await fetchInventoryFromDatabase();
        data.forEach(({ name, quantity }) => {
            this.products[name] = quantity;
        });
    }
}

// Mock function to simulate fetching data from a database
async function fetchInventoryFromDatabase() {
    // Simulate a database call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { name: 'Tomatoes', quantity: 50 },
                { name: 'Cheese', quantity: 20 },
                { name: 'Bread', quantity: 30 },
            ]);
        }, 1000);
    });
}

// Usage example
(async () => {
    const inventoryManager = new InventoryManager();
    await inventoryManager.initializeFromDatabase();
    console.log(inventoryManager.listAvailableProducts());
})();