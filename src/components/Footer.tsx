// Footer.jsx
import {
  SiFacebook,
  //   SiTwitter,
  SiLinkedin,
  SiYoutube,
  SiInstagram,
} from "react-icons/si";

export default function Footer({className=""}) {
  return (
    <footer className={`border border-t-1 border-l-0 border-r-0 border-b-0 mt-6 ${className}`}>
      <div className="container mx-auto px-4 py-2 md:flex md:justify-between lg:block">
        <div className="flex flex-col lg:flex-row justify-between pb-3 md:flex-1">
          {/* Contact Info */}
          <div className="mb-6 lg:mb-0">
            <h3 className="text-lg font-semibold text-white mb-2 bg-gradient-to-r from-gradient-background-from to-gradient-background-to bg-clip-text text-transparent">
              Contact Us
            </h3>
            <p className="text-gray-400 hover:text-white transition-colors mb-1">
              <span className="text-gray-500">Email:</span>{" "}
              info@amnetdigital.com
            </p>
            <p className="text-gray-400 hover:text-white transition-colors">
              <span className="text-gray-500">Phone:</span> +91 832-863-1349
            </p>
          </div>

          {/* Address */}
          <div className="mb-6 lg:mb-0">
            <h3 className="text-lg font-semibold text-white mb-2 bg-gradient-to-r from-gradient-background-from to-gradient-background-to bg-clip-text text-transparent">
              Location
            </h3>
            <p className="text-gray-400 hover:text-white transition-colors mb-1">
              Austin, TX
            </p>
            <p className="text-gray-400 hover:text-white transition-colors">
              660 South Bagdad Road #320,
              <br />
              Leander, 78641
            </p>
          </div>

          {/* Social Icons */}
          <div className="">
            <h3 className="text-lg font-semibold text-white mb-2 bg-gradient-to-r from-gradient-background-from to-gradient-background-to bg-clip-text text-transparent">
              Follow Us
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/amnetdigital"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <SiFacebook size={24} />
              </a>
              {/* <a href="https://twitter.com/DigitalAmnet" target="_blank" rel="noreferrer">
                <SiTwitter className="text-white hover:text-white" size={20} />
              </a> */}
              <a
                href="https://www.linkedin.com/company/amnet-digital"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <SiLinkedin size={24} />
              </a>
              <a
                href="https://www.youtube.com/@amnetdigital"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <SiYoutube size={24} />
              </a>
              <a
                href="https://www.instagram.com/amnetdigital"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <SiInstagram size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-wrap justify-between md:justify-center lg:justify-between items-center md:flex-col lg:flex-row">
          <div className="text-gray-400 text-sm mb-4 sm:mb-0 md:mb-8 lg:mb-0">
            © 2024 Amnet Digital. All rights reserved.
          </div>
          <div className="flex flex-wrap md:flex-col lg:flex-row gap-4 text-sm">
            <a
              href="/legal-resources"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Legal Resources
            </a>
            <a
              href="/privacypolicy"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/termsandconditions"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
