import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import cloudinary from "../config/cloudinary.js";
import { Admin } from "../models/admin.model.js";
import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI;
const ARTIFACTS_DIR = "C:/Users/joyBoy/.gemini/antigravity-ide/brain/bff6771f-1e6e-48bb-b80b-6e2a164edd29";

if (!MONGODB_URI) {
  console.error("Invalid MONGODB_URI. Check your .env file.");
  process.exit(1);
}

// Image optimization utility
const optimizeImage = async (filePath) => {
  const buffer = await sharp(filePath)
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
  return buffer;
};

// Cloudinary upload utility
const uploadOptimizedImage = (buffer, folder = "bytecart") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, format: "webp" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

// Find local image by prefix in the artifacts folder
const findLocalImage = (prefix) => {
  try {
    const files = fs.readdirSync(ARTIFACTS_DIR);
    const matched = files.find(
      (file) => file.startsWith(prefix) && file.endsWith(".png")
    );
    return matched ? path.join(ARTIFACTS_DIR, matched) : null;
  } catch (e) {
    console.error(`Error reading artifacts dir: ${e.message}`);
    return null;
  }
};

// Upload or fallback handler
const uploadImage = async (prefix, fallbackUrl, folder) => {
  const localPath = findLocalImage(prefix);
  if (localPath) {
    console.log(`Found local image for "${prefix}": ${localPath}. Uploading...`);
    try {
      const buffer = await optimizeImage(localPath);
      const url = await uploadOptimizedImage(buffer, folder);
      console.log(`Uploaded "${prefix}" successfully to ${url}`);
      return url;
    } catch (err) {
      console.error(`Error uploading local image for "${prefix}":`, err.message);
      console.log(`Falling back to ${fallbackUrl}`);
      return fallbackUrl;
    }
  } else {
    console.log(`No local image found for "${prefix}". Using fallback: ${fallbackUrl}`);
    return fallbackUrl;
  }
};

