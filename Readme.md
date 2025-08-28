# Pixel Perfect E-commerce API

A robust e-commerce backend API built with Node.js, Express, TypeScript, Prisma, and PostgreSQL. This API provides comprehensive functionality for managing products, categories, and shopping cart operations.

## 🚀 Features

- **Product Management**: Create, read, update, delete products with image upload
- **Category Management**: Organize products by categories
- **Shopping Cart**: Add, view, and remove items from cart
- **Image Upload**: Cloudinary integration for product images
- **Search & Filter**: Search products by title and filter by category
- **Data Validation**: Robust input validation using Zod
- **Error Handling**: Comprehensive error handling with custom error responses
- **Type Safety**: Full TypeScript support with Prisma ORM

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Testing with Postman](#testing-with-postman)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)

---

## 🧪 Testing with Postman

### Postman Collection

You can import the following Postman collection to test all Apis

[GET POSTMAN APIS 🔗](https://.postman.co/workspace/My-Workspace~664476d4-c66c-46da-8181-259dcc781bc3/collection/42942531-18b704a8-0afe-45b5-a7d8-7bba3b208488?action=share&creator=42942531)



---

## 🛠 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database
- **Git**

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pixel_perfect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## ⚙️ Environment Setup

1. **Create a `.env` file in the root directory**
   ```bash
   cp .env.example .env
   ```

2. **Add the following environment variables**
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/pixel_perfect"
   
   # Server
   PORT=3000
   
   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

## 🗄️ Database Setup

1. **Generate Prisma client**
   ```bash
   npm run prisma:generate
   ```

2. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```

3. **Open Prisma Studio (optional)**
   ```bash
   npm run prisma:studio
   ```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000`

## 📊 Database Schema

![Database Schema](./public/pixel_perfect_schemas.png)

### Models Overview

#### **User**
- `id`: Unique identifier (CUID)
- `email`: User email (unique)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

#### **Category**
- `id`: Unique identifier (CUID)
- `name`: Category name (unique)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

#### **Product**
- `id`: Unique identifier (CUID)
- `title`: Product title
- `description`: Product description
- `price`: Product price (Decimal)
- `stock`: Available quantity
- `imageUrl`: Cloudinary image URL (optional)
- `categoryId`: Foreign key to Category
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

#### **CartItem**
- `id`: Unique identifier (CUID)
- `userId`: Foreign key to User
- `productId`: Foreign key to Product
- `quantity`: Item quantity
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Relationships
- User → CartItem (One-to-Many)
- Category → Product (One-to-Many)
- Product → CartItem (One-to-Many)
- Unique constraint on `userId + productId` in CartItem

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Response Format
All API responses follow this structure:
```json
{
  "success": boolean,
  "statusCode": number,
  "message": string,
  "data": any,
  "errors": array (only for error responses)
}
```

---

## 🏷️ Categories API

### **GET /categories**
Get all categories with their products.

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Categories fetched successfully",
  "data": [
    {
      "id": "category-id",
      "name": "Electronics",
      "createdAt": "2025-08-28T...",
      "updatedAt": "2025-08-28T...",
      "products": [...]
    }
  ]
}
```

### **POST /categories**
Create a new category.

**Body:**
```json
{
  "name": "Electronics"
}
```

**Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Category created successfully",
  "data": {
    "id": "category-id",
    "name": "Electronics",
    "createdAt": "2025-08-28T...",
    "updatedAt": "2025-08-28T..."
  }
}
```

---

## 📦 Products API

### **GET /products**
Get all products with optional filtering.

**Query Parameters:**
- `categoryId` (optional): Filter by category ID
- `search` (optional): Search by product title (case-insensitive)

**Examples:**
```
GET /products
GET /products?categoryId=category-id
GET /products?search=iphone
GET /products?categoryId=category-id&search=phone
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Products fetched successfully",
  "data": [
    {
      "id": "product-id",
      "title": "iPhone 15",
      "description": "Latest iPhone",
      "price": 999.99,
      "stock": 50,
      "imageUrl": "cloudinary-url",
      "categoryId": "category-id",
      "createdAt": "2025-08-28T...",
      "updatedAt": "2025-08-28T...",
      "category": {
        "id": "category-id",
        "name": "Electronics"
      }
    }
  ]
}
```

### **GET /products/:id**
Get a single product by ID.

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Product fetched successfully",
  "data": {
    "id": "product-id",
    "title": "iPhone 15",
    "description": "Latest iPhone",
    "price": 999.99,
    "stock": 50,
    "imageUrl": "cloudinary-url",
    "categoryId": "category-id",
    "category": {
      "id": "category-id",
      "name": "Electronics"
    }
  }
}
```

### **POST /products**
Create a new product with optional image upload.

**Content-Type:** `multipart/form-data`

**Body (Form Data):**
```
title: "iPhone 15"
description: "Latest iPhone model"
price: "999.99"
stock: "50"
categoryId: "category-id"
image: [file] (optional)
```

**Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Product created successfully",
  "data": {
    "id": "product-id",
    "title": "iPhone 15",
    "description": "Latest iPhone model",
    "price": 999.99,
    "stock": 50,
    "imageUrl": "cloudinary-url",
    "categoryId": "category-id"
  }
}
```

