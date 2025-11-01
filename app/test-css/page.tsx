export default function TestCSS() {
  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-blue-600">
          If you see styled text, Tailwind is working!
        </h1>
        <p className="text-green-500 mt-4">This should be green</p>
        <div className="w-20 h-20 bg-[#FF9800] mt-4">Orange box</div>
      </div>
    </div>
  );
}