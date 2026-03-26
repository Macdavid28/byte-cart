import {
  Facebook,
  Instagram,
  Twitter,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const footerLinks = [
    {
      category: "Quick Links",
      links: [
        { name: "Home", path: "/" },
        { name: "About Us", path: "/about" },
        { name: "Products", path: "/products" },
        { name: "Categories", path: "/categories" },
      ],
    },
    {
      category: "Customer Service",
      links: [
        { name: "Shipping & Returns", path: "/contact" },
        { name: "FAQs", path: "/faq" },
        { name: "Contact Support", path: "/contact" },
      ],
    },
    {
      category: "Legal",
      links: [
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms of Use", path: "/terms" },
        { name: "Cookie Policy", path: "/terms" },
      ],
    },
  ];

  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-20 py-16">
        {/* Top Section: Newsletter & Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-center">
          <div>
            <h2 className="text-3xl font-secondary font-bold text-slate-900 mb-4">
              Join our newsletter
            </h2>
            <p className="text-slate-600 font-primary text-lg">
              We'll send you a nice letter once per week. No spam.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-4 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <button className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
              Subscribe
            </button>
          </div>
        </div>

        <div className="h-px bg-slate-200 w-full mb-16"></div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link
              to="/"
              className="text-2xl font-bold font-secondary text-slate-900 mb-6 block"
            >
              ByteCart
            </Link>
            <p className="text-slate-600 font-primary leading-relaxed mb-8 max-w-sm">
              Your premium destination for quality products. We believe in
              style, substance, and sustainability.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {footerLinks.map((section, index) => (
              <div key={index}>
                <h3 className="font-secondary font-bold text-slate-900 text-lg mb-6">
                  {section.category}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        to={link.path}
                        className="text-slate-600 font-primary hover:text-blue-600 transition-colors flex items-center gap-2 group"
                      >
                        <span className="w-0 group-hover:w-2 h-0.5 bg-blue-600 transition-all duration-300"></span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="h-px bg-slate-200 w-full my-12"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 font-primary text-sm">
            &copy; {new Date().getFullYear()} ByteCart. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <div className="flex gap-3 text-slate-400">
              <CreditCard size={24} />
              <ShieldCheck size={24} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
