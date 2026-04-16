"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSend, FiCheck, FiAlertCircle } from "react-icons/fi";
import { trackPageView } from "@/lib/analytics";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<ContactForm>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    trackPageView("/contact");
  }, []);

  const validate = (): boolean => {
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<ContactForm> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0])
          fieldErrors[err.path[0] as keyof ContactForm] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!validate()) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to send");

      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setSubmitError("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: keyof ContactForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="section min-h-screen overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] rounded-full bg-primary-500/10 blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-accent-violet/10 blur-[100px] animate-pulse-slow" />
      </div>

      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-5xl font-black mb-6">Let's <span className="gradient-text">Connect</span></h1>
          <p className="text-dark-600 dark:text-dark-400 max-w-2xl mx-auto text-lg">
            Have a exciting project or just want to say hi? I'm always open to discussing new opportunities and ideas.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card h-full"
            >
              <h3 className="text-2xl font-bold mb-8">Contact Info</h3>
              <div className="space-y-8">
                {[
                  { label: "Email", value: "shankhadeepmondal7@gmail.com", href: "mailto:shankhadeepmondal7@gmail.com" },
                  { label: "Phone", value: "+91 8420011603", href: "tel:+918420011603" },
                  { label: "Location", value: "Bengaluru, Karnataka", href: null },
                  { label: "Response Time", value: "Within 24 Hours", href: null }
                ].map((item, i) => (
                  <div key={i} className="group">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-2">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-lg font-semibold text-dark-900 dark:text-white hover:text-primary-500 transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-lg font-semibold text-dark-900 dark:text-white">{item.value}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-dark-200/50 dark:border-white/5">
                <p className="text-xs font-bold uppercase tracking-widest text-dark-400 mb-4">Availability</p>
                <ul className="grid grid-cols-2 gap-3">
                  {["Full-time", "Freelance", "Collaborations", "Mentoring"].map(tag => (
                    <li key={tag} className="text-sm font-semibold text-dark-600 dark:text-dark-300 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="card">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-green-500/10 text-green-500">
                    <FiCheck size={40} />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Message Sent!</h3>
                  <p className="text-dark-600 dark:text-dark-400 mb-8 max-w-sm mx-auto">
                    Thanks for reaching out. I've received your message and will get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-secondary"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {submitError && (
                    <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-semibold">
                      <FiAlertCircle size={20} />
                      {submitError}
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label htmlFor="name" className="text-sm font-bold ml-1 text-dark-700 dark:text-dark-300">Name</label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className={`w-full px-6 py-4 rounded-2xl glass focus:ring-2 focus:ring-primary-500 transition-all ${
                          errors.name ? "border-red-500" : ""
                        }`}
                        placeholder="John Doe"
                      />
                      {errors.name && <p className="text-xs font-bold text-red-500 ml-1">{errors.name}</p>}
                    </div>

                    <div className="space-y-3">
                      <label htmlFor="email" className="text-sm font-bold ml-1 text-dark-700 dark:text-dark-300">Email</label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className={`w-full px-6 py-4 rounded-2xl glass focus:ring-2 focus:ring-primary-500 transition-all ${
                          errors.email ? "border-red-500" : ""
                        }`}
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="text-xs font-bold text-red-500 ml-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="message" className="text-sm font-bold ml-1 text-dark-700 dark:text-dark-300">Message</label>
                    <textarea
                      id="message"
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      className={`w-full px-6 py-4 rounded-2xl glass focus:ring-2 focus:ring-primary-500 transition-all resize-none ${
                        errors.message ? "border-red-500" : ""
                      }`}
                      placeholder="Tell me about your vision..."
                    />
                    {errors.message && <p className="text-xs font-bold text-red-500 ml-1">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
                  >
                    {submitting ? "Sending..." : <><FiSend /> Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
