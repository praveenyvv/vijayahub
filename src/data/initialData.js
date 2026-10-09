export const INITIAL_PRODUCTS = [
  // --- KITCHEN APPLIANCES ---
  {
    id: 'prod-ka-1',
    title: 'Preethi Zodiac MG-218 750W Mixer Grinder',
    category: 'Kitchen Appliances',
    price: 7499,
    mrp: 9999,
    stock: 6,
    rating: 4.8,
    reviewsCount: 38,
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80',
    description: 'Powerful 750W Vega W5 motor capable of grinding tough ingredients in 2 minutes. Includes MasterChef Food Processor jar for chopping, slicing, grating, and atta kneading.',
    specs: {
      power: '750 Watts Vega W5 Motor',
      warranty: '2 Years Comprehensive + 5 Years on Motor',
      boxContents: '1x Motor Unit, 5x Stainless Steel & Tritan Jars, MasterChef Bowl, Citrus Press, Kneader Blade, User Manual',
      brand: 'Preethi',
      modelNumber: 'MG-218'
    },
    badge: 'Best Seller in Vizag'
  },
  {
    id: 'prod-ka-2',
    title: 'Pigeon Cruise 1800W Induction Cooktop',
    category: 'Kitchen Appliances',
    price: 1599,
    mrp: 3195,
    stock: 14,
    rating: 4.6,
    reviewsCount: 52,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    description: 'High-speed energy-efficient 1800W electromagnetic induction cooktop with 7 preset Indian cooking menus, LED display, and dual heat sensors.',
    specs: {
      power: '1800 Watts High Efficiency',
      warranty: '1 Year Manufacturer Warranty',
      boxContents: '1x Induction Cooktop Unit, Warranty Card, User Manual',
      brand: 'Pigeon by Stovekraft',
      modelNumber: 'Cruise 1800'
    },
    badge: '50% OFF'
  },
  {
    id: 'prod-ka-3',
    title: 'Philips Digital Air Fryer HD9252/90 (4.1L)',
    category: 'Kitchen Appliances',
    price: 6999,
    mrp: 10995,
    stock: 4,
    rating: 4.9,
    reviewsCount: 29,
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80',
    description: 'Patented Rapid Air Technology fries with up to 90% less fat. Features digital touch screen with 7 preset cooking programs and Keep Warm function.',
    specs: {
      power: '1400 Watts Rapid Air',
      warranty: '2 Years Worldwide Guarantee',
      boxContents: '1x Air Fryer Unit, 4.1L Pan & Basket, Recipe Book QR, Quick Guide',
      brand: 'Philips',
      modelNumber: 'HD9252/90'
    },
    badge: 'Healthy Choice'
  },
  {
    id: 'prod-ka-4',
    title: 'Butterfly Smart Glass 3 Burner Gas Stove',
    category: 'Kitchen Appliances',
    price: 2899,
    mrp: 5495,
    stock: 5,
    rating: 4.7,
    reviewsCount: 41,
    image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80',
    description: 'Shatter-proof toughened black glass top with heavy-duty brass burners and powder-coated pan supports for stable Indian heavy cooking.',
    specs: {
      power: 'High Efficiency Thermal Brass Burners',
      warranty: '1 Year Warranty on Product, 2 Years on Glass',
      boxContents: '1x 3-Burner Gas Stove, 3x Brass Burners, 3x Pan Supports, 4x Rubber Legs',
      brand: 'Butterfly',
      modelNumber: 'Smart Glass 3B'
    },
    badge: 'Popular'
  },
  {
    id: 'prod-ka-5',
    title: 'Prestige Iris 1.2L Stainless Steel Electric Kettle',
    category: 'Kitchen Appliances',
    price: 749,
    mrp: 1295,
    stock: 18,
    rating: 4.5,
    reviewsCount: 64,
    image: 'https://images.unsplash.com/photo-1520038410233-7141be7e6f97?auto=format&fit=crop&w=800&q=80',
    description: 'Fast boiling 1200W electric kettle with 360-degree swivel base, automatic cut-off when water boils, and single-touch lid locking.',
    specs: {
      power: '1200 Watts Fast Boil',
      warranty: '1 Year Prestige Brand Warranty',
      boxContents: '1x Electric Kettle, 1x Swivel Power Base, Instruction Manual',
      brand: 'Prestige',
      modelNumber: 'Iris 1.2L'
    },
    badge: 'Everyday Essential'
  },

  // --- FRESH DRY FRUITS ---
  {
    id: 'prod-df-1',
    title: 'Premium W-240 Jumbo Cashews (Kaju) - 500g',
    category: 'Fresh Dry Fruits',
    price: 499,
    mrp: 650,
    stock: 28,
    rating: 4.9,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
    description: 'Handpicked, whole white jumbo W-240 kernel cashews. Crispy, naturally sweet, unroasted, and nitrogen-vacuum packed to preserve freshness.',
    specs: {
      packWeight: '500 Grams Pouch',
      grade: 'Grade W-240 Whole Jumbo',
      shelfLife: '9 Months from Packing',
      fssaiLicense: '10123000019842',
      origin: 'Mangalore / Kerala'
    },
    badge: 'Direct Farm Price'
  },
  {
    id: 'prod-df-2',
    title: 'California Select Crunchy Almonds (Badam) - 500g',
    category: 'Fresh Dry Fruits',
    price: 449,
    mrp: 599,
    stock: 35,
    rating: 4.8,
    reviewsCount: 76,
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80',
    description: '100% genuine California Nonpareil almonds. Rich in plant protein, Vitamin E, and antioxidants. Perfectly crunchy with zero bitter taste.',
    specs: {
      packWeight: '500 Grams Airtight Standup Pouch',
      grade: 'Extra No. 1 California Nonpareil',
      shelfLife: '12 Months',
      fssaiLicense: '10123000019842',
      origin: 'California, USA (Packed in Vizag)'
    },
    badge: 'High Protein'
  },
  {
    id: 'prod-df-3',
    title: 'Kashmiri Snow White Walnut Kernels (Akhrot) - 250g',
    category: 'Fresh Dry Fruits',
    price: 380,
    mrp: 490,
    stock: 15,
    rating: 4.9,
    reviewsCount: 34,
    image: 'https://images.unsplash.com/photo-1558818498-28c1e002b655?auto=format&fit=crop&w=800&q=80',
    description: 'Pure Kashmiri walnut kernels (halves and quarters) with rich natural oils. High in plant-based Omega-3 fatty acids for brain & heart health.',
    specs: {
      packWeight: '250 Grams Resealable Zip Lock',
      grade: 'Snow White Halves (Grade A)',
      shelfLife: '6 Months (Store refrigerated)',
      fssaiLicense: '10123000019842',
      origin: 'Srinagar, Kashmir'
    },
    badge: 'Pure Kashmiri'
  },
  {
    id: 'prod-df-4',
    title: 'Afghani Jumbo Dried Figs (Anjeer) - 500g',
    category: 'Fresh Dry Fruits',
    price: 590,
    mrp: 750,
    stock: 12,
    rating: 4.7,
    reviewsCount: 42,
    image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80',
    description: 'Plump, naturally sun-dried Afghani garland figs. Soft and naturally sweet with zero added sugar or preservatives. High in dietary fiber and calcium.',
    specs: {
      packWeight: '500 Grams Pack',
      grade: 'Afghani Jumbo Garland Cut',
      shelfLife: '8 Months',
      fssaiLicense: '10123000019842',
      origin: 'Kandahar, Afghanistan'
    },
    badge: 'Zero Added Sugar'
  },
  {
    id: 'prod-df-5',
    title: 'Long Golden Kishmish (Green Raisins) - 500g',
    category: 'Fresh Dry Fruits',
    price: 199,
    mrp: 280,
    stock: 22,
    rating: 4.6,
    reviewsCount: 39,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    description: 'Selected long seedless green raisins sun-dried in clean hygienic chambers. Soft, chewy, rich in iron, and perfect for sweet dishes.',
    specs: {
      packWeight: '500 Grams Pouch',
      grade: 'Nashik Green Long Seedless',
      shelfLife: '9 Months',
      fssaiLicense: '10123000019842',
      origin: 'Nashik, Maharashtra'
    },
    badge: 'Value Pack'
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'VH-1042',
    date: '2026-10-08T09:15:00',
    customer: {
      name: 'Ramesh Varma',
      phone: '9848022341',
      email: 'ramesh.varma@gmail.com',
      address: 'Plot 42, Sector 3, MVP Colony, Visakhapatnam',
      pincode: '530017',
      landmark: 'Near AS Raja College'
    },
    fulfillmentType: 'delivery', // 'delivery' or 'pickup'
    items: [
      {
        id: 'prod-ka-1',
        title: 'Preethi Zodiac MG-218 750W Mixer Grinder',
        price: 7499,
        quantity: 1
      },
      {
        id: 'prod-df-1',
        title: 'Premium W-240 Jumbo Cashews (Kaju) - 500g',
        price: 499,
        quantity: 2
      }
    ],
    itemSubtotal: 8497,
    deliveryFee: 0, // Free above 999
    total: 8497,
    paymentMethod: 'UPI (PhonePe)',
    paymentStatus: 'PAID',
    status: 'Packed', // 'Placed', 'Packed', 'Out for Delivery', 'Completed'
    notes: 'Please call before arriving at the gate.'
  },
  {
    id: 'VH-1041',
    date: '2026-10-07T16:30:00',
    customer: {
      name: 'Sravani Devi',
      phone: '9490155678',
      email: 'sravani.d@yahoo.com',
      address: 'Near Old Gajuwaka Junction, Visakhapatnam',
      pincode: '530026',
      landmark: 'Opposite State Bank of India'
    },
    fulfillmentType: 'pickup',
    items: [
      {
        id: 'prod-df-2',
        title: 'California Select Crunchy Almonds (Badam) - 500g',
        price: 449,
        quantity: 2
      },
      {
        id: 'prod-df-4',
        title: 'Afghani Jumbo Dried Figs (Anjeer) - 500g',
        price: 590,
        quantity: 1
      }
    ],
    itemSubtotal: 1488,
    deliveryFee: 0,
    total: 1488,
    paymentMethod: 'Pay on Pickup (UPI/Cash)',
    paymentStatus: 'PAID',
    status: 'Completed',
    notes: 'Customer collected at Dwaraka Nagar hub.'
  }
];

export const VIZAG_STORE_INFO = {
  name: 'VijayaHub Central Store & Warehouse',
  address: 'Door No. 47-10-22, 1st Floor, Near RTC Complex, Dwaraka Nagar, Visakhapatnam, Andhra Pradesh - 530016',
  phone: '+91 98480 54321',
  whatsapp: '+91 98480 54321',
  email: 'orders@vijayahub.com',
  workingHours: '10:00 AM - 8:30 PM (All 7 Days)',
  deliveryRadiusKm: 20,
  freeDeliveryThreshold: 999,
  localDeliveryFlatFee: 40,
  fssaiNumber: '10123000019842',
  gstNumber: '37AAAAA0000A1Z5',
  upiId: '9392624326@idfcfirst',
  upiPayeeName: 'VijayaHub'
};
