export const CATEGORIES = [
  { name: "Mobiles", sub: ["Apple", "Samsung", "Xiaomi", "OnePlus", "Accessories"] },
  { name: "Electronics", sub: ["Laptops", "Tablets", "Cameras", "Gaming Consoles", "Printers"] },
  { name: "Fashion", sub: ["Men's Wear", "Women's Wear", "Kids", "Watches", "Shoes"] },
  { name: "Home & Furniture", sub: ["Living Room", "Bedroom", "Kitchen", "Decor", "Lighting"] },
  { name: "Appliances", sub: ["Televisions", "Washing Machines", "Refrigerators", "ACs"] },
  { name: "Beauty & Toys", sub: ["Makeup", "Skincare", "Baby Care", "Toys & Games"] },
  { name: "Grocery", sub: ["Staples", "Snacks", "Beverages", "Household Care"] },
];

export const HERO_SLIDES = [
  { 
    id: 1, 
    title: "The Big Tech Sale", 
    sub: "Up to 75% Off on Laptops & Accessories", 
    bg: "bg-gradient-to-r from-blue-900 to-blue-600",
    img: "https://placehold.co/1200x400/1e3a8a/FFFFFF?text=Mega+Tech+Sale+Banner" 
  },
  { 
    id: 2, 
    title: "Fashion Festival", 
    sub: "50-80% Off | Top Brands", 
    bg: "bg-gradient-to-r from-pink-600 to-rose-500",
    img: "https://placehold.co/1200x400/be185d/FFFFFF?text=Fashion+Festival+Banner" 
  },
  { 
    id: 3, 
    title: "Home Makeover", 
    sub: "Starts @ ₹99 | Decor, Sheets & More", 
    bg: "bg-gradient-to-r from-orange-500 to-amber-500",
    img: "https://placehold.co/1200x400/f59e0b/FFFFFF?text=Home+Decor+Sale" 
  },
];

export const DEALS_PRODUCTS = [
  { id: 101, name: "Sony WH-1000XM5 Noise Cancelling", price: 24999, oldPrice: 29990, discount: "17% Off", img: "https://placehold.co/300x300/e2e8f0/1e293b?text=Sony+Headphones" },
  { id: 102, name: "Apple Watch Series 9 GPS", price: 39900, oldPrice: 44900, discount: "11% Off", img: "https://placehold.co/300x300/e2e8f0/1e293b?text=Apple+Watch+9" },
  { id: 103, name: "Samsung Galaxy S24 Ultra", price: 119999, oldPrice: 134999, discount: "12% Off", img: "https://placehold.co/300x300/e2e8f0/1e293b?text=Samsung+S24+Ultra" },
  { id: 104, name: "Nike Air Jordan 1 Retro", price: 14999, oldPrice: 18999, discount: "21% Off", img: "https://placehold.co/300x300/e2e8f0/1e293b?text=Nike+Jordans" },
  { id: 105, name: "Instant Pot Duo 7-in-1", price: 7999, oldPrice: 11999, discount: "33% Off", img: "https://placehold.co/300x300/e2e8f0/1e293b?text=Instant+Pot" },
  { id: 106, name: "Kindle Paperwhite (16GB)", price: 12999, oldPrice: 14999, discount: "13% Off", img: "https://placehold.co/300x300/e2e8f0/1e293b?text=Kindle+Paperwhite" },
];

export const RECOMMENDED_PRODUCTS = [
  { id: 201, name: "Adidas Running Shoes Men", price: 2499, rating: 4.2, reviews: 450, img: "https://placehold.co/200x200/f1f5f9/334155?text=Adidas+Shoes" },
  { id: 202, name: "Puma Cotton T-Shirt", price: 499, rating: 4.0, reviews: 1200, img: "https://placehold.co/200x200/f1f5f9/334155?text=Puma+Tee" },
  { id: 203, name: "Logitech MX Master 3S", price: 9499, rating: 4.8, reviews: 890, img: "https://placehold.co/200x200/f1f5f9/334155?text=Logitech+Mouse" },
  { id: 204, name: "Skybags 32L Backpack", price: 1299, rating: 4.3, reviews: 340, img: "https://placehold.co/200x200/f1f5f9/334155?text=Skybag" },
  { id: 205, name: "Milton Thermosteel Bottle", price: 899, rating: 4.6, reviews: 2100, img: "https://placehold.co/200x200/f1f5f9/334155?text=Water+Bottle" },
  { id: 206, name: "Boat Airdopes 141", price: 1099, rating: 4.1, reviews: 15000, img: "https://placehold.co/200x200/f1f5f9/334155?text=Boat+Airdopes" },
  { id: 207, name: "Philips Trimmer Series 3000", price: 1499, rating: 4.4, reviews: 5600, img: "https://placehold.co/200x300/f1f5f9/334155?text=Philips+Trimmer" },
  { id: 208, name: "Casio Vintage Watch", price: 1695, rating: 4.7, reviews: 800, img: "https://placehold.co/200x200/f1f5f9/334155?text=Casio+Watch" },
  { id: 209, name: "Safari Trolley Bag 65L", price: 3499, rating: 4.2, reviews: 400, img: "https://placehold.co/200x200/f1f5f9/334155?text=Trolley+Bag" },
  { id: 210, name: "MuscleBlaze Whey Protein", price: 2899, rating: 4.5, reviews: 1200, img: "https://placehold.co/200x200/f1f5f9/334155?text=Whey+Protein" },
  { id: 211, name: "Lakme Eyeconic Kajal", price: 199, rating: 4.3, reviews: 9000, img: "https://placehold.co/200x200/f1f5f9/334155?text=Kajal" },
  { id: 212, name: "Godrej Security Camera", price: 2499, rating: 4.0, reviews: 150, img: "https://placehold.co/200x200/f1f5f9/334155?text=CCTV+Camera" },
];

export const FOOTER_LINKS = {
  about: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press Releases", href: "#" },
    { label: "MarketHub Science", href: "#" },
  ],
  connect: [
    { label: "Facebook", href: "#", icon: "Facebook" },
    { label: "Twitter", href: "#", icon: "Twitter" },
    { label: "Instagram", href: "#", icon: "Instagram" },
  ],
  money: [
    { label: "Sell on MarketHub", href: "#" },
    { label: "Protect and Build Your Brand", href: "#" },
    { label: "MarketHub Global Selling", href: "#" },
    { label: "Become an Affiliate", href: "#" },
    { label: "Fulfilment by MarketHub", href: "#" },
  ],
  help: [
    { label: "COVID-19 and MarketHub", href: "#" },
    { label: "Your Account", href: "#" },
    { label: "Returns Centre", href: "#" },
    { label: "100% Purchase Protection", href: "#" },
    { label: "Help", href: "#" },
  ],
};