# Ecommerce Backend API

A complete, production-ready Node.js + Express + MongoDB backend for an ecommerce application.

## Features

- ✅ User Authentication (JWT-based login/register)
- ✅ Product Management (CRUD, filtering, categories, search)
- ✅ Shopping Cart System
- ✅ Order Management (create, track, cancel)
- ✅ Address Management
- ✅ Admin Dashboard & Inventory Management
- ✅ Payment Status Tracking (Cash on Delivery support)
- ✅ Order Summary & Checkout Flow
- ✅ Input Validation & Error Handling
- ✅ Secure Password Hashing (bcrypt)
- ✅ ES Modules Support

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing

## Project Structure

```
Backend Code/
├── src/
│   ├── config/
│   │   ├── database.js      # MongoDB connection
│   │   └── jwt.js           # JWT configuration
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js          # Authentication & authorization
│   │   ├── errorHandler.js  # Error handling
│   │   └── validator.js     # Validation middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   └── Address.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   └── server.js            # Entry point
├── .env.example              # Environment variables template
├── .gitignore
├── package.json
├── postman_collection.json   # Postman API collection
├── API_DOCUMENTATION.md      # Complete API documentation
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository** (or navigate to the project directory)

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:

   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start MongoDB:**

   - If using local MongoDB, ensure MongoDB service is running
   - If using MongoDB Atlas, update `MONGODB_URI` with your connection string

   If you need a local MongoDB running, examples below help:

   - Homebrew (macOS):
     ```bash
     brew tap mongodb/brew
     brew install mongodb-community
     brew services start mongodb-community
     ```
   - Docker (quick):
     ```bash
     docker run -d -p 27017:27017 --name ecommerce-mongo mongo:6.0
     ```

5. **Start the server:**

   ```bash
   npm start
   ```

   For development with auto-reload:

   ```bash
   npm run dev
   ```

6. **Verify the server is running:**
   ```bash
   curl http://localhost:5000/api/health
   ```

## Troubleshooting / Common Errors

- "Error connecting to MongoDB: connect ECONNREFUSED" — This means the app cannot reach MongoDB. Check that your MongoDB is running and that `MONGODB_URI` in `.env` is correct (local or Atlas connection string).
- To view running MongoDB processes and free the port (for macOS/linux):

  ```bash
  # Find process listening on port 27017
  lsof -i :27017

  # Kill the process if it is a stray node/mongo (replace <PID> with the PID shown from lsof)
  kill -9 <PID>
  ```

- If you just want to run the API without connecting to a database (development convenience), set `SKIP_DB=true` in your `.env` — the server will start but DB-dependent endpoints will not work.

## Environment Variables related to DB

| Variable         | Description                                                  | Default                               |
| ---------------- | ------------------------------------------------------------ | ------------------------------------- |
| `MONGODB_URI`    | MongoDB connection string                                    | `mongodb://127.0.0.1:27017/ecommerce` |
| `SKIP_DB`        | Skip connecting to DB in development mode (`true` to skip)   | `false`                               |
| `DB_RETRIES`     | Number of times the server tries to connect before giving up | `5`                                   |
| `DB_RETRY_DELAY` | Initial reconnect delay in ms (exponential backoff applied)  | `2000`                                |

````

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/categories` - Get all categories
- `GET /api/products/search?q=query` - Search products
- `GET /api/products/category/:category` - Get products by category

### Cart (Protected)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:itemId` - Update cart item
- `DELETE /api/cart/items/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders (Protected)
- `GET /api/orders/summary` - Get order summary
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/cancel` - Cancel order

### User Profile (Protected)
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/addresses` - Get addresses
- `POST /api/users/addresses` - Create address
- `PUT /api/users/addresses/:id` - Update address
- `DELETE /api/users/addresses/:id` - Delete address

### Admin (Protected + Admin Role)
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Testing with Postman

1. Import `postman_collection.json` into Postman
2. Set the `baseUrl` variable to `http://localhost:5000/api`
3. Register/Login to get a token
4. The token will be automatically saved to the `token` variable
5. Test all endpoints

## Creating an Admin User

To create an admin user, you can either:

1. **Using MongoDB directly:**
```javascript
// In MongoDB shell or Compass
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
````

2. **Using a script:**
   Create a temporary script to update user role:

   ```javascript
   import User from "./src/models/User.js";
   import connectDB from "./src/config/database.js";

   connectDB();
   await User.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   );
   ```

## Environment Variables

| Variable      | Description               | Default                 |
| ------------- | ------------------------- | ----------------------- |
| `PORT`        | Server port               | `5000`                  |
| `NODE_ENV`    | Environment mode          | `development`           |
| `MONGODB_URI` | MongoDB connection string | Required                |
| `JWT_SECRET`  | Secret key for JWT        | Required                |
| `JWT_EXPIRE`  | JWT expiration time       | `7d`                    |
| `CORS_ORIGIN` | Allowed CORS origin       | `http://localhost:3000` |

## Features Explained

### Authentication

- JWT-based authentication
- Password hashing with bcrypt (12 rounds)
- Token expiration (7 days default)
- Role-based access control (user/admin)

### Product Management

- Full CRUD operations
- Advanced filtering (category, price range, brand)
- Text search functionality
- Pagination support
- Stock management

### Cart System

- Persistent cart per user
- Real-time stock validation
- Automatic price calculation
- Quantity management

### Order Management

- Complete order lifecycle
- Automatic stock deduction
- Shipping cost calculation (free above ₹1000)
- Tax calculation (18% GST)
- Order cancellation with stock restoration

### Admin Features

- Dashboard statistics
- Product inventory management
- Order status management
- User management

## Error Handling

The API uses centralized error handling:

- Validation errors return 400 with details
- Authentication errors return 401
- Authorization errors return 403
- Not found errors return 404
- Server errors return 500

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation on all endpoints
- CORS configuration
- Environment variable protection
- Role-based access control

## Production Considerations

Before deploying to production:

1. **Update environment variables:**

   - Set a strong `JWT_SECRET`
   - Use MongoDB Atlas or secure MongoDB instance
   - Configure proper CORS origins

2. **Security:**

   - Enable HTTPS
   - Use environment-specific configurations
   - Implement rate limiting
   - Add request logging
   - Set up proper error logging

3. **Performance:**

   - Enable MongoDB indexes (already defined in models)
   - Implement caching where appropriate
   - Optimize database queries
   - Use connection pooling

4. **Monitoring:**
   - Set up application monitoring
   - Log errors to external service
   - Monitor database performance

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload

## License

ISC

## Support

For issues or questions, please refer to the API documentation or create an issue in the repository.
