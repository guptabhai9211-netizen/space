import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="w-full py-24 bg-gradient-to-b from-slate-900 via-slate-950 to-black">
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Contact <span className="text-indigo-400">Us</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Have questions about space missions or collaborations? Reach out to us.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* Left Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4">
              <Mail className="w-6 h-6 text-indigo-400" />
              <span className="text-slate-300">contact@spacesite.com</span>
            </div>

            <div className="flex items-center gap-4">
              <Phone className="w-6 h-6 text-indigo-400" />
              <span className="text-slate-300">+1 234 567 890</span>
            </div>

            <div className="flex items-center gap-4">
              <MapPin className="w-6 h-6 text-indigo-400" />
              <span className="text-slate-300">Houston, Texas</span>
            </div>
          </motion.div>

          {/* Right Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-slate-900/70 backdrop-blur-lg p-10 rounded-2xl border border-slate-800 shadow-xl"
          >
            <form className="space-y-6">

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Message
                </label>
                <textarea
                  rows="4"
                  className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Write your message..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-500 hover:bg-indigo-600 transition py-3 rounded-lg font-semibold"
              >
                Send Message 🚀
              </button>

            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}