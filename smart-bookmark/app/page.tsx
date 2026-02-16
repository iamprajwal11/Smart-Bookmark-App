"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, Star, Shield, Zap, Layout, Globe, 
  Mail, Phone, Facebook, Instagram, Linkedin, MapPin, 
  Twitter, Github, ExternalLink 
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans scroll-smooth">
      {/* --- Navigation Bar --- */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                SB
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                SmartBookmark
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="#" className="text-gray-600 hover:text-blue-600 transition">Home</Link>
              <Link href="#features" className="text-gray-600 hover:text-blue-600 transition">Features</Link>
              <Link href="#testimonials" className="text-gray-600 hover:text-blue-600 transition">Testimonials</Link>
              {/* Clicking this scrolls to footer */}
              <Link href="#contact" className="text-gray-600 hover:text-blue-600 transition">Contact Us</Link>
            </div>
            <button
              onClick={handleLogin}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition shadow-lg shadow-blue-600/20"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
            Organize your web, <br />
            <span className="text-blue-600">Supercharge your productivity.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            The minimal, real-time bookmark manager designed for modern teams and individuals. Access your links anywhere, instantly.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleLogin}
              className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition shadow-xl"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 rounded-full text-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition">
              View Demo
            </button>
          </div>
          
          <div className="mt-16 rounded-xl border-8 border-gray-900/5 shadow-2xl overflow-hidden max-w-5xl mx-auto bg-white">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426" 
                alt="Dashboard Preview" 
                className="w-full h-auto object-cover"
              />
          </div>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why choose SmartBookmark?</h2>
            <p className="mt-4 text-gray-500">Everything you need to manage your digital footprint.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: Zap, title: "Real-time Sync", desc: "Changes reflect instantly across all your devices and tabs." },
              { icon: Shield, title: "Private & Secure", desc: "Your data is encrypted and only accessible by you via Google Auth." },
              { icon: Layout, title: "Clean Interface", desc: "A distraction-free dashboard designed for focus and speed." },
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition duration-300">
                <feature.icon className="w-12 h-12 text-blue-600 mb-6" />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Testimonials Section --- */}
      <section id="testimonials" className="py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">Loved by developers</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
                { name: "Alex Johnson", role: "Software Engineer", img: "https://i.pravatar.cc/150?u=1" },
                { name: "Sarah Chen", role: "UI Designer", img: "https://i.pravatar.cc/150?u=2" },
                { name: "Mike Ross", role: "Researcher", img: "https://i.pravatar.cc/150?u=3" }
            ].map((user, i) => (
              <div key={i} className="bg-blue-800/50 p-6 rounded-xl border border-blue-700 backdrop-blur-sm">
                <div className="flex gap-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="mb-6 text-blue-100">"This app completely changed how I organize my research. The real-time updates are magic!"</p>
                <div className="flex items-center gap-3">
                  <img src={user.img} alt={user.name} className="w-10 h-10 rounded-full border-2 border-blue-400" />
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-blue-300">{user.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Footer / Contact Section --- */}
      <footer id="contact" className="bg-gray-900 text-gray-300 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            {/* Column 1: Brand */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">SB</div>
                <span className="text-xl font-bold text-white">SmartBookmark</span>
              </div>
              <p className="text-sm leading-relaxed text-gray-400">
                Organize your digital life with the world's most intuitive bookmarking tool. Built for speed, security, and seamless collaboration.
              </p>
              <div className="flex gap-4">
                <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition"><Facebook size={18} /></a>
                <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition"><Instagram size={18} /></a>
                <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition"><Twitter size={18} /></a>
                <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition"><Linkedin size={18} /></a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Product</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#features" className="hover:text-blue-500 transition">Browser Extension</a></li>
                <li><a href="#" className="hover:text-blue-500 transition">Mobile App</a></li>
                <li><a href="#" className="hover:text-blue-500 transition">Pricing Plans</a></li>
                <li><a href="#" className="hover:text-blue-500 transition">Release Notes</a></li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Support</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-blue-500 transition">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-500 transition">API Documentation</a></li>
                <li><a href="#" className="hover:text-blue-500 transition">Community Forum</a></li>
                <li><a href="#" className="hover:text-blue-500 transition">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Column 4: Contact Details */}
            <div className="space-y-4">
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Get in Touch</h4>
              <div className="flex items-start gap-3 text-sm">
                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                <a href="mailto:prajwallute11@gmail.com" className="hover:text-white transition">prajwallute11@gmail.com</a>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-gray-400">Nagpur, Maharashtra, India</span>
              </div>
              <div className="pt-4">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://smartbookmark.com" 
                  alt="QR Code" 
                  className="rounded bg-white p-1 opacity-80"
                />
              </div>
            </div>

          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <p>© 2026 SmartBookmark Inc. Designed by Prajwal Lute. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-gray-300">Terms of Service</a>
              <a href="#" className="hover:text-gray-300">Cookie Policy</a>
              <div className="flex items-center gap-1">
                <Globe size={14} />
                <span>Global (English)</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}