const runSeeder = async () => {
  try {
    console.log("Configuring Cloudinary...");
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });

    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully.");

    // 1. Get or Create Admin User
    const adminEmail = process.env.EMAIL || "admin@bytecart.com";
    const adminName = process.env.NAME || "Admin User";
    const adminPassword = process.env.PASSWORD || "AdminPassword123";

    let admin = await Admin.findOne({ email: adminEmail });
    if (!admin) {
      console.log(`Admin user not found. Creating admin "${adminName}"...`);
      admin = new Admin({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: "super_admin",
        isVerified: true,
      });
      await admin.save();
      console.log("Admin user created.");
    } else {
      console.log(`Found existing admin: ${admin.email}`);
    }

    // 2. Clear existing Products and Categories (as approved by user)
    console.log("Clearing existing products...");
    await Product.deleteMany({});
    console.log("Clearing existing categories...");
    await Category.deleteMany({});
    console.log("Database cleared.");

    // 3. Define Categories
    const categoriesData = [
      {
        key: "laptops",
        name: "Laptops",
        fallbackUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
      },
      {
        key: "headsets",
        name: "Headsets",
        fallbackUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      },
      {
        key: "wearables",
        name: "Wearables",
        fallbackUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
      },
      {
        key: "phones",
        name: "Phones",
        fallbackUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
      },
    ];

    // Seed Categories
    const categoryMap = {};
    for (const cat of categoriesData) {
      console.log(`\nProcessing Category: ${cat.name}`);
      const prefix = `${cat.key.replace(/s$/, "")}_category`;
      const imageUrl = await uploadImage(prefix, cat.fallbackUrl, "bytecart_categories");
      const categoryDoc = await Category.create({
        name: cat.name.toLowerCase(),
        coverImage: imageUrl,
        admin: admin._id,
      });
      categoryMap[cat.key] = categoryDoc._id;
      console.log(`Category "${cat.name}" seeded with ID: ${categoryDoc._id}`);
    }

    // 4. Define Products
    const productsData = [
      // LAPTOPS
      {
        categoryKey: "laptops",
        name: "ZenBook Pro Ultra-Slim",
        prefix: "laptop_ultra",
        price: 1299,
        description: "Super slim, modern 13-inch metallic silver ultrabook with a vibrant display and all-day battery life.",
        color: "Silver",
        stock: 25,
        fallbackUrl: "https://images.unsplash.com/photo-1496181130204-755241544e35?w=800&auto=format&fit=crop&q=80",
      },
      {
        categoryKey: "laptops",
        name: "DevBook Workstation Pro",
        prefix: "laptop_pro",
        price: 1899,
        description: "Professional 16-inch dark space gray laptop designed for developers and power users. Fast processor, lots of RAM.",
        color: "Space Gray",
        stock: 15,
        fallbackUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=80",
      },
      {
        categoryKey: "laptops",
        name: "Razer Blade Stealth Gaming",
        prefix: "laptop_gaming",
        price: 2499,
        description: "Futuristic high-performance gaming laptop with a vibrant RGB backlit keyboard and a powerful graphics card.",
        color: "Matte Black",
        stock: 10,
        fallbackUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80",
      },
      {
        categoryKey: "laptops",
        name: "CreatorBook Studio Rose Gold",
        prefix: "laptop_creator",
        price: 1599,
        description: "Premium creative professional laptop with a color-accurate display perfect for designers and videographers.",
        color: "Rose Gold",
        stock: 20,
        fallbackUrl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80",
      },
      {
        categoryKey: "laptops",
        name: "CloudBook Air Chromebook",
        prefix: "laptop_chromebook",
        price: 349,
        description: "Affordable lightweight cloud laptop in pastel blue. Perfect for students and casual browsing.",
        color: "Pastel Blue",
        stock: 50,
        fallbackUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
      },

      // HEADSETS
      {
        categoryKey: "headsets",
        name: "QuietComfort ANC Headphones",
        prefix: "headset_anc",
        price: 299,
        description: "Over-ear active noise-canceling headphones with plush earcups and immersive wireless sound.",
        color: "Matte Grey",
        stock: 40,
        fallbackUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
      },
      {
        categoryKey: "headsets",
        name: "Orion Wireless Gaming Headset",
        prefix: "headset_gaming",
        price: 149,
        description: "High-fidelity gaming headset with green RGB accents and an integrated crystal-clear boom microphone.",
        color: "Black/Green",
        stock: 30,
        fallbackUrl: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=800&auto=format&fit=crop&q=80",
      },
      {
        categoryKey: "headsets",
        name: "Pulse True Wireless Earbuds",
        prefix: "headset_buds",
        price: 129,
        description: "Sleek metallic silver true wireless earbuds with a compact charging case and sweat resistance.",
        color: "Metallic Silver",
        stock: 60,
        fallbackUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
      },
      {
        categoryKey: "headsets",
        name: "StudioMonitor Open-Back Professional",
        prefix: "headset_studio",
        price: 399,
        description: "Audiophile-grade open-back reference headphones with premium wood accents and luxurious velvet ear pads.",
        color: "Walnut Brown",
        stock: 12,
        fallbackUrl: "https://images.unsplash.com/photo-1484755560693-a4074577af3a?w=800&auto=format&fit=crop&q=80",
      },
      {
        categoryKey: "headsets",
        name: "AeroSport Wireless Neckband",
        prefix: "headset_sport",
        price: 79,
        description: "Ergonomic sports wireless neckband headphones in vibrant red. Secure fit for intense workouts.",
        color: "Vibrant Red",
        stock: 45,
        fallbackUrl: "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&auto=format&fit=crop&q=80",
      },

      // WEARABLES
      {
        categoryKey: "wearables",
        name: "Chronos Classic Smartwatch",
        prefix: "wearable_classic",
        price: 349,
        description: "Luxury smartwatch with a polished stainless steel link band and a classic mechanical chronograph interface.",
        color: "Silver Steel",
        stock: 18,
        fallbackUrl: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
      },
      {
        categoryKey: "wearables",
        name: "FlexFit Smart Band",
        prefix: "wearable_fitness",
        price: 89,
        description: "Sleek fitness tracker band with a bright OLED color screen, continuous heart rate monitoring, and GPS.",
        color: "Graphite Black",
        stock: 80,
        fallbackUrl: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80",
      },
      {
        categoryKey: "wearables",
        name: "Adventure GPS Rugged Watch",
        prefix: "wearable_rugged",
        price: 249,
        description: "Tough shockproof outdoor GPS smartwatch with a carbon-reinforced bezel and tactical green strap.",
        color: "Tactical Green",
        stock: 22,
        fallbackUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80",
      },
      {
        categoryKey: "wearables",
        name: "Aura Titanium Smart Ring",
        prefix: "wearable_ring",
        price: 299,
        description: "Minimalist smart ring crafted from titanium. Seamlessly monitors sleep quality, activity, and temperature.",
        color: "Titanium Silver",
        stock: 35,
        fallbackUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80",
      },
      {
        categoryKey: "wearables",
        name: "Junior GPS Buddy Watch",
        prefix: "wearable_kids",
        price: 99,
        description: "Durable and colorful smartwatch for kids, featuring real-time GPS tracking and two-way voice calling.",
        color: "Sky Blue",
        stock: 50,
        fallbackUrl: "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=800&auto=format&fit=crop&q=80",
      },

      // PHONES
      {
        categoryKey: "phones",
        name: "Apex Ultra Flagship 5G",
        prefix: "phone_flagship",
        price: 1099,
        description: "Cutting-edge flagship smartphone with a titanium frame, 100x zoom camera, and a gorgeous 120Hz display.",
        color: "Titanium Gray",
        stock: 20,
        fallbackUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
      },
      {
        categoryKey: "phones",
        name: "Horizon Foldable Screen",
        prefix: "phone_fold",
        price: 1799,
        description: "Innovative smartphone with a folding display, offering a tablet experience that fits in your pocket.",
        color: "Cosmic Black",
        stock: 10,
        fallbackUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80",
      },
      {
        categoryKey: "phones",
        name: "Neon X-Lite 5G",
        prefix: "phone_lite",
        price: 499,
        description: "Sleek and slim mid-range smartphone with 5G connectivity and outstanding battery life.",
        color: "Aurora Blue",
        stock: 35,
        fallbackUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
      },
      {
        categoryKey: "phones",
        name: "Cyber Trigger Mobile Gaming",
        prefix: "phone_gaming",
        price: 899,
        description: "Dedicated gaming phone with built-in cooling fans, physical shoulder triggers, and ultra-fast refresh rate.",
        color: "Carbon Cyber",
        stock: 15,
        fallbackUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
      },
      {
        categoryKey: "phones",
        name: "Aegis Heavy Duty Rugged",
        prefix: "phone_rugged",
        price: 399,
        description: "Virtually indestructible heavy-duty rugged smartphone. IP69K dust/waterproof with a massive battery.",
        color: "Safety Orange",
        stock: 25,
        fallbackUrl: "https://images.unsplash.com/photo-1565630916779-e303be97b6f5?w=800&auto=format&fit=crop&q=80",
      },
    ];

    // Seed Products
    for (const prod of productsData) {
      console.log(`\nProcessing Product: ${prod.name}`);
      const categoryId = categoryMap[prod.categoryKey];
      if (!categoryId) {
        console.error(`Category key "${prod.categoryKey}" not found in categoryMap! skipping.`);
        continue;
      }

      const imageUrl = await uploadImage(prod.prefix, prod.fallbackUrl, "bytecart");
      
      const productDoc = await Product.create({
        name: prod.name,
        description: prod.description,
        price: prod.price,
        category: categoryId,
        coverImage: imageUrl,
        images: [imageUrl], // Use coverImage as first detail image too
        stock: prod.stock,
        color: prod.color,
        admin: admin._id,
      });

      console.log(`Product "${prod.name}" seeded with ID: ${productDoc._id}`);
    }

    console.log("\nDatabase seeding completed successfully!");
  } catch (error) {
    console.error("Error during database seeding:", error);
  } finally {
    console.log("Disconnecting from MongoDB...");
    await mongoose.disconnect();
    console.log("Disconnected.");
    process.exit(0);
  }
};

runSeeder();
