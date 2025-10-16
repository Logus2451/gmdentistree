import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, ArrowRight, CheckCircle } from "lucide-react";

const ServicesPage: React.FC = () => {
  const services = [
    {
      title: "General Dentistry",
      description: "Comprehensive oral health care for the whole family",
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=300&fit=crop",
      features: [
        "Routine Cleanings & Exams",
        "Cavity Detection & Fillings",
        "Gum Disease Treatment",
        "Oral Cancer Screening",
        "Fluoride Treatments",
        "Dental Sealants",
      ],
      startingPrice: "$89",
    },
    {
      title: "Cosmetic Dentistry",
      description: "Transform your smile with our aesthetic treatments",
      image:
        "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500&h=300&fit=crop",
      features: [
        "Professional Teeth Whitening",
        "Porcelain Veneers",
        "Dental Bonding",
        "Smile Makeovers",
        "Gum Contouring",
        "Invisalign Clear Aligners",
      ],
      startingPrice: "$299",
    },
    {
      title: "Dental Implants",
      description: "Permanent solution for missing teeth",
      image:
        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&h=300&fit=crop",
      features: [
        "Single Tooth Implants",
        "Multiple Tooth Replacement",
        "All-on-4 Treatment",
        "Implant-Supported Dentures",
        "3D Imaging & Planning",
        "Bone Grafting",
      ],
      startingPrice: "$1,299",
    },
    {
      title: "Orthodontics",
      description: "Straighten your teeth for a perfect smile",
      image:
        "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=500&h=300&fit=crop",
      features: [
        "Traditional Metal Braces",
        "Clear Ceramic Braces",
        "Invisalign Treatment",
        "Retainers",
        "Adult Orthodontics",
        "Early Treatment for Kids",
      ],
      startingPrice: "$2,999",
    },
    {
      title: "Emergency Dental Care",
      description: "24/7 urgent dental care when you need it most",
      image:
        "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=500&h=300&fit=crop",
      features: [
        "Severe Tooth Pain Relief",
        "Dental Trauma Treatment",
        "Broken Tooth Repair",
        "Lost Filling Replacement",
        "Abscess Treatment",
        "Emergency Extractions",
      ],
      startingPrice: "$150",
    },
    {
      title: "Periodontal Treatment",
      description: "Specialized care for gum disease and oral health",
      image:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&h=300&fit=crop",
      features: [
        "Deep Cleaning (Scaling)",
        "Root Planing",
        "Gum Surgery",
        "Pocket Reduction",
        "Gum Grafting",
        "Maintenance Therapy",
      ],
      startingPrice: "$200",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-50 to-teal-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-6">
              Our Dental Services
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive dental care using the latest technology and
              techniques. From routine cleanings to advanced procedures, we're
              here for all your oral health needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-heading font-bold text-gray-900">
                      {service.title}
                    </h3>
                    <span className="text-2xl font-bold text-primary-600">
                      {service.startingPrice}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-6">{service.description}</p>

                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/booking"
                    className="inline-flex items-center justify-center w-full bg-gradient-to-r from-primary-500 to-teal-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-primary-600 hover:to-teal-600 transition-all duration-200"
                  >
                    Book Appointment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-6">
              Why Choose Dentistree?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine advanced technology with compassionate care to deliver
              exceptional results.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Excellence in Care
              </h3>
              <p className="text-gray-600">
                Our experienced team is committed to providing the highest
                quality dental care with attention to detail.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Modern Technology
              </h3>
              <p className="text-gray-600">
                We use the latest dental technology and techniques to ensure
                comfortable, effective treatments.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center"
            >
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <ArrowRight className="h-8 w-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Personalized Treatment
              </h3>
              <p className="text-gray-600">
                Every treatment plan is customized to meet your unique needs and
                goals for optimal results.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-teal-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Book your appointment today and experience the difference that
              quality dental care can make.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/booking"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg"
              >
                Book Appointment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/video-consultation"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                Video Consultation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
