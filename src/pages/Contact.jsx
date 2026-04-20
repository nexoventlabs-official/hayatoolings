import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import './FormPages.css';

const Contact = () => {
  return (
    <div className="form-page section">
      <div className="container">
        <div className="form-header text-center mb-8 animate-fade-in">
          <h1 className="h2 mb-4">Get in <span className="text-accent">Touch</span></h1>
          <p className="text-secondary max-w-2xl mx-auto">
            Have questions about our tools or need support? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 contact-grid">
          <div className="contact-info glass p-8 rounded-xl animate-fade-in delay-100">
            <h3 className="h3 mb-6">Contact Information</h3>
            
            <div className="info-item">
              <div className="icon-box"><Phone className="text-accent" /></div>
              <div>
                <h4 className="font-semibold">Phone</h4>
                <p className="text-secondary"><a href="tel:+918680085737">+91 8680085737</a></p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="icon-box"><Mail className="text-accent" /></div>
              <div>
                <h4 className="font-semibold">Email</h4>
                <p className="text-secondary"><a href="mailto:hayatoolings@gmail.com">hayatoolings@gmail.com</a></p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="icon-box"><MapPin className="text-accent" /></div>
              <div>
                <h4 className="font-semibold">Location</h4>
                <p className="text-secondary">26N, Bharathi Nagar, Near Palayapudur, Periyanaickenpalayam, Coimbatore, Tamil Nadu - 641020</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-box"><Clock className="text-accent" /></div>
              <div>
                <h4 className="font-semibold">Business Hours</h4>
                <p className="text-secondary">Mon-Sat: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>

          <div className="map-container glass rounded-xl animate-fade-in delay-200">
            {/* Simulated Map Area */}
            <div className="simulated-map">
              <MapPin size={48} className="text-accent map-pin" />
              <div className="pulse-ring"></div>
              <p className="map-text">Haya Toolings H.Q.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
