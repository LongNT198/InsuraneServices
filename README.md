# Insurance Service

A comprehensive insurance management system built with .NET and React.

## Features

- Life Insurance
- Medical Insurance  
- Motor Insurance
- Home Insurance
- Customer Portal
- Admin Dashboard
- Claims Management
- Policy Management

## Tech Stack

**Frontend:**
- React + Vite
- TailwindCSS
- Shadcn/ui
- React Query
- React Router

**Backend:**
- .NET 8
- Entity Framework Core
- SQL Server
- JWT Authentication

## Getting Started

### Prerequisites

- Node.js 18+
- .NET 8 SDK
- SQL Server

### Installation

1. Clone the repository
```bash
git clone https://github.com/LongNT198/InsuranceService.git
cd InsuranceService
```

2. Setup Backend
```bash
cd InsuranceServiceServer
dotnet restore
```

3. Configure appsettings.json
- Update ConnectionStrings
- Configure JWT settings
- Setup Email (Gmail) credentials
- Setup Twilio credentials (optional)

4. Run Migrations
```bash
dotnet ef database update
```

5. Setup Frontend
```bash
cd ../InsuranceServiceClient
npm install
```

6. Start Development Servers

Backend:
```bash
cd InsuranceServiceServer
dotnet run
```

Frontend:
```bash
cd InsuranceServiceClient
npm run dev
```

## Configuration

Copy `.env.example` to `.env` in InsuranceServiceClient folder and configure:

```
VITE_API_URL=http://localhost:5000
```

## License

MIT
