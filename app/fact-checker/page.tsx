import FactChecker from '@/components/FactChecker';

export default function FactCheckerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#ECEFF1]">
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="pt-20">
          <FactChecker />
        </div>
      </div>
    </div>
  );
}