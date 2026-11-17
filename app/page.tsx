"use client";

import { ChatWidget } from "@/components/chat-widget";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Mock application header ── */}
      <header className="border-b border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            Application Print
          </span>
          <div className="flex items-center gap-3">
            <button className="rounded bg-[#7bba3f] px-5 py-1.5 text-sm font-semibold text-white hover:bg-[#6aa836]">
              Print
            </button>
            <span className="text-sm text-gray-500">
              or{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Cancel
              </a>
            </span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* ── Application content ── */}
        <main className="flex-1 p-6">
          {/* Application header card */}
          <div className="rounded border border-gray-300 bg-white p-4 mb-4">
            <p className="text-sm font-bold text-gray-900">
              APPLICATION #19419334
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Started On: 11/17/2026 05:29 PM EST &nbsp;|&nbsp; Last Updated
              On: 11/17/2026 05:29 PM EST &nbsp;|&nbsp; Status: Application:
              Started
            </p>
          </div>

          {/* Applicants table */}
          <div className="rounded border border-gray-300 bg-white mb-4">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                Applicants
              </p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 text-xs">
                    Name(s)
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 text-xs">
                    Gender
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 text-xs">
                    Date of Birth
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 text-xs">
                    Email Address
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 text-xs">
                    Phone
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 text-xs">
                    Income
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-2 text-gray-900">
                    Theodore Erickson
                  </td>
                  <td className="px-4 py-2 text-gray-700">Male</td>
                  <td className="px-4 py-2 text-gray-700">04/17/2007</td>
                  <td className="px-4 py-2 text-gray-700">
                    Theoerickson7@gmail.com
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    (703) 896-2176 (Mobile)
                  </td>
                  <td className="px-4 py-2 text-gray-700">$0.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Applicant Preferences */}
          <div className="rounded border border-gray-300 bg-white mb-4">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                Applicant Preferences
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 px-4 py-3 text-sm">
              <div className="flex">
                <span className="w-32 shrink-0 font-semibold text-gray-700 text-right pr-3">
                  Property
                </span>
                <span className="text-gray-900">
                  Meridian on College Avenue
                </span>
              </div>
              <div className="flex">
                <span className="w-32 shrink-0 font-semibold text-gray-700 text-right pr-3">
                  Lease Length
                </span>
                <span className="text-gray-700">month(s)</span>
              </div>
              <div className="flex">
                <span className="w-32 shrink-0 font-semibold text-gray-700 text-right pr-3">
                  Applied Rent
                </span>
                <span className="text-gray-900">$0.00</span>
              </div>
              <div className="flex">
                <span className="w-32 shrink-0 font-semibold text-gray-700 text-right pr-3">
                  Move-in Date
                </span>
                <span className="text-gray-900">11/17/2026</span>
              </div>
              <div className="flex">
                <span className="w-32 shrink-0 font-semibold text-gray-700 text-right pr-3">
                  Floor Plan
                </span>
                <span className="text-gray-900">2 Bed - A - Triple</span>
              </div>
              <div />
              <div className="flex">
                <span className="w-32 shrink-0 font-semibold text-gray-700 text-right pr-3">
                  Building
                </span>
                <span className="text-gray-700">-</span>
              </div>
              <div />
              <div className="flex">
                <span className="w-32 shrink-0 font-semibold text-gray-700 text-right pr-3">
                  Unit
                </span>
                <span className="text-gray-700" />
              </div>
              <div />
              <div className="flex">
                <span className="w-32 shrink-0 font-semibold text-gray-700 text-right pr-3 text-xs leading-5">
                  How Did You Hear About Us
                </span>
                <span className="text-gray-900">Property Website</span>
              </div>
            </div>
          </div>

          {/* Applicant Name / Status banner */}
          <div className="rounded border border-gray-300 bg-white mb-4">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
              <p className="text-sm font-bold text-gray-900">
                APPLICANT NAME: Theodore Isaac Erickson
              </p>
              <p className="text-sm font-bold text-gray-900">
                STATUS: Application: Started
              </p>
            </div>

            {/* Basic Information */}
            <div className="px-4 py-3">
              <p className="text-sm font-semibold text-gray-800 mb-2">
                Basic Information
              </p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div className="flex">
                  <span className="w-36 shrink-0 font-semibold text-gray-700 text-right pr-3">
                    Applicant Name
                  </span>
                  <span className="text-gray-900">
                    Theodore Isaac Erickson
                  </span>
                </div>
                <div className="flex">
                  <span className="w-36 shrink-0 font-semibold text-gray-700 text-right pr-3">
                    Email
                  </span>
                  <span className="text-gray-900">
                    Theoerickson7@gmail.com
                  </span>
                </div>
                <div className="flex">
                  <span className="w-36 shrink-0 font-semibold text-gray-700 text-right pr-3">
                    Applicant Type
                  </span>
                  <span className="text-gray-900">Primary</span>
                </div>
                <div className="flex">
                  <span className="w-36 shrink-0 font-semibold text-gray-700 text-right pr-3">
                    Primary Number
                  </span>
                  <span className="text-gray-900">
                    (703) 896-2176 (Mobile)
                  </span>
                </div>
                <div className="flex">
                  <span className="w-36 shrink-0 font-semibold text-gray-700 text-right pr-3">
                    SSN
                  </span>
                  <span className="text-gray-900">*****2434</span>
                </div>
                <div className="flex">
                  <span className="w-36 shrink-0 font-semibold text-gray-700 text-right pr-3">
                    Secondary Number
                  </span>
                  <span className="text-gray-700" />
                </div>
                <div className="flex">
                  <span className="w-36 shrink-0 font-semibold text-gray-700 text-right pr-3">
                    Birth Date
                  </span>
                  <span className="text-gray-900">04/17/2007</span>
                </div>
                <div />
                <div className="flex">
                  <span className="w-36 shrink-0 font-semibold text-gray-700 text-right pr-3">
                    Gender
                  </span>
                  <span className="text-gray-900">Male</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* ── Right sidebar nav ── */}
        <aside className="hidden w-48 shrink-0 border-l border-gray-200 bg-white p-4 lg:block">
          <nav className="space-y-1.5 text-sm">
            {[
              "Applicants",
              "Preferences",
              "Basic Information",
              "Address Information",
              "Vehicle Information",
              "Contacts",
              "General Question",
              "Policy Documents",
            ].map((item) => (
              <a
                key={item}
                href="#"
                className="block text-blue-600 hover:text-blue-800 hover:underline"
              >
                {item}
              </a>
            ))}
          </nav>
        </aside>
      </div>

      {/* ── Chat Widget overlay ── */}
      <ChatWidget />
    </div>
  );
}
