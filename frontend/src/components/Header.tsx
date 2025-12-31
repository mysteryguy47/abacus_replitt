import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ChevronDown, Sparkles, BookOpen } from "lucide-react";

export default function Header() {
  const [abacusOpen, setAbacusOpen] = useState(false);
  const [location] = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isActive = (path: string) => location === path || location.startsWith(path + "/");

  // Handle mouse enter with delay
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setAbacusOpen(true);
  };

  // Handle mouse leave with delay
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setAbacusOpen(false);
    }, 200); // 200ms delay before closing
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Talent Hub
              </div>
              <div className="text-xs text-gray-500 font-medium">Premium Math Education</div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-8">
            {/* Abacus Dropdown */}
            <div 
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50/50">
                <BookOpen className="w-4 h-4" />
                Abacus
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${abacusOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {abacusOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-100/50 overflow-hidden animate-fade-in"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="py-2">
                    {/* Junior - Active */}
                    <Link href="/create/junior">
                      <div className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 border-b border-gray-100 ${
                        isActive("/create/junior")
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border-l-4 border-blue-600"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${isActive("/create/junior") ? "bg-blue-600" : "bg-gray-300"}`}></div>
                        <span>Junior</span>
                        {isActive("/create/junior") && (
                          <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-semibold">Active</span>
                        )}
                      </div>
                    </Link>

                    {/* Basic - Active */}
                    <Link href="/create/basic">
                      <div className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
                        isActive("/create/basic") || (location === "/create" && !location.includes("advanced"))
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border-l-4 border-blue-600"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${isActive("/create/basic") || (location === "/create" && !location.includes("advanced")) ? "bg-blue-600" : "bg-gray-300"}`}></div>
                        <span>Basic</span>
                        {(isActive("/create/basic") || (location === "/create" && !location.includes("advanced"))) && (
                          <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-semibold">Active</span>
                        )}
                      </div>
                    </Link>

                    {/* Advanced - Active */}
                    <Link href="/create/advanced">
                      <div className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
                        isActive("/create/advanced")
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border-l-4 border-blue-600"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${isActive("/create/advanced") ? "bg-blue-600" : "bg-gray-300"}`}></div>
                        <span>Advanced</span>
                        {isActive("/create/advanced") && (
                          <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-semibold">Active</span>
                        )}
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Vedic Maths Link */}
            <Link href="/vedic-maths/level-1">
              <button className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors rounded-lg hover:bg-blue-50/50 ${
                isActive("/vedic-maths")
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}>
                <BookOpen className="w-4 h-4" />
                Vedic Maths
              </button>
            </Link>

            {/* Mental Math Link */}
            <Link href="/mental">
              <button className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors rounded-lg hover:bg-purple-50/50 ${
                isActive("/mental")
                  ? "text-purple-600"
                  : "text-gray-700 hover:text-purple-600"
              }`}>
                <Sparkles className="w-4 h-4" />
                Mental
              </button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

