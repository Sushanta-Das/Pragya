const Home = () => {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Top Half - Video */}
      <div className="flex-1 relative">
        <video
          src="/videos/video1.mp4"
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
        />
    
        <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
      </div>

      {/* Bottom Half - Image and Button */}
      <div className="flex flex-col md:flex-row h-1/2">
        {/* Left: Image */}
        <div className="flex-1">
          <img
            src="images/image1.png"
            alt="Illustration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right: Get Started Button */}
        <div className="flex-1 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm border-t border-slate-700">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-xl rounded-xl shadow-lg transition"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home