"use client";

import * as React from "react";
import { MessageCircle, X, ChevronLeft, Smile, Send } from "lucide-react";

type WidgetMessage = {
  id: string;
  role: "user" | "bot";
  text: string;
  time: string;
};

// ── Knowledge base: scored-match rules ──
// Each entry has keywords (any-match), phrases (bonus for multi-word hits),
// and a priority so the best match wins.

type KBEntry = {
  keywords: string[];
  phrases?: string[];
  answer: string;
  priority?: number;
};

const KNOWLEDGE_BASE: KBEntry[] = [
  // ── Greetings ──
  {
    keywords: ["hello", "hi", "hey", "howdy", "good morning", "good afternoon"],
    answer:
      "Hi there! 👋 Welcome to Sunset Ridge. I can answer questions about your application, our property, floor plans, fees, pet policy, and more. How can I help?",
  },
  {
    keywords: ["help", "what can you"],
    answer:
      "I can help with:\n• Your application status & next steps\n• Floor plans, pricing & availability\n• Pet policy & fees\n• Parking & storage\n• Move-in costs & lease terms\n• Community amenities\n• Maintenance requests\n• Office hours & contact info\n\nJust ask away!",
  },

  // ── This specific application ──
  {
    keywords: ["my application", "application status", "where is my application", "check my application", "19419334"],
    phrases: ["application status", "my application"],
    answer:
      "Your application #19419334 is currently in **Started** status, which means it's been created but hasn't been fully submitted yet.\n\nTo complete it you'll need to:\n1. Verify your personal information is correct\n2. Provide income/employment documentation\n3. Authorize the background & credit check\n4. Pay the application fee ($50 per applicant)\n5. Click Submit\n\nWould you like help with any of those steps?",
    priority: 10,
  },
  {
    keywords: ["theodore", "erickson", "applicant"],
    answer:
      "The primary applicant on this application is Theodore Isaac Erickson. His contact info on file:\n• Email: Theoerickson7@gmail.com\n• Phone: (703) 896-2176 (Mobile)\n• DOB: 04/17/2007\n\nIf any of this info is incorrect, it can be updated in the Basic Information section before the application is submitted.",
    priority: 8,
  },
  {
    keywords: ["submit", "finish", "complete", "next step", "what do i need"],
    phrases: ["next step", "how do i submit", "what do i need"],
    answer:
      "To submit this application, make sure the following are complete:\n\n✅ Personal info (name, DOB, SSN, contact)\n✅ Current & previous address history\n✅ Employment & income verification\n✅ Vehicle information (if applicable)\n✅ Emergency contacts\n✅ Answer the General Questions section\n✅ Review & sign the Policy Documents\n✅ Pay the $50 application fee\n\nOnce everything's filled in, the Submit button will become active at the bottom of the page.",
    priority: 9,
  },

  // ── Property: Meridian on College Avenue / Sunset Ridge ──
  {
    keywords: ["property", "meridian", "college avenue", "community", "sunset ridge", "about"],
    phrases: ["about the property", "tell me about"],
    answer:
      "Meridian on College Avenue (managed by Sunset Ridge) is a modern apartment community offering studio, 1-bed, 2-bed, and 3-bed floor plans. Highlights include:\n\n🏊 Resort-style pool & hot tub\n💪 24-hour fitness center\n🐕 Dog park & pet spa\n📦 Package lockers\n👔 Business center & co-working lounge\n🚗 Covered & garage parking available\n\nWe're located just minutes from downtown with easy access to I-25 and public transit.",
  },

  // ── Floor plans & pricing ──
  {
    keywords: ["floor plan", "unit", "layout", "bedroom", "bed", "2 bed", "triple", "square feet", "sqft"],
    phrases: ["floor plan", "2 bed"],
    answer:
      "This application is for the **2 Bed - A - Triple** floor plan. Here's a quick overview of our 2-bedroom options:\n\n• 2 Bed A (Triple) — 1,050 sq ft — from $1,850/mo\n• 2 Bed B — 980 sq ft — from $1,750/mo\n• 2 Bed C (Corner) — 1,120 sq ft — from $1,950/mo\n\nAll 2-beds include in-unit washer/dryer, quartz countertops, and a balcony or patio. Would you like to see other floor plan options?",
    priority: 7,
  },
  {
    keywords: ["studio"],
    answer:
      "Our studio floor plans range from 450–525 sq ft, starting at $1,200/mo. They feature an open-concept layout with full kitchen, in-unit washer/dryer, and large windows. Great for singles or couples looking for an efficient space!",
  },
  {
    keywords: ["1 bed", "one bed", "1 bedroom", "one bedroom"],
    answer:
      "Our 1-bedroom floor plans range from 680–750 sq ft, starting at $1,450/mo. Options include:\n\n• 1 Bed A — 680 sq ft — from $1,450/mo\n• 1 Bed B (Den) — 750 sq ft — from $1,550/mo\n\nBoth include in-unit W/D, walk-in closet, and balcony.",
  },
  {
    keywords: ["3 bed", "three bed", "3 bedroom", "three bedroom"],
    answer:
      "Our 3-bedroom floor plans are 1,300–1,450 sq ft, starting at $2,350/mo. They include 2 full bathrooms, in-unit W/D, walk-in closets in every bedroom, and a large open living area. Perfect for families or roommates!",
  },
  {
    keywords: ["price", "pricing", "cost", "how much", "rent", "monthly"],
    phrases: ["how much", "what does it cost"],
    answer:
      "Here's our current pricing overview:\n\n• Studio — from $1,200/mo\n• 1 Bed — from $1,450/mo\n• 2 Bed — from $1,750/mo\n• 3 Bed — from $2,350/mo\n\nThe applied rent on this application is currently showing $0.00, which means pricing hasn't been locked in yet. Final rent will be confirmed once the application is approved and a lease is generated.\n\nRent can vary by floor, view, and move-in date.",
    priority: 6,
  },

  // ── Move-in ──
  {
    keywords: ["move in", "move-in", "movein", "when can i move", "target date"],
    phrases: ["move-in date", "move in date", "when can i move"],
    answer:
      "The requested move-in date on this application is **11/17/2026**.\n\nTypical move-in costs include:\n• First month's rent\n• Security deposit (usually equal to one month's rent)\n• Application fee ($50, non-refundable)\n• Admin fee ($150, one-time)\n• Pet deposit ($300 per pet, if applicable)\n\nThe exact move-in cost sheet will be provided once the application is approved.",
    priority: 7,
  },

  // ── Lease terms ──
  {
    keywords: ["lease", "term", "length", "duration", "month to month", "renew"],
    phrases: ["lease term", "lease length", "month to month"],
    answer:
      "We offer flexible lease terms:\n\n• 12-month lease — best rate\n• 9-month lease — slight premium\n• 6-month lease — short-term premium\n• Month-to-month — available after initial lease, +$200/mo premium\n\nThis application doesn't have a lease length specified yet. The leasing team will discuss options once the application is approved.",
  },

  // ── Application fee & screening ──
  {
    keywords: ["fee", "application fee", "screening", "background", "credit check", "credit score"],
    phrases: ["application fee", "credit check", "background check"],
    answer:
      "The application fee is **$50 per applicant** (non-refundable). This covers:\n\n• Credit check\n• Criminal background screening\n• Eviction history search\n• Employment/income verification\n\nWe look at the full picture — there's no hard credit score cutoff. Generally, we look for:\n• No recent evictions\n• Verifiable income of 2.5x the monthly rent\n• No serious criminal history\n\nResults typically come back within 24–48 hours.",
    priority: 6,
  },

  // ── Income requirements ──
  {
    keywords: ["income", "salary", "employment", "pay stub", "how much do i need to make", "qualify"],
    phrases: ["income requirement", "how much do i need"],
    answer:
      "To qualify, the combined household income should be at least **2.5x the monthly rent**. For example:\n\n• $1,750/mo rent → $4,375/mo gross income\n• $1,850/mo rent → $4,625/mo gross income\n\nAcceptable income documentation includes:\n• 2 most recent pay stubs\n• Employment offer letter\n• Tax returns (self-employed)\n• Bank statements (3 months)\n• Social Security/disability award letter\n\nThis application currently shows $0.00 income — that will need to be updated before submission.",
    priority: 7,
  },

  // ── Pets ──
  {
    keywords: ["pet", "dog", "cat", "animal", "pet policy", "breed"],
    phrases: ["pet policy", "pet fee", "breed restriction"],
    answer:
      "Great news — Sunset Ridge is pet-friendly! 🐾\n\n• Up to 2 pets per apartment\n• Dogs & cats welcome\n• $300 refundable pet deposit per pet\n• $35/mo pet rent per pet\n• Weight limit: 75 lbs per dog\n\n**Breed restrictions:** Pit Bulls, Rottweilers, Dobermans, German Shepherds, Chow Chows, Akitas, and wolf hybrids are not permitted.\n\nService animals and emotional support animals are exempt from pet fees — just provide documentation from your provider.",
  },

  // ── Parking ──
  {
    keywords: ["parking", "garage", "car", "vehicle"],
    answer:
      "Parking options at Sunset Ridge:\n\n• Open lot — 1 free space per unit, additional at $50/mo\n• Covered — $75/mo\n• Garage (attached) — $125/mo\n• EV charging stations available (first come, first served)\n\nGuest parking is available on a first-come, first-served basis near the leasing office. You'll be able to add parking preferences during lease signing.",
  },

  // ── Utilities ──
  {
    keywords: ["utilities", "electric", "water", "gas", "internet", "wifi", "trash"],
    phrases: ["what's included", "what is included"],
    answer:
      "Here's how utilities work at Sunset Ridge:\n\n**Included in rent:**\n• Trash & recycling\n• Sewer\n• Common area WiFi (pool, lounge, business center)\n\n**Resident responsibility:**\n• Electric (avg. $60–90/mo for a 2-bed)\n• Gas (heating, avg. $30–50/mo)\n• Water (billed via RUBS, avg. $40–60/mo)\n• Internet/Cable — Xfinity & Google Fiber available\n\nAll units are individually metered for electric & gas.",
  },

  // ── Amenities ──
  {
    keywords: ["amenities", "pool", "gym", "fitness", "clubhouse", "lounge"],
    answer:
      "Sunset Ridge community amenities include:\n\n🏊 Resort-style pool with sun deck & cabanas\n♨️ Year-round hot tub\n💪 24-hour fitness center with Pelotons & free weights\n🐕 Off-leash dog park with agility equipment\n🐾 Pet spa & grooming station\n📦 24/7 package lockers (Amazon Hub)\n👔 Business center with private offices & conference room\n🎮 Resident lounge with gaming & coffee bar\n🔥 Outdoor grilling stations & fire pits\n🚲 Bike storage & repair station\n\nAll amenities are included with your lease — no extra fees!",
  },

  // ── Maintenance ──
  {
    keywords: ["maintenance", "repair", "fix", "broken", "work order"],
    phrases: ["maintenance request", "work order", "something is broken"],
    answer:
      "For maintenance requests:\n\n• **Emergency** (flood, fire, no heat, lock-out): Call (814) 636-8512 — 24/7 on-call maintenance\n• **Standard requests**: Submit through the Resident Portal or call the office during business hours\n• Typical response time: within 24–48 hours for non-emergencies\n\nSince your application is still in progress, maintenance services will be available once you've moved in and have Resident Portal access.",
  },

  // ── Office & contact ──
  {
    keywords: ["office", "hours", "contact", "phone", "email", "leasing", "tour", "visit"],
    phrases: ["office hours", "schedule a tour"],
    answer:
      "Sunset Ridge Leasing Office:\n\n📍 Meridian on College Avenue\n📞 (814) 636-8512\n📧 leasing@sunsetridge.com\n\n**Office Hours:**\n• Mon–Fri: 9:00 AM – 6:00 PM\n• Saturday: 10:00 AM – 5:00 PM\n• Sunday: 12:00 PM – 5:00 PM\n\nWe'd love to show you around! Self-guided tours are available anytime during office hours, or you can schedule a private tour with a leasing consultant.",
  },

  // ── Roommates / co-applicants ──
  {
    keywords: ["roommate", "co-applicant", "coapplicant", "add someone", "guarantor", "cosigner"],
    phrases: ["add a roommate", "co-applicant", "guarantor"],
    answer:
      "To add a co-applicant or roommate:\n\n1. Each person over 18 must submit their own application\n2. Each pays the $50 application fee\n3. All applicants are screened individually\n4. All approved adults are named on the lease\n\n**Guarantors/Cosigners:** If an applicant doesn't meet the income requirement on their own, a guarantor can be added. The guarantor must earn 5x the monthly rent and submit a separate application.\n\nCurrently this application lists Theodore Erickson as the sole Primary applicant.",
  },

  // ── SSN & privacy ──
  {
    keywords: ["ssn", "social security", "privacy", "secure", "data", "safe"],
    phrases: ["is my data safe", "social security"],
    answer:
      "Your information is securely handled:\n\n🔒 SSNs are encrypted and masked (yours shows as *****2434)\n🔒 All data transmitted via 256-bit SSL encryption\n🔒 We never share personal info with third parties beyond screening providers\n🔒 Background checks are conducted by TransUnion, a trusted FCRA-compliant agency\n\nOnly authorized leasing staff can access your full application details.",
  },

  // ── Building & unit assignment ──
  {
    keywords: ["building", "which building", "unit number", "assigned"],
    answer:
      "Your application doesn't have a specific building or unit assigned yet — that's normal at the \"Started\" stage. A unit is typically assigned after:\n\n1. Application is submitted & approved\n2. You select your preferred available unit\n3. A lease is generated with the specific unit number\n\nYou've indicated the 2 Bed - A - Triple floor plan. Once approved, the leasing team will show you which specific units in that layout are available for your 11/17/2026 move-in date.",
  },

  // ── How did you hear about us ──
  {
    keywords: ["property website", "how did you hear", "referral", "found"],
    answer:
      "This application indicates the applicant found us through the **Property Website**. If that's not correct, it can be updated in the Applicant Preferences section. We also accept referrals — if a current resident referred you, let us know! Referrers may be eligible for a rent credit.",
  },

  // ── Address history ──
  {
    keywords: ["address", "previous address", "rental history", "lived", "residence"],
    phrases: ["address history", "previous address", "rental history"],
    answer:
      "The Address Information section tracks your current and permanent addresses. For a complete application, we typically need:\n\n• Current address with dates\n• At least 2 years of address history\n• Landlord/manager name and phone for rental references\n• Reason for leaving each prior residence\n• Monthly payment amount\n\nThis application's address fields are currently incomplete — make sure to fill in both Current Address and Permanent Address before submitting.",
  },

  // ── Vehicle info ──
  {
    keywords: ["vehicle", "car info", "license plate", "registration"],
    answer:
      "The Vehicle Information section is used for parking management and registration. You'll want to provide:\n\n• Year, make, model, and color\n• License plate number and state\n• Number of vehicles\n\nThis is optional but recommended — it helps us assign parking and identify your vehicles on property. You can update vehicle info anytime after move-in through the Resident Portal.",
  },

  // ── Contacts / emergency ──
  {
    keywords: ["emergency contact", "contact info", "references"],
    answer:
      "The Contacts section is for emergency contacts and personal references. We recommend providing:\n\n• At least 1 emergency contact (name, phone, relationship)\n• Emergency contacts should be someone NOT living with you\n\nThis is important for safety — if there's ever an emergency and we can't reach you, we'll contact the person listed here.",
  },

  // ── General questions section ──
  {
    keywords: ["general question", "questionnaire", "additional question"],
    answer:
      "The General Questions section includes standard screening questions such as:\n\n• Have you ever been evicted?\n• Have you ever been convicted of a felony?\n• Have you ever broken a lease?\n• Do you have pets?\n• Do you smoke?\n\nAnswer honestly — providing false information can result in application denial or lease termination. These questions help us process your application fairly and in compliance with fair housing laws.",
  },

  // ── Policy documents ──
  {
    keywords: ["policy", "documents", "sign", "signature", "terms", "agreement"],
    phrases: ["policy documents"],
    answer:
      "Before submitting, you'll need to review and sign several policy documents:\n\n📄 Application Terms & Conditions\n📄 Fair Housing Disclosure\n📄 Privacy Policy & Data Consent\n📄 Background Check Authorization\n📄 Community Rules & Regulations acknowledgment\n\nThese are available in the Policy Documents section (last item in the sidebar). Electronic signatures are accepted — just click to sign each document.",
  },

  // ── Timeline / how long ──
  {
    keywords: ["how long", "timeline", "when will i hear", "turnaround", "wait"],
    phrases: ["how long does it take", "when will i hear back"],
    answer:
      "Here's the typical application timeline:\n\n📋 Submit application — same day\n🔍 Screening & background check — 24–48 hours\n✅ Approval notification — within 48 hours of submission\n📝 Lease signing — within 3 days of approval\n🔑 Move-in — on your requested date (11/17/2026)\n\nYou'll receive email and text updates at each step. If additional documentation is needed, the leasing team will reach out to Theoerickson7@gmail.com or (703) 896-2176.",
    priority: 6,
  },

  // ── Denial / rejected ──
  {
    keywords: ["denied", "rejected", "not approved", "appeal", "adverse"],
    phrases: ["what if i'm denied", "what happens if"],
    answer:
      "If an application is denied, you'll receive:\n\n• A written adverse action notice (required by law)\n• The specific reason(s) for denial\n• Contact info for the screening agency to dispute errors\n\nCommon denial reasons include insufficient income, poor credit/eviction history, or incomplete information. If denied, the application fee is non-refundable, but you may:\n\n• Provide additional documentation\n• Add a qualified guarantor/cosigner\n• Appeal within 14 days with new information",
  },

  // ── Catch-all ──
  {
    keywords: [],
    answer:
      "I appreciate the question! I'm best at answering questions about:\n\n• This application & its status\n• Sunset Ridge property info & amenities\n• Floor plans, pricing & availability\n• Move-in costs, fees & lease terms\n• Pet, parking & utility policies\n• Application requirements & next steps\n\nCould you rephrase, or would you like me to connect you with our leasing office at (814) 636-8512?",
  },
];

