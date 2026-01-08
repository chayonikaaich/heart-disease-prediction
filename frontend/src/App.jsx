import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import LearnMore from './components/LearnMore';

function App() {
  const scrollToPredict = () => {
    // If on home page, scroll. Else navigate home then scroll (handled by Home component mount logical or simplified here)
    // For simplicity, if not on home, the button in Home component handles it. 
    // The navbar button needs to check location or just navigate to "#prediction" which html anchors handle if on same page.
    const element = document.getElementById('prediction-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#prediction-section';
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-inter text-slate-900 selection:bg-blue-100 selection:text-blue-900 flex flex-col">
        {/* Navbar */}
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
                <span className="text-2xl">❤️</span>
                <span className="font-bold text-xl tracking-tight text-slate-900">Heart<span className="text-blue-600">Guard</span></span>
              </Link>
              <div className="hidden md:flex items-center gap-8">
                <Link to="/" className="font-medium text-slate-600 hover:text-blue-600 transition">Home</Link>
                <Link to="/about" className="font-medium text-slate-600 hover:text-blue-600 transition">About</Link>
                <Link to="/learn-more" className="font-medium text-slate-600 hover:text-blue-600 transition">Learn More</Link>
                <button onClick={scrollToPredict} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition shadow-lg shadow-blue-500/20">
                  Start Assessment
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/learn-more" element={<LearnMore />} />
          </Routes>
        </main>

        {/* Footer - Minimal as requested */}
        <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">❤️</span>
              <span className="font-bold text-xl tracking-tight text-white">Heart<span className="text-blue-500">Guard</span></span>
            </div>
            <p className="text-sm text-slate-500">Empowering early detection for a healthier future.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
