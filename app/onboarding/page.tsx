"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  GraduationCap,
  Building2,
  Shield,
  Sprout,
  Briefcase,
  Users,
  Landmark,
} from "lucide-react";

const TOPICS = [
  { id: "healthcare", label: "Healthcare", icon: Heart },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "infrastructure", label: "Infrastructure", icon: Building2 },
  { id: "women-safety", label: "Women's Safety", icon: Shield },
  { id: "agriculture", label: "Agriculture", icon: Sprout },
  { id: "jobs", label: "Jobs & Employment", icon: Briefcase },
  { id: "social-welfare", label: "Social Welfare", icon: Users },
  { id: "governance", label: "Governance", icon: Landmark },
];

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locationParam = searchParams.get("location");

  const [location, setLocation] = useState(locationParam || "");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [step, setStep] = useState<"location" | "topics">(
    locationParam ? "topics" : "location"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const toggleTopic = (topicId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((t) => t !== topicId)
        : [...prev, topicId]
    );
  };

  const handleSubmit = async () => {
    if (!session?.user?.id || selectedTopics.length < 2) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          constituency: location,
          topics: selectedTopics,
        }),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        alert("Failed to save preferences. Please try again.");
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#ECEFF1] flex items-center justify-center">
        <div className="text-[#263238] text-xl">Loading...</div>
      </div>
    );
  }

  if (step === "location") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#ECEFF1] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full"
        >
          <h2 className="text-3xl font-bold text-[#263238] mb-4">
            Welcome, {session?.user?.name?.split(" ")[0]}!
          </h2>
          <p className="text-[#424242] mb-8">
            Let's start by finding your constituency
          </p>

          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your Constituency or District"
            className="w-full px-4 py-3 border-2 border-[#00BCD4] rounded-lg focus:outline-none focus:border-[#0097A7] mb-6"
            onKeyPress={(e) => {
              if (e.key === "Enter" && location.trim()) {
                setStep("topics");
              }
            }}
          />

          <button
            onClick={() => location.trim() && setStep("topics")}
            disabled={!location.trim()}
            className="w-full px-6 py-3 bg-[#FF9800] text-white rounded-lg hover:bg-[#FFB74D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            Continue
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#ECEFF1] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto py-12"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-[#263238] mb-4">
            What topics matter most to you?
          </h2>
          <p className="text-[#424242] text-lg">
            Select at least 2 topics to personalize your feed
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {TOPICS.map((topic) => {
            const Icon = topic.icon;
            const isSelected = selectedTopics.includes(topic.id);

            return (
              <motion.button
                key={topic.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleTopic(topic.id)}
                className={`p-6 rounded-xl border-2 transition-all ${
                  isSelected
                    ? "bg-[#FF9800] border-[#FF9800] text-white shadow-lg"
                    : "bg-white border-[#00BCD4] text-[#263238] hover:border-[#0097A7]"
                }`}
              >
                <Icon className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold text-sm">{topic.label}</p>
              </motion.button>
            );
          })}
        </div>

        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={selectedTopics.length < 2 || isSubmitting}
            className="px-12 py-3 bg-[#FF9800] text-white rounded-lg hover:bg-[#FFB74D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
          >
            {isSubmitting ? "Saving..." : "Done"}
          </button>
          <p className="text-sm text-[#424242] mt-4">
            {selectedTopics.length} topic{selectedTopics.length !== 1 ? "s" : ""} selected
            {selectedTopics.length < 2 && " (select at least 2)"}
          </p>
        </div>

        {/* Back button */}
        <div className="text-center mt-6">
          <button
            onClick={() => setStep("location")}
            className="text-[#0097A7] hover:underline"
          >
            ← Change Location
          </button>
        </div>
      </motion.div>
    </div>
  );
}