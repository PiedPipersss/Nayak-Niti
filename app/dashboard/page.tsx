"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import {
  Shield,
  LogOut,
  Users,
  TrendingUp,
  FileText,
  MapPin,
  Search,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Scale,
  Award,
  BarChart3,
} from "lucide-react";
import YourRepresentatives from "@/components/dashboard/YourRepresentatives";
import PoliciesAffectingYou from "@/components/dashboard/PoliciesAffectingYou";
import Link from "next/link";

interface UserPreferences {
  constituency: string;
  district?: string;
  topics: string[];
  location: string;
  interests: string[];
}

interface Politician {
  id: string;
  name: string;
  party: string;
  position: string;
  constituency: string;
  image?: string;
  attendance?: number;
  bills?: number;
  assets?: string;
  criminalCases?: number;
}

interface Bill {
  id: string;
  title: string;
  status: string;
  date: string;
  description: string;
}

interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  budget: string;
  lastUpdate: string;
}

export default function Dashboard() {
//   const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  // Mock data - replace with API calls later
  const [politicians] = useState<Politician[]>([
    {
      id: "1",
      name: "Rahul Sharma",
      party: "INC",
      position: "MP",
      constituency: "Pune South",
      attendance: 85,
      bills: 12,
      assets: "₹5.2 Cr",
      criminalCases: 0,
    },
    {
      id: "2",
      name: "Priya Deshmukh",
      party: "BJP",
      position: "MLA",
      constituency: "Pune South",
      attendance: 92,
      bills: 8,
      assets: "₹3.8 Cr",
      criminalCases: 1,
    },
  ]);

  const [bills] = useState<Bill[]>([
    {
      id: "1",
      title: "Digital India Bill 2024",
      status: "Under Review",
      date: "2024-10-15",
      description: "Amendments to digital infrastructure and data protection",
    },
    {
      id: "2",
      title: "Education Reform Act",
      status: "Passed",
      date: "2024-09-20",
      description: "Major changes to school curriculum and teacher training",
    },
  ]);

  const [projects] = useState<Project[]>([
    {
      id: "1",
      name: "Pune Metro Line 3",
      status: "In Progress",
      progress: 62,
      budget: "₹8,500 Cr",
      lastUpdate: "Land acquisition 80% complete",
    },
    {
      id: "2",
      name: "Smart City Initiative",
      status: "In Progress",
      progress: 45,
      budget: "₹2,300 Cr",
      lastUpdate: "WiFi zones installed in 12 areas",
    },
  ]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      // Check if location is passed from homepage
      const locationParam = searchParams.get("location");
      if (locationParam) {
        setSelectedLocation(locationParam);
        setPreferences({ location: locationParam, interests: [] });
        setLoading(false);
      } else {
        // Load saved preferences
        loadPreferences();
      }
    }
  }, [status, router, searchParams]);

  const loadPreferences = async () => {
    // Simulate loading from localStorage or API
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) {
      setPreferences({ location: savedLocation, interests: [] });
      setSelectedLocation(savedLocation);
    }
    setLoading(false);
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSelectedLocation(searchQuery);
      setPreferences({ location: searchQuery, interests: [] });
      localStorage.setItem("userLocation", searchQuery);
    }
  };

  // Extract state from constituency (assuming format like "Pune South, Maharashtra")
  const extractState = (constituency: string) => {
    // Try to extract state from constituency string
    // This is a simple implementation - you might need to adjust based on your data format
    const parts = constituency.split(",");
    if (parts.length > 1) {
      return parts[1].trim();
    }
    // Default fallback - you might want to add a proper state mapping
    return preferences?.district || "Maharashtra";
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#ECEFF1] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF9800] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Location selection screen
  if (!preferences || !selectedLocation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#ECEFF1] pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-2xl border-2 border-[#FF9800]">
              <CardHeader className="text-center bg-gradient-to-r from-[#FF9800] to-[#F57C00] text-white rounded-t-xl">
                <CardTitle className="text-3xl font-bold">
                  Welcome to Your Dashboard!
                </CardTitle>
                <p className="text-orange-100 mt-2">
                  Enter your location to get personalized political insights
                </p>
              </CardHeader>
              <CardContent className="p-8">
                <form
                  onSubmit={handleLocationSubmit}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Constituency or City
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="e.g., Pune South, Mumbai North, Bengaluru Urban"
                        className="pl-10 py-6 text-lg border-2 border-gray-300 focus:border-[#FF9800]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-600">
                      Popular Locations:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Pune South", "Mumbai North", "Bengaluru Urban", "Hyderabad", "Delhi Central"].map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => {
                            setSearchQuery(loc);
                            setSelectedLocation(loc);
                            setPreferences({ location: loc, interests: [] });
                            localStorage.setItem('userLocation', loc);
                          }}
                          className="px-4 py-2 rounded-lg border-2 border-[#FF9800] text-[#FF9800] hover:bg-[#FF9800] hover:text-white transition-all"
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#FF9800] to-[#F57C00] hover:from-[#F57C00] hover:to-[#E65100] text-white font-bold text-lg py-6 rounded-xl"
                  >
                    Continue to Dashboard
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#ECEFF1] pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-[#263238] mb-2">
                Your Political Dashboard
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">{selectedLocation}</span>
                <button
                  onClick={() => {
                    setSelectedLocation("");
                    setPreferences(null);
                  }}
                  className="text-[#FF9800] hover:underline text-sm ml-2"
                >
                  Change
                </button>
              </div>
            </div>

            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search politicians, bills, projects..."
                className="pl-10 pr-4 py-2 w-full sm:w-80 border-2 border-gray-300 focus:border-[#FF9800]"
              />
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-[#FF9800]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Representatives</p>
                  <p className="text-3xl font-bold text-[#263238]">
                    {politicians.length}
                  </p>
                </div>
                <Users className="w-10 h-10 text-[#FF9800]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-[#00BCD4]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Bills</p>
                  <p className="text-3xl font-bold text-[#263238]">
                    {bills.length}
                  </p>
                </div>
                <FileText className="w-10 h-10 text-[#00BCD4]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-[#4CAF50]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Local Projects</p>
                  <p className="text-3xl font-bold text-[#263238]">
                    {projects.length}
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 text-[#4CAF50]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-[#9C27B0]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Updates</p>
                  <p className="text-3xl font-bold text-[#263238]">12</p>
                </div>
                <AlertCircle className="w-10 h-10 text-[#9C27B0]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Politicians */}
          <div className="lg:col-span-2 space-y-6">
            {/* Politicians Section */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-[#FF9800] to-[#F57C00] text-white rounded-t-xl">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Your Representatives
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {politicians.map((politician) => (
                    <div
                      key={politician.id}
                      className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-[#FF9800] hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF9800] to-[#F57C00] flex items-center justify-center text-white font-bold text-xl">
                          {politician.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-bold text-[#263238]">
                                {politician.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {politician.position} • {politician.party} •{" "}
                                {politician.constituency}
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                            <div className="bg-green-50 rounded-lg p-2 text-center">
                              <p className="text-xs text-gray-600 mb-1">
                                Attendance
                              </p>
                              <p className="text-sm font-bold text-[#4CAF50]">
                                {politician.attendance}%
                              </p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-2 text-center">
                              <p className="text-xs text-gray-600 mb-1">Bills</p>
                              <p className="text-sm font-bold text-[#2196F3]">
                                {politician.bills}
                              </p>
                            </div>
                            <div className="bg-yellow-50 rounded-lg p-2 text-center">
                              <p className="text-xs text-gray-600 mb-1">Assets</p>
                              <p className="text-sm font-bold text-[#FFC107]">
                                {politician.assets}
                              </p>
                            </div>
                            <div
                              className={`${
                                politician.criminalCases === 0
                                  ? "bg-green-50"
                                  : "bg-red-50"
                              } rounded-lg p-2 text-center`}
                            >
                              <p className="text-xs text-gray-600 mb-1">Cases</p>
                              <p
                                className={`text-sm font-bold ${
                                  politician.criminalCases === 0
                                    ? "text-[#4CAF50]"
                                    : "text-red-600"
                                }`}
                              >
                                {politician.criminalCases}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Projects Section */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-[#00BCD4] to-[#0097A7] text-white rounded-t-xl">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Local Development Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-[#00BCD4] hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-[#263238]">
                            {project.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {project.status}
                          </p>
                        </div>
                        <span className="bg-[#00BCD4] text-white text-xs px-3 py-1 rounded-full">
                          {project.progress}%
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div
                          className="bg-gradient-to-r from-[#00BCD4] to-[#0097A7] h-2 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <DollarSign className="w-4 h-4" />
                          <span>Budget: {project.budget}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs">{project.lastUpdate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Bills & Quick Actions */}
          <div className="space-y-6">
            {/* Bills Section */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-[#4CAF50] to-[#388E3C] text-white rounded-t-xl">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Recent Bills
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {bills.map((bill) => (
                    <div
                      key={bill.id}
                      className="bg-white border-2 border-gray-200 rounded-lg p-3 hover:border-[#4CAF50] hover:shadow-sm transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-bold text-[#263238] flex-1">
                          {bill.title}
                        </h4>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            bill.status === "Passed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {bill.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        {bill.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(bill.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg border-2 border-[#9C27B0]">
              <CardHeader className="bg-gradient-to-r from-[#9C27B0] to-[#7B1FA2] text-white rounded-t-xl">
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <Button
                    onClick={() => router.push("/fact-checker")}
                    className="w-full bg-gradient-to-r from-[#4CAF50] to-[#388E3C] hover:from-[#388E3C] hover:to-[#2E7D32] text-white justify-start"
                  >
                    <Scale className="w-4 h-4 mr-2" />
                    Verify Facts
                  </Button>
                  <Button
                    onClick={() => router.push("/chat")}
                    className="w-full bg-gradient-to-r from-[#9C27B0] to-[#7B1FA2] hover:from-[#7B1FA2] hover:to-[#6A1B9A] text-white justify-start"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Ask AI Assistant
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-2 border-[#FF9800] text-[#FF9800] hover:bg-[#FF9800] hover:text-white justify-start"
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Transparency Index
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
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