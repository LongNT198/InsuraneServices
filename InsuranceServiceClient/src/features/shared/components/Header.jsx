import { Link, useNavigate } from "react-router-dom";
import {
  Shield,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  FileText,
  CreditCard,
  Bell,
  Heart,
  Car,
  Home,
  Calculator,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from '../../../core/contexts/AuthContext';
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "./ui/dropdown-menu";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const notifications = [
    { id: 1, text: 'Premium Payment Successful - ₹25,000 processed', time: '5 minutes ago', unread: true },
    { id: 2, text: 'Policy Renewal Reminder - Due in 15 days', time: '2 hours ago', unread: true },
    { id: 3, text: 'Claim Approved - CLM-2024-142 Amount: ₹50,000', time: '1 day ago', unread: false },
  ];

  // Helper function to get full avatar URL
  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    if (avatar.startsWith('http')) return avatar;
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5088';
    return `${baseURL}${avatar}`;
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Shield className="size-8 text-blue-600" />
            <span className="text-xl font-semibold text-gray-900">
              Insurance Services 
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="text-gray-700 hover:text-blue-600 transition">
                Insurance Types
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/life-insurance">
                    Life Insurance
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/medical-insurance">
                    Medical Insurance
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/motor-insurance">
                    Motor Insurance
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/home-insurance">
                    Home Insurance
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              to="/schemes"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Schemes
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="text-gray-700 hover:text-blue-600 transition font-medium flex items-center gap-1">
                Get Quote
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56">
                <DropdownMenuLabel className="text-xs text-gray-500 font-semibold">Calculate Premium</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to="/calculator?type=life" className="flex items-center gap-3 cursor-pointer py-2">
                    <Heart className="size-4 text-blue-600" />
                    <div className="flex flex-col">
                      <span className="font-medium">Life Insurance</span>
                      <span className="text-xs text-gray-500">Get instant quote</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/calculator?type=medical" className="flex items-center gap-3 cursor-pointer py-2">
                    <Shield className="size-4 text-green-600" />
                    <div className="flex flex-col">
                      <span className="font-medium">Medical Insurance</span>
                      <span className="text-xs text-gray-500">Health coverage quote</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/calculator?type=motor" className="flex items-center gap-3 cursor-pointer py-2">
                    <Car className="size-4 text-orange-600" />
                    <div className="flex flex-col">
                      <span className="font-medium">Motor Insurance</span>
                      <span className="text-xs text-gray-500">Vehicle protection quote</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/calculator?type=home" className="flex items-center gap-3 cursor-pointer py-2">
                    <Home className="size-4 text-purple-600" />
                    <div className="flex flex-col">
                      <span className="font-medium">Home Insurance</span>
                      <span className="text-xs text-gray-500">Property coverage quote</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/calculator" className="flex items-center gap-2 cursor-pointer text-blue-600 font-medium justify-center py-2">
                    <Calculator className="size-4" />
                    <span>View All Calculators</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Dashboard
                </Link>
                <Link
                  to="/claims"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Claims
                </Link>
              </>
            )}
            <Link
              to="/support"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Support
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Contact
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowProfile(false);
                    }}
                    className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Bell className="w-6 h-6 text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <h3 className="font-semibold">Notifications</h3>
                      </div>
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                            notif.unread ? 'bg-blue-50' : ''
                          }`}
                        >
                          <p className="text-sm text-gray-800">{notif.text}</p>
                          <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                        </div>
                      ))}
                      <div className="px-4 py-2 border-t border-gray-200 text-center">
                        <button className="text-sm text-blue-600 hover:text-blue-800">
                          View All
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowProfile(!showProfile);
                      setShowNotifications(false);
                    }}
                    className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Avatar className="size-9">
                      {user?.avatar && (
                        <AvatarImage 
                          src={getAvatarUrl(user.avatar)} 
                          alt={user?.name || "User"} 
                          className="object-cover"
                        />
                      )}
                      <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {getInitials(user?.name || "U")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden lg:block">
                      <p className="text-sm text-gray-800 font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </button>

                  {showProfile && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm text-gray-800 font-semibold">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setShowProfile(false)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link
                        to="/policies"
                        onClick={() => setShowProfile(false)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        My Policies
                      </Link>
                      <Link
                        to="/claims"
                        onClick={() => setShowProfile(false)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors"
                      >
                        <CreditCard className="w-4 h-4" />
                        Claims
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setShowProfile(false)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Profile & Settings
                      </Link>
                      <button
                        onClick={() => {
                          setShowProfile(false);
                          handleLogout();
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-3 text-red-600 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-3">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/life-insurance"
                className="text-gray-700 hover:text-blue-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Life Insurance
              </Link>
              <Link
                to="/medical-insurance"
                className="text-gray-700 hover:text-blue-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Medical Insurance
              </Link>
              <Link
                to="/motor-insurance"
                className="text-gray-700 hover:text-blue-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Motor Insurance
              </Link>
              <Link
                to="/home-insurance"
                className="text-gray-700 hover:text-blue-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home Insurance
              </Link>
              <Link
                to="/schemes"
                className="text-gray-700 hover:text-blue-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Schemes
              </Link>
              <Link
                to="/calculator"
                className="text-gray-700 hover:text-blue-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Quote
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-blue-600 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/claims"
                    className="text-gray-700 hover:text-blue-600 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Claims
                  </Link>
                </>
              )}
              <Link
                to="/support"
                className="text-gray-700 hover:text-blue-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Support
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-blue-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-3 border-t flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <div className="py-2 text-gray-900">
                      Hello, {user?.name}
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="justify-start"
                    >
                      <LogOut className="size-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link
                        to="/register"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}


