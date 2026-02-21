import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Bell, Menu, X, ChevronDown } from "lucide-react";
import Logo from "@/assets/LOGO.png";

// const navItems = [
//   { label: "Prepare", hasDropdown: true },
//   { label: "Courses", hasDropdown: true },
//   { label: "Projects", hasDropdown: true },
//   { label: "Skill Courses", hasDropdown: true },
//   { label: "OffCampus", hasDropdown: true },
// ];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={Logo} alt="Trackora" className="h-9 w-9 object-contain" />
          <span className="text-xl font-bold text-foreground">
            Track<span className="text-gradient-primary">ora</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {/* {navItems.map((item) => (
            <button
              key={item.label}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
              {item.hasDropdown && <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          ))} */}
        </div>

        {/* Search + Actions */}
        <div className="flex items-center gap-3">
          {/* <div className="hidden items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2 md:flex">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder='Search for "Placements"'
              className="w-48 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div> */}
          <button className="hidden rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted lg:block">
            <Bell className="h-5 w-5" />
          </button>
          {/* <Button variant="ghost" size="sm" className="hidden text-foreground lg:inline-flex">
            Login
          </Button> */}
          <Button
            onClick={() => navigate('/login', { state: { from: '/student/courses' } })}
            size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Get Started →
          </Button>
          <button
            className="rounded-lg p-2 text-foreground lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 py-4 lg:hidden">
          {/* {navItems.map((item) => (
            <button
              key={item.label}
              className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-foreground/80 hover:bg-muted"
            >
              {item.label}
              <ChevronDown className="h-4 w-4" />
            </button>
          ))} */}
          {/* <div className="mt-3 flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </div> */}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
