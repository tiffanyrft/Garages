# Garages Project

A comprehensive garage management system built with a modern full-stack architecture.

## 🏗️ Architecture

This project consists of multiple components:

- **Laravel API** (`laravel-api/`) - Backend REST API built with Laravel 10 and PostgreSQL
- **Web Frontend** (`web/`) - React 18 application with TailwindCSS
- **Mobile App** (`mobile/`) - React Native mobile application
- **Documentation** (`documentation/`) - Project documentation and API specs
- **Database** (`base_postgres/`) - PostgreSQL database schema and migrations

## 🚀 Tech Stack

### Backend (Laravel API)
- **Framework**: Laravel 10
- **Database**: PostgreSQL
- **Authentication**: Laravel Sanctum
- **PHP Version**: ^8.1

### Frontend (Web)
- **Framework**: React 18
- **Routing**: React Router DOM 6
- **Styling**: TailwindCSS
- **HTTP Client**: Axios
- **UI Components**: Headless UI, Lucide React

### Mobile
- **Framework**: React Native
- **Cross-platform**: iOS & Android

## 📋 Prerequisites

- PHP ^8.1
- Composer
- Node.js ^16
- npm/yarn
- PostgreSQL
- Git

## 🛠️ Installation

### Backend Setup

1. Navigate to the API directory:
```bash
cd laravel-api
```

2. Install dependencies:
```bash
composer install
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Generate application key:
```bash
php artisan key:generate
```

5. Configure your database in `.env` file:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=garages
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

6. Run migrations:
```bash
php artisan migrate
```

7. Start the development server:
```bash
php artisan serve
```

### Frontend Setup

1. Navigate to the web directory:
```bash
cd web
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000` and is configured to proxy API requests to `http://localhost:8000`.

### Mobile Setup

1. Navigate to the mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Run on iOS:
```bash
npx react-native run-ios
```

4. Run on Android:
```bash
npx react-native run-android
```

## 📁 Project Structure

```
garages/
├── laravel-api/          # Laravel backend API
│   ├── app/             # Application logic
│   ├── database/        # Database migrations and seeders
│   ├── routes/          # API routes
│   └── tests/           # PHPUnit tests
├── web/                 # React web frontend
│   ├── src/            # React components and source code
│   ├── public/         # Static assets
│   └── package.json    # Node dependencies
├── mobile/              # React Native mobile app
├── documentation/       # Project documentation
├── base_postgres/      # Database setup files
└── README.md           # This file
```

## 🔧 Development

### Running Tests

**Backend Tests:**
```bash
cd laravel-api
php artisan test
```

**Frontend Tests:**
```bash
cd web
npm test
```

### Code Style

This project uses:
- **Laravel Pint** for PHP code formatting
- **ESLint** for JavaScript/React code formatting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the `composer.json` file for details.

## 📞 Support

For support and questions, please open an issue in the GitHub repository.
