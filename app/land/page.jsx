"use client";
import Image from "next/image";
import Link from "next/link";
import Nav from "../components/Nav";

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-gray-100 dark:from-slate-950 dark:via-blue-950 dark:to-gray-900">
      {/* Navbar with fixed positioning to stay on scroll */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Nav />
      </div>
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-sky-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-slate-300 dark:bg-slate-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.15),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.2),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(148,163,184,0.15),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_bottom,rgba(100,116,139,0.2),transparent_50%)]"></div>
      </div>

      {/* Animated Floating Clouds */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[5%] left-[-5%] sm:left-[-5%] animate-float-slow opacity-30">
          <Image src="/images/cloud.png" alt="Cloud" width={400} height={200} className="drop-shadow-lg w-32 sm:w-64 md:w-80 lg:w-96 h-auto" priority />
        </div>
        <div className="absolute top-[10%] right-[-8%] sm:right-[-8%] animate-float-slower opacity-25">
          <Image src="/images/cloud.png" alt="Cloud" width={500} height={250} className="drop-shadow-lg w-40 sm:w-72 md:w-96 lg:w-[500px] h-auto" />
        </div>
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 animate-float opacity-20">
          <Image src="/images/cloud.png" alt="Cloud" width={350} height={175} className="drop-shadow-lg w-28 sm:w-56 md:w-72 lg:w-[350px] h-auto" />
        </div>
        <div className="absolute top-[40%] left-[-10%] sm:left-[-10%] animate-float-slow opacity-25">
          <Image src="/images/cloud.png" alt="Cloud" width={450} height={225} className="drop-shadow-lg w-36 sm:w-64 md:w-80 lg:w-[450px] h-auto" />
        </div>
        <div className="absolute top-[45%] right-[-12%] sm:right-[-12%] animate-float-slower opacity-20">
          <Image src="/images/cloud.png" alt="Cloud" width={600} height={300} className="drop-shadow-lg w-48 sm:w-80 md:w-96 lg:w-[600px] h-auto" />
        </div>
        <div className="absolute bottom-[20%] left-[5%] sm:left-[5%] animate-float opacity-25">
          <Image src="/images/cloud.png" alt="Cloud" width={400} height={200} className="drop-shadow-lg w-32 sm:w-64 md:w-80 lg:w-96 h-auto" />
        </div>
        <div className="absolute bottom-[10%] right-[-15%] sm:right-[-15%] animate-float-slow opacity-20">
          <Image src="/images/cloud.png" alt="Cloud" width={700} height={350} className="drop-shadow-lg w-56 sm:w-96 md:w-[500px] lg:w-[700px] h-auto" />
        </div>
      </div>

      {/* Hero Section - Compact to fit buttons in viewport, starting from top */}
      <section className="relative z-10 w-full flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-47 sm:pt-28 lg:pt-42 pb-8 sm:pb-12">
        {/* Floating Particles Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-sky-400 rounded-full animate-ping opacity-75"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping animation-delay-1000 opacity-75"></div>
          <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-slate-400 rounded-full animate-ping animation-delay-2000 opacity-75"></div>
        </div>

        {/* Animated Logo with Enhanced Glow */}
        <div className="relative mb-4 sm:mb-6 group">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-400 via-blue-500 to-slate-400 rounded-full blur-2xl opacity-40 group-hover:opacity-60 animate-pulse transition-opacity duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-sky-400 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 animate-spin-slow"></div>
          <Image
            src="/images/logo2.png"
            alt="SpecForge Logo"
            width={120}
            height={120}
            className="relative object-contain w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-300"
            priority
          />
        </div>

        {/* Main Heading with Enhanced Typography */}
        <div className="relative mb-3 sm:mb-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-center leading-tight px-4 mb-2 sm:mb-3">
            <span className="block bg-gradient-to-r from-sky-600 via-blue-600 to-slate-700 dark:from-blue-400 dark:via-purple-400 dark:to-slate-300 bg-clip-text text-transparent animate-gradient">
              SpecForge
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center text-gray-700 dark:text-gray-300 px-4 leading-snug">
            Transform Ideas into{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-sky-600 to-blue-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Perfect Specs</span>
              <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                <path d="M0,7 Q50,0 100,7" stroke="url(#gradient)" strokeWidth="2" fill="none" />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0284c7" className="dark:stop-color-[#60a5fa]" />
                    <stop offset="100%" stopColor="#2563eb" className="dark:stop-color-[#a78bfa]" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </p>
        </div>

        {/* Enhanced Subtitle */}
        <div className="relative mb-4 sm:mb-6 max-w-3xl mx-auto">
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-center text-white dark:text-white px-4 leading-relaxed">
            <span className="inline-flex items-center gap-2 justify-center flex-wrap">
              <span className="text-xl sm:text-2xl">🚀</span>
              <span>Harness the power of AI to generate</span>
            </span>
            <br className="hidden sm:block" />
            <span className="font-semibold bg-gradient-to-r from-sky-600 to-blue-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              IEEE-compliant Software Requirement Specifications
            </span>
            <br className="hidden sm:block" />
            <span>in minutes, not days</span>
          </p>
        </div>

        {/* Enhanced CTA Buttons - More compact */}
        <div className="mt-2 relative flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center px-6 sm:px-8 mb-6 sm:mb-8 w-full max-w-lg sm:max-w-2xl mx-auto">
          <Link
            href="/signup"
            className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 overflow-hidden bg-gradient-to-r from-sky-500 via-blue-600 to-blue-700 text-white text-sm sm:text-base font-bold rounded-2xl shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span className="relative z-10 whitespace-nowrap">Get Started Free</span>
            <svg className="relative z-10 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-r from-sky-600 via-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          <Link
            href="/login"
            className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-900 text-sm sm:text-base font-bold rounded-2xl shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-blue-300 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span className="whitespace-nowrap">Sign In</span>
            <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </Link>
        </div>

        
      </section>

      {/* Features Overview Section */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full mb-4">
            ✨ Discover How AI Can Help You
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            Smart SRS Solutions Tailored
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              for Your Business
            </span>
          </h2>
          <p className="text-base sm:text-lg text-white max-w-3xl mx-auto leading-relaxed px-4">
            SRS Bot provides smart requirement elicitation for your projects, ensuring accurate, efficient, and structured Software Requirement Specifications.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1 */}
          <div className="group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-2xl dark:shadow-blue-900/20 dark:hover:shadow-blue-800/30 transition-all duration-300 overflow-hidden border border-gray-100 dark:border-slate-700/50 hover:border-blue-200 dark:hover:border-blue-600">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <div className="p-6 sm:p-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Image
                  src="/images/2-page/Icon.png"
                  alt="What it Does"
                  width={48}
                  height={48}
                  className="w-10 h-10 sm:w-12 sm:h-12"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                What it Does?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                AI-Powered SRS Generator — Instantly turn your project idea into a structured Software Requirements Specification.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-2xl dark:shadow-purple-900/20 dark:hover:shadow-purple-800/30 transition-all duration-300 overflow-hidden border border-gray-100 dark:border-slate-700/50 hover:border-purple-200 dark:hover:border-purple-600">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <div className="p-6 sm:p-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Image
                  src="/images/2-page/Icon1.png"
                  alt="Why it's Useful"
                  width={48}
                  height={48}
                  className="w-10 h-10 sm:w-12 sm:h-12"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                Why it's Useful?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                Fast, Accurate & Standardized — Save time with IEEE-compliant documents while reducing errors and misinterpretation.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-2xl dark:shadow-emerald-900/20 dark:hover:shadow-emerald-800/30 transition-all duration-300 overflow-hidden border border-gray-100 dark:border-slate-700/50 hover:border-green-200 dark:hover:border-emerald-600 sm:col-span-2 lg:col-span-1">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <div className="p-6 sm:p-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Image
                  src="/images/2-page/Icon2.png"
                  alt="How to Start"
                  width={48}
                  height={48}
                  className="w-10 h-10 sm:w-12 sm:h-12"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                How to Start?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                Start Your Project Today — Begin chatting with the bot and download your ready-to-use SRS in minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Intelligent Requirement Section */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Image - Chatbot */}
          <div className="order-1 lg:order-1 flex justify-center lg:justify-start">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <Image
                src="/images/3-page/image.png"
                alt="Chatbot Interface"
                width={650}
                height={700}
                className="relative object-contain drop-shadow-2xl rounded-2xl w-full max-w-[600px] sm:max-w-[800px] lg:max-w-[700px] transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="order-2 lg:order-2 text-center lg:text-left">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-4">
              💡 Smarter Requirement Discovery
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Intelligent Requirement
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Gathering
              </span>
            </h2>
            <p className="text-base sm:text-lg text-white leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              Collect project requirements effortlessly through conversational AI. The chatbot translates user inputs into structured, precise details, minimizing ambiguity and communication gaps.
            </p>

            {/* Feature List */}
            <ul className="space-y-4 mb-8 text-left max-w-xl mx-auto lg:mx-0">
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white">Conversational AI interface</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white">Structured requirement extraction</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white">Real-time document generation</span>
              </li>
            </ul>

            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <span>Explore Chat</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-20 sm:mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <Image
                src="/images/log.png"
                alt="SpecForge"
                width={120}
                height={48}
                className="mb-4"
              />
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                AI-powered requirements elicitation for modern software projects. Build better, faster, smarter.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/chat" className="hover:text-white transition-colors">Try Chat</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 SpecForge. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float-slower 10s ease-in-out infinite;
        }
        .animate-blob {
          animation: blob 7s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}
