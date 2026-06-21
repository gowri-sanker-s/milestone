import React from "react";
import ContactForm from "@/components/pageComponents/contact-us/contact-form";
import { oleo, funnel } from "@/lib/fonts";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Twitter, 
  Instagram, 
  Facebook, 
  Globe 
} from "lucide-react";

export const metadata = {
  title: "Contact Us | Milestone Books",
  description:
    "Have questions about your order, need a book request, or want to get in touch? Reach out to the Milestone Books team today.",
};

export default function ContactPage() {
  return (
    <div className="bg-primary-bg min-h-screen text-primary-text py-12 md:py-20">
      <div className="wrapper max-w-6xl">
        
        {/* Header Section */}
        <div className="text-center space-y-4 mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full text-[13px] font-extrabold opacity-85 bg-primary-border/60 p-1.5 px-5 border border-primary-text/10">
            <span>Get In Touch</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
            We&apos;d Love to <span className={`${oleo.className} text-4xl md:text-6xl font-normal block md:inline mt-2 md:mt-0`}>Hear From You</span>
          </h1>
          <p className={`max-w-xl mx-auto text-base md:text-lg opacity-80 ${funnel.className}`}>
            Have a question about a book, a custom request, or just want to talk literature? Reach out and we will get back to you shortly.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-start">
          
          {/* Info Card Column */}
          <div className={`lg:col-span-5 space-y-8 ${funnel.className} animate-slide-in-left`}>
            <div className="bg-primary-border/30 border border-primary-border/40 p-8 rounded-3xl space-y-8 relative overflow-hidden">
              {/* Subtle background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-border/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-primary-text">Contact Info</h3>
                <p className="text-sm opacity-80 leading-relaxed">
                  Our team is dedicated to giving you the best bookstore experience. Feel free to use any of the channels below to reach us.
                </p>
              </div>

              {/* Contact Details List */}
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-primary-text text-primary-bg rounded-2xl shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase font-extrabold opacity-60 tracking-wider">Email Support</h4>
                    <p className="font-semibold text-base">hello@milestonebooks.com</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-primary-text text-primary-bg rounded-2xl shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase font-extrabold opacity-60 tracking-wider">Call Us</h4>
                    <p className="font-semibold text-base">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-primary-text text-primary-bg rounded-2xl shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase font-extrabold opacity-60 tracking-wider">Visit our Nook</h4>
                    <p className="font-semibold text-base leading-snug">
                      123 Literary Nook Way, <br />
                      Reading District, RD 56789
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-primary-text text-primary-bg rounded-2xl shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase font-extrabold opacity-60 tracking-wider">Support Hours</h4>
                    <p className="font-semibold text-base leading-snug">
                      Mon - Sat: 9:00 AM - 6:00 PM <br />
                      Sunday: Closed (Reading day!)
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-primary-border/60">
                <h4 className="text-xs uppercase font-extrabold opacity-60 tracking-wider mb-4">Connect with us</h4>
                <div className="flex gap-3">
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="p-3 bg-primary-border/60 hover:bg-primary-text hover:text-primary-bg rounded-xl transition-all duration-300 transform hover:-translate-y-1"
                    aria-label="Twitter"
                  >
                    <Twitter size={18} />
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="p-3 bg-primary-border/60 hover:bg-primary-text hover:text-primary-bg rounded-xl transition-all duration-300 transform hover:-translate-y-1"
                    aria-label="Instagram"
                  >
                    <Instagram size={18} />
                  </a>
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="p-3 bg-primary-border/60 hover:bg-primary-text hover:text-primary-bg rounded-xl transition-all duration-300 transform hover:-translate-y-1"
                    aria-label="Facebook"
                  >
                    <Facebook size={18} />
                  </a>
                  <a 
                    href="https://milestonebooks.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="p-3 bg-primary-border/60 hover:bg-primary-text hover:text-primary-bg rounded-xl transition-all duration-300 transform hover:-translate-y-1"
                    aria-label="Website"
                  >
                    <Globe size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7 animate-slide-in-right">
            <ContactForm />
          </div>

        </div>
      </div>
    </div>
  );
}