function getBotReply(input: string): string {
  const lower = input.toLowerCase();

  let bestScore = 0;
  let bestAnswer = KNOWLEDGE_BASE[KNOWLEDGE_BASE.length - 1].answer;

  for (const entry of KNOWLEDGE_BASE) {
    if (entry.keywords.length === 0) continue;

    let score = 0;

    for (const kw of entry.keywords) {
      if (lower.includes(kw)) {
        score += kw.split(" ").length;
      }
    }

    if (entry.phrases) {
      for (const phrase of entry.phrases) {
        if (lower.includes(phrase)) {
          score += phrase.split(" ").length * 2;
        }
      }
    }

    if (score > 0 && entry.priority) {
      score += entry.priority;
    }

    if (score > bestScore) {
      bestScore = score;
      bestAnswer = entry.answer;
    }
  }

  return bestAnswer;
}

function formatTime(): string {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function ChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<WidgetMessage[]>([]);
  const [draft, setDraft] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  React.useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;

    const userMsg: WidgetMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
      time: formatTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setDraft("");
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: WidgetMessage = {
        id: `b-${Date.now()}`,
        role: "bot",
        text: getBotReply(text),
        time: formatTime(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* ── Floating "Chat with us" pill button ── */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2.5 rounded-full bg-[#F5A623] px-5 py-3 text-white font-semibold text-sm shadow-lg transition-all hover:bg-[#E6961E] hover:shadow-xl hover:scale-105 active:scale-100"
          aria-label="Open chat"
        >
          <MessageCircle className="h-5 w-5 fill-white" />
          Chat with us
        </button>
      )}

      {/* ── Chat panel ── */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-[9999] flex flex-col w-[380px] h-[540px] rounded-2xl bg-white overflow-hidden"
          style={{
            boxShadow:
              "0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.08)",
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-3.5">
            <button
              onClick={() => setOpen(false)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              aria-label="Go back"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                Sunset Ridge
              </p>
              <p className="text-xs text-gray-500">
                Typically replies in a few minutes
              </p>
            </div>
          </div>

          {/* Message area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto bg-white px-4 py-4"
          >
            {messages.length === 0 && !isTyping && (
              <div className="flex h-full flex-col items-center justify-center text-center px-6">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F5A623]/10">
                  <MessageCircle className="h-7 w-7 text-[#F5A623]" />
                </div>
                <p className="text-sm font-medium text-gray-900">
                  Welcome to Sunset Ridge
                </p>
                <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                  Ask us anything about the application — we&apos;re here to
                  help!
                </p>
              </div>
            )}

            <div className="space-y-3">
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex flex-col gap-1",
                      isUser ? "items-end" : "items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                        isUser
                          ? "bg-[#F5A623] text-white rounded-br-md"
                          : "bg-gray-100 text-gray-900 rounded-bl-md"
                      )}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-gray-400 px-1">
                      {msg.time}
                    </span>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-start">
                  <div className="rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input area */}
          <div className="border-t border-gray-100 bg-white px-4 py-3">
            <div className="flex items-center gap-2 rounded-full border-2 border-red-400 bg-white px-4 py-2.5">
              <input
                ref={inputRef}
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message"
                className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                aria-label="Type your message"
              />
              {draft.trim() ? (
                <button
                  onClick={handleSend}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F5A623] text-white transition-colors hover:bg-[#E6961E]"
                  aria-label="Send message"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  className="shrink-0 text-gray-400 transition-colors hover:text-gray-600"
                  aria-label="Emoji"
                >
                  <Smile className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Powered by Entrata */}
            <div className="mt-2.5 flex items-center justify-center gap-1.5">
              <svg
                width="14"
                height="14"
                viewBox="0 0 40 40"
                fill="none"
                className="opacity-40"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 0V40H40V0H0ZM8.625 20.375H5.375C5.5 21 6 21.5 6.625 21.5C7.125 21.5 7.5 21.25 7.875 21L8.625 21.75C8.125 22.25 7.375 22.625 6.625 22.625C5.125 22.625 4.125 21.625 4.125 20.125C4.125 18.75 5 17.625 6.5 17.625C7.875 17.625 8.75 18.75 8.75 20.125C8.75 20.125 8.75 20.25 8.625 20.375ZM14.25 22.5H12.875V20C12.875 19.5 12.75 19.25 12.625 19.125C12.375 18.875 12.125 18.75 11.875 18.75C11.375 18.75 11 19 10.75 19.375V22.5H9.5V17.75H10.75V18.125C11.125 17.75 11.625 17.625 12.125 17.625C12.75 17.625 13.375 17.875 13.75 18.375C14.125 18.75 14.25 19.25 14.25 20V22.5ZM17.875 18.75H16.25V21.25H17.5V22.5H16.25V21.25H15V16.375H16.25V17.75H17.875V18.75ZM19.875 19.625V22.5H18.625V17.75H19.875V18.25C20.125 17.875 20.625 17.625 21.25 17.625H21.625V18.875H21C20.5 18.875 20.125 19.125 19.875 19.625ZM26.5 22.5H25.375V22.125C25 22.5 24.5 22.625 24 22.625C23.25 22.625 22.625 22.375 22.125 21.75C21.75 21.25 21.5 20.625 21.5 20.125C21.5 18.75 22.5 17.625 23.875 17.625C24.375 17.625 24.875 17.75 25.25 18.125V17.75H26.5V22.5ZM30.25 22.5H29V21.25H30.25V22.5ZM30.5 18.75H28.875V21.25H27.625V16.375H28.875V17.75H30.5V18.75ZM35.75 22.5H34.625V22.125C34.25 22.5 33.75 22.625 33.25 22.625C32.5 22.625 31.875 22.375 31.375 21.75C31 21.25 30.75 20.625 30.75 20.125C30.75 18.75 31.75 17.625 33.125 17.625C33.625 17.625 34.125 17.75 34.5 18.125V17.75H35.75V22.5ZM6.5 18.625C6 18.625 5.5 19 5.5 19.5H7.5C7.375 19 6.875 18.625 6.5 18.625ZM23 20.125C23 20.875 23.5 21.375 24.25 21.375C24.75 21.375 25.125 21.125 25.375 20.75V19.25C25.125 19 24.625 18.75 24.25 18.75C23.5 18.75 23 19.375 23 20.125ZM33.375 18.75C32.625 18.75 32.125 19.375 32.125 20.125C32.125 20.875 32.625 21.375 33.375 21.375C33.875 21.375 34.25 21.125 34.5 20.75V19.25C34.375 19 33.875 18.75 33.375 18.75Z"
                  fill="#383838"
                />
              </svg>
              <span className="text-[11px] text-gray-400 font-medium">
                Powered by Entrata
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Close FAB (replaces "Chat with us" when panel is open) ── */}
      {open && (
        <button
          onClick={() => setOpen(false)}
          className="fixed bottom-6 right-6 z-[10000] flex h-14 w-14 items-center justify-center rounded-full bg-[#F5A623] text-white shadow-lg transition-all hover:bg-[#E6961E] hover:shadow-xl"
          aria-label="Close chat"
        >
          <X className="h-6 w-6" />
        </button>
      )}
    </>
  );
}
