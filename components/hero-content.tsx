"use client"

import Link from "next/link"

export default function HeroContent() {
  return (
    <main className="absolute bottom-8 left-8 z-20 max-w-lg">
      <div className="text-left">
        <div
          className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm mb-4 relative"
          style={{
            filter: "url(#glass-effect)",
          }}
        >
          <div className="absolute top-0 left-1 right-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
          <span className="text-white/90 text-sm font-light relative z-10">✨ BETA RELEASE</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-6xl md:text-7xl md:leading-tight tracking-tight font-light text-white mb-6">
          <span className="font-medium italic instrument">Unlock</span> your
          <br />
          <span className="font-light tracking-tight text-white">API's revenue potential</span>
        </h1>

        {/* Description */}
        <p className="text-base font-light text-white/80 mb-6 leading-relaxed max-w-xl">
          Through perpetual monetization strategies that outperform traditional API marketplaces. Focus on building while Veil handles payments, auth, and analytics.
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-4 flex-wrap">
          <Link href="/marketplace">
            <button className="px-8 py-3 rounded-full bg-transparent border border-white/30 text-white font-normal text-sm transition-all duration-200 hover:bg-white/10 hover:border-white/50 cursor-pointer">
              Browse APIs
            </button>
          </Link>
          <Link href="/signup">
            <button className="px-8 py-3 rounded-full bg-white text-black font-normal text-sm transition-all duration-200 hover:bg-white/90 cursor-pointer">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </main>
  )
}
