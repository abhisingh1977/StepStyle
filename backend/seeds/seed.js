const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Product = require('../models/Product');

const connectDB = require('../config/db');

const products = [
    // MEN
    { name: 'Urban Runner Pro', description: 'Premium running shoes with responsive cushioning and breathable mesh upper. Designed for urban athletes who demand style and performance.', price: 8999, discountPercent: 25, maxCoinsUsable: 200, category: 'men', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'], brand: 'StepStyle', rating: 4.5, reviewCount: 234, isTrending: true, tags: ['running', 'sports'] },
    { name: 'Classic Leather Jacket', description: 'Handcrafted genuine leather jacket with quilted lining. A timeless piece that elevates any outfit.', price: 12999, discountPercent: 15, maxCoinsUsable: 300, category: 'men', images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'], brand: 'StyleCraft', rating: 4.7, reviewCount: 189, isTrending: true, tags: ['jacket', 'leather'] },
    { name: 'Slim Fit Chinos', description: 'Tailored slim-fit chinos made from premium stretch cotton blend. Perfect for both casual and semi-formal occasions.', price: 2499, discountPercent: 30, maxCoinsUsable: 100, category: 'men', images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600'], brand: 'StepStyle', rating: 4.3, reviewCount: 156, isNewArrival: true, tags: ['pants', 'casual'] },
    { name: 'Performance Hoodie', description: 'Tech-fabric hoodie with moisture-wicking properties and zippered pockets. Your go-to workout companion.', price: 3999, discountPercent: 20, maxCoinsUsable: 150, category: 'men', images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600'], brand: 'ActiveWear', rating: 4.4, reviewCount: 312, isNewArrival: true, isDeal: true, tags: ['hoodie', 'sports'] },

    // WOMEN
    { name: 'Athleisure Yoga Set', description: 'Matching yoga top and leggings set in buttery-soft fabric. Seamless design for maximum comfort and style.', price: 4999, discountPercent: 20, maxCoinsUsable: 150, category: 'women', images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600'], brand: 'FlexFit', rating: 4.6, reviewCount: 420, isTrending: true, tags: ['yoga', 'activewear'] },
    { name: 'Floral Midi Dress', description: 'Elegant floral print midi dress with a flattering A-line silhouette. Perfect for brunches and garden parties.', price: 3499, discountPercent: 35, maxCoinsUsable: 120, category: 'women', images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600'], brand: 'Bloom', rating: 4.5, reviewCount: 278, isNewArrival: true, tags: ['dress', 'casual'] },
    { name: 'Running Tights Pro', description: 'High-waisted compression tights with side pocket and reflective details for early morning runs.', price: 2999, discountPercent: 25, maxCoinsUsable: 100, category: 'women', images: ['https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600'], brand: 'StepStyle', rating: 4.8, reviewCount: 567, isTrending: true, isDeal: true, tags: ['running', 'tights'] },
    { name: 'Oversized Blazer', description: 'Contemporary oversized blazer in premium wool blend. The perfect power piece for any modern wardrobe.', price: 6999, discountPercent: 10, maxCoinsUsable: 200, category: 'women', images: ['https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600'], brand: 'StyleCraft', rating: 4.4, reviewCount: 145, tags: ['blazer', 'formal'] },

    // ELECTRONICS
    { name: 'ProFit Smartwatch X1', description: 'Advanced fitness smartwatch with heart rate monitoring, GPS tracking, and 7-day battery. Syncs with StepStyle app.', price: 14999, discountPercent: 20, maxCoinsUsable: 500, category: 'electronics', images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'], brand: 'TechFit', rating: 4.7, reviewCount: 890, isTrending: true, tags: ['smartwatch', 'fitness'] },
    { name: 'Wireless Earbuds Sport', description: 'IPX7 waterproof wireless earbuds with deep bass and 36-hour battery life. Perfect for intense workouts.', price: 4999, discountPercent: 30, maxCoinsUsable: 200, category: 'electronics', images: ['https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600'], brand: 'SoundPulse', rating: 4.5, reviewCount: 1200, isTrending: true, isDeal: true, tags: ['earbuds', 'wireless'] },
    { name: 'Smart Body Scale', description: 'WiFi-connected smart scale tracking 13 body metrics. Seamless integration with StepStyle fitness ecosystem.', price: 3999, discountPercent: 15, maxCoinsUsable: 100, category: 'electronics', images: ['https://images.unsplash.com/photo-1576511468760-1cf1c9ff8a61?w=600'], brand: 'TechFit', rating: 4.3, reviewCount: 345, isNewArrival: true, tags: ['smart-scale', 'fitness'] },
    { name: 'Fitness Tracker Band', description: 'Slim fitness tracker with AMOLED display, sleep tracking, and SpO2 monitoring. 14-day battery life.', price: 2999, discountPercent: 25, maxCoinsUsable: 100, category: 'electronics', images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600'], brand: 'TechFit', rating: 4.4, reviewCount: 678, isNewArrival: true, tags: ['tracker', 'fitness'] },

    // BEAUTY
    { name: 'Recovery Muscle Gel', description: 'Post-workout muscle recovery gel with arnica and essential oils. Clinically tested for rapid relief.', price: 999, discountPercent: 20, maxCoinsUsable: 50, category: 'beauty', images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600'], brand: 'ActiveGlow', rating: 4.6, reviewCount: 523, isTrending: true, tags: ['skincare', 'recovery'] },
    { name: 'SPF 50 Sport Sunscreen', description: 'Sweat-resistant SPF 50 sunscreen designed for outdoor athletes. Non-greasy, reef-safe formula.', price: 799, discountPercent: 15, maxCoinsUsable: 30, category: 'beauty', images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600'], brand: 'ActiveGlow', rating: 4.5, reviewCount: 890, isTrending: true, isDeal: true, tags: ['sunscreen', 'skincare'] },
    { name: 'Hydrating Face Mist', description: 'Refreshing rose water face mist with hyaluronic acid. Perfect post-workout skin revival.', price: 599, discountPercent: 10, maxCoinsUsable: 20, category: 'beauty', images: ['https://images.unsplash.com/photo-1570194065650-d99fb4d9aaee?w=600'], brand: 'Bloom', rating: 4.4, reviewCount: 234, isNewArrival: true, tags: ['skincare', 'mist'] },
    { name: 'Protein Hair Mask', description: 'Deep conditioning hair mask enriched with keratin protein. Repairs exercise-damaged hair.', price: 1299, discountPercent: 25, maxCoinsUsable: 40, category: 'beauty', images: ['https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600'], brand: 'ActiveGlow', rating: 4.3, reviewCount: 167, isNewArrival: true, tags: ['haircare', 'treatment'] },

    // SHOES
    { name: 'CloudWalk Ultra', description: 'Ultra-lightweight walking shoes with cloud-foam midsole. Designed specifically for step counting enthusiasts.', price: 6999, discountPercent: 20, maxCoinsUsable: 250, category: 'shoes', images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600'], brand: 'StepStyle', rating: 4.8, reviewCount: 1500, isTrending: true, tags: ['walking', 'comfort'] },
    { name: 'Trail Blazer GTX', description: 'All-terrain trail running shoes with GORE-TEX waterproofing and aggressive outsole grip.', price: 9999, discountPercent: 15, maxCoinsUsable: 300, category: 'shoes', images: ['https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600'], brand: 'StepStyle', rating: 4.6, reviewCount: 890, isTrending: true, isDeal: true, tags: ['trail', 'running'] },
    { name: 'Street Canvas Lows', description: 'Classic canvas low-top sneakers with vulcanized rubber sole. Effortless street style for daily steps.', price: 2499, discountPercent: 30, maxCoinsUsable: 80, category: 'shoes', images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600'], brand: 'UrbanStep', rating: 4.4, reviewCount: 2100, isNewArrival: true, tags: ['casual', 'sneakers'] },
    { name: 'Gym Training X', description: 'Cross-training shoes with stable heel and flexible forefoot. Built for HIIT and gym sessions.', price: 5499, discountPercent: 25, maxCoinsUsable: 180, category: 'shoes', images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600'], brand: 'StepStyle', rating: 4.5, reviewCount: 567, isNewArrival: true, isDeal: true, tags: ['gym', 'training'] },
];

const seedDB = async () => {
    try {
        await connectDB();
        console.log('🗑  Clearing database...');
        await User.deleteMany({});
        await Product.deleteMany({});

        // Create demo user
        const demoUser = await User.create({
            name: 'Demo User',
            email: 'demo@stepstyle.com',
            password: 'Demo@123',
            coins: 2500,
            level: 3,
            totalSteps: 152000,
            stepsToday: 8540,
            streak: 14,
            badges: ['Early Bird', 'Step Master', '10K Club'],
        });
        console.log('✅ Demo user created: demo@stepstyle.com / Demo@123');

        await Product.insertMany(products);
        console.log(`✅ ${products.length} products seeded`);

        process.exit(0);
    } catch (err) {
        console.error('❌ Seed Error:', err);
        process.exit(1);
    }
};

seedDB();
