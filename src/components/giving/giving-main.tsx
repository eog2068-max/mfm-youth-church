"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Gift,
  Heart,
  Sprout,
  Globe,
  Building2,
  Flame,
  HandHeart,
  Landmark,
  CreditCard,
  Church,
  Copy,
  Check,
  ArrowRight,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionWrapper, SectionTitle } from "@/components/home/section-wrapper";
import {
  givingCategories,
  bankDetails,
  paymentMethods,
  givingScriptures,
  givingBlessings,
} from "./giving-data";

const iconMap: Record<string, React.ElementType> = {
  TrendingUp,
  Gift,
  Heart,
  Sprout,
  Globe,
  Building2,
  HandHeart,
  Flame,
  Landmark,
  CreditCard,
  Church,
};

export function GivingMain() {
  const [copied, setCopied] = useState(false);
  const [activeMethod, setActiveMethod] = useState("bank-transfer");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    name: "",
    email: "",
    phone: "",
  });
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const copyAccountNumber = () => {
    navigator.clipboard.writeText(bankDetails.accountNumber).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setPaymentSubmitted(true);
    }, 1500);
  };

  return (
    <div>
      {/* Scripture Hero */}
      <SectionWrapper className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Quote className="size-10 text-[#D32F2F]/30 mx-auto mb-4" />
            <p className="text-xl md:text-2xl font-semibold text-[#4A148C] leading-relaxed italic">
              &ldquo;Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.&rdquo;
            </p>
            <p className="text-sm text-gray-500 mt-3 font-medium">— 2 Corinthians 9:7 (NIV)</p>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Giving Categories */}
      <SectionWrapper className="bg-[#F3E5F5] py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionTitle
            title="Ways to Give"
            subtitle="Choose a category and partner with God in advancing His kingdom"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {givingCategories.map((cat, index) => {
              const IconComp = iconMap[cat.icon] || Heart;
              return (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setActiveMethod("online");
                  }}
                  className="bg-white rounded-2xl p-6 text-left border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all group cursor-pointer"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <IconComp className="size-6 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-gray-800 mb-2 group-hover:text-[#4A148C] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{cat.description}</p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </SectionWrapper>

      {/* Payment Methods */}
      <SectionWrapper className="py-16 md:py-20" id="payment-section">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <SectionTitle
            title="How to Give"
            subtitle="Multiple convenient ways to support the work of God"
          />

          {/* Method Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {paymentMethods.map((method) => {
              const IconComp = iconMap[method.icon] || Heart;
              const isActive = activeMethod === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setActiveMethod(method.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#4A148C] text-white shadow-md"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-[#4A148C]/30 hover:text-[#4A148C]"
                  }`}
                >
                  <IconComp className="size-4" />
                  {method.name}
                </button>
              );
            })}
          </div>

          {/* Bank Transfer */}
          {activeMethod === "bank-transfer" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-lg mx-auto"
            >
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-[#4A148C] to-[#6A1B9A] p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                      <Landmark className="size-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Bank Transfer Details</h3>
                      <p className="text-sm text-purple-200/80">Transfer to the account below</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Bank Name
                    </p>
                    <p className="text-base font-semibold text-gray-800">{bankDetails.bankName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Account Name
                    </p>
                    <p className="text-base font-semibold text-gray-800">{bankDetails.accountName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Account Number
                    </p>
                    <div className="flex items-center gap-3">
                      <p className="text-2xl font-bold text-[#4A148C] tracking-wider">
                        {bankDetails.accountNumber}
                      </p>
                      <button
                        onClick={copyAccountNumber}
                        className="p-2 rounded-lg bg-[#F3E5F5] hover:bg-[#EBF0FA] transition-colors"
                      >
                        {copied ? (
                          <Check className="size-4 text-[#2E7D32]" />
                        ) : (
                          <Copy className="size-4 text-[#4A148C]" />
                        )}
                      </button>
                    </div>
                    {copied && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-[#2E7D32] mt-1"
                      >
                        Copied to clipboard!
                      </motion.p>
                    )}
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Please use your name as the payment reference when making the transfer. Send
                      your payment confirmation to{" "}
                      <span className="font-semibold text-gray-600">
                        thecenaclemfmycr10@gmail.com
                      </span>{" "}
                      or via WhatsApp.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Online Payment (Mock) */}
          {activeMethod === "online" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-lg mx-auto"
            >
              {paymentSubmitted ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                    <Check className="size-8 text-[#2E7D32]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#4A148C] mb-2">Thank You for Your Giving!</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6">
                    Your generous contribution has been received. May God bless you abundantly as you
                    have sown into His kingdom. Remember, &ldquo;God loves a cheerful giver.&rdquo;
                  </p>
                  <Button
                    onClick={() => {
                      setPaymentSubmitted(false);
                      setPaymentForm({ amount: "", name: "", email: "", phone: "" });
                      setSelectedCategory("");
                    }}
                    className="bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl"
                  >
                    Give Again
                  </Button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-[#D32F2F] to-[#E53935] p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                        <CreditCard className="size-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Online Payment</h3>
                        <p className="text-sm text-red-100/80">
                          Secure payment with your debit or credit card
                        </p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handlePaymentSubmit} className="p-6 space-y-5">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                        Amount (NGN)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                          ₦
                        </span>
                        <Input
                          type="number"
                          value={paymentForm.amount}
                          onChange={(e) =>
                            setPaymentForm((p) => ({ ...p, amount: e.target.value }))
                          }
                          placeholder="Enter amount"
                          className="pl-8 rounded-xl border-gray-200 h-11 focus:border-[#4A148C]/30"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                        Giving Category
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-[#4A148C]/30 focus:outline-none focus:ring-1 focus:ring-[#4A148C]/20"
                        required
                      >
                        <option value="">Select category</option>
                        {givingCategories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                        Full Name
                      </label>
                      <Input
                        value={paymentForm.name}
                        onChange={(e) =>
                          setPaymentForm((p) => ({ ...p, name: e.target.value }))
                        }
                        placeholder="Your full name"
                        className="rounded-xl border-gray-200 h-11 focus:border-[#4A148C]/30"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                          Email
                        </label>
                        <Input
                          type="email"
                          value={paymentForm.email}
                          onChange={(e) =>
                            setPaymentForm((p) => ({ ...p, email: e.target.value }))
                          }
                          placeholder="your@email.com"
                          className="rounded-xl border-gray-200 h-11 focus:border-[#4A148C]/30"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                          Phone
                        </label>
                        <Input
                          type="tel"
                          value={paymentForm.phone}
                          onChange={(e) =>
                            setPaymentForm((p) => ({ ...p, phone: e.target.value }))
                          }
                          placeholder="+234 800 000 0000"
                          className="rounded-xl border-gray-200 h-11 focus:border-[#4A148C]/30"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#4A148C] hover:bg-[#1A0033] text-white rounded-xl h-12 text-base font-semibold"
                    >
                      {submitting ? "Processing..." : "Pay Now"}
                    </Button>

                    <p className="text-[11px] text-gray-400 text-center">
                      This is a demo. No real payment will be processed. In production, this will
                      connect to a secure payment gateway.
                    </p>
                  </form>
                </div>
              )}
            </motion.div>
          )}

          {/* In-Person */}
          {activeMethod === "in-person" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-lg mx-auto"
            >
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-[#2E7D32] to-[#388E3C] p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                      <Church className="size-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Give In Person</h3>
                      <p className="text-sm text-green-100/80">
                        Join us during any of our service times
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="bg-[#F8FAFF] rounded-xl p-5">
                    <h4 className="text-sm font-bold text-[#4A148C] mb-3">Service Times</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#D32F2F] mt-1.5 shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">Sunday Services</p>
                          <p className="text-xs text-gray-500">Service: 7:00 AM</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#4A148C] mt-1.5 shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">Tuesday Bible Study</p>
                          <p className="text-xs text-gray-500">5:30 PM</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#D32F2F] mt-1.5 shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">Thursday Faith Clinic</p>
                          <p className="text-xs text-gray-500">5:30 PM</p>
                        </div>
                      </div>

                    </div>
                  </div>

                  <p className="text-sm text-gray-500 leading-relaxed">
                    Giving baskets are passed during all services. You can also locate the giving
                    box at the church entrance. Our ushers are available to assist you with any
                    questions about giving.
                  </p>

                  <Button
                    asChild
                    className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-xl h-11"
                  >
                    <a href="/contact">
                      Get Directions to Church
                      <ArrowRight className="size-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </SectionWrapper>

      {/* Why We Give - Scriptures */}
      <SectionWrapper className="bg-[#F3E5F5] py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionTitle
            title="Why We Give"
            subtitle="God's Word on the blessings of generous giving"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {givingScriptures.map((scripture, index) => (
              <motion.div
                key={scripture.reference}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
              >
                <Quote className="size-6 text-[#D32F2F]/20 mb-3" />
                <p className="text-sm text-gray-700 leading-relaxed italic mb-3">
                  &ldquo;{scripture.text}&rdquo;
                </p>
                <p className="text-sm font-bold text-[#4A148C]">{scripture.reference}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Blessings of Giving */}
      <SectionWrapper className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <SectionTitle
            title="Blessings of Giving"
            subtitle="Real stories from our church family"
          />

          <div className="space-y-6">
            {givingBlessings.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F3E5F5] flex items-center justify-center shrink-0">
                    <Heart className="size-5 text-[#D32F2F]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">{item.testimony}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-[#4A148C]">{item.name}</p>
                      <span className="text-xs bg-[#F3E5F5] text-[#4A148C] px-2 py-0.5 rounded-full font-medium">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
