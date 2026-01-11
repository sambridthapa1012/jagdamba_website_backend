# Ecommerce Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

---

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "phone": "+1234567890"
    },
    "token": "jwt_token"
  }
}
```

#### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "jwt_token"
  }
}
```

#### Get Current User
```http
GET /api/auth/me
```
**Headers:** `Authorization: Bearer <token>`

---

### Products

#### Get All Products
```http
GET /api/products
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12)
- `category` (optional): Filter by category
- `subcategory` (optional): Filter by subcategory
- `brand` (optional): Filter by brand
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price
- `search` (optional): Search term
- `featured` (optional): Filter featured products (true/false)
- `sort` (optional): Sort by (`price_low`, `price_high`, `rating`, `newest`)

**Example:**
```
GET /api/products?category=electronics&page=1&limit=12&sort=price_low
```

#### Get Product by ID
```http
GET /api/products/:id
```

#### Get Categories
```http
GET /api/products/categories
```

#### Search Products
```http
GET /api/products/search?q=laptop
```

#### Get Products by Category
```http
GET /api/products/category/:category
```

---

### Cart

All cart endpoints require authentication.

#### Get Cart
```http
GET /api/cart
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "cart": {
      "items": [...],
      "total": 1999.98,
      "itemCount": 3
    }
  }
}
```

#### Add to Cart
```http
POST /api/cart/items
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "productId": "product_id",
  "quantity": 2
}
```

#### Update Cart Item
```http
PUT /api/cart/items/:itemId
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "quantity": 3
}
```

#### Remove from Cart
```http
DELETE /api/cart/items/:itemId
```
**Headers:** `Authorization: Bearer <token>`

#### Clear Cart
```http
DELETE /api/cart
```
**Headers:** `Authorization: Bearer <token>`

---

### Orders

All order endpoints require authentication.

#### Get Order Summary
```http
GET /api/orders/summary
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "itemsPrice": 1999.98,
      "shippingPrice": 50,
      "taxPrice": 360,
      "totalPrice": 2409.98,
      "itemCount": 3
    }
  }
}
```

#### Create Order
```http
POST /api/orders
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "+1234567890",
    "addressLine1": "123 Main St",
    "addressLine2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "cash_on_delivery"
}
```

**Payment Methods:**
- `cash_on_delivery` (default)
- `card`
- `upi`
- `wallet`

#### Get My Orders
```http
GET /api/orders
```
**Headers:** `Authorization: Bearer <token>`

#### Get Order by ID
```http
GET /api/orders/:id
```
**Headers:** `Authorization: Bearer <token>`

#### Cancel Order
```http
PUT /api/orders/:id/cancel
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "cancellationReason": "Changed my mind"
}
```

**Order Statuses:**
- `pending`
- `processing`
- `shipped`
- `delivered`
- `cancelled`

---

### User Profile

All user endpoints require authentication.

#### Get Profile
```http
GET /api/users/profile
```
**Headers:** `Authorization: Bearer <token>`

#### Update Profile
```http
PUT /api/users/profile
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+1234567891",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### Get Addresses
```http
GET /api/users/addresses
```
**Headers:** `Authorization: Bearer <token>`

#### Create Address
```http
POST /api/users/addresses
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "fullName": "John Doe",
  "phone": "+1234567890",
  "addressLine1": "123 Main St",
  "addressLine2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "postalCode": "10001",
  "country": "USA",
  "isDefault": true,
  "type": "shipping"
}
```

#### Update Address
```http
PUT /api/users/addresses/:id
```
**Headers:** `Authorization: Bearer <token>`

#### Delete Address
```http
DELETE /api/users/addresses/:id
```
**Headers:** `Authorization: Bearer <token>`

---

### Admin Routes

All admin endpoints require authentication and admin role.

#### Get Dashboard Stats
```http
GET /api/admin/stats
```
**Headers:** `Authorization: Bearer <admin_token>`

#### Get All Products (Admin)
```http
GET /api/admin/products
```

**Query Parameters:**
- `page` (optional)
- `limit` (optional)
- `search` (optional)
- `category` (optional)

#### Create Product (Admin)
```http
POST /api/admin/products
```

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 999.99,
  "originalPrice": 1299.99,
  "category": "electronics",
  "subcategory": "laptops",
  "brand": "Brand Name",
  "images": ["https://example.com/image.jpg"],
  "stock": 100,
  "sku": "SKU123",
  "tags": ["tag1", "tag2"],
  "featured": true,
  "specifications": {
    "color": "Black",
    "size": "15 inch"
  }
}
```

#### Update Product (Admin)
```http
PUT /api/admin/products/:id
```

#### Delete Product (Admin)
```http
DELETE /api/admin/products/:id
```
Note: This performs a soft delete (sets `isActive: false`)

#### Get All Orders (Admin)
```http
GET /api/admin/orders
```

**Query Parameters:**
- `status` (optional): Filter by order status
- `page` (optional)
- `limit` (optional)

#### Update Order Status (Admin)
```http
PUT /api/admin/orders/:id/status
```

**Request Body:**
```json
{
  "orderStatus": "shipped",
  "trackingNumber": "TRACK123456"
}
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ] // For validation errors
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

## Notes

1. **JWT Tokens**: Tokens expire after 7 days (configurable via `JWT_EXPIRE`)

2. **Pagination**: Most list endpoints support pagination with `page` and `limit` parameters

3. **Stock Management**: Product stock is automatically updated when orders are created or cancelled

4. **Shipping**: Free shipping for orders above ₹1000, otherwise ₹50

5. **Tax**: 18% GST is applied to all orders

6. **Cart**: Each user has one cart that persists across sessions

7. **Order Cancellation**: Orders can only be cancelled if status is `pending` or `processing`

