"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { Shield, LogOut } from "lucide-react";
import YourRepresentatives from "@/components/dashboard/YourRepresentatives";

interface UserPreferences {
  constituency: string;
  district?: string;
  topics: string[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      fetchPreferences();
    }
  }, [status, router]);

  const fetchPreferences = async () => {
    try {
      const response = await fetch("/api/user/preferences");
      const data = await response.json();
      
      if (data.preferences) {
        setPreferences(data.preferences);
      } else {
        router.push("/onboarding");
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  // Extract state from constituency (assuming format like "Pune South, Maharashtra")
  const extractState = (constituency: string) => {
    // Try to extract state from constituency string
    // This is a simple implementation - you might need to adjust based on your data format
    const parts = constituency.split(',');
    if (parts.length > 1) {
      return parts[1].trim();
    }
    // Default fallback - you might want to add a proper state mapping
    return preferences?.district || "Maharashtra";
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#ECEFF1] flex items-center justify-center">
        <div className="text-[#263238] text-xl">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#ECEFF1]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-[#FF9800]" />
              <h1 className="text-2xl font-bold text-[#263238]">Nayak Niti</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-[#424242]">{session?.user?.name}</p>
                <p className="text-xs text-[#0097A7]">{preferences?.constituency}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 px-4 py-2 text-[#424242] hover:text-[#FF9800] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <h2 className="text-4xl font-bold text-[#263238] mb-2">
          Your Political Hub: {preferences?.constituency}
        </h2>
        <p className="text-[#424242] mb-8">
          Interested in: {preferences?.topics.join(", ")}
        </p>

        {/* Widgets */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Your Representatives */}
          <div className="md:col-span-2">
            {preferences && (
              <YourRepresentatives 
                constituency={preferences.constituency}
                state={extractState(preferences.constituency)}
              />
            )}
          </div>

          {/* Other Widgets */}
          <WidgetPlaceholder title="Key Development Projects" />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <WidgetPlaceholder title="Policies Affecting You" />
          <WidgetPlaceholder title="Recent Updates" />
        </div>
      </main>
    </div>
  );
}

function WidgetPlaceholder({ title }: { title: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-[#ECEFF1]">
      <h3 className="text-xl font-bold text-[#263238] mb-4">{title}</h3>
      <div className="text-[#424242]">
        <p>Coming soon...</p>
      </div>
    </div>
  );
}