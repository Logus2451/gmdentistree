import React from "react";
import { reviews } from "../data/reviews";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  Award,
  Users,
  Clock,
  ArrowRight,
  Shield,
  Heart,
  Smile,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  User,
  Calendar,
  Menu,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { supabase } from "../lib/supabase";
import LazyImage from "../components/LazyImage";
import { useNotification } from "../hooks/useNotification";
import { useOfflineSync } from "../hooks/useOfflineSync";

interface BookingForm {
  fullName: string;
  email: string;
  phone: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
}

const HomePage: React.FC = () => {
  // Use environment variable for default clinic ID for public bookings
  const DEFAULT_CLINIC_ID = import.meta.env.VITE_CLINIC_ID || '';
  const [currentHeroImage, setCurrentHeroImage] = React.useState(0);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingForm>();
  const { sendNotification, requestPermission } = useNotification();
  const { isOnline, addToQueue } = useOfflineSync();
  const heroImages = ["/images/Hero1.png", "/images/hero2.png"];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const onSubmit = async (data: BookingForm): Promise<void> => {
    setIsLoading(true);
    setError("");

    try {
      if (!isOnline) {
        addToQueue("appointment", data);
        setIsSubmitted(true);
        setShowSuccessModal(true);
        reset();

        // Open WhatsApp with booking details (works offline)
        const whatsappMessage = `Hi! I've booked an appointment (OFFLINE):

Name: ${data.fullName}
Service: ${data.service}
Date: ${data.preferredDate}
Time: ${data.preferredTime}
Phone: ${data.phone}
Email: ${data.email}${
          data.notes
            ? `
Notes: ${data.notes}`
            : ""
        }

Note: This was booked offline, please confirm availability.`;

        const whatsappURL = `https://wa.me/919952205380?text=${encodeURIComponent(
          whatsappMessage
        )}`;
        window.open(whatsappURL, "_blank");

        sendNotification("Appointment Saved", {
          body: "Your appointment will be processed when you're back online.",
          tag: "offline-booking",
        });
        return;
      }

      let patientId: string;

      const { data: existingPatient } = await supabase
        .from("patients")
        .select("id")
        .eq("email", data.email)
        .single();

      if (existingPatient) {
        patientId = existingPatient.id;
      } else {
        const { data: newPatient, error: patientError } = await supabase
          .from("patients")
          .insert({
            full_name: data.fullName,
            email: data.email,
            phone: data.phone,
            clinic_id: DEFAULT_CLINIC_ID,
          })
          .select("id")
          .single();

        if (patientError) throw patientError;
        patientId = newPatient.id;
      }

      const { error: appointmentError } = await supabase
        .from("appointments")
        .insert({
          patient_id: patientId,
          service: data.service,
          appointment_date: data.preferredDate,
          appointment_time: data.preferredTime,
          notes: data.notes || null,
          status: "scheduled",
          clinic_id: DEFAULT_CLINIC_ID,
        });

      if (appointmentError) throw appointmentError;

      setIsSubmitted(true);
      setShowSuccessModal(true);
      reset();

      // Open WhatsApp with booking details
      const whatsappMessage = `Hi! I've booked an appointment:

Name: ${data.fullName}
Service: ${data.service}
Date: ${data.preferredDate}
Time: ${data.preferredTime}
Phone: ${data.phone}
Email: ${data.email}${
        data.notes
          ? `
Notes: ${data.notes}`
          : ""
      }`;

      const whatsappURL = `https://wa.me/919952205380?text=${encodeURIComponent(
        whatsappMessage
      )}`;
      window.open(whatsappURL, "_blank");

      await requestPermission();
      sendNotification("Appointment Confirmed!", {
        body: `Your ${data.service} appointment is scheduled for ${data.preferredDate} at ${data.preferredTime}`,
        tag: "appointment-confirmation",
      });
    } catch (err: any) {
      console.error("Booking error:", err);
      setError(err.message || "Failed to book appointment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const services = [
    {
      title: "General Dentistry",
      description:
        "Comprehensive oral health care including cleanings, fillings, and preventive treatments.",
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
      features: ["Routine Cleanings", "Cavity Fillings", "Oral Exams"],
    },
    {
      title: "Cosmetic Dentistry",
      description:
        "Transform your smile with our advanced cosmetic dental procedures.",
      image:
        "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop",
      features: ["Teeth Whitening", "Veneers", "Smile Makeovers"],
    },
    {
      title: "Emergency Care",
      description: "24/7 emergency dental services for urgent dental problems.",
      image:
        "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=300&fit=crop",
      features: ["Pain Relief", "Emergency Repairs", "Same-Day Treatment"],
    },
  ];

  const stats = [
    { icon: Users, value: "2000+", label: "Happy Patients" },
    { icon: Award, value: "5+", label: "Years Experience" },
    { icon: Star, value: "5", label: "Average Rating" },
    { icon: Clock, value: "24/7", label: "Emergency Care" },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      text: "The best dental experience I've ever had. The staff is incredibly professional and caring.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b400?w=80&h=80&fit=crop&crop=face",
    },
    {
      name: "Michael Chen",
      text: "Dr. Smith transformed my smile completely. I couldn't be happier with the results!",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    },
    {
      name: "Emily Davis",
      text: "The online booking system made it so easy to schedule my appointment. Highly recommend!",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    },
  ];

  return (
    <div id="top" className="bg-white">
      {/* Top Info Bar */}
      <div className="bg-gray-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm">
            <div className="hidden sm:flex items-center space-x-4">
              <LazyImage
                src="/images/Logo.jpg"
                alt="Dentistree Logo"
                className="w-6 h-6 rounded"
              />
              <span className="text-center sm:text-left">
                No4, vasantham nagar, kappi kadai, near PPG institute of
                technology, Coimbatore, Tamil Nadu 641035
              </span>
            </div>
            <div className="flex items-center space-x-6 mt-2 sm:mt-0">
              <a
                href="tel:+919952205380"
                className="flex items-center space-x-2 hover:text-green-400 transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>9952205380</span>
              </a>
              <a
                href="mailto:dr.gmsdentistree@gmail.com?subject=Dental Appointment Inquiry&body=Hi Dr. G.M's Dentistree,%0D%0A%0D%0AI would like to inquire about dental services.%0D%0A%0D%0AThank you."
                className="flex items-center space-x-2 hover:text-green-400 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>dr.gmsdentistree@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Header Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <a href="#top" className="flex items-center space-x-3">
              <LazyImage
                src="/images/Logo.jpg"
                alt="Dentistree Logo"
                className="w-12 h-12 rounded"
              />
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                Dr.G.M's Dentistree
              </span>
            </a>
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#top"
                className="text-gray-900 font-semibold border-b-2 border-green-500 pb-1"
              >
                Home
              </a>
              <a
                href="#services"
                className="text-gray-700 hover:text-green-500 transition-colors"
              >
                Services
              </a>
              <a
                href="#stats"
                className="text-gray-700 hover:text-green-500 transition-colors"
              >
                About
              </a>
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-green-500 transition-colors"
              >
                Reviews
              </a>
              <a
                href="#gallery"
                className="text-gray-700 hover:text-green-500 transition-colors"
              >
                Gallery
              </a>
              <a
                href="#mission"
                className="text-gray-700 hover:text-green-500 transition-colors"
              >
                Mission
              </a>
              <a
                href="#maps"
                className="text-gray-700 hover:text-green-500 transition-colors"
              >
                Location
              </a>
              <a
                href="#booking"
                className="text-gray-700 hover:text-green-500 transition-colors"
              >
                Contact Us
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-green-500"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4 px-4">
                <a
                  href="#top"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-700 hover:text-green-500 transition-colors"
                >
                  Home
                </a>
                <a
                  href="#services"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-700 hover:text-green-500 transition-colors"
                >
                  Services
                </a>
                <a
                  href="#stats"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-700 hover:text-green-500 transition-colors"
                >
                  About
                </a>
                <a
                  href="#testimonials"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-700 hover:text-green-500 transition-colors"
                >
                  Reviews
                </a>
                <a
                  href="#gallery"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-700 hover:text-green-500 transition-colors"
                >
                  Gallery
                </a>
                <a
                  href="#mission"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-700 hover:text-green-500 transition-colors"
                >
                  Mission
                </a>
                <a
                  href="#maps"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-700 hover:text-green-500 transition-colors"
                >
                  Location
                </a>
                <a
                  href="#booking"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-700 hover:text-green-500 transition-colors"
                >
                  Contact Us
                </a>
                <a
                  href="/admin/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-700 hover:text-green-500 transition-colors"
                >
                  Admin Login
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative h-screen bg-cover bg-center transition-all duration-1000"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${heroImages[currentHeroImage]}')`,
        }}
      >
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex justify-between items-center">
              {/* Hero Text */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl"
              >
                <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
                  THE HIGHEST QUALITY
                  <br />
                  DENTAL HEALTH CARE
                  <br />
                  <span className="text-pink-400">YOUR</span> FAMILY DESERVES
                </h1>
                <div className="flex items-center space-x-4 mt-8">
                  <a
                    href="#booking"
                    className="inline-flex items-center px-8 py-4 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-all duration-200"
                  >
                    Book Appointment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </div>
              </motion.div>

              {/* Social Media Buttons - Mobile Optimized */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="hidden sm:flex flex-col fixed right-2 lg:right-4 top-1/2 transform -translate-y-1/2 z-40"
              >
                <a
                  href="https://instagram.com/dr.g.msdentistree?igshid=ZDdkNTZiNTM="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 lg:w-14 lg:h-14 bg-pink-500 flex items-center justify-center text-white hover:bg-pink-600 transition-colors rounded-t-lg"
                >
                  <Instagram className="h-4 w-4 lg:h-5 lg:w-5" />
                </a>
                <a
                  href="https://maps.app.goo.gl/aMJeG9HyrMJGjHLU9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 lg:w-14 lg:h-14 bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition-colors rounded-b-lg"
                >
                  <MapPin className="h-4 w-4 lg:h-5 lg:w-5" />
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section
        id="stats"
        className="py-20 bg-gradient-to-br from-green-50 via-white to-yellow-50 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/60"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our commitment to excellence has earned us the trust of patients
              across the region.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="text-center group"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-green-500 to-yellow-500 p-2 sm:p-4 rounded-full inline-flex transform group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="h-6 w-6 sm:h-10 sm:w-10 text-white" />
                  </div>
                </div>
                <motion.h3
                  className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
                >
                  {stat.value}
                </motion.h3>
                <p className="text-sm sm:text-lg text-gray-600 font-medium">
                  {stat.label}
                </p>
                <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-yellow-500 mx-auto mt-3 rounded-full"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">
              Our Dental Services
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive dental care for all your oral health needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Dental Implant",
                image: "/images/Service - Dental Implant.png",
              },
              {
                name: "Orthodontic",
                image: "/images/Service - Orthodontic Treatment.png",
              },
              {
                name: "Invisalign Treatment",
                image:
                  "/images/Service - Invisalign Treatment in Coimbatore.png",
              },
              {
                name: "Root Canal",
                image: "/images/Service - Root Canal Treatment.png",
              },
              {
                name: "Pediatric Dental",
                image: "/images/Service - Pediatric Dental Treatment.jpg",
              },
              {
                name: "Dental Crown and Bridges",
                image: "/images/Service - Dental Crown And Bridges.jpg",
              },
              {
                name: "Complete Denture",
                image: "/images/Service - Complete Denture.jpg",
              },
              {
                name: "Wisdom Tooth Removal",
                image: "/images/Service - Wisdom Teeth Removal.jpg",
              },
              {
                name: "Composite Fillings",
                image: "/images/Service - Dental Fillings.jpg",
              },
              {
                name: "Gum Treatment",
                image: "/images/Service - Gum Treatment.jpg",
              },
              {
                name: "Scaling Treatment",
                image: "/images/Service - Scaling Treatment.webp",
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden"
              >
                <LazyImage
                  src={service.image}
                  alt={service.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 text-center">
                    {service.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-6">
                Why Choose Dentistree?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 p-2 rounded-full">
                    <Heart className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Patient-Centered Care
                    </h3>
                    <p className="text-gray-600">
                      We prioritize your comfort and well-being in every
                      treatment.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-teal-100 p-2 rounded-full">
                    <Award className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Advanced Technology
                    </h3>
                    <p className="text-gray-600">
                      State-of-the-art equipment for precise, comfortable
                      treatments.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-coral-100 p-2 rounded-full">
                    <Smile className="h-6 w-6 text-coral-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Beautiful Results
                    </h3>
                    <p className="text-gray-600">
                      Transforming smiles with artistry and precision.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <LazyImage
                src="/images/Docotr Photo.jpg"
                alt="Dr. Ganeshmoorthy"
                className="rounded-2xl shadow-xl w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Certification Section */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-6">
              Our Certifications & Expertise
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-700 mb-4">
                Dr. Ganeshmoorthy brings over 5 years of specialized experience
                in comprehensive dental care. Graduated from prestigious dental
                institutions and continuously updated with the latest techniques
                and technologies in modern dentistry.
              </p>
              <p className="text-lg text-gray-700">
                Our clinic is certified by leading dental associations and
                maintains the highest standards of patient care, safety
                protocols, and treatment excellence. We are committed to
                providing world-class dental services to our community.
              </p>
            </div>
          </motion.div>

          {/* Manual Swipe Certificates */}
          <div className="scroll-container">
            <div className="scroll-content">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <div
                  key={num}
                  className="flex-shrink-0 w-48 sm:w-64 h-36 sm:h-48 bg-white rounded-lg shadow-lg p-2 sm:p-4"
                >
                  <LazyImage
                    src={`/images/Caertificate${num}.jpg`}
                    alt={`Dental Certification ${num}`}
                    className="w-full h-full object-contain rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">
              What Our Patients Say
            </h2>
            <p className="text-xl text-gray-600">
              Don't just take our word for it - hear from our satisfied
              patients.
            </p>
          </motion.div>

          <div className="scroll-container">
            <div className="scroll-content">
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-80 bg-white p-6 rounded-xl shadow-lg"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                    "{review.text}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-primary-600 font-semibold text-sm">
                        {review.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-base">
                        {review.name}
                      </h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">
              Our Clinic Gallery
            </h2>
            <p className="text-xl text-gray-600">
              Take a look at our modern facilities and comfortable environment.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {[
              "/images/Gallaery1.jpg",
              "/images/Gallaery2.jpg",
              "/images/Gallaery3.jpg",
              "/images/Gallaery4.jpg",
              "/images/Gallaery5.jpg",
              "/images/Gallaery6.jpg",
              "/images/Gallaery7.jpg",
              "/images/Gallaery8.jpg",
              "/images/Gallaery9.jpg",
              "/images/Gallaery10.jpg",
              "/images/Gallaery11.jpg",
              "/images/Gallaery12.jpg",
            ].map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow group"
              >
                <LazyImage
                  src={image}
                  alt={`Clinic Gallery ${index + 1}`}
                  className="w-full h-32 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Mission & Vision Section */}
      <section
        id="mission"
        className="py-20 bg-gradient-to-br from-green-50 via-white to-yellow-50 relative"
      >
        <div className="absolute inset-0 bg-white/80"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our Mission & Vision
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-green-500 to-yellow-500 mx-auto mb-8 rounded-full"></div>

            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              At Dr. G.M.'s Dentistree, we are committed to transforming lives
              through exceptional dental care, building lasting relationships
              with our patients while maintaining the highest standards of
              excellence.
            </p>
          </motion.div>

          {/* Enhanced Cards with Images */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="relative h-32 sm:h-48 overflow-hidden">
                <LazyImage
                  src="/images/Our-Mission.jpg"
                  alt="Our Mission"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-600/80 to-transparent"></div>
                <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-8">
                <h3 className="text-lg sm:text-2xl font-bold text-green-600 mb-2 sm:mb-4">
                  Our Mission
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  To provide compassionate, comprehensive dental care that
                  exceeds expectations, fostering lifelong relationships built
                  on trust, comfort, and exceptional results.
                </p>
              </div>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="relative h-32 sm:h-48 overflow-hidden">
                <LazyImage
                  src="/images/Our-Vision.png"
                  alt="Our Vision"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-600/80 to-transparent"></div>
                <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-8">
                <h3 className="text-lg sm:text-2xl font-bold text-yellow-600 mb-2 sm:mb-4">
                  Our Vision
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  To be the leading multi-specialty dental clinic, setting new
                  standards in ethical practice, advanced technology, and
                  patient-centered care across the region.
                </p>
              </div>
            </motion.div>

            {/* Values Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="relative h-32 sm:h-48 overflow-hidden">
                <LazyImage
                  src="/images/Our-values.jpg"
                  alt="Our Values"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-600/80 to-transparent"></div>
                <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-8">
                <h3 className="text-lg sm:text-2xl font-bold text-green-600 mb-2 sm:mb-4">
                  Our Values
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Excellence in every treatment, integrity in every interaction,
                  and innovation in every solution - delivering the right care,
                  done right, the first time.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section id="maps" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">
              Visit Our Clinic
            </h2>
            <p className="text-xl text-gray-600">
              Find us easily with our convenient location in Coimbatore.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl overflow-hidden shadow-xl"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125287.71107294265!2d76.86669539726562!3d11.095410000000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8f936bf4b53ad%3A0xe09568d769613c08!2sDr.G.M%E2%80%99s%20Dentistree!5e0!3m2!1sen!2sin!4v1758824730976!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            ></iframe>
          </motion.div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-16 pb-20 sm:pb-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">
              Book Your Appointment
            </h2>
            <p className="text-xl text-gray-600">
              Schedule your visit with our experienced dental team
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-100 p-2 rounded-full">
                    <Phone className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">9952205380</p>
                    <p className="text-sm text-gray-600">Emergency Line</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-teal-100 p-2 rounded-full">
                    <Mail className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      dr.gmsdentistree@gmail.com
                    </p>
                    <p className="text-sm text-gray-600">General Inquiries</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-coral-100 p-2 rounded-full">
                    <MapPin className="h-5 w-5 text-coral-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      No4, vasantham nagar, kappi kadai
                    </p>
                    <p className="text-sm text-gray-600">
                      near PPG institute of technology, Coimbatore, Tamil Nadu
                      641035
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-primary-100 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Mon-Sat: 9.30AM-1PM & 4.30PM-8PM
                    </p>
                    <p className="text-sm text-gray-600">Sat: 9AM-3PM</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Booking Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                {isSubmitted && (
                  <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                    Booking Confirmed! Thank you for booking with Dr.G.M's
                    Dentistree.
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                      <input
                        {...register("fullName", {
                          required: "Full name is required",
                        })}
                        type="text"
                        className="w-full pl-10 pr-3 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                      <input
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        })}
                        type="email"
                        className="w-full pl-10 pr-3 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                    <input
                      {...register("phone", {
                        required: "Phone number is required",
                      })}
                      type="tel"
                      className="w-full pl-10 pr-3 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="9952205380"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type *
                  </label>
                  <select
                    {...register("service", {
                      required: "Please select a service",
                    })}
                    className="w-full px-3 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select a service</option>
                    <option value="General Checkup & Cleaning">
                      General Checkup & Cleaning
                    </option>
                    <option value="Cosmetic Consultation">
                      Cosmetic Consultation
                    </option>
                    <option value="Dental Implant Consultation">
                      Dental Implant Consultation
                    </option>
                    <option value="Emergency Appointment">
                      Emergency Appointment
                    </option>
                    <option value="Teeth Whitening">Teeth Whitening</option>
                    <option value="Orthodontic Consultation">
                      Orthodontic Consultation
                    </option>
                    <option value="Root Canal Treatment">
                      Root Canal Treatment
                    </option>
                    <option value="Periodontal Treatment">
                      Periodontal Treatment
                    </option>
                  </select>
                  {errors.service && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.service.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Date *
                    </label>
                    <div
                      className="relative cursor-pointer"
                      onClick={(e) => {
                        const input = e.currentTarget.querySelector(
                          'input[type="date"]'
                        ) as HTMLInputElement;
                        input?.showPicker?.() || input?.focus();
                      }}
                    >
                      <Calendar className="absolute left-3 top-4 h-5 w-5 text-gray-400 pointer-events-none" />
                      <input
                        {...register("preferredDate", {
                          required: "Please select a date",
                        })}
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full pl-10 pr-3 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer"
                      />
                    </div>
                    {errors.preferredDate && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.preferredDate.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Time *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                      <select
                        {...register("preferredTime", {
                          required: "Please select a time",
                        })}
                        className="w-full pl-10 pr-3 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select time</option>
                        <option value="9:00 AM">9:00 AM</option>
                        <option value="9:30 AM">9:30 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="10:30 AM">10:30 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="11:30 AM">11:30 AM</option>
                        <option value="2:00 PM">2:00 PM</option>
                        <option value="2:30 PM">2:30 PM</option>
                        <option value="3:00 PM">3:00 PM</option>
                        <option value="3:30 PM">3:30 PM</option>
                        <option value="4:00 PM">4:00 PM</option>
                        <option value="4:30 PM">4:30 PM</option>
                        <option value="5:00 PM">5:00 PM</option>
                      </select>
                    </div>
                    {errors.preferredTime && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.preferredTime.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    {...register("notes")}
                    rows={4}
                    className="w-full px-3 py-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder="Any specific concerns or requests?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-yellow-500 text-white py-4 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Booking..." : "Book Appointment"}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mobile Social Media Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-center space-x-1 py-2">
          <a
            href="tel:9952205380"
            className="flex-1 bg-green-500 text-white py-3 px-4 text-center rounded-none flex items-center justify-center space-x-2"
          >
            <Phone className="h-4 w-4" />
            <span className="text-sm font-medium">Call</span>
          </a>
          <a
            href="https://instagram.com/dr.g.msdentistree?igshid=ZDdkNTZiNTM="
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-pink-500 text-white py-3 px-4 text-center rounded-none flex items-center justify-center space-x-2"
          >
            <Instagram className="h-4 w-4" />
            <span className="text-sm font-medium">Instagram</span>
          </a>
          {/* <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-blue-500 text-white py-3 px-4 text-center rounded-none flex items-center justify-center space-x-2"
          >
            <Facebook className="h-4 w-4" />
            <span className="text-sm font-medium">Facebook</span>
          </a> */}
          <a
            href="#booking"
            className="flex-1 bg-yellow-500 text-white py-3 px-4 text-center rounded-none flex items-center justify-center space-x-2"
          >
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">Book</span>
          </a>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 sm:p-8 max-w-md mx-4 text-center shadow-2xl"
          >
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Booking Confirmed!
            </h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              Thank you for booking with Dr.G.M's Dentistree. WhatsApp will open
              to send your booking details. We'll send you a confirmation email
              shortly.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-gradient-to-r from-green-500 to-yellow-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-yellow-600 transition-all duration-200"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
