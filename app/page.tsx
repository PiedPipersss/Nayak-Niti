"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, Users, TrendingUp, BookOpen, Shield, Bot, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [quickTopic, setQuickTopic] = useState<string | null>(null);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const loc = (quickTopic || query).trim();
    if (!loc) return;
    router.push(`/dashboard?location=${encodeURIComponent(loc)}`);
  };

  const QUICK_LOCATIONS = ["Pune South", "Mumbai North", "Bengaluru Urban", "Hyderabad"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#ECEFF1]">
      <header className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-[#FF9800] flex items-center justify-center text-white font-bold">NN</div>
          <h1 className="text-2xl font-extrabold text-[#263238]">Nayak Niti</h1>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-6 text-sm text-[#424242]">
            <a className="hover:text-[#0097A7]" href="#features">Features</a>
            <a className="hover:text-[#0097A7]" href="#how">How it works</a>
            <a className="hover:text-[#0097A7]" href="#testimonials">Stories</a>
          </nav>
          <button onClick={() => router.push("/dashboard")} className="px-4 py-2 rounded-md border border-[#00BCD4] text-[#263238] font-semibold">
            Open Hub
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <section className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left: Hero text + search */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-extrabold leading-tight text-[#263238] mb-4"
            >
              Get the non-partisan truth about your local politics.
            </motion.h2>

            <p className="text-lg text-[#424242] mb-6 max-w-xl">
              No noise, just data. Personalized updates on representatives, projects, and policies that affect your neighborhood.
            </p>

            <form onSubmit={(e) => handleSearch(e)} className="max-w-xl">
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setQuickTopic(null); }}
                  placeholder="Enter your Constituency or District (e.g., Pune South)"
                  className="w-full rounded-full border-2 border-[#00BCD4] px-5 py-3 pr-32 text-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0097A7]"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-full bg-[#FF9800] text-white font-semibold hover:bg-[#FFB74D]"
                >
                  Go
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 items-center">
                <span className="text-sm text-[#424242] mr-2">Quick:</span>
                {QUICK_LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => { setQuickTopic(loc); setQuery(""); setTimeout(() => handleSearch(), 80); }}
                    className={`text-sm px-3 py-1 rounded-full border ${quickTopic === loc ? "bg-[#00BCD4] text-white border-[#00BCD4]" : "bg-white text-[#263238] border-[#00BCD4] hover:bg-[#0097A7] hover:text-white"}`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </form>

            <div className="mt-8 grid sm:grid-cols-3 gap-3 max-w-xl">
              <StatCard icon={<Users className="w-5 h-5 text-white" />} title="Representatives" value="MP • MLA" color="bg-[#FF9800]" />
              <StatCard icon={<TrendingUp className="w-5 h-5 text-white" />} title="Projects" value="Local tracker" color="bg-[#0097A7]" />
              <StatCard icon={<BookOpen className="w-5 h-5 text-white" />} title="Policies" value="Explained simply" color="bg-[#00BCD4]" />
            </div>
          </div>

          {/* Right: Illustration / cards */}
          <div className="relative">
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-[#263238]">Pune Metro Line 3</h4>
                      <p className="text-sm text-[#424242]">Infrastructure • In Progress</p>
                    </div>
                    <div className="text-sm bg-[#FF9800] text-white px-3 py-1 rounded-full">In Progress</div>
                  </div>

                  <div className="mt-4">
                    <div className="w-full bg-[#ECEFF1] rounded-full h-3 overflow-hidden">
                      <div className="h-3 bg-[#FF9800]" style={{ width: "62%" }} />
                    </div>
                    <p className="text-xs text-[#424242] mt-2">Progress: 62% • Latest: Land acquisition 80%</p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button className="text-sm px-3 py-1 rounded-md bg-[#00BCD4] text-white">Latest Update</button>
                    <button className="text-sm px-3 py-1 rounded-md border border-[#00BCD4] text-[#263238]">Public Sentiment</button>
                  </div>
                </div>

                <div className="w-28 h-28 bg-gradient-to-tr from-[#FFB74D] to-[#FF9800] rounded-xl flex items-center justify-center text-white font-bold">
                  Metro
                </div>
              </div>
            </motion.div>

            <svg className="absolute -right-8 -bottom-8 opacity-20 w-56 h-56" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#FF9800" stopOpacity="0.8" />
                  <stop offset="1" stopColor="#00BCD4" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="80" fill="url(#g)" />
            </svg>
          </div>
        </section>

        <section id="features" className="mt-16">
          <h3 className="text-2xl font-bold text-[#263238] mb-6">What you get</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Users className="w-6 h-6 text-[#FF9800]" />} 
              title="Politician Profiles" 
              text="Comprehensive profiles with voting records, assets, criminal cases, and performance metrics."
              link="/dashboard"
            />
            <FeatureCard 
              icon={<TrendingUp className="w-6 h-6 text-[#0097A7]" />} 
              title="Bill Tracker" 
              text="Track parliamentary bills, understand their impact, and see voting patterns in real-time."
              link="/bills"
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-[#4CAF50]" />} 
              title="Fact Checker" 
              text="AI-powered verification of political claims with source credibility analysis."
              link="/fact-checker"
            />
            <FeatureCard 
              icon={<Bot className="w-6 h-6 text-[#9C27B0]" />} 
              title="AI Political Assistant" 
              text="Chat with AI to understand Indian politics, policies, and governance."
              link="/chat"
            />
            <FeatureCard 
              icon={<TrendingUp className="w-6 h-6 text-[#2196F3]" />} 
              title="Performance Analytics" 
              text="Data-driven insights on politician performance, promises vs delivery."
              link="/dashboard"
            />
            <FeatureCard 
              icon={<Award className="w-6 h-6 text-[#FFC107]" />} 
              title="Transparency Index" 
              text="Unique scoring system measuring accountability and transparency."
              link="/dashboard"
            />
          </div>
        </section>

        <section id="testimonials" className="mt-12">
          <h3 className="text-2xl font-bold text-[#263238] mb-4">Voices from the community</h3>
          <div className="bg-white p-6 rounded-xl shadow-md max-w-2xl">
            <p className="text-[#424242] italic">"Nayak Niti helped me finally understand how the new education policy affects my child's school. Clear, unbiased, and local."</p>
            <div className="mt-4 text-sm text-[#263238] font-semibold">— A Local Teacher</div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#ECEFF1] mt-12 py-6">
        <div className="container mx-auto px-6 text-center text-sm text-[#424242]">
          © {new Date().getFullYear()} Nayak Niti — Built for civic clarity
        </div>
      </footer>
    </div>
  );
}

function StatCard({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: string; color: string; }) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-lg p-3 shadow-sm">
      <div className={`w-10 h-10 flex items-center justify-center rounded-md ${color}`}>{icon}</div>
      <div>
        <div className="text-sm text-[#424242]">{title}</div>
        <div className="text-sm font-semibold text-[#263238]">{value}</div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, text, link }: { icon: React.ReactNode; title: string; text: string; link?: string; }) {
  const router = useRouter();
  
  return (
    <motion.div 
      whileHover={{ y: -6 }} 
      onClick={() => link && router.push(link)}
      className={`bg-white p-5 rounded-xl shadow hover:shadow-lg transition ${link ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-md bg-[#FAFAFA] flex items-center justify-center">{icon}</div>
        <h4 className="text-lg font-semibold text-[#263238]">{title}</h4>
      </div>
      <p className="text-[#424242] text-sm">{text}</p>
    </motion.div>
  );
}