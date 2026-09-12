"use client";

import { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, Building2, ReceiptText } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function AccountPage() {
  const { user, isLoggedIn, hydrated } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    billingAddress: "",
    gstNumber: "",
  });

  const [sameBillingAddress, setSameBillingAddress] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.mobile || user.phone || "",
        address: user.address || "",
        billingAddress: user.billingAddress || "",
        gstNumber: user.gstNumber || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSaved(false);
  };

  const handleSameBillingAddress = (e) => {
    const checked = e.target.checked;

    setSameBillingAddress(checked);

    if (checked) {
      setFormData((prev) => ({
        ...prev,
        billingAddress: prev.address,
      }));
    }
  };

  const handleSave = () => {
    // You can connect this to your API later.
    console.log("User details:", formData);

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Login Required
          </h1>

          <p className="mt-2 text-gray-500">
            Please login to view your account details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <main className="min-h-screen bg-cream pt-24 pb-20 sm:pt-28">
    <div className="mx-auto max-w-8xl px-5 sm:px-8">
        {/* Header */}
        <div className="mb-8">
         <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            My Account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your personal, contact and billing information.
          </p>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* Personal Information */}
          <section className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your basic account information.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="border-t border-gray-200" />

          {/* Address */}
          <section className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Address Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Add the address where your orders should be delivered.
              </p>
            </div>

            <div>
              <label
                htmlFor="address"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Address
              </label>

              <div className="relative">
                <MapPin className="absolute left-3 top-4 h-5 w-5 text-gray-400" />

                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your complete address"
                  rows={4}
                  className="w-full resize-none rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                />
              </div>
            </div>
          </section>

          <div className="border-t border-gray-200" />

          {/* Billing Address */}
          <section className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Billing Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Add billing details for your invoices.
              </p>
            </div>

            {/* Same address checkbox */}
            <label className="mb-5 flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={sameBillingAddress}
                onChange={handleSameBillingAddress}
                className="h-4 w-4 rounded border-gray-300"
              />

              <span className="text-sm text-gray-700">
                Billing address is same as delivery address
              </span>
            </label>

            {/* Billing Address */}
            <div className="mb-6">
              <label
                htmlFor="billingAddress"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Billing Address
              </label>

              <div className="relative">
                <Building2 className="absolute left-3 top-4 h-5 w-5 text-gray-400" />

                <textarea
                  id="billingAddress"
                  name="billingAddress"
                  value={formData.billingAddress}
                  onChange={handleChange}
                  disabled={sameBillingAddress}
                  placeholder="Enter your billing address"
                  rows={4}
                  className={`w-full resize-none rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition ${
                    sameBillingAddress
                      ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-500"
                      : "border-gray-300 bg-white focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                  }`}
                />
              </div>
            </div>

            {/* GST */}
            <div>
              <label
                htmlFor="gstNumber"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                GST Number
                <span className="ml-2 font-normal text-gray-400">
                  (Optional)
                </span>
              </label>

              <div className="relative">
                <ReceiptText className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  id="gstNumber"
                  name="gstNumber"
                  type="text"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  placeholder="Enter your GST number"
                  maxLength={15}
                  className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm uppercase outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                />
              </div>

              <p className="mt-2 text-xs text-gray-400">
                GST number should contain 15 characters.
              </p>
            </div>
          </section>

          <div className="border-t border-gray-200" />

          {/* Footer */}
          <div className="flex flex-col gap-4 bg-gray-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">

            {saved ? (
              <p className="text-sm font-medium text-green-600">
                ✓ Details saved successfully
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Make sure your information is correct before saving.
              </p>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.98]"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </main>
    <Footer/>
    </>
  );
}