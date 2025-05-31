"use client";

import { useState, useEffect } from 'react';

export default function DLFPrivanaHome() {
  // Main popup form state
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [countryCode, setCountryCode] = useState('+91');

  // Contact form state
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: ''
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactErrors, setContactErrors] = useState({});
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);
  const [contactSubmitError, setContactSubmitError] = useState('');
  const [contactCountryCode, setContactCountryCode] = useState('+91');

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll state for navbar
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleCountryCodeChange = (e) => {
    setCountryCode(e.target.value);
  };

  const handleContactCountryCodeChange = (e) => {
    setContactCountryCode(e.target.value);
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes gentle-fade {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes soft-scale {
        0% { transform: scale(0.95); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      
      @keyframes slide-in {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
      }
      
      body {
        scroll-behavior: smooth;
      }
      
      .minimal-shadow {
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
      }
      
      .royal-gradient {
        background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #1e40af 100%);
      }
      
      .text-gradient {
        background: linear-gradient(135deg, #60a5fa, #3b82f6, #1d4ed8);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Show popup when the page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      const mobileMenu = document.getElementById("mobile-menu");
      const hamburgerButton = document.getElementById("hamburger-button");

      if (mobileMenuOpen && mobileMenu && hamburgerButton) {
        if (!mobileMenu.contains(event.target) && !hamburgerButton.contains(event.target)) {
          setMobileMenuOpen(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  // Close mobile menu when navigating to a section
  const handleSectionClick = (sectionId) => {
    setMobileMenuOpen(false);
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required";
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) {
      tempErrors.phone = "Phone number is required";
    } else if (!/^\d+$/.test(formData.phone)) {
      tempErrors.phone = "Phone number should contain only digits";
    }
    if (!formData.city.trim()) {
      tempErrors.city = "City is required";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        setSubmitError('');

        const response = await fetch('/api/submit-form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            countryCode: countryCode,
            city: formData.city
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Error submitting form');
        }

        console.log("Form submitted successfully:", data);
        setSubmitted(true);

        // Clear form data
        setFormData({
          name: '',
          email: '',
          phone: '',
          city: ''
        });

        // Close popup after successful submission
        setTimeout(() => {
          setShowPopup(false);
          setSubmitted(false);
        }, 3000);
      } catch (error) {
        console.error("Error submitting form:", error);
        setSubmitError(error.message || 'Failed to submit form. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Contact form handlers
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateContactForm = () => {
    let tempErrors = {};
    if (!contactFormData.name.trim()) tempErrors.name = "Name is required";
    if (!contactFormData.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(contactFormData.email)) {
      tempErrors.email = "Email is invalid";
    }
    if (!contactFormData.phone.trim()) {
      tempErrors.phone = "Phone number is required";
    } else if (!/^\d+$/.test(contactFormData.phone)) {
      tempErrors.phone = "Phone number should contain only digits";
    }
    if (!contactFormData.city.trim()) {
      tempErrors.city = "City is required";
    }

    setContactErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (validateContactForm()) {
      try {
        setIsContactSubmitting(true);
        setContactSubmitError('');

        const response = await fetch('/api/submit-form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: contactFormData.name,
            email: contactFormData.email,
            phone: contactFormData.phone,
            countryCode: contactCountryCode,
            city: contactFormData.city
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Error submitting form');
        }

        console.log("Contact form submitted successfully:", data);
        setContactSubmitted(true);

        // Clear form data
        setContactFormData({
          name: '',
          email: '',
          phone: '',
          city: ''
        });

        // Reset form after delay
        setTimeout(() => {
          setContactSubmitted(false);
        }, 5000);
      } catch (error) {
        console.error("Error submitting contact form:", error);
        setContactSubmitError(error.message || 'Failed to submit form. Please try again.');
      } finally {
        setIsContactSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Navigation Bar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 royal-gradient rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <div>
                <div className="text-xl font-light tracking-wide text-gradient">DLF Privana</div>
                <div className="text-xs text-gray-500 -mt-1">Gurgaon</div>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#phases" className={`text-sm font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-300'
                }`}>
                Phases
              </a>
              <a href="#about" className={`text-sm font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-300'
                }`}>
                About
              </a>
              <a href="#contact" className={`text-sm font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-300'
                }`}>
                Contact
              </a>
              <a href="/admin" className={`text-sm font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-300'
                }`}>
                Admin
              </a>
              <button
                onClick={() => setShowPopup(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-md transition-colors"
              >
                Enquire Now
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                id="hamburger-button"
                onClick={toggleMobileMenu}
                className={`transition-colors ${scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-300'
                  }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden bg-white border-t border-gray-100 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-6 py-4 space-y-3">
            <a onClick={() => handleSectionClick('phases')} className="block text-gray-600 hover:text-blue-600 text-sm cursor-pointer">
              Phases
            </a>
            <a onClick={() => handleSectionClick('about')} className="block text-gray-600 hover:text-blue-600 text-sm cursor-pointer">
              About
            </a>
            <a onClick={() => handleSectionClick('contact')} className="block text-gray-600 hover:text-blue-600 text-sm cursor-pointer">
              Contact
            </a>
            <a href="/admin" className="block text-gray-600 hover:text-blue-600 text-sm cursor-pointer">
              Admin
            </a>
            <button
              onClick={() => setShowPopup(true)}
              className="bg-blue-600 text-white px-4 py-2 text-sm rounded-md w-full"
            >
              Enquire Now
            </button>
          </div>
        </div>
      </nav >

      {/* Hero Section */}
      < div className="relative min-h-screen overflow-hidden" >
        {/* Background Image */}
        < div className="absolute inset-0" >
          <img
            src="https://dlfpriivana.in/wp-content/uploads/2023/09/dlf_a1.jpg"
            alt="DLF Privana Luxury Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 royal-gradient opacity-80"></div>
        </ div>

        {/* Content */}
        < div className="relative z-10 min-h-screen flex items-center justify-center" >
          <div className="max-w-6xl mx-auto px-6 text-center text-white">
            <div style={{ animation: "gentle-fade 1s ease-out" }}>
              <h1 className="text-5xl md:text-7xl font-extralight mb-6 tracking-wide">
                DLF Privana
              </h1>
              <div className="w-16 h-px bg-white/40 mx-auto mb-6"></div>
              <p className="text-lg md:text-xl text-blue-100 mb-2 font-light">
                Premium Residential Development
              </p>
              <p className="text-blue-200 mb-12 text-sm">
                Sectors 76 & 77, Gurgaon
              </p>
              <button
                onClick={() => setShowPopup(true)}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3 text-sm rounded-md hover:bg-white/20 transition-all duration-300"
              >
                Discover Luxury
              </button>
            </div>
          </div>
        </ div>
      </div >

      {/* Key Stats Section */}
      < div className="py-20 bg-gray-50" >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-4">
              Project <span className="text-gradient">Excellence</span>
            </h2>
            <div className="w-12 h-px bg-blue-600 mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-light text-blue-600 mb-2">126</div>
              <div className="text-sm text-gray-600 font-medium">Acres</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-blue-600 mb-2">88%</div>
              <div className="text-sm text-gray-600 font-medium">Green Space</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-blue-600 mb-2">4</div>
              <div className="text-sm text-gray-600 font-medium">Phases</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-blue-600 mb-2">30+</div>
              <div className="text-sm text-gray-600 font-medium">Floors</div>
            </div>
          </div>
        </div>
      </ div>

      {/* Phases Section */}
      < div id="phases" className="py-20 bg-white" >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-4">
              Four Distinct <span className="text-gradient">Phases</span>
            </h2>
            <div className="w-12 h-px bg-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each phase offers unique advantages and lifestyle experiences, designed for discerning residents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Privana East */}
            <div className="group">
              <div className="bg-white minimal-shadow rounded-lg p-8 border border-gray-100 hover:border-blue-200 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-800">Privana East</h3>
                    <p className="text-sm text-gray-500">Sector 76</p>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex text-sm">
                    <span className="text-gray-500 w-20">Config:</span>
                    <span className="text-gray-800">3 & 4 BHK</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-500 w-20">Area:</span>
                    <span className="text-gray-800">2100 - 3500 sq.ft.</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-500 w-20">Price:</span>
                    <span className="text-blue-600 font-medium">₹3.40 - 6.40 Cr</span>
                  </div>
                </div>
                <ul className="text-sm text-gray-600 space-y-1 mb-6">
                  <li>• Resort-style lakelet</li>
                  <li>• Largest clubhouse</li>
                  <li>• Aravalli views</li>
                </ul>
                <button
                  onClick={() => setShowPopup(true)}
                  className="text-blue-600 text-sm hover:text-blue-700 transition-colors"
                >
                  Learn More →
                </button>
              </div>
            </div>

            {/* Privana North */}
            <div className="group">
              <div className="bg-white minimal-shadow rounded-lg p-8 border border-gray-100 hover:border-green-200 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-3 h-3 bg-green-600 rounded-full mr-3"></div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-800">Privana North</h3>
                    <p className="text-sm text-gray-500">Sector 77</p>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex text-sm">
                    <span className="text-gray-500 w-20">Config:</span>
                    <span className="text-gray-800">4 BHK + Utility</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-500 w-20">Area:</span>
                    <span className="text-gray-800">3956 sq.ft.</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-500 w-20">Price:</span>
                    <span className="text-green-600 font-medium">On Request</span>
                  </div>
                </div>
                <ul className="text-sm text-gray-600 space-y-1 mb-6">
                  <li>• 85% green spaces</li>
                  <li>• Smart home features</li>
                  <li>• Low density living</li>
                </ul>
                <button
                  onClick={() => setShowPopup(true)}
                  className="text-green-600 text-sm hover:text-green-700 transition-colors"
                >
                  Learn More →
                </button>
              </div>
            </div>

            {/* Privana South */}
            <div className="group">
              <div className="bg-white minimal-shadow rounded-lg p-8 border border-gray-100 hover:border-purple-200 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-3 h-3 bg-purple-600 rounded-full mr-3"></div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-800">Privana South</h3>
                    <p className="text-sm text-gray-500">Sector 77</p>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex text-sm">
                    <span className="text-gray-500 w-20">Config:</span>
                    <span className="text-gray-800">4 BHK</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-500 w-20">Area:</span>
                    <span className="text-gray-800">2150 - 3200 sq.ft.</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-500 w-20">Price:</span>
                    <span className="text-purple-600 font-medium">₹7.39 - 11.16 Cr</span>
                  </div>
                </div>
                <ul className="text-sm text-gray-600 space-y-1 mb-6">
                  <li>• 7 towers, 25 acres</li>
                  <li>• Spa & wellness</li>
                  <li>• 3 parking spaces</li>
                </ul>
                <button
                  onClick={() => setShowPopup(true)}
                  className="text-purple-600 text-sm hover:text-purple-700 transition-colors"
                >
                  Learn More →
                </button>
              </div>
            </div>

            {/* Privana West */}
            <div className="group">
              <div className="bg-white minimal-shadow rounded-lg p-8 border border-gray-100 hover:border-orange-200 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-3 h-3 bg-orange-600 rounded-full mr-3"></div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-800">Privana West</h3>
                    <p className="text-sm text-gray-500">Sector 76</p>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex text-sm">
                    <span className="text-gray-500 w-20">Config:</span>
                    <span className="text-gray-800">4 BHK</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-500 w-20">Area:</span>
                    <span className="text-gray-800">3577 - 5472 sq.ft.</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-500 w-20">Price:</span>
                    <span className="text-orange-600 font-medium">₹7.24 - 7.87 Cr</span>
                  </div>
                </div>
                <ul className="text-sm text-gray-600 space-y-1 mb-6">
                  <li>• 12.6 acre development</li>
                  <li>• 744 premium units</li>
                  <li>• Possession 2028</li>
                </ul>
                <button
                  onClick={() => setShowPopup(true)}
                  className="text-orange-600 text-sm hover:text-orange-700 transition-colors"
                >
                  Learn More →
                </button>
              </div>
            </div>
          </div>
        </div>
      </ div>

      {/* Location Section */}
      < div className="py-20 bg-gray-50" >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-4">
              Strategic <span className="text-gradient">Location</span>
            </h2>
            <div className="w-12 h-px bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl">🛣️</span>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Connectivity</h3>
              <p className="text-sm text-gray-600">NH-48, Dwarka Expressway, SPR & CPR access</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl">🏢</span>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Corporate Hubs</h3>
              <p className="text-sm text-gray-600">DLF Cyber City, Google, American Express nearby</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl">🚇</span>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Amenities</h3>
              <p className="text-sm text-gray-600">Metro, malls, schools & healthcare facilities</p>
            </div>
          </div>
        </div>
      </ div>

      {/* About Section */}
      < div id="about" className="py-20 bg-white" >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-6">
                About <span className="text-gradient">DLF Privana</span>
              </h2>
              <div className="w-12 h-px bg-blue-600 mb-8"></div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                DLF Privana represents the pinnacle of luxury living in Gurgaon. Spanning 126 acres across Sectors 76 and 77,
                this premium development offers an unparalleled blend of luxury, comfort, and sustainability.
              </p>

              <p className="text-gray-600 mb-8 leading-relaxed">
                With 88% open green spaces and international architectural standards, Privana features design inputs from
                renowned consultants from Paris and London, creating a truly world-class living experience.
              </p>

              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-4">RERA Compliance</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>Privana South: HARERA/GGM/772/504/2023/116</div>
                  <div>Privana West: RC/REP/HARERA/GGM/819/551/2024/46</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-lg overflow-hidden shadow-xl">
                <img
                  src="https://dlfpriivana.in/wp-content/uploads/2023/09/gallery7-1.jpg"
                  alt="DLF Privana Premium Interior Design"
                  className="w-full h-full object-cover transform transition duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </ div>

      {/* Contact Section */}
      {/* Contact Section */}
      <div id="contact" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-4">
              Get in <span className="text-gradient">Touch</span>
            </h2>
            <div className="w-12 h-px bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <div className="bg-white rounded-lg p-8 minimal-shadow">
                <h3 className="text-xl font-medium text-gray-800 mb-6">Contact Information</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <span className="text-blue-600 mt-1 mr-3">📍</span>
                    <div>
                      <div className="font-medium text-gray-800">DLF Privana Sales Office</div>
                      <div className="text-sm text-gray-600">Sectors 76 & 77, Gurgaon</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-600 mt-1 mr-3">📞</span>
                    <div>
                      <div className="font-medium text-gray-800">Phone</div>
                      <div className="text-sm text-gray-600">(+91) 124-456-7890</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-600 mt-1 mr-3">✉️</span>
                    <div>
                      <div className="font-medium text-gray-800">Email</div>
                      <div className="text-sm text-gray-600">info@dlfprivana.com</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-600 mt-1 mr-3">🌐</span>
                    <div>
                      <div className="font-medium text-gray-800">Website</div>
                      <div className="text-sm text-gray-600">https://dlfpriivana.in/</div>
                    </div>
                  </div>
                </div>

                <div className="h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.2033848991827!2d77.06149597539654!3d28.489353975700193!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d195d8b1234e5%3A0x12345678!2sSector%2076%2C%20Gurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1712166133861!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg p-8 minimal-shadow">
                {contactSubmitted ? (
                  <div className="text-center py-12" style={{ animation: "gentle-fade 0.5s ease-out" }}>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-green-600 text-2xl">✓</span>
                    </div>
                    <h4 className="text-xl font-medium text-gray-800 mb-2">Thank You!</h4>
                    <p className="text-gray-600">We've received your message and will be in touch shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit}>
                    <h3 className="text-xl font-medium text-gray-800 mb-6">Send us a Message</h3>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contact-name">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="contact-name"
                          name="name"
                          value={contactFormData.name}
                          onChange={handleContactChange}
                          className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors ${contactErrors.name ? 'border-red-300' : 'border-gray-300'
                            }`}
                          placeholder="Enter your full name"
                        />
                        {contactErrors.name && <p className="text-red-500 text-xs mt-1">{contactErrors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contact-email">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="contact-email"
                          name="email"
                          value={contactFormData.email}
                          onChange={handleContactChange}
                          className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors ${contactErrors.email ? 'border-red-300' : 'border-gray-300'
                            }`}
                          placeholder="Enter your email address"
                        />
                        {contactErrors.email && <p className="text-red-500 text-xs mt-1">{contactErrors.email}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contact-city">
                          City
                        </label>
                        <input
                          type="text"
                          id="contact-city"
                          name="city"
                          value={contactFormData.city}
                          onChange={handleContactChange}
                          className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors ${contactErrors.city ? 'border-red-300' : 'border-gray-300'
                            }`}
                          placeholder="Enter your city"
                        />
                        {contactErrors.city && <p className="text-red-500 text-xs mt-1">{contactErrors.city}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="contact-phone">
                          Phone Number
                        </label>
                        <div className="flex">
                          <select
                            className="px-3 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            value={contactCountryCode}
                            onChange={handleContactCountryCodeChange}
                          >
                            <option value="+91">+91</option>
                            <option value="+1">+1</option>
                            <option value="+44">+44</option>
                            <option value="+61">+61</option>
                            <option value="+86">+86</option>
                            <option value="+49">+49</option>
                          </select>
                          <input
                            type="number"
                            id="contact-phone"
                            name="phone"
                            value={contactFormData.phone}
                            onChange={handleContactChange}
                            className={`w-full px-4 py-3 border rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors ${contactErrors.phone ? 'border-red-300' : 'border-gray-300'
                              }`}
                            placeholder="Enter your phone number"
                            min="0"
                          />
                        </div>
                        {contactErrors.phone && <p className="text-red-500 text-xs mt-1">{contactErrors.phone}</p>}
                      </div>

                      <button
                        type="submit"
                        disabled={isContactSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md transition-colors disabled:opacity-50"
                      >
                        {isContactSubmitting ? 'Sending...' : 'Send Message'}
                      </button>

                      {contactSubmitError && <p className="text-red-500 text-xs">{contactSubmitError}</p>}
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 royal-gradient rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-sm">D</span>
                </div>
                <div className="text-xl font-light">DLF Privana</div>
              </div>
              <p className="text-gray-400 text-sm mb-4 max-w-md">
                Premium residential development in Gurgaon, offering luxury living with international design standards and world-class amenities.
              </p>
              <div className="text-xs text-gray-500">
                <p>RERA Approved Project</p>
                <p>Launched: December 2023</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#phases" className="hover:text-white transition-colors">Phases</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="/admin" className="hover:text-white transition-colors">Admin</a></li>
                <li><a href="https://dlfpriivana.in/" className="hover:text-white transition-colors">Official Website</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-4">Project Phases</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Privana East - Sector 76</li>
                <li>Privana North - Sector 77</li>
                <li>Privana South - Sector 77</li>
                <li>Privana West - Sector 76</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-xs">
              &copy; {new Date().getFullYear()} DLF Privana. All rights reserved. | RERA Approved
            </p>
          </div>
        </div>
      </footer>

      {/* Popup Form */}
      {
        showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            <div
              className="bg-white rounded-lg shadow-xl max-w-md w-full relative z-10"
              style={{ animation: "soft-scale 0.3s ease-out" }}
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-medium text-gray-800">Request Information</h3>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>

                {submitted ? (
                  <div className="text-center py-8" style={{ animation: "gentle-fade 0.5s ease-out" }}>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-green-600 text-2xl">✓</span>
                    </div>
                    <h4 className="text-lg font-medium text-gray-800 mb-2">Thank You!</h4>
                    <p className="text-gray-600 text-sm">We've received your information and will be in touch shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.name ? 'border-red-300' : 'border-gray-300'
                            }`}
                          placeholder="Enter your full name"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.email ? 'border-red-300' : 'border-gray-300'
                            }`}
                          placeholder="Enter your email address"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="city">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.city ? 'border-red-300' : 'border-gray-300'
                            }`}
                          placeholder="Enter your city"
                        />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="phone">
                          Phone Number
                        </label>
                        <div className="flex">
                          <select
                            className="px-3 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            value={countryCode}
                            onChange={handleCountryCodeChange}
                          >
                            <option value="+91">+91</option>
                            <option value="+1">+1</option>
                            <option value="+44">+44</option>
                            <option value="+61">+61</option>
                            <option value="+86">+86</option>
                            <option value="+49">+49</option>
                          </select>
                          <input
                            type="number"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.phone ? 'border-red-300' : 'border-gray-300'
                              }`}
                            placeholder="Enter your phone number"
                            min="0"
                          />
                        </div>
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md transition-colors disabled:opacity-50"
                      >
                        {isSubmitting ? 'Submitting...' : 'Get Information'}
                      </button>

                      {submitError && <p className="text-red-500 text-xs">{submitError}</p>}
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}