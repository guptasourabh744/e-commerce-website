# Shopping Website - E-commerce MVP

A full-stack e-commerce MVP built with Node.js, Express.js, MongoDB, Next.js, and TypeScript.

## 🚀 Features

### User Features

- **User Authentication**: Sign up, login with JWT tokens
- **Product Browsing**: Browse products with search, filtering, and pagination
- **Shopping Cart**: Add/remove items, update quantities
- **Order Management**: Place orders, view order history
- **Responsive Design**: Works on desktop, tablet, and mobile

### Admin Features

- **Product Management**: Create, update, delete products
- **Order Management**: View and update order status
- **User Management**: View user information

## 🛠 Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hook Form** - Form handling
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

## 📁 Project Structure

```
shopping-website/
├── server/                 # Backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middlewares/       # Custom middlewares
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── seed.js           # Database seeding
│   └── index.js          # Server entry point
├── client/               # Frontend
│   ├── app/             # Next.js app directory
│   ├── components/      # Reusable components
│   ├── lib/            # Utilities and API
│   └── public/         # Static assets
└── package.json         # Root package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd shopping-website
   ```

2. **Install dependencies**

   ```bash
   npm run install-all
   ```

3. **Environment Setup**

   Create a `.env` file in the `server` directory:

   ```env
   JWT_SECRET=2856853c249826298b08128253313ea5756160def065b77bb35a0d8bccb34a22495f69d294111c7962c4454723873343cb17aebeb595a45728ae0e2243d83de8
   MONGODB_URI=mongodb+srv://guptasourabh744:LifeGuru12345@cluster0.xduzmmn.mongodb.net/shopping-website?retryWrites=true&w=majority&appName=Cluster0
   PORT=5002
   NODE_ENV=development
   ```

4. **Seed the database**

   ```bash
   cd server
   node seed.js
   ```

5. **Start the development servers**

   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5002) and frontend development server (port 3000).

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5002/api

## 👥 Default Users

After seeding the database, you can use these accounts:

### Admin User

- **Email**: admin@shop.com
- **Password**: admin123
- **Role**: Admin

### Regular Users

- **Email**: john@example.com
- **Password**: password123
- **Email**: jane@example.com
- **Password**: password123

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `PUT /api/auth/profile` - Update user profile

### Products

- `GET /api/products` - Get all products (with pagination, search, filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:itemId` - Update cart item quantity
- `DELETE /api/cart/items/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders

- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (Admin only)
- `GET /api/orders/admin/all` - Get all orders (Admin only)

## 🎨 UI Components

The application includes reusable UI components:

- **Button** - Various button styles and sizes
- **Card** - Content containers with header, content, and footer
- **Input** - Form input with validation
- **Modal** - Overlay dialogs
- **Header** - Navigation header with cart and user menu
- **Footer** - Site footer with links and information

## 🔧 Development

### Backend Development

```bash
cd server
npm run dev
```

### Frontend Development

```bash
cd client
npm run dev
```

### Database Seeding

```bash
cd server
node seed.js
```

## 🚀 Deployment

### Backend Deployment

1. Set up MongoDB Atlas or your preferred MongoDB hosting
2. Update the `MONGODB_URI` in your environment variables
3. Deploy to your preferred hosting platform (Heroku, Railway, etc.)

### Frontend Deployment

1. Build the Next.js application:
   ```bash
   cd client
   npm run build
   ```
2. Deploy to Vercel, Netlify, or your preferred hosting platform

## 🔒 Security Features

- JWT-based authentication with HttpOnly cookies
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 📱 Responsive Design

The application is fully responsive and works on:

- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🎯 Future Enhancements

- Payment integration (Stripe, PayPal)
- Email notifications
- Product reviews and ratings
- Wishlist functionality
- Advanced search with filters
- Inventory management
- Analytics dashboard
- Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please create an issue in the repository.

---

Built with ❤️ using modern web technologies.
