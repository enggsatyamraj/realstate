"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  // Main popup form state
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
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
    phone: ''
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactErrors, setContactErrors] = useState({});
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);
  const [contactSubmitError, setContactSubmitError] = useState('');
  const [contactCountryCode, setContactCountryCode] = useState('+91');

  const handleCountryCodeChange = (e) => {
    setCountryCode(e.target.value);
  };

  const handleContactCountryCodeChange = (e) => {
    setContactCountryCode(e.target.value);
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes spring-popup {
        0% { transform: scale(0.8); opacity: 0; }
        60% { transform: scale(1.05); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
      
      @keyframes spring-up {
        0% { transform: translateY(20px); opacity: 0; }
        60% { transform: translateY(-5px); opacity: 1; }
        100% { transform: translateY(0); opacity: 1; }
      }
      
      ::placeholder {
        color: #9ca3af;
        font-size: 1rem;
        opacity: 1;
      }
      
      h1, h2, h3, h4, h5, h6 {
        color: inherit;
      }
      
      input, textarea {
        color: #1f2937;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Show popup when the page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 2000); // Show popup after 2 seconds

    return () => clearTimeout(timer);
  }, []);

  // Popup form handlers
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
            countryCode: countryCode
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
          phone: ''
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
            countryCode: contactCountryCode
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
          phone: ''
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

  const downloadBrochure = () => {
    // Create a link to download the brochure file from the correct location
    const link = document.createElement('a');
    link.href = '/brochure.pdf'; // When in public folder, start with slash
    link.download = 'Luxury-Estates-Brochure.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const navigateToAdmin = () => {
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Luxury Estates | Find Your Dream Home</title>
        <meta name="description" content="Discover luxury real estate properties" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-600">Luxury Estates</div>
            <div className="flex items-center space-x-6">
              <a href="#properties" className="text-gray-600 hover:text-gray-900">Properties</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
              <button
                onClick={navigateToAdmin}
                className="text-gray-600 hover:text-gray-900"
              >
                Admin
              </button>
              <button
                onClick={downloadBrochure}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
              >
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gray-900 h-96">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white bg-transparent">
            <h1 className="text-5xl font-bold mb-4 text-white">Find Your Dream Home</h1>
            <p className="text-xl mb-6 text-white">Luxury properties for discerning clients</p>
            <button
              onClick={() => setShowPopup(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg shadow-lg transition duration-300"
            >
              Get More Info
            </button>
          </div>
        </div>
      </div>

      {/* Featured Properties Section */}
      <div id="properties" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Property Card 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Luxury Villa"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Luxury Villa</h3>
                <p className="text-gray-600 mb-4">A stunning 5-bedroom villa with pool and garden</p>
                <div className="flex justify-between">
                  <span className="text-blue-600 font-bold">$1,250,000</span>
                  <button
                    onClick={() => setShowPopup(true)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>

            {/* Property Card 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Modern Apartment"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Modern Apartment</h3>
                <p className="text-gray-600 mb-4">A centrally located 3-bedroom apartment with views</p>
                <div className="flex justify-between">
                  <span className="text-blue-600 font-bold">$750,000</span>
                  <button
                    onClick={() => setShowPopup(true)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>

            {/* Property Card 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Countryside Estate"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Countryside Estate</h3>
                <p className="text-gray-600 mb-4">A magnificent 10-acre estate with historic mansion</p>
                <div className="flex justify-between">
                  <span className="text-blue-600 font-bold">$2,800,000</span>
                  <button
                    onClick={() => setShowPopup(true)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">About Luxury Estates</h2>
              <p className="text-gray-700 mb-6">
                With over 25 years in the luxury real estate market, we specialize in connecting discerning clients
                with exceptional properties. Our portfolio includes exclusive villas, penthouses, historic estates,
                and unique investment opportunities.
              </p>
              <p className="text-gray-700 mb-6">
                Our team of experts provides personalized service tailored to your specific needs and preferences.
                Whether you're looking for a primary residence, vacation home, or investment property, we're here
                to help you find the perfect match.
              </p>
              <button
                onClick={downloadBrochure}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition duration-300"
              >
                Download Our Brochure
              </button>
            </div>
            <div className="mt-8 lg:mt-0 lg:w-1/2 lg:pl-8">
              <div className="h-96 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1577415124269-fc1140a69e91?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Luxury Real Estate Office"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="bg-gray-100 p-6 rounded-lg">
                <p className="text-gray-800 mb-2">Plot Nos 8, 11, TechZone 2</p>
                <p className="text-gray-800 mb-2">Greater Noida, Uttar Pradesh 201310</p>
                <p className="text-gray-800 mb-2">Phone: (123) 456-7890</p>
                <p className="text-gray-800 mb-4">Email: info@luxuryestates.com</p>
                <div className="h-64 bg-gray-300 rounded-lg overflow-hidden">
                  {/* Google Maps iframe */}
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.022551644106!2d77.49705347539894!3d28.564700875689344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cefd3dd39f561%3A0xf935d542fe7de485!2sTechZone%202%2C%20Greater%20Noida%2C%20Uttar%20Pradesh%20201310!5e0!3m2!1sen!2sin!4v1712166133861!5m2!1sen!2sin"
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
              <div className="bg-gray-100 p-6 rounded-lg">
                {contactSubmitted ? (
                  <div
                    className="text-center py-8"
                    style={{
                      animation: "spring-up 0.5s ease-out forwards"
                    }}
                  >
                    <div className="text-green-500 text-5xl mb-4">✓</div>
                    <h4 className="text-2xl font-semibold mb-3">Thank You!</h4>
                    <p className="text-gray-600 text-lg">We've received your message and will be in touch shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit}>
                    <div className="mb-5">
                      <label className="block text-gray-800 mb-2 font-medium" htmlFor="contact-name">Name</label>
                      <input
                        type="text"
                        id="contact-name"
                        name="name"
                        value={contactFormData.name}
                        onChange={handleContactChange}
                        className={`w-full px-4 py-3 text-lg border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${contactErrors.name ? 'border-red-500' : 'border-gray-300'} text-gray-900`}
                        placeholder="Enter your full name"
                      />
                      {contactErrors.name && <p className="text-red-500 text-sm mt-1">{contactErrors.name}</p>}
                    </div>
                    <div className="mb-5">
                      <label className="block text-gray-800 mb-2 font-medium" htmlFor="contact-email">Email</label>
                      <input
                        type="email"
                        id="contact-email"
                        name="email"
                        value={contactFormData.email}
                        onChange={handleContactChange}
                        className={`w-full px-4 py-3 text-lg border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${contactErrors.email ? 'border-red-500' : 'border-gray-300'} text-gray-900`}
                        placeholder="Enter your email address"
                      />
                      {contactErrors.email && <p className="text-red-500 text-sm mt-1">{contactErrors.email}</p>}
                    </div>
                    <div className="mb-5">
                      <label className="block text-gray-800 mb-2 font-medium" htmlFor="contact-phone">Phone Number</label>
                      <div className="flex">
                        <select
                          className="px-2 py-3 text-lg border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
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
                          className={`w-full px-4 py-3 text-lg border rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${contactErrors.phone ? 'border-red-500' : 'border-gray-300'} text-gray-900`}
                          placeholder="Enter your phone number"
                          min="0"
                        />
                      </div>
                      {contactErrors.phone && <p className="text-red-500 text-sm mt-1">{contactErrors.phone}</p>}
                    </div>
                    <button
                      type="submit"
                      disabled={isContactSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md transition duration-300 font-medium text-lg"
                    >
                      {isContactSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                    {contactSubmitError && <p className="text-red-500 mt-3 text-sm">{contactSubmitError}</p>}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Luxury Estates</h3>
              <p className="text-gray-300">Your trusted partner in luxury real estate since 1998.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#properties" className="text-gray-300 hover:text-white transition duration-200">Properties</a></li>
                <li><a href="#about" className="text-gray-300 hover:text-white transition duration-200">About Us</a></li>
                <li><a href="#contact" className="text-gray-300 hover:text-white transition duration-200">Contact</a></li>
                <li><a href="#" onClick={downloadBrochure} className="text-gray-300 hover:text-white transition duration-200">Download Brochure</a></li>
                <li><a href="/admin" className="text-gray-300 hover:text-white transition duration-200">Admin</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-300 hover:text-white transition duration-200">Facebook</a>
                <a href="#" className="text-gray-300 hover:text-white transition duration-200">Twitter</a>
                <a href="#" className="text-gray-300 hover:text-white transition duration-200">Instagram</a>
                <a href="#" className="text-gray-300 hover:text-white transition duration-200">LinkedIn</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-300">
            <p>&copy; {new Date().getFullYear()} Luxury Estates. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Popup Form */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full animate-popup"
            style={{
              animation: "spring-popup 0.5s ease-out forwards"
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Get More Information</h3>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="text-3xl">&times;</span>
              </button>
            </div>
            {submitted ? (
              <div
                className="text-center py-8"
                style={{
                  animation: "spring-up 0.5s ease-out forwards"
                }}
              >
                <div className="text-green-500 text-5xl mb-4">✓</div>
                <h4 className="text-2xl font-semibold mb-3">Thank You!</h4>
                <p className="text-gray-600 text-lg">We've received your information and will be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label className="block text-gray-700 text-lg mb-2" htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'} text-gray-900`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div className="mb-5">
                  <label className="block text-gray-700 text-lg mb-2" htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'} text-gray-900`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-lg mb-2" htmlFor="phone">Phone Number</label>
                  <div className="flex">
                    <select
                      className="px-2 py-3 text-lg border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
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
                      className={`w-full px-4 py-3 text-lg border rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'} text-gray-900`}
                      placeholder="Enter your phone number"
                      min="0"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md text-lg font-medium transition duration-300"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
                {submitError && <p className="text-red-500 mt-3 text-sm">{submitError}</p>}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}