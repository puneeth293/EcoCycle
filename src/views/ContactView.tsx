import React, { useState } from 'react';
import { 
  Send, 
  ChevronDown, 
  HelpCircle, 
  CheckCircle2, 
  MessageSquare
} from 'lucide-react';
import { ContactLocationDetailsCard } from '../components/ContactLocationDetailsCard';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Why is waste segregation necessary before pickup?',
      a: 'When wet organic waste gets mixed with paper or plastic, it causes severe contamination. Unsegregated recyclables cannot be processed by machinery and end up clogging landfills.'
    },
    {
      q: 'Which bin should I put milk pouches and plastic food wrappers in?',
      a: 'Clean plastic pouches and food wrappers belong in the Dry / Recyclable Waste (Blue Bin). Please rinse milk residue before tossing.'
    },
    {
      q: 'How does the doorstep pickup request work?',
      a: 'After you submit a request on the Pickup page, our logistics system routes the request to your nearest authorized collection vehicle. You will receive an SMS with your driver contact and ETA.'
    },
    {
      q: 'Where do I dispose of old smartphones, chargers, and laptop batteries?',
      a: 'E-waste should NEVER be thrown in general garbage bins as heavy metals leach into groundwater. Use our Yellow Bin E-Waste pickup option or visit a local certified collection center.'
    },
    {
      q: 'How do Eco Points work and how can I redeem them?',
      a: 'You earn points for uploading waste verification photos (+25 to +60 pts), logging segregated items (+15 pts), and booking pickup requests (+30 pts). Points can be redeemed for electricity bill discounts (₹0.50/pt) on the Electricity Bill page.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSentSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }
  };

  return (
    <div className="py-12 relative z-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 text-emerald-800 border border-white/80 text-xs font-black uppercase tracking-wider shadow-xs backdrop-blur-md">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Get in Touch & Help Center</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-3 font-sans tracking-tight drop-shadow-md">
            Contact EcoCycle Support
          </h1>
          <p className="text-base font-semibold text-emerald-50/90 mt-2 drop-shadow-xs">
            Have questions about collection schedules, corporate bulk waste handling, or partnership opportunities? Reach out to our team.
          </p>
        </div>

        {/* Contact Info + Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Info Column with Interactive Video Background */}
          <div className="lg:col-span-6 space-y-6">
            <ContactLocationDetailsCard className="h-full" />
          </div>

          {/* Form Column */}
          <div className="lg:col-span-6">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl">
              
              <h2 className="text-xl font-black text-[#063B32] mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <span>Send Us a Message</span>
              </h2>

              {sentSuccess ? (
                <div className="glass-subcard p-6 rounded-2xl border border-emerald-300 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="text-lg font-black text-[#063B32]">Message Delivered!</h3>
                  <p className="text-xs text-[#365A52] font-semibold">
                    Thank you for contacting EcoCycle. An environmental support representative will respond within 24 hours.
                  </p>
                  <button
                    onClick={() => setSentSuccess(false)}
                    className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-[#063B32] mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Verma"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-[#063B32] text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-[#063B32] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. rahul@gmail.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-[#063B32] text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#063B32] mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Bulk Society Recycling Query"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-[#063B32] text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#063B32] mb-1">
                      Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your inquiry..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-[#063B32] text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 shadow-emerald-600/25"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

        {/* FAQ Accordion Section */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-2xl max-w-4xl mx-auto">
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-[#063B32] flex items-center justify-center gap-2">
              <HelpCircle className="w-6 h-6 text-emerald-600" />
              <span>Frequently Asked Questions (FAQ)</span>
            </h2>
            <p className="text-xs text-[#365A52] font-semibold mt-1">
              Quick answers regarding bin colors, pickup schedules, and eco points.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="glass-subcard rounded-2xl border border-emerald-100 overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-black text-xs sm:text-sm text-[#063B32] flex items-center justify-between gap-3"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-emerald-600 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-xs font-semibold text-[#365A52] leading-relaxed border-t border-emerald-100/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
