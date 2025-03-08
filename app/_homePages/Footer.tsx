import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-green-50 text-gray-700 py-8 px-6">
      <div className="w-full mx-auto">
        <div className="flex flex-wrap justify-between items-start border-b pb-6">
          {/* Logo va Kontakt */}
          <div className="w-full md:w-1/3 space-y-2">
            <h2 className="text-xl font-bold text-green-700">GREENSHOP</h2>
            <p className="text-sm">
              70 West Buckingham Ave. Farmingdale, NY 11735
            </p>
            <p className="text-sm">📧 contact@greenshop.com</p>
            <p className="text-sm">📞 +88 01911 717 490</p>
          </div>

          {/* Account */}
          <div className="w-1/2 md:w-1/6">
            <h3 className="font-semibold">My Account</h3>
            <ul className="text-sm space-y-1">
              <li>My Account</li>
              <li>Our Stores</li>
              <li>Contact Us</li>
              <li>Career</li>
              <li>Specials</li>
            </ul>
          </div>

          {/* Help & Guide */}
          <div className="w-1/2 md:w-1/6">
            <h3 className="font-semibold">Help & Guide</h3>
            <ul className="text-sm space-y-1">
              <li>Help Center</li>
              <li>How to Buy</li>
              <li>Shipping & Delivery</li>
              <li>Product Policy</li>
              <li>How to Return</li>
            </ul>
          </div>

          {/* Categories */}
          <div className="w-1/2 md:w-1/6">
            <h3 className="font-semibold">Categories</h3>
            <ul className="text-sm space-y-1">
              <li>House Plants</li>
              <li>Potter Plants</li>
              <li>Seeds</li>
              <li>Small Plants</li>
              <li>Accessories</li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="w-1/2 md:w-1/6">
            <h3 className="font-semibold">Social Media</h3>
            <div className="flex space-x-2 mt-2">
              <FaFacebookF className="text-green-600 cursor-pointer" />
              <FaInstagram className="text-green-600 cursor-pointer" />
              <FaTwitter className="text-green-600 cursor-pointer" />
              <FaLinkedinIn className="text-green-600 cursor-pointer" />
              <FaYoutube className="text-green-600 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Payment & Copyright */}
        <div className="flex flex-wrap justify-between items-center pt-4 text-sm">
          <div className="space-x-2">
            <span className="font-semibold">We accept:</span>
            <span className="text-blue-600">PayPal</span>
            <span className="text-red-600">MasterCard</span>
            <span className="text-blue-800">VISA</span>
            <span className="text-gray-600">American Express</span>
          </div>
          <p className="text-gray-500">
            © 2021 GreenShop. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
