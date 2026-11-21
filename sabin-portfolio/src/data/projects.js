// Project data — add new projects here without touching any UI component.

import shopzoneHero from "../assets/shopzone/hero.webp";
import shopzoneCategory from "../assets/shopzone/category.webp";
import shopzoneProducts from "../assets/shopzone/products.webp";
import shopzoneProductDetail from "../assets/shopzone/product-detail.webp";
import shopzoneCart from "../assets/shopzone/cart.webp";
import shopzoneFounders from "../assets/shopzone/founders.webp";
import shopzoneMilestones from "../assets/shopzone/milestones.webp";
import shopzoneValues from "../assets/shopzone/values.webp";

export const projects = [
  {
    id: "shopzone",
    title: "ShopZone",
    description:
      "A modern full-stack e-commerce platform with authentication, product and category management, a shopping cart, and an admin workflow backed by a REST API.",
    image: shopzoneHero,
    gallery: [
      { src: shopzoneHero, caption: "Homepage — hero and category highlights" },
      { src: shopzoneCategory, caption: "Shop by Category" },
      { src: shopzoneProducts, caption: "All Products — filtering by category" },
      { src: shopzoneProductDetail, caption: "Product detail page" },
      { src: shopzoneCart, caption: "Cart & order summary" },
      { src: shopzoneFounders, caption: "About — team section" },
      { src: shopzoneValues, caption: "About — core values" },
      { src: shopzoneMilestones, caption: "About — milestones timeline" },
    ],
    tech: ["React", "Vite", "Tailwind CSS", "Node.js", "Express", "MongoDB", "Mongoose"],
    features: [
      "Authentication",
      "Product management",
      "Product categories & filtering",
      "Shopping cart with order summary",
      "Admin functionality",
      "REST API",
      "Responsive UI",
      "MongoDB backend",
    ],
    links: {
      demo: "https://shop-zone-pearl.vercel.app/",
      github: "https://github.com/Sabinsu/ShopZone",
    },
    caseStudy: {
      overview:
        "ShopZone is a full-stack e-commerce application covering the shopping experience end to end: a category-driven homepage, a filterable product catalog, product detail pages, a cart with order summary, and an About section that tells the store's story.",
      problem:
        "Most personal e-commerce projects stop at a product list and a cart. The goal here was to build something closer to a real storefront — category browsing, filtering, a proper cart with subtotal/shipping/total breakdown, and a backend that actually persists products, categories, and orders instead of hardcoded arrays.",
      solution:
        "The frontend is a React + Vite single-page app styled with Tailwind CSS, covering the homepage, category grid, filterable product listing, product detail pages, and cart/checkout flow. The backend is a Node.js/Express REST API with MongoDB via Mongoose, handling authentication, product and category data, and cart/order logic. An admin-facing layer supports managing the catalog.",
      process: [
        "Modelled the catalog data in MongoDB with Mongoose.",
        "Built the REST API with Node.js and Express.",
        "Built the responsive React + Tailwind interface: homepage, category grid, filterable product list, product detail, cart and order summary.",
        "Deployed the frontend live on Vercel.",
      ],
      challenges:
        "Keeping catalog data consistent across the homepage, category grid, filtered product list, and cart required a clear API and data model rather than ad-hoc per-page fetching. Cart state (quantities, subtotal, shipping thresholds) also needed to stay in sync between the UI and the backend without extra round-trips on every interaction.",
      outcome:
        "A deployed, working storefront (linked below) with a full browsing-to-cart flow, a REST API backing real data instead of mock JSON, and a reusable structure — the category and admin patterns from ShopZone are the ones I now default to when building similar backend-driven UIs.",
    },
    featured: true,
  },
];
