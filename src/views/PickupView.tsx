import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WasteCategoryType, PickupRequest } from '../types';
import { 
  Truck, 
  User, 
  Package, 
  CheckCircle2, 
  Search
} from 'lucide-react';

export const PickupView: React.FC = () => {
  const { user, pickupRequests, addPickupRequest } = useApp();

  // Form states
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState('102 Green Enclave, M.G. Road');
  const [city, setCity] = useState('Tumkur');
  const [wasteType, setWasteType] = useState<WasteCategoryType | 'Other'>('Recyclable Waste');
  const [quantity, setQuantity] = useState('15 kg');
  const [preferredDate, setPreferredDate] = useState('2026-08-12');
  const [preferredTime, setPreferredTime] = useState('10:00 AM - 01:00 PM');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<PickupRequest | null>(null);

  // Status search modal/tracker
  const [searchTrackerId, setSearchTrackerId] = useState('');
  const [trackedRecord, setTrackedRecord] = useState<PickupRequest | null>(null);
  const [trackerError, setTrackerError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !address || !city) return;

    setSubmitting(true);

    const record = await addPickupRequest({
      userName: fullName,
      userEmail: email,
      userPhone: phone,
      address,
      city,
      wasteType,
      quantity,
      preferredDate,
      preferredTime,
      notes
    });

    setSubmitting(false);
    setSubmittedRecord(record);
  };

  const handleTrackRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const idToSearch = searchTrackerId.trim().toUpperCase();
    const found = pickupRequests.find((p) => p.id.toUpperCase() === idToSearch);
    if (found) {
      setTrackedRecord(found);
      setTrackerError(false);
    } else {
      setTrackedRecord(null);
      setTrackerError(true);
    }
  };

  const statusSteps = ['Pending', 'Confirmed', 'Assigned', 'Collected', 'Completed'];

  return (
    <div className="py-12 relative z-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 text-emerald-800 border border-white/80 text-xs font-black uppercase tracking-wider shadow-xs backdrop-blur-md">
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>Doorstep Waste Collection Logistics</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-3 font-sans tracking-tight drop-shadow-md">
            Schedule Online Waste Pickup
          </h1>
          <p className="text-base font-semibold text-emerald-50/90 mt-2 max-w-2xl mx-auto leading-relaxed drop-shadow-xs">
            Request authorized municipal or EcoCycle collection trucks right to your doorstep. Earn <strong className="text-white underline decoration-emerald-400 font-black">+30 Eco Points</strong> per completed pickup!
          </p>
        </div>

        {/* Top Tracker Bar (White Glass) */}
        <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-2xl mb-12 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-[#063B32] flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-600" />
                <span>Track Existing Request Status</span>
              </h3>
              <p className="text-xs text-[#365A52] font-semibold mt-0.5">Enter your Request ID (e.g. EC-2026-00125)</p>
            </div>

            <form onSubmit={handleTrackRequest} className="flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="EC-2026-XXXXX"
                value={searchTrackerId}
                onChange={(e) => setSearchTrackerId(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-[#063B32] placeholder-[#365A52]/60 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shrink-0 transition-colors shadow-md"
              >
                Track Request
              </button>
            </form>
          </div>

          {/* Tracked Record Result Modal / Card */}
          {trackedRecord && (
            <div className="mt-6 pt-6 border-t border-emerald-100 animate-in fade-in">
              <div className="glass-subcard p-5 rounded-2xl border border-emerald-200 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-amber-600 text-sm">{trackedRecord.id}</span>
                  <span className="px-3 py-1 rounded-full font-black text-xs bg-emerald-100 text-emerald-800">
                    Status: {trackedRecord.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-[#063B32]">
                  <div>
                    <span className="text-[#365A52] block font-semibold">User:</span>
                    <span className="font-bold">{trackedRecord.userName}</span>
                  </div>
                  <div>
                    <span className="text-[#365A52] block font-semibold">Waste Type:</span>
                    <span className="font-bold">{trackedRecord.wasteType}</span>
                  </div>
                  <div>
                    <span className="text-[#365A52] block font-semibold">Quantity:</span>
                    <span className="font-bold">{trackedRecord.quantity}</span>
                  </div>
                  <div>
                    <span className="text-[#365A52] block font-semibold">Date Slot:</span>
                    <span className="font-bold">{trackedRecord.preferredDate}</span>
                  </div>
                </div>

                {/* Status Progress Bar */}
                <div className="pt-2">
                  <div className="flex justify-between text-[11px] font-bold text-[#365A52] mb-2">
                    {statusSteps.map((step) => {
                      const isPassed = statusSteps.indexOf(trackedRecord.status) >= statusSteps.indexOf(step);
                      return (
                        <span key={step} className={isPassed ? 'text-emerald-700 font-black' : 'opacity-40'}>
                          {step}
                        </span>
                      );
                    })}
                  </div>
                  <div className="w-full bg-emerald-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full transition-all duration-500"
                      style={{
                        width: `${((statusSteps.indexOf(trackedRecord.status) + 1) / statusSteps.length) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {trackerError && (
            <p className="text-xs text-rose-600 font-bold mt-3">
              ⚠️ Request ID not found. Please verify the ID or check your user dashboard list.
            </p>
          )}
        </div>

        {/* Confirmation Card after Submission */}
        {submittedRecord ? (
          <div className="glass-panel rounded-3xl p-8 shadow-2xl max-w-2xl mx-auto text-center space-y-6 animate-in zoom-in-95 duration-300 border-2 border-emerald-400">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border-2 border-emerald-500 shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Request Confirmation
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#063B32] mt-2">
                Your waste pickup request has been submitted successfully!
              </h2>
              <p className="text-xs font-semibold text-[#365A52] mt-1">
                An agent will verify your pickup details and send SMS confirmation.
              </p>
            </div>

            <div className="glass-subcard p-5 rounded-2xl border border-emerald-100 text-left space-y-3 font-mono text-xs text-[#063B32]">
              <div className="flex justify-between items-center border-b pb-2 border-emerald-100">
                <span className="text-[#365A52] font-sans">Unique Request ID:</span>
                <span className="font-bold text-amber-700 text-base">{submittedRecord.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#365A52] font-sans">Waste Category:</span>
                <span className="font-bold">{submittedRecord.wasteType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#365A52] font-sans">Quantity:</span>
                <span className="font-bold">{submittedRecord.quantity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#365A52] font-sans">Preferred Date & Time:</span>
                <span className="font-bold">{submittedRecord.preferredDate} ({submittedRecord.preferredTime})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#365A52] font-sans">Status:</span>
                <span className="font-bold text-emerald-700">{submittedRecord.status}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSubmittedRecord(null)}
                className="flex-1 py-3 rounded-2xl bg-[#063B32] text-white font-bold text-xs hover:bg-[#063B32]/90 transition-colors"
              >
                Book Another Request
              </button>
              <button
                onClick={() => setTrackedRecord(submittedRecord)}
                className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md"
              >
                View Live Progress
              </button>
            </div>
          </div>
        ) : (
          /* Pickup Booking Form (White Glass) */
          <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-2xl max-w-4xl mx-auto">
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="border-b border-emerald-100 pb-4">
                <h3 className="text-lg font-black text-[#063B32] flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-600" />
                  <span>Contact & Location Details</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#063B32] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Puneeth"
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
                    placeholder="e.g. user@ecocycle.org"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-[#063B32] text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#063B32] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-[#063B32] text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#063B32] mb-1">
                    City / Location *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-[#063B32] text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Tumkur">Tumkur</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Mysuru">Mysuru</option>
                    <option value="Hubballi">Hubballi</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-[#063B32] mb-1">
                    Complete Street Address & Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House/Apartment #, Street, Landmark"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-[#063B32] text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="border-b border-emerald-100 pb-4 pt-2">
                <h3 className="text-lg font-black text-[#063B32] flex items-center gap-2">
                  <Package className="w-5 h-5 text-emerald-600" />
                  <span>Waste Specification & Schedule Slot</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#063B32] mb-1">
                    Waste Category *
                  </label>
                  <select
                    value={wasteType}
                    onChange={(e) => setWasteType(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-[#063B32] text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Wet Waste">Wet Waste (Food Scraps / Organic)</option>
                    <option value="Dry Waste">Dry Waste (Paper / Cardboard)</option>
                    <option value="Recyclable Waste">Recyclable Waste (Plastics / Glass / Metal)</option>
                    <option value="E-Waste">E-Waste (Electronics / Chargers)</option>
                    <option value="Hazardous Waste">Hazardous Waste (Batteries / Medicines)</option>
                    <option value="Other">Other Mixed Household Waste</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#063B32] mb-1">
                    Estimated Quantity *
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-[#063B32] text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="5-10 kg">Small (5 - 10 kg / 1 bag)</option>
                    <option value="15 kg">Medium (15 - 25 kg / 2-3 bags)</option>
                    <option value="30-50 kg">Large (30 - 50 kg / Bulk cardboard)</option>
                    <option value="100+ kg">Commercial / Society Bulk (100+ kg)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#063B32] mb-1">
                    Preferred Pickup Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-[#063B32] text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#063B32] mb-1">
                    Preferred Time Slot *
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-[#063B32] text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="08:00 AM - 11:00 AM">Morning (08:00 AM - 11:00 AM)</option>
                    <option value="10:00 AM - 01:00 PM">Mid-Day (10:00 AM - 01:00 PM)</option>
                    <option value="02:00 PM - 05:00 PM">Afternoon (02:00 PM - 05:00 PM)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-[#063B32] mb-1">
                    Additional Instructions or Access Notes
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g., Gate code, items kept near garage, special handling requested..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-[#063B32] text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  ></textarea>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 shadow-emerald-600/25"
                >
                  {submitting ? (
                    <span>Submitting Request...</span>
                  ) : (
                    <>
                      <Truck className="w-5 h-5" />
                      <span>Request Waste Pickup (+30 Eco Points)</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        )}

      </div>
    </div>
  );
};
