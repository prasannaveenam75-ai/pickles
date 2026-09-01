import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/devi-pickles";

const categories = [
  { name: "Veg Pickles", slug: "veg-pickles", description: "Traditional vegetarian pickles made with authentic recipes and the finest ingredients.", displayOrder: 1, active: true },
  { name: "Non-Veg Pickles", slug: "non-veg-pickles", description: "Rich, flavourful non-vegetarian pickles prepared with care and traditional spices.", displayOrder: 2, active: true },
  { name: "Powders", slug: "powders", description: "Authentic spice powders and podis made from traditional recipes.", displayOrder: 3, active: true },
];

const productData = [
  { name: "Usiri Pickle", slug: "usiri-pickle", category: "Veg Pickles", shortDescription: "Tangy and flavourful gooseberry pickle, a traditional favourite.", description: "Our Usiri Pickle is made from fresh gooseberries, carefully selected and prepared using traditional recipes. The perfect balance of tangy and spicy flavours makes it an ideal accompaniment to any meal.", ingredients: ["Gooseberry", "Chilli Powder", "Turmeric", "Salt", "Mustard Seeds", "Fenugreek", "Oil"], tags: ["veg", "gooseberry", "tangy", "traditional"], featured: true, bestSeller: true, active: true },
  { name: "Tomato Pickle", slug: "tomato-pickle", category: "Veg Pickles", shortDescription: "Rich and tangy tomato pickle with a hint of spice.", description: "Made from ripe, juicy tomatoes and ground with traditional spices, our Tomato Pickle delivers a burst of flavour in every bite.", ingredients: ["Tomato", "Red Chilli", "Garlic", "Salt", "Oil", "Mustard Seeds", "Fenugreek"], tags: ["veg", "tomato", "tangy", "spicy"], featured: true, bestSeller: true, active: true },
  { name: "Pandumirchi Pickle", slug: "pandumirchi-pickle", category: "Veg Pickles", shortDescription: "Bold and fiery red chilli pickle for spice lovers.", description: "Made with sun-dried red chillies and aromatic spices, this pickle is a true celebration of traditional heat.", ingredients: ["Red Chilli", "Garlic", "Salt", "Oil", "Mustard Seeds", "Fenugreek", "Turmeric"], tags: ["veg", "chilli", "spicy", "bold"], featured: false, bestSeller: true, active: true },
  { name: "Lemon Pickle", slug: "lemon-pickle", category: "Veg Pickles", shortDescription: "Zesty and refreshing lemon pickle with a perfect balance of sour and spice.", description: "Our Lemon Pickle captures the fresh, zesty flavour of handpicked lemons, prepared with care using traditional methods.", ingredients: ["Lemon", "Salt", "Red Chilli", "Turmeric", "Mustard Seeds", "Oil", "Fenugreek"], tags: ["veg", "lemon", "zesty", "refreshing"], featured: false, bestSeller: true, active: true },
  { name: "Avakai Pickle", slug: "avakai-pickle", category: "Veg Pickles", shortDescription: "Authentic Andhra-style raw mango pickle with bold flavours.", description: "Made from raw mangoes and ground with hand-pounded spices, it delivers the bold, authentic taste that pickle lovers cherish.", ingredients: ["Raw Mango", "Red Chilli", "Mustard Seeds", "Fenugreek", "Salt", "Oil", "Garlic"], tags: ["veg", "mango", "avakai", "andhra", "traditional"], featured: true, bestSeller: true, active: true },
  { name: "Sweet Avakai Pickle", slug: "sweet-avakai-pickle", category: "Veg Pickles", shortDescription: "A delightful sweet and tangy version of the classic Avakai.", description: "A perfect blend of sweet and tangy, our Sweet Avakai Pickle is for those who enjoy a milder, jaggery-kissed version of the traditional Avakai.", ingredients: ["Raw Mango", "Jaggery", "Red Chilli", "Mustard Seeds", "Fenugreek", "Salt", "Oil"], tags: ["veg", "mango", "sweet", "avakai"], featured: false, bestSeller: false, active: true },
  { name: "Magai Pickle", slug: "magai-pickle", category: "Veg Pickles", shortDescription: "Tangy and spicy magai pickle with a rustic, homemade character.", description: "Our Magai Pickle brings the rustic, homemade flavours of traditional Indian kitchens.", ingredients: ["Raw Mango", "Red Chilli", "Garlic", "Mustard Seeds", "Fenugreek", "Salt", "Oil"], tags: ["veg", "mango", "magai", "rustic"], featured: false, bestSeller: false, active: true },
  { name: "Allam Pickle", slug: "allam-pickle", category: "Veg Pickles", shortDescription: "Bold and aromatic ginger pickle with a warm, spicy kick.", description: "Our Allam Pickle is crafted from fresh ginger and blended with traditional spices.", ingredients: ["Ginger", "Red Chilli", "Garlic", "Mustard Seeds", "Fenugreek", "Salt", "Oil"], tags: ["veg", "ginger", "allam", "aromatic"], featured: false, bestSeller: false, active: true },
  { name: "Vellulli Pickle", slug: "vellulli-pickle", category: "Veg Pickles", shortDescription: "Rich and pungent garlic pickle, a bold condiment for true pickle enthusiasts.", description: "Our Vellulli Pickle showcases the bold, pungent character of garlic, blended with traditional spices and oil.", ingredients: ["Garlic", "Red Chilli", "Mustard Seeds", "Fenugreek", "Salt", "Oil", "Turmeric"], tags: ["veg", "garlic", "vellulli", "bold", "pungent"], featured: false, bestSeller: false, active: true },
  { name: "Gongura Pickle", slug: "gongura-pickle", category: "Veg Pickles", shortDescription: "Tangy and unique gongura pickle, a signature Andhra delicacy.", description: "Gongura is a beloved ingredient in Andhra cuisine, and our pickle captures its distinctive tangy flavour perfectly.", ingredients: ["Gongura Leaves", "Red Chilli", "Garlic", "Mustard Seeds", "Salt", "Oil"], tags: ["veg", "gongura", "andhra", "tangy"], featured: true, bestSeller: false, active: true },
  { name: "Chicken Pickle", slug: "chicken-pickle", category: "Non-Veg Pickles", shortDescription: "Savoury chicken pickle with bones, packed with bold spices.", description: "Our Chicken Pickle with bones is a hearty, flavourful preparation that brings together tender chicken pieces and bold, aromatic spices.", ingredients: ["Chicken", "Red Chilli", "Garlic", "Ginger", "Mustard Seeds", "Fenugreek", "Salt", "Oil", "Spices"], tags: ["non-veg", "chicken", "spicy", "bold"], featured: true, bestSeller: true, active: true },
  { name: "Chicken Pickle Boneless", slug: "chicken-pickle-boneless", category: "Non-Veg Pickles", shortDescription: "Premium boneless chicken pickle, tender and flavourful.", description: "Our Boneless Chicken Pickle offers the same bold flavours with the convenience of boneless pieces.", ingredients: ["Boneless Chicken", "Red Chilli", "Garlic", "Ginger", "Mustard Seeds", "Fenugreek", "Salt", "Oil", "Spices"], tags: ["non-veg", "chicken", "boneless", "premium"], featured: true, bestSeller: true, active: true },
  { name: "Mutton Pickle", slug: "mutton-pickle", category: "Non-Veg Pickles", shortDescription: "Rich and indulgent boneless mutton pickle for the discerning palate.", description: "Our Mutton Pickle is a premium offering made from tender boneless mutton pieces, slow-cooked with aromatic spices.", ingredients: ["Boneless Mutton", "Red Chilli", "Garlic", "Ginger", "Mustard Seeds", "Fenugreek", "Salt", "Oil", "Garam Masala"], tags: ["non-veg", "mutton", "boneless", "premium", "indulgent"], featured: true, bestSeller: false, active: true },
  { name: "Prawns Pickle", slug: "prawns-pickle", category: "Non-Veg Pickles", shortDescription: "Delicious prawns pickle with a coastal flair.", description: "Our Prawns Pickle brings the flavours of the coast to your table.", ingredients: ["Prawns", "Red Chilli", "Garlic", "Ginger", "Mustard Seeds", "Fenugreek", "Salt", "Oil", "Spices"], tags: ["non-veg", "prawns", "seafood", "coastal"], featured: true, bestSeller: false, active: true },
  { name: "Kura Kaaram", slug: "kura-kaaram", category: "Powders", shortDescription: "Traditional curry powder for authentic South Indian flavour.", description: "Our Kura Kaaram is a versatile curry powder made from a carefully balanced blend of roasted spices.", ingredients: ["Red Chilli", "Coriander Seeds", "Cumin", "Fenugreek", "Mustard Seeds", "Garlic", "Salt"], tags: ["powder", "curry", "kura-kaaram", "spice"], featured: false, bestSeller: true, active: true },
  { name: "Pappula Podi", slug: "pappula-podi", category: "Powders", shortDescription: "Savoury dal powder, a traditional accompaniment to meals.", description: "Our Pappula Podi is a classic dal-based powder prepared with roasted lentils, spices and a hint of garlic.", ingredients: ["Toor Dal", "Chana Dal", "Red Chilli", "Garlic", "Cumin", "Mustard Seeds", "Salt", "Oil"], tags: ["powder", "dal", "pappula-podi", "traditional"], featured: false, bestSeller: true, active: true },
];

