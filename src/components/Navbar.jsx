import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Award, Briefcase, BookOpen, User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleMenu = () => setIsOpen(!isOpen);

  const controlNavbar = () => {
    if (typeof window !== 'undefined') {
      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  const navItems = [
    { to: '/', label: 'Home', icon: <Home size={20} /> },
    { to: '/whoiam', label: 'Who I Am', icon: <User size={20} /> },
    { to: '/projects', label: 'Projects', icon: <Briefcase size={20} /> },
    { to: '/certificates', label: 'Certificates', icon: <Award size={20} /> },
    { to: '/blog', label: 'Blog', icon: <BookOpen size={20} /> },
  ];

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-2 py-1 rounded-md transition-colors duration-200 ${
      isActive ? 'text-[#17c0f8]' : 'text-white hover:text-[#17c0f8]'
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[#0a192f] text-white shadow-xl transition-transform duration-300 ease-in-out ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-semibold tracking-wide text-white">LINGALA RAJESH</div>

        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none text-white"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} className={navLinkClass}>
              {icon}
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-[#0a192f] backdrop-blur-md px-6 py-4 space-y-3 rounded-b-2xl">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={navLinkClass}
              onClick={() => setIsOpen(false)}
            >
              {icon}
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;