import React from "react";
import logo from "../../../assets/logo.png";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link } from "react-router";
import { HashLink } from "react-router-hash-link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-base-content mt-16 border-t border-t-primary">
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-8">
        {/* Branding */}
        <div>
          <Link to="/" className="flex items-center gap-2 text-xl">
            <img src={logo} alt="" className="w-12 h-12 " />
            <h2 className="text-2xl font-bold text-primary">LifeDrop</h2>
          </Link>
          <p className="mt-2 text-sm ">
            Give blood, give life. Join us in building a strong donor community
            that saves lives every day.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="">
          <h3 className="font-semibold mb-2 text-primary">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link to="/signUp" className="hover:underline">
                Join as Donor
              </Link>
            </li>
            <li>
              <HashLink smooth to="/#contact" className="hover:underline">
                Contact Us
              </HashLink>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold mb-2 text-primary">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <FaPhoneAlt /> <span>+880 1234 567890</span>
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope /> <span>support@lifedrop.org</span>
            </li>
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt /> <span>Dhaka, Bangladesh</span>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold mb-2 text-primary">Follow Us</h3>
          <div className="flex gap-4 mt-2">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              className=" hover:text-primary transition-colors"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              className=" hover:text-primary transition-colors"
            >
              <FaInstagram />
            </a>
            <a
              href="https://x.com/"
              target="_blank"
              className=" hover:text-primary transition-colors"
            >
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center py-4 text-sm border-t border-secondary">
        © {currentYear} LifeDrop. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