### **PUT /products/:id**
Update an existing product.

**Content-Type:** `multipart/form-data`

**Body (Form Data):** (All fields optional)
```
title: "iPhone 15 Pro"
price: "1199.99"
image: [file] (optional)
```

### **DELETE /products/:id**
Delete a product.

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Product deleted successfully",
  "data": null
}
```

---

## 🛒 Cart API

### **GET /cart**
Get cart items for a user.

**Query Parameters:**
- `userId` (required): User ID

**Example:**
```
GET /cart?userId=user-id
```

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Cart items fetched successfully",
  "data": [
    {
      "id": "cart-item-id",
      "userId": "user-id",
      "productId": "product-id",
      "quantity": 2,
      "product": {
        "id": "product-id",
        "title": "iPhone 15",
        "price": 999.99,
        "imageUrl": "cloudinary-url"
      }
    }
  ]
}
```

### **POST /cart**
Add item to cart (or update quantity if exists).

**Body:**
```json
{
  "userId": "user-id",
  "productId": "product-id",
  "quantity": 2
}
```

**Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Item added to cart",
  "data": {
    "id": "cart-item-id",
    "userId": "user-id",
    "productId": "product-id",
    "quantity": 2
  }
}
```

### **DELETE /cart/:itemId**
Remove item from cart.

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Item removed from cart",
  "data": null
}
```

---

## 🏗️ Project Structure

```
pixel_perfect/
├── src/
│   ├── controllers/          # Route controllers
│   │   ├── categories.controller.ts
│   │   ├── products.controller.ts
│   │   └── cart.controller.ts
│   ├── middlewares/          # Custom middlewares
│   │   ├── errorHandler.ts
│   │   └── multer.middleware.ts
│   ├── routes/              # API routes
│   │   ├── categories.routes.ts
│   │   ├── products.routes.ts
│   │   └── cart.routes.ts
│   ├── utils/               # Utility functions
│   │   ├── ApiError.ts
│   │   ├── ApiResponse.ts
│   │   └── cloudinary.ts
│   ├── generated/           # Prisma generated client
│   ├── types/               # Type definitions
│   ├── db.ts               # Database connection
│   ├── app.ts              # Express app setup
│   └── index.ts            # Server entry point
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
├── public/
│   ├── temp/              # Temporary file uploads
│   └── pixel_perfect_schemas.png
├── package.json
├── tsconfig.json
├── .env
└── README.md
```

## 🛠️ Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **File Upload**: Multer
- **Cloud Storage**: Cloudinary
- **Development Tools**: Nodemon, TSX


---

**Happy Coding! 🚀**