const variantPrices: Record<string, [number, number]> = {
  "usiri-pickle": [300, 500],
  "tomato-pickle": [300, 500],
  "pandumirchi-pickle": [300, 500],
  "lemon-pickle": [350, 600],
  "avakai-pickle": [300, 500],
  "sweet-avakai-pickle": [350, 550],
  "magai-pickle": [350, 600],
  "allam-pickle": [300, 500],
  "vellulli-pickle": [400, 700],
  "gongura-pickle": [300, 550],
  "chicken-pickle": [550, 950],
  "chicken-pickle-boneless": [650, 1100],
  "mutton-pickle": [1050, 2000],
  "prawns-pickle": [900, 1700],
  "kura-kaaram": [350, 650],
  "pappula-podi": [350, 650],
};

const homepageContent = {
  hero: {
    heading: "AUTHENTIC TASTE.\nMADE WITH LOVE.",
    subheading: "Traditional homemade pickles crafted with care, packed fresh and delivered to your doorstep.",
    image: "",
    ctaText: "SHOP PICKLES",
    ctaUrl: "/shop",
  },
  announcementBar: {
    text: "AUTHENTIC HOMEMADE PICKLES • FRESHLY PREPARED • MADE WITH LOVE",
    active: true,
  },
  trustItems: [
    { icon: "leaf", title: "100% NATURAL", description: "Made with natural ingredients, nothing artificial." },
    { icon: "shield", title: "NO ARTIFICIAL COLOURS", description: "Authentic colours from real ingredients." },
    { icon: "heart", title: "HOMEMADE TASTE", description: "Prepared with traditional recipes and care." },
    { icon: "check", title: "HYGIENICALLY PREPARED", description: "Packed with the highest standards of hygiene." },
  ],
  storySection: {
    title: "TRADITION IN EVERY JAR",
    text: "At Devi Pickles, every jar carries the warmth of traditional homemade cooking. We believe great food does not need to be complicated — it needs authentic ingredients, time-tested recipes and a whole lot of love.",
    image: "",
  },
  featuredProducts: [],
  whyChooseUs: {
    title: "WHY CHOOSE DEVI PICKLES?",
    items: [
      { title: "AUTHENTIC RECIPES", description: "Traditional recipes passed down through generations.", icon: "book" },
      { title: "QUALITY INGREDIENTS", description: "Carefully selected ingredients for the best flavour.", icon: "star" },
      { title: "HOMEMADE TASTE", description: "Prepared with the warmth of traditional cooking.", icon: "home" },
      { title: "HYGIENICALLY PREPARED", description: "Prepared and packed with the highest care.", icon: "shield" },
      { title: "FRESH & FLAVOURFUL", description: "Made fresh to preserve authentic taste.", icon: "zap" },
      { title: "QUALITY YOU CAN TRUST", description: "Consistency and care in every product.", icon: "check" },
    ],
  },
  finalCta: {
    heading: "BRING HOME THE TASTE OF TRADITION.",
    description: "Authentic homemade flavours, prepared with care.",
    buttonText: "SHOP NOW",
    buttonUrl: "/shop",
  },
  socialGallery: [],
  nonVegSection: { heading: "PREMIUM NON-VEG PICKLES", description: "Rich, flavourful and prepared with the finest ingredients.", image: "", ctaText: "EXPLORE NON-VEG PICKLES", ctaUrl: "/shop/non-veg-pickles" },
  powdersSection: { heading: "TRADITIONAL POWDERS", description: "Authentic spice blends made from traditional recipes.", image: "", ctaText: "SHOP POWDERS", ctaUrl: "/shop/powders" },
  experienceSteps: [
    { number: "01", title: "SELECT", description: "Carefully selected ingredients from trusted sources." },
    { number: "02", title: "PREPARE", description: "Ingredients are cleaned and prepared with care." },
    { number: "03", title: "TRADITION", description: "Traditional recipes and time-tested preparation methods." },
    { number: "04", title: "PACK", description: "Packed carefully to preserve freshness and flavour." },
    { number: "05", title: "DELIVER", description: "Delivered to your doorstep with care." },
  ],
};

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  await mongoose.connection.dropDatabase();
  console.log("Database cleared");

  const Category = mongoose.models.Category || require("../src/lib/models/Category").default;
  const Product = mongoose.models.Product || require("../src/lib/models/Product").default;
  const Admin = mongoose.models.Admin || require("../src/lib/models/Admin").default;
  const Homepage = mongoose.models.Homepage || require("../src/lib/models/Homepage").default;
  const SiteSettings = mongoose.models.SiteSettings || require("../src/lib/models/SiteSettings").default;
  const FAQ = mongoose.models.FAQ || require("../src/lib/models/FAQ").default;

  for (const cat of categories) {
    await Category.create(cat);
  }
  console.log("Categories created");

  for (const product of productData) {
    const [p500, p1kg] = variantPrices[product.slug];
    await Product.create({
      ...product,
      variants: [
        { name: "500g", weight: "500g", weightInGrams: 500, price: p500, stock: 50, active: true },
        { name: "1kg", weight: "1kg", weightInGrams: 1000, price: p1kg, stock: 30, active: true },
      ],
    });
  }
  console.log("Products created");

  const hashed = await bcrypt.hash("admin123", 12);
  await Admin.create({
    email: process.env.ADMIN_EMAIL || "admin@devipickles.com",
    name: "Admin",
    password: hashed,
    role: "superadmin",
  });
  console.log("Admin created");

  await Homepage.create(homepageContent);
  console.log("Homepage content created");

  await SiteSettings.create({
    businessName: "Devi Pickles",
    businessAddress: "",
    phone: "",
    whatsappNumber: process.env.WHATSAPP_NUMBER || "",
    email: "",
    fssaiNumber: "20126122000228",
    deliveryRatePerKg: 100,
    minimumDeliveryCharge: 100,
    freeDeliveryEnabled: false,
    freeDeliveryThreshold: 0,
    razorpayEnabled: true,
    whatsappOrdersEnabled: true,
  });
  console.log("Site settings created");

  const defaultFaqs = [
    { question: "What weights are available?", answer: "Most pickles are available in 500g and 1kg packs. You can select your preferred weight on each product page.", displayOrder: 1, active: true },
    { question: "How are orders packed?", answer: "Orders are hygienically packed to preserve freshness and prevent leakage during delivery.", displayOrder: 2, active: true },
    { question: "How is delivery calculated?", answer: "Delivery is calculated based on total order weight at ₹100 per kg. For example, a 500g order costs ₹100, and a 1.5kg order costs ₹150.", displayOrder: 3, active: true },
    { question: "How can I track my order?", answer: "You can track your order by visiting the Track Order page and entering your order number and mobile number.", displayOrder: 4, active: true },
    { question: "Do you accept cancellations?", answer: "Cancellations are accepted before the order is dispatched. Please contact us on WhatsApp at the earliest.", displayOrder: 5, active: true },
    { question: "How can I contact you?", answer: "You can contact us via WhatsApp, phone or email. Visit our Contact page for details.", displayOrder: 6, active: true },
  ];
  for (const faq of defaultFaqs) {
    await FAQ.create(faq);
  }
  console.log("FAQs created");

  console.log("\nSeed completed successfully!");
  console.log("Admin login: admin@devipickles.com / admin123");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
