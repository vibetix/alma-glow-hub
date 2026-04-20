# ✨ Alma Glow Hub - Beauty Salon Management System

Welcome! **Alma Glow Hub** is the all-in-one platform for running a thriving beauty salon business in the digital age. Whether you''re managing appointments, tracking inventory, or keeping customers happy with real-time updates—this app handles it all.

Built on modern technology (React + TypeScript for the frontend, PHP + MySQL for the backend), it''s designed to be powerful, flexible, and actually enjoyable to use.

> **Status**: ✅ Production Ready | **Last Updated**: April 2026

---

## 🌟 What Can You Do With It?

### 👤 For Customers
- **Book appointments online** - No more phone calls! Browse available slots and book instantly
- **Browse services** - Hair styling, skincare, spa treatments—everything in one place
- **Shop beauty products** - Sell directly through the app
- **Get notifications** - Know exactly when their appointment is coming up
- **Manage profiles** - Save preferences and booking history

### 👨‍💼 For Salon Owners & Managers
- **Beautiful dashboard** - See your revenue, busiest days, and top services at a glance
- **Full booking control** - Manage all appointments, reschedule, or cancel with one click
- **Staff scheduling** - Keep track of who''s working, their availability, and performance
- **Inventory management** - Never run out of stock—track products in real time
- **Instant alerts** - Get notified the moment a new booking comes in
- **Customer insights** - Know your customers'' preferences and history

### 💇‍♀️ For Staff
- **Your schedule** - Always know what appointments you have
- **Client details** - See customer preferences, notes, and history
- **Mark services complete** - Log what you''ve done during the day

---

## 🛠️ The Tech Stack

We built this with battle-tested, industry-standard tools:

**Frontend** - The beautiful, interactive part users see:
- **React 18** - Smooth, responsive interface
- **TypeScript** - Catches bugs before they happen
- **Vite** - Incredibly fast development and builds
- **Tailwind CSS** - Beautiful, consistent styling
- **shadcn/ui** - Professional UI components
- **React Router** - Seamless navigation

**Backend** - The powerful engine behind the scenes:
- **PHP 8** - Reliable server-side logic
- **MySQL** - Solid database for storing all that data
- **RESTful API** - Clean communication between frontend and backend
- **Real-time Notifications** - Keep users updated instantly
- **PHPMailer** - Send appointment confirmations and updates

**Developer Experience**:
- **Composer** - Manage PHP libraries
- **ESLint & Prettier** - Keep code clean and consistent
- **Automated deployment** - Scripts to make deployment smooth

---

## ⚡ Get Up and Running in 5 Minutes

Ready to see it in action? Here''s the quickest way to get started:

``````bash
# 1. Clone the project to your computer
git clone https://github.com/yourusername/alma-glow-hub.git
cd alma-glow-hub

# 2. Install frontend and start it
npm install
npm run dev

# 3. Open another terminal and start the backend
composer install
php -S localhost:8000 -t api
``````

That''s it! Open your browser:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000

---

## 🚀 Full Setup Guide

### What You''ll Need

Don''t worry if this looks like a lot—you probably have most of it already:
- **Node.js** v16+ (download from nodejs.org)
- **PHP 8.0+** (usually included with XAMPP or similar)
- **MySQL 5.7+** (comes with XAMPP, Docker, or your hosting)
- **Composer** (PHP package manager - takes 2 minutes to install)
- **Git** (for version control)

### Step-by-Step Installation

**1. Get the code**
``````bash
git clone https://github.com/yourusername/alma-glow-hub.git
cd alma-glow-hub
``````

**2. Set up the frontend** (React + TypeScript)
``````bash
npm install        # Grab all the JavaScript libraries
npm run dev        # Start the dev server
``````

**3. Set up the backend** (PHP API)
``````bash
composer install   # Get PHP dependencies
``````

**4. Get your database ready**
- Create a MySQL database called `alma_glow_hub`
- Import the schema: `mysql -u root alma_glow_hub < u857701618_alma_glow_hub.sql`

**5. Configure your environment**
- Copy `env.example` to `.env`
- Update database credentials in `api/config.env`

**6. Start everything up**
``````bash
npm run dev        # Terminal 1 - Frontend
php -S localhost:8000 -t api   # Terminal 2 - Backend
``````

Done! Visit `http://localhost:5173` and enjoy!

---

## 📂 Where''s Everything?

``````
alma-glow-hub/
├── api/                  # The backend (where the magic happens)
│   ├── config/          # Database connection & settings
│   ├── endpoints/       # All the API routes
│   ├── logs/            # Error logs & debugging
│   └── utils/           # Helper functions
├── src/                 # The frontend (what users see)
│   ├── components/      # Reusable UI bits
│   ├── pages/          # Full page components
│   ├── services/       # API communication code
│   ├── hooks/          # Custom React logic
│   └── types/          # TypeScript definitions
├── public/             # Images, icons, static files
├── uploads/            # User-uploaded files
└── dist/               # Built & ready for production
``````

---

## 🔧 Quick Command Reference

**Frontend**:
- `npm run dev` - Start dev server (hot reload)
- `npm run build` - Create production build
- `npm run lint` - Check code quality

**Backend**:
- `composer install` - Get PHP packages
- `composer update` - Update packages

---

## 🔐 Security

We take security seriously:
- Environment variables in `.env` (never committed!)
- CORS properly configured
- Input validation on frontend & backend
- SQL injection prevention
- Password hashing
- Error logging

---

## 📚 Main API Endpoints

``````
GET    /api/services              # Available services
POST   /api/bookings              # Create appointment
GET    /api/bookings/{id}         # Booking details
GET    /api/products              # Browse products
POST   /api/auth/register         # Sign up
POST   /api/auth/login            # Sign in
``````

See `api/` directory for full documentation.

---

## 🐛 Troubleshooting

**Frontend doesn''t load?**
- Reinstall: `rm -r node_modules && npm install`
- Check port 5173 isn''t in use
- Verify `.env` has correct API URL

**Backend connection issues?**
- Is PHP server running? `php -S localhost:8000 -t api`
- Check `api/config/db.php`
- Review `api/logs/`

**Database problems?**
- Import schema: `mysql -u root alma_glow_hub < u857701618_alma_glow_hub.sql`
- Verify MySQL is running
- Check credentials

---

## 🤝 Contributing

Love to contribute! Here''s how:

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m ''Add feature''`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT License - free to use, modify, and distribute.

---

## 📞 Support

- **Bug report?** Open an issue on GitHub
- **Feature request?** Let us know!
- **Email**: support@almaglowhub.local

---

### ✨ Alma Glow Hub

*Bringing beauty and wellness to your fingertips*

**Built with ❤️ using modern web technologies**

---

**Perfect! Your README is now humanized and ready to share.**
