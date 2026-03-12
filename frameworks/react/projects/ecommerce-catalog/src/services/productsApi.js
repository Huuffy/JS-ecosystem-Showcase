const productsData = [
    {"id":1,"name":"Wireless Headphones","category":"Electronics","price":99.99,"image":"https://picsum.photos/seed/1/400/300"},
    {"id":2,"name":"Smart Watch","category":"Electronics","price":149.99,"image":"https://picsum.photos/seed/2/400/300"},
    {"id":3,"name":"Coffee Maker","category":"Home","price":49.99,"image":"https://picsum.photos/seed/3/400/300"},
    {"id":4,"name":"Yoga Mat","category":"Fitness","price":29.99,"image":"https://picsum.photos/seed/4/400/300"},
    {"id":5,"name":"Bluetooth Speaker","category":"Electronics","price":79.99,"image":"https://picsum.photos/seed/5/400/300"},
    {"id":6,"name":"Gaming Mouse","category":"Electronics","price":39.99,"image":"https://picsum.photos/seed/6/400/300"},
    {"id":7,"name":"Running Shoes","category":"Fitness","price":89.99,"image":"https://picsum.photos/seed/7/400/300"},
    {"id":8,"name":"LED Desk Lamp","category":"Home","price":24.99,"image":"https://picsum.photos/seed/8/400/300"},
    {"id":9,"name":"Electric Toothbrush","category":"Personal Care","price":59.99,"image":"https://picsum.photos/seed/9/400/300"},
    {"id":10,"name":"Laptop Stand","category":"Office","price":34.99,"image":"https://picsum.photos/seed/10/400/300"},
    {"id":11,"name":"Water Bottle","category":"Fitness","price":19.99,"image":"https://picsum.photos/seed/11/400/300"},
    {"id":12,"name":"Portable Charger","category":"Electronics","price":29.99,"image":"https://picsum.photos/seed/12/400/300"},
    {"id":13,"name":"Desk Organizer","category":"Office","price":14.99,"image":"https://picsum.photos/seed/13/400/300"},
    {"id":14,"name":"Hair Dryer","category":"Personal Care","price":44.99,"image":"https://picsum.photos/seed/14/400/300"},
    {"id":15,"name":"Fitness Tracker","category":"Fitness","price":59.99,"image":"https://picsum.photos/seed/15/400/300"},
    {"id":16,"name":"Table Lamp","category":"Home","price":39.99,"image":"https://picsum.photos/seed/16/400/300"},
    {"id":17,"name":"Wireless Keyboard","category":"Electronics","price":49.99,"image":"https://picsum.photos/seed/17/400/300"},
    {"id":18,"name":"Scented Candles","category":"Home","price":19.99,"image":"https://picsum.photos/seed/18/400/300"},
    {"id":19,"name":"Shaving Kit","category":"Personal Care","price":34.99,"image":"https://picsum.photos/seed/19/400/300"},
    {"id":20,"name":"Notebook","category":"Office","price":9.99,"image":"https://picsum.photos/seed/20/400/300"}
];

function fetchProducts({ page = 1, limit = 8, filter = {}, search = '' }) {
    let filtered = [...productsData];

    // Apply category filter
    if (filter.category) {
        filtered = filtered.filter(p => p.category === filter.category);
    }

    // Apply search filter
    if (search) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    // Apply sorting
    if (filter.sort) {
        switch (filter.sort) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
    }

    const start = (page - 1) * limit;
    const end = start + limit;

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                products: filtered.slice(start, end),
                hasMore: end < filtered.length,
                total: filtered.length
            });
        }, 500);
    });
}

window.fetchProducts = fetchProducts;
