"use client";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Nav from "../components/Nav";

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-start text-center overflow-hidden bg-cover bg-center bg-no-repeat bg-[url('/images/rays.png')]">
      {/* Navbar at the top */}
      {/* <div className="w-full flex justify-center mt-4 z-20">
        <Nav />
      </div> */}

      {/* Background Rays */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.9),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.9),transparent_70%)]"></div>
      </div>

      {/* 🌥️ Clouds Layer - Hidden on smaller screens */}
      <div className="absolute inset-0 z-0 hidden sm:block">
        {/* Center cloud */}
        <Image
          src="/images/cloud.png"
          alt="Cloud Center"
          width={500}
          height={600}
          className="absolute top-[4%] left-1/2 -translate-x-1/2 opacity-30"
          priority
        />

        {/* Left side clouds (closer to hero text center) */}
        <Image
          src="/images/cloud.png"
          alt="Cloud Left"
          width={500}
          height={300}
          className="absolute top-[8%] left-[-10%] opacity-30"
        />

        {/* Right side clouds (closer to hero text center) */}
        <Image
          src="/images/cloud.png"
          alt="Cloud Right"
          width={500}
          height={300}
          className="absolute top-[8%] right-[-10%] opacity-30"
        />
      </div>

      {/* Hero Section with Clouds */}
      <section className="relative z-10 w-full flex flex-col items-center px-4 mt-10 md:mt-20">
        {/* 🌥️ Clouds Layer (ONLY for hero) - Hidden on smaller screens */}
        <div className="absolute inset-0 z-0 hidden sm:block">
          {/* Left cloud (center of left edge) */}
          <Image
            src="/images/cloud.png"
            alt="Cloud Left"
            width={500}
            height={300}
            className="absolute top-1/3 -translate-y-1/2 left-[-10%] opacity-30"
          />

          {/* Right cloud (center of right edge) */}
          <Image
            src="/images/cloud.png"
            alt="Cloud Right"
            width={500}
            height={300}
            className="absolute top-1/3 -translate-y-1/2 right-[-10%] opacity-30"
          />
        </div>

        {/* Floating Logo */}
        <div className="relative z-10 flex items-center justify-center mb-1">
          <Image
            src="/images/Logo2.png"
            alt="Logo"
            width={100}
            height={72}
            className="object-contain w-[80px] md:w-[120px]"
            priority
          />
        </div>

        {/* Heading */}
        <h1 className="relative z-10 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-md text-gray-900 max-w-4xl leading-tight px-4">
          SpecForge - Smart Requirements Elicitation Chatbot using NLP
        </h1>

        {/* Subtitle */}
        <p className="relative z-10 mt-4 text-gray-600 text-xs sm:text-sm md:text-base px-4 max-w-xl">
          Your journey to AI-powered SRS generator starts here
        </p>

        {/* CTA Buttons */}
        <div className="relative z-10 mt-6 justify-center flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none px-4">
          <Link
            href="/signup"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base rounded-lg shadow-md flex items-center justify-center gap-2 transition"
          >
            Get Started →
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white text-sm md:text-base rounded-lg shadow-md transition"
          >
            Login
          </Link>
        </div>

        {/* Footer Note */}
        <p className="relative z-10 mt-10 sm:mt-30 text-gray-900 text-xs md:text-sm px-4">
          Adopted by projects aiming for clarity, efficiency, and accuracy
        </p>
      </section>

      {/* ================== Info Section ================== */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 mt-20 md:mt-45 mb-16 sm:mb-28 text-center">
        {/* Sub-heading */}
        <p className="text-sm font-medium" style={{ color: "#774be5" }}>
          Discover How AI Can Help You
        </p>

        {/* Main Heading */}
        <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-md text-gray-900 px-4">
          Smart SRS Chatbot Solutions Tailored for Your Business
        </h2>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-xs sm:text-sm md:text-base px-4">
          SRS Bot provides smart requirement elicitation for your projects,
          ensuring accurate, efficient, and structured Software Requirement
          Specifications.
        </p>

        {/* Info Cards */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-4">
          {/* Card 1 */}
          <div className="p-4 sm:p-6 bg-white rounded-xl shadow-xl hover:shadow-lg transition flex flex-col items-start text-left min-h-[220px] sm:min-h-[280px]">
            <Image
              src="/images/2-page/icon.png"
              alt="What it Does"
              width={48}
              height={34}
              className="mb-3 sm:mb-4 rounded-xl w-12 h-auto sm:w-[68px]"
            />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              What it Does?
            </h3>
            <p className="mt-2 text-gray-600 text-sm sm:text-md leading-relaxed">
              AI-Powered SRS Generator — Instantly turn your project idea into a
              structured Software Requirements Specification.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-4 sm:p-6 bg-white rounded-xl shadow-xl hover:shadow-lg transition flex flex-col items-start text-left min-h-[220px] sm:min-h-[280px]">
            <Image
              src="/images/2-page/icon1.png"
              alt="Why it's Useful"
              width={48}
              height={34}
              className="mb-3 sm:mb-4 rounded-xl w-12 h-auto sm:w-[68px]"
            />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Why it's Useful?
            </h3>
            <p className="mt-2 text-gray-600 text-sm sm:text-md leading-relaxed">
              Fast, Accurate & Standardized — Save time with IEEE-compliant
              documents while reducing errors and misinterpretation.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-4 sm:p-6 bg-white rounded-xl shadow-xl hover:shadow-lg transition flex flex-col items-start text-left min-h-[220px] sm:min-h-[280px]">
            <Image
              src="/images/2-page/icon2.png"
              alt="How to Start"
              width={48}
              height={34}
              className="mb-3 sm:mb-4 rounded-xl w-12 h-auto sm:w-[68px]"
            />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              How to Start?
            </h3>
            <p className="mt-2 text-gray-600 text-sm sm:text-md leading-relaxed">
              Start Your Project Today — Begin chatting with the bot and
              download your ready-to-use SRS in minutes.
            </p>
          </div>
        </div>
      </section>

      {/* ================== Insights Section ================== */}
      <section className="relative z-10 w-full max-w-7xl mx-auto mt-16 sm:mt-30 px-4 sm:px-10 py-12 sm:py-20 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12 items-center">
        {/* 🌥️ Clouds Layer - Hidden on mobile */}
        <div className="absolute inset-0 -z-10 hidden sm:block">
          {/* Top-left cloud */}
          <Image
            src="/images/cloud.png"
            alt="Cloud Top Left"
            width={500}
            height={300}
            className="absolute top-[-10%] left-[-10%] opacity-25"
          />
          {/* Bottom-right cloud */}
          <Image
            src="/images/cloud.png"
            alt="Cloud Bottom Right"
            width={800}
            height={300}
            className="absolute bottom-[-20%] right-[-17%] opacity-25"
          />
        </div>

        {/* Left Content */}
        <div className="text-left">
          <p
            className="max-w-54 mb-2 rounded-xl p-2 text-xs sm:text-sm font-medium inline-block"
            style={{ color: "#0084FF", backgroundColor: "#E6F3FF" }}
          >
            Smarter Requirement Discovery
          </p>
          <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-md text-gray-900">
            Intelligent Requirement Gathering
          </h2>
          <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-md leading-relaxed max-w-lg">
            Collect project requirements effortlessly through conversational AI.
            The chatbot translates user inputs into structured, precise details,
            minimizing ambiguity and communication gaps.
          </p>

          {/* CTA Button */}
          <Link
            href="/explore-chat"
            className="mt-4 sm:mt-6 inline-block px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition text-sm sm:text-base"
          >
            Explore Chat →
          </Link>
        </div>

        {/* Right Image */}
        <div className="flex justify-center mt-6 md:mt-0">
          <Image
            src="/images/3-page/image.png"
            alt="Chatbot Mockup"
            width={450}
            height={300}
            className="object-contain drop-shadow-xl rounded-2xl w-full max-w-[350px] md:max-w-[450px]"
          />
        </div>
      </section>

      <section className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-10 py-12 sm:py-20 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12 items-center">
        {/* 🌥️ Clouds Layer - Hidden on mobile */}
        <div className="absolute inset-0 -z-10 hidden sm:block">
          {/* Top-left cloud */}
          <Image
            src="/images/cloud.png"
            alt="Cloud Top Left"
            width={700}
            height={300}
            className="absolute top-[-10%] left-[-20%] opacity-25"
          />
          {/* Bottom-right cloud */}
          <Image
            src="/images/cloud.png"
            alt="Cloud Bottom Right"
            width={800}
            height={300}
            className="absolute bottom-[-10%] right-[-20%] opacity-25"
          />
        </div>
      </section>

      {/* <section className="relative z-10 w-full max-w-7xl mx-auto mb-16 sm:mb-30 px-4 sm:px-10 py-12 sm:py-20 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12 items-center"></section> */}

      {/* Footer Section */}
      <footer className="relative z-10 w-full bg-gray-900 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Image
                src="/images/log.png"
                alt="SRS Bot Logo"
                width={100}
                height={40}
                className="mb-3"
              />
              <p className="text-gray-400 text-sm">
                AI-powered requirements elicitation for software projects
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              <Link
                href="/about"
                className="text-gray-300 hover:text-white text-sm"
              >
                About
              </Link>
              <Link
                href="/pricing"
                className="text-gray-300 hover:text-white text-sm"
              >
                Pricing
              </Link>
              <Link
                href="/contact"
                className="text-gray-300 hover:text-white text-sm"
              >
                Contact
              </Link>
              <Link
                href="/privacy"
                className="text-gray-300 hover:text-white text-sm"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-6 text-center text-gray-400 text-xs">
            © 2025 Smart Elicitation Bot. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
