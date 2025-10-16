import React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  Video,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
} from "lucide-react";

interface VideoConsultationForm {
  fullName: string;
  email: string;
  phone: string;
  consultationType: string;
  preferredDate: string;
  preferredTime: string;
  concerns: string;
  hasSymptoms: boolean;
  urgencyLevel: string;
}

const VideoConsultationPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VideoConsultationForm>();

  const consultationTypes = [
    "General Consultation",
    "Pain Assessment",
    "Treatment Planning",
    "Post-Treatment Follow-up",
    "Cosmetic Consultation",
    "Emergency Consultation",
    "Second Opinion",
    "Preventive Care Advice",
  ];

  const urgencyLevels = [
    "Low - General inquiry",
    "Medium - Some discomfort",
    "High - Significant pain",
    "Urgent - Severe pain/emergency",
  ];

  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
  ];

  const onSubmit = async (data: VideoConsultationForm): Promise<void> => {
    console.log("Video consultation request:", data);
    // Here we would normally send data to Supabase or backend
    alert(
      "Video consultation request submitted! We'll contact you within 24 hours to confirm your appointment."
    );
    reset();
  };

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
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Video className="h-8 w-8 text-primary-600" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-6">
              Video Consultation
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get professional dental advice from the comfort of your home. Our
              experienced dentists are available for virtual consultations to
              address your concerns.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Save Time
              </h3>
              <p className="text-gray-600">
                No travel time or waiting room delays. Get expert advice quickly
                and conveniently.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div className="bg-teal-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Expert Care
              </h3>
              <p className="text-gray-600">
                Consult with our experienced dentists through secure,
                high-quality video calls.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center"
            >
              <div className="bg-coral-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-6 w-6 text-coral-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Safe & Secure
              </h3>
              <p className="text-gray-600">
                HIPAA-compliant platform ensures your privacy and
                confidentiality are protected.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Consultation Request Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">
              Request Video Consultation
            </h2>
            <p className="text-xl text-gray-600">
              Fill out the form below and we'll schedule your virtual
              appointment.
            </p>
          </motion.div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      {...register("fullName", {
                        required: "Full name is required",
                      })}
                      type="text"
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      type="email"
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    {...register("phone", {
                      required: "Phone number is required",
                    })}
                    type="tel"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="09952205380"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Consultation Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consultation Type *
                  </label>
                  <select
                    {...register("consultationType", {
                      required: "Please select consultation type",
                    })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select consultation type</option>
                    {consultationTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.consultationType && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.consultationType.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency Level *
                  </label>
                  <select
                    {...register("urgencyLevel", {
                      required: "Please select urgency level",
                    })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select urgency level</option>
                    {urgencyLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                  {errors.urgencyLevel && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.urgencyLevel.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Scheduling */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      {...register("preferredDate", {
                        required: "Please select a date",
                      })}
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                    <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <select
                      {...register("preferredTime", {
                        required: "Please select a time",
                      })}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
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
                  Describe Your Concerns *
                </label>
                <textarea
                  {...register("concerns", {
                    required: "Please describe your concerns",
                  })}
                  rows={4}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Please describe your dental concerns, symptoms, or questions in detail..."
                />
                {errors.concerns && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.concerns.message}
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  {...register("hasSymptoms")}
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  I am currently experiencing pain or discomfort
                </label>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Important Note:
                </h4>
                <p className="text-sm text-blue-800">
                  Video consultations are for assessment and advice only. For
                  emergencies, physical examinations, or hands-on treatments, an
                  in-person visit will be required. If you're experiencing
                  severe pain, please call our emergency line at 09952205380.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-500 to-teal-500 text-white py-4 px-6 rounded-lg font-semibold hover:from-primary-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <Video className="mr-2 h-5 w-5" />
                Request Video Consultation
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">
              What to Expect
            </h2>
            <p className="text-xl text-gray-600">
              Here's how your video consultation will work
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Schedule
              </h3>
              <p className="text-gray-600">
                Submit your request and we'll contact you within 24 hours to
                confirm your appointment time.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-teal-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Connect
              </h3>
              <p className="text-gray-600">
                Join the secure video call at your scheduled time using the link
                we'll send you.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center"
            >
              <div className="bg-coral-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-coral-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Consult
              </h3>
              <p className="text-gray-600">
                Discuss your concerns with our dentist and receive professional
                advice and next steps.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VideoConsultationPage;
