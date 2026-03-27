const MockService = {
    async getAllProducts() {
        return [
            // --- SNEAKERS ---
            { 
                id: 1, 
                name: "Jordan 1 Retro High University Blue", 
                brand: "Jordan", 
                category: "Sneakers",
                colorway: "University Blue",
                price: 190, 
                sizes: ["7", "8", "9", "10", "11", "12"],
                image_url: "https://images.stockx.com/360/Air-Jordan-1-Retro-High-White-University-Blue-Black/Images/Air-Jordan-1-Retro-High-White-University-Blue-Black/Lv2/img01.jpg?fm=avif&auto=compress&w=576" 
            },
            { 
                id: 2, 
                name: "Jordan 4 Retro Military Black", 
                brand: "Jordan", 
                category: "Sneakers",
                colorway: "Military Black",
                price: 210, 
                old_price: 280, 
                sizes: ["9", "9.5", "10"],
                image_url: "https://images.stockx.com/360/Air-Jordan-4-Retro-Military-Black/Images/Air-Jordan-4-Retro-Military-Black/Lv2/img01.jpg?fm=avif&auto=compress&w=576" 
            },
             { 
                id: 3, 
                name: "Jordan 4 Retro Military Black", 
                brand: "Jordan", 
                category: "Sneakers",
                colorway: "Military Black",
                price: 210, 
                old_price: 280, 
                sizes: ["9", "9.5", "10"],
                image_url: "https://images.stockx.com/360/Air-Jordan-4-Retro-Military-Black/Images/Air-Jordan-4-Retro-Military-Black/Lv2/img01.jpg?fm=avif&auto=compress&w=576" 
            },
             { 
                id: 4, 
                name: "Jordan 4 Retro Military Black", 
                brand: "Jordan", 
                category: "Sneakers",
                colorway: "Military Black",
                price: 210, 
                old_price: 280, 
                sizes: ["9", "9.5", "10"],
                image_url: "https://images.stockx.com/360/Air-Jordan-4-Retro-Military-Black/Images/Air-Jordan-4-Retro-Military-Black/Lv2/img01.jpg?fm=avif&auto=compress&w=576" 
            },

            // --- SLIDES ---
            { 
                id: 30, 
                name: "Yeezy Slide Onyx", 
                brand: "Adidas", 
                category: "Slides",
                colorway: "Onyx",
                price: 80, 
                sizes: ["8", "9", "10", "11"],
                image_url: "https://images.stockx.com/360/adidas-Yeezy-Slide-Black/Images/adidas-Yeezy-Slide-Black/Lv2/img01.jpg?fm=avif&auto=compress&w=576" 
            },
             { 
                id: 300, 
                name: "Yeezy Slide Onyx", 
                brand: "Adidas", 
                category: "Slides",
                colorway: "Onyx",
                price: 80, 
                sizes: ["8", "9", "10", "11"],
                image_url: "https://images.stockx.com/360/adidas-Yeezy-Slide-Black/Images/adidas-Yeezy-Slide-Black/Lv2/img01.jpg?fm=avif&auto=compress&w=576" 
            },
            { 
                id: 31, 
                name: "Yeezy Slide Bone", 
                brand: "Adidas", 
                category: "Slides",
                colorway: "Bone",
                price: 90, 
                sizes: ["7", "8", "10"],
                image_url: "https://images.stockx.com/360/adidas-Yeezy-Slide-Bone-2022/Images/adidas-Yeezy-Slide-Bone-2022/Lv2/img01.jpg?fm=avif&auto=compress&w=576" 
            },
             { 
                id: 34, 
                name: "Yeezy Slide Onyx", 
                brand: "Adidas", 
                category: "Slides",
                colorway: "Onyx",
                price: 80, 
                sizes: ["8", "9", "10", "11"],
                image_url: "https://images.stockx.com/360/adidas-Yeezy-Slide-Black/Images/adidas-Yeezy-Slide-Black/Lv2/img01.jpg?fm=avif&auto=compress&w=576" 
            },
            { 
                id: 100, 
                name: "Yeezy Slide Bone", 
                brand: "Adidas", 
                category: "Slides",
                colorway: "Bone",
                price: 90, 
                sizes: ["7", "8", "10"],
                image_url: "https://images.stockx.com/360/adidas-Yeezy-Slide-Bone-2022/Images/adidas-Yeezy-Slide-Bone-2022/Lv2/img01.jpg?fm=avif&auto=compress&w=576" 
            },

            // --- CAPS ---
            { 
                id: 40, 
                name: "New Era NY Yankees 59Fifty", 
                brand: "New Era", 
                category: "Caps",
                colorway: "Navy/White",
                price: 45, 
                sizes: ["7 1/4", "7 3/8", "7 1/2"],
                image_url: "https://images.stockx.com/images/New-Era-New-York-Yankees-Authentic-Collection-On-Field-59FIFTY-Fitted-Hat-Navy.jpg?fit=fill&bg=FFFFFF&w=576&h=384&auto=format,compress&q=90&dpr=2&trim=color&updated_at=1603481985" 
            },
             { 
                id: 41, 
                name: "New Era NY Yankees 59Fifty", 
                brand: "New Era", 
                category: "Caps",
                colorway: "Navy/White",
                price: 45, 
                sizes: ["7 1/4", "7 3/8", "7 1/2"],
                image_url: "https://images.stockx.com/images/New-Era-New-York-Yankees-Authentic-Collection-On-Field-59FIFTY-Fitted-Hat-Navy.jpg?fit=fill&bg=FFFFFF&w=576&h=384&auto=format,compress&q=90&dpr=2&trim=color&updated_at=1603481985" 
            },
            { 
                id: 81, 
                name: "New Era NY Yankees 59Fifty", 
                brand: "New Era", 
                category: "Caps",
                colorway: "Navy/White",
                price: 45, 
                sizes: ["7 1/4", "7 3/8", "7 1/2"],
                image_url: "https://images.stockx.com/images/New-Era-New-York-Yankees-Authentic-Collection-On-Field-59FIFTY-Fitted-Hat-Navy.jpg?fit=fill&bg=FFFFFF&w=576&h=384&auto=format,compress&q=90&dpr=2&trim=color&updated_at=1603481985" 
            },

            // --- SOCCER JERSEYS ---
            { 
                id: 50, 
                name: "Real Madrid 24/25 Home Jersey", 
                brand: "Adidas", 
                category: "Jersey",
                colorway: "White",
                price: 100, 
                sizes: ["S", "M", "L", "XL"],
                image_url: "https://images.stockx.com/images/Adidas-Real-Madrid-Home-Jersey-24-25-White.jpg?fit=fill&bg=FFFFFF&w=576&h=384&auto=format,compress&q=90&dpr=2&trim=color&updated_at=1717614000" 
            }
        ];
    },

    async getProductById(id) {
        const products = await this.getAllProducts();
        return products.find(p => p.id === parseInt(id));
    }
};