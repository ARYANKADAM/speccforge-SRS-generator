"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Nav from "../components/Nav";

export default function SRSFormPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    projectName: "",
    purpose: "",
    scope: "",
    definitions: "",
    references: "",
    productPerspective: "",
    productFunctions: "",
    userClasses: "",
    operatingEnvironment: "",
    constraints: "",
    userDocumentation: "",
    assumptions: "",
    features: [{ name: "", description: "", requirements: "" }],
    userInterfaces: "",
    hardwareInterfaces: "",
    softwareInterfaces: "",
    communicationInterfaces: "",
    performance: "",
    security: "",
    reliability: "",
    maintainability: "",
    usability: "",
    portability: "",
    businessRules: "",
    legalCompliance: "",
    standardsCompliance: "",
    glossary: "",
    notes: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [srs, setSrs] = useState("");
  const [cloudinaryUrl, setCloudinaryUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [currentSection, setCurrentSection] = useState("introduction");
  const [error, setError] = useState("");

  useEffect(() => {
    // Check for token
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFeatureChange = (index, field, value) => {
    const updatedFeatures = [...form.features];
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
    setForm({ ...form, features: updatedFeatures });
  };

  const addFeature = () => {
    setForm({
      ...form,
      features: [...form.features, { name: "", description: "", requirements: "" }],
    });
  };

  const removeFeature = (index) => {
    const updatedFeatures = [...form.features];
    updatedFeatures.splice(index, 1);
    setForm({ ...form, features: updatedFeatures });
  };

  const generateSRS = async () => {
    if (!form.projectName || !form.purpose || !form.scope) {
      setError("Project Name, Purpose, and Scope are required fields");
      return;
    }

    setLoading(true);
    setError("");
    
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    
    try {
      const res = await fetch("/api/create-doc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate SRS");
      }
      
      const data = await res.json();
      setSrs(data.srs || "");
      setCloudinaryUrl(data.cloudinaryUrl || "");
      setPdfUrl(data.pdfUrl || "");
      setCurrentSection("preview");
    } catch (error) {
      console.error("Error generating SRS:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Only validate the form when submitting, but don't generate SRS yet
    if (!form.projectName || !form.purpose || !form.scope) {
      setError("Project Name, Purpose, and Scope are required fields");
      return;
    }
    setError("");
    // Let the user review their input in the appendices section before generating
    setCurrentSection("appendices");
  };

  const renderSection = () => {
    switch (currentSection) {
      case "introduction":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-sky-100 to-blue-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-xl">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">1. Introduction</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="inline-flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 gap-2">
                  Project Name
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="projectName"
                  value={form.projectName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-blue-500 focus:border-sky-500 dark:focus:border-blue-500 transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600 resize-none"
                  rows={3}
                  placeholder="Enter your project name..."
                  required
                />
              </div>
              <div>
                <label className="inline-flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 gap-2">
                  Purpose
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="purpose"
                  value={form.purpose}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-blue-500 focus:border-sky-500 dark:focus:border-blue-500 transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600 resize-none"
                  placeholder="Describe the purpose..."
                  required
                  rows={3}
                />
              </div>
              <div>
                <label className="inline-flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 gap-2">
                  Scope
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="scope"
                  value={form.scope}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-blue-500 focus:border-sky-500 dark:focus:border-blue-500 transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600 resize-none"
                  placeholder="Define the scope..."
                  required
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Definitions/Acronyms</label>
                <textarea
                  name="definitions"
                  value={form.definitions}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-blue-500 focus:border-sky-500 dark:focus:border-blue-500 transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600 resize-none"
                  placeholder="Add definitions and acronyms..."
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">References</label>
                <textarea
                  name="references"
                  value={form.references}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-blue-500 focus:border-sky-500 dark:focus:border-blue-500 transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600 resize-none"
                  placeholder="Add references..."
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setCurrentSection("description")}
                className="group relative px-6 py-3 overflow-hidden bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">Next: Overall Description</span>
                <svg className="relative z-10 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        );
        
      case "description":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-sky-100 to-blue-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-xl">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">2. Overall Description</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Product Perspective</label>
                <textarea
                  name="productPerspective"
                  value={form.productPerspective}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-blue-500 focus:border-sky-500 dark:focus:border-blue-500 transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600 resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Product Functions</label>
                <textarea
                  name="productFunctions"
                  value={form.productFunctions}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-blue-500 focus:border-sky-500 dark:focus:border-blue-500 transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600 resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">User Classes</label>
                <textarea
                  name="userClasses"
                  value={form.userClasses}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-blue-500 focus:border-sky-500 dark:focus:border-blue-500 transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600 resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Operating Environment</label>
                <textarea
                  name="operatingEnvironment"
                  value={form.operatingEnvironment}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-blue-500 focus:border-sky-500 dark:focus:border-blue-500 transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600 resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Constraints</label>
                <textarea
                  name="constraints"
                  value={form.constraints}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-blue-500 focus:border-sky-500 dark:focus:border-blue-500 transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600 resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">User Documentation</label>
                <textarea
                  name="userDocumentation"
                  value={form.userDocumentation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-blue-500 focus:border-sky-500 dark:focus:border-blue-500 transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600 resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Assumptions & Dependencies</label>
                <textarea
                  name="assumptions"
                  value={form.assumptions}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-blue-500 focus:border-sky-500 dark:focus:border-blue-500 transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600 resize-none"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentSection("introduction")}
                className="group px-6 py-3 bg-white/60 backdrop-blur-sm text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-white/80 transition-all duration-300 flex items-center gap-2"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentSection("features")}
                className="group relative px-6 py-3 overflow-hidden bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">Next: Features</span>
                <svg className="relative z-10 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        );
        
      case "features":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-sky-100 to-blue-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-xl">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">3. System Features</h3>
            </div>
            
            {form.features.map((feature, index) => (
              <div key={index} className="p-5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl shadow-sm mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Feature {index + 1}</h4>
                  {form.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center transition-colors duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Remove
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Name</label>
                    <input
                      value={feature.name}
                      onChange={(e) => handleFeatureChange(index, "name", e.target.value)}
                      className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-blue-500 focus:border-sky-500 dark:focus:border-blue-500 transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                    <textarea
                      value={feature.description}
                      onChange={(e) => handleFeatureChange(index, "description", e.target.value)}
                      className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-blue-500 focus:border-sky-500 dark:focus:border-blue-500 transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600 resize-none"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Requirements</label>
                    <textarea
                      value={feature.requirements}
                      onChange={(e) => handleFeatureChange(index, "requirements", e.target.value)}
                      className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-blue-500 focus:border-sky-500 dark:focus:border-blue-500 transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600 resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addFeature}
              className="group relative px-6 py-3 overflow-hidden bg-gradient-to-r from-emerald-500 to-green-600 dark:from-emerald-600 dark:to-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-emerald-500/50 dark:hover:shadow-emerald-600/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-700 dark:from-emerald-700 dark:to-green-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <svg xmlns="http://www.w3.org/2000/svg" className="relative z-10 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span className="relative z-10">Add Another Feature</span>
            </button>
            
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentSection("description")}
                className="group px-6 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm text-gray-700 dark:text-gray-300 font-semibold rounded-xl border-2 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 flex items-center gap-2"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentSection("interfaces")}
                className="group relative px-6 py-3 overflow-hidden bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">Next: Interfaces</span>
                <svg className="relative z-10 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        );
        
      case "interfaces":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-sky-100 to-blue-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-xl">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">4. External Interface Requirements</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">User Interfaces</label>
                <textarea
                  name="userInterfaces"
                  value={form.userInterfaces}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-blue-500 focus:border-sky-500 dark:focus:border-blue-500 transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600 resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Hardware Interfaces</label>
                <textarea
                  name="hardwareInterfaces"
                  value={form.hardwareInterfaces}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-blue-500 focus:border-sky-500 dark:focus:border-blue-500 transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600 resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Software Interfaces</label>
                <textarea
                  name="softwareInterfaces"
                  value={form.softwareInterfaces}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-blue-500 focus:border-sky-500 dark:focus:border-blue-500 transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600 resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Communication Interfaces</label>
                <textarea
                  name="communicationInterfaces"
                  value={form.communicationInterfaces}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-blue-500 focus:border-sky-500 dark:focus:border-blue-500 transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600 resize-none"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentSection("features")}
                className="group px-6 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm text-gray-700 dark:text-gray-300 font-semibold rounded-xl border-2 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 flex items-center gap-2"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentSection("nonfunctional")}
                className="group relative px-6 py-3 overflow-hidden bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">Next: Non-Functional Requirements</span>
                <svg className="relative z-10 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        );
        
      case "nonfunctional":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-sky-100 to-blue-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-xl">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">5. Non-Functional Requirements</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Performance Requirements</label>
                <textarea
                  name="performance"
                  value={form.performance}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-blue-500 focus:border-sky-500 dark:focus:border-blue-500 transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600 resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Security Requirements</label>
                <textarea
                  name="security"
                  value={form.security}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-blue-500 focus:border-sky-500 dark:focus:border-blue-500 transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600 resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Reliability & Availability</label>
                <textarea
                  name="reliability"
                  value={form.reliability}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-blue-500 focus:border-sky-500 dark:focus:border-blue-500 transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600 resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Maintainability & Supportability</label>
                <textarea
                  name="maintainability"
                  value={form.maintainability}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-blue-500 focus:border-sky-500 dark:focus:border-blue-500 transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600 resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Usability</label>
                <textarea
                  name="usability"
                  value={form.usability}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-blue-500 focus:border-sky-500 dark:focus:border-blue-500 transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600 resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Portability</label>
                <textarea
                  name="portability"
                  value={form.portability}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-blue-500 focus:border-sky-500 dark:focus:border-blue-500 transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600 resize-none"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentSection("interfaces")}
                className="group px-6 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm text-gray-700 dark:text-gray-300 font-semibold rounded-xl border-2 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 flex items-center gap-2"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentSection("other")}
                className="group relative px-6 py-3 overflow-hidden bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">Next: Other Requirements</span>
                <svg className="relative z-10 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        );
        
      case "other":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-sky-100 to-blue-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-xl">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">6. Other Requirements</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Business Rules</label>
                <textarea
                  name="businessRules"
                  value={form.businessRules}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-blue-500 focus:border-sky-500 dark:focus:border-blue-500 transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600 resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Legal/Regulatory Compliance</label>
                <textarea
                  name="legalCompliance"
                  value={form.legalCompliance}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-blue-500 focus:border-sky-500 dark:focus:border-blue-500 transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600 resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Standards Compliance</label>
                <textarea
                  name="standardsCompliance"
                  value={form.standardsCompliance}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-blue-500 focus:border-sky-500 dark:focus:border-blue-500 transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600 resize-none"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentSection("nonfunctional")}
                className="group px-6 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm text-gray-700 dark:text-gray-300 font-semibold rounded-xl border-2 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 flex items-center gap-2"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentSection("appendices")}
                className="group relative px-6 py-3 overflow-hidden bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">Next: Appendices</span>
                <svg className="relative z-10 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        );
        
      case "appendices":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-sky-100 to-blue-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-xl">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">7. Appendices</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Glossary</label>
                <textarea
                  name="glossary"
                  value={form.glossary}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-blue-500 focus:border-sky-500 dark:focus:border-blue-500 transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600 resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Other Notes</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 dark:focus:ring-blue-500 focus:border-sky-500 dark:focus:border-blue-500 transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600 resize-none"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentSection("other")}
                className="group px-6 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm text-gray-700 dark:text-gray-300 font-semibold rounded-xl border-2 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 flex items-center gap-2"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <button
                type="button"
                onClick={generateSRS}
                className="group relative px-6 py-3 overflow-hidden bg-gradient-to-r from-emerald-500 to-green-600 dark:from-emerald-600 dark:to-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-emerald-500/50 dark:hover:shadow-emerald-600/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                disabled={loading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-700 dark:from-emerald-700 dark:to-green-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {loading ? (
                  <span className="relative flex items-center gap-2 z-10">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="relative z-10 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
                    </svg>
                    <span className="relative z-10">Generate SRS Document</span>
                  </>
                )}
              </button>
            </div>
          </div>
        );
        
      case "preview":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40 rounded-xl">
                <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">Generated SRS Document</h3>
            </div>
            
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl flex items-center gap-3">
                <svg className="h-6 w-6 text-red-500 dark:text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl shadow-lg p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Document Download</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  {pdfUrl ? (
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative px-6 py-3 overflow-hidden bg-gradient-to-r from-emerald-500 to-green-600 dark:from-emerald-600 dark:to-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-emerald-500/50 dark:hover:shadow-emerald-600/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-700 dark:from-emerald-700 dark:to-green-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="relative z-10 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                      </svg>
                      <span className="relative z-10">Download PDF</span>
                    </a>
                  ) : null}
                  {cloudinaryUrl ? (
                    <a
                      href={cloudinaryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative px-6 py-3 overflow-hidden bg-gradient-to-r from-sky-500 to-blue-600 dark:from-blue-600 dark:to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/50 dark:hover:shadow-blue-600/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-blue-700 dark:from-blue-700 dark:to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="relative z-10 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span className="relative z-10">Download Markdown</span>
                    </a>
                  ) : null}
                  {!pdfUrl && !cloudinaryUrl ? (
                    <span className="text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 px-4 py-2 rounded-xl border border-yellow-200 dark:border-yellow-800 text-sm">
                      Note: Upload failed. Document was saved to database only.
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-slate-900/60 p-6 rounded-xl border border-gray-200 dark:border-slate-700 overflow-auto max-h-[500px]">
                <pre className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono text-sm">{srs}</pre>
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentSection("appendices")}
                className="group px-6 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm text-gray-700 dark:text-gray-300 font-semibold rounded-xl border-2 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 flex items-center gap-2"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Form
              </button>
              <Link href="/" className="group relative px-6 py-3 overflow-hidden bg-gradient-to-r from-emerald-500 to-green-600 dark:from-emerald-600 dark:to-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-emerald-500/50 dark:hover:shadow-emerald-600/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-2">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-700 dark:from-emerald-700 dark:to-green-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg xmlns="http://www.w3.org/2000/svg" className="relative z-10 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="relative z-10">Back to Home</span>
              </Link>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-gray-100 dark:from-slate-950 dark:via-blue-950 dark:to-gray-900">
      {/* Navbar */}
      <Nav />
      
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-sky-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-slate-300 dark:bg-slate-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      {/* 🌥️ Clouds Layer - Hidden on smaller screens */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden hidden sm:block">
        <div className="absolute top-[10%] left-[-5%] animate-float-slow opacity-30">
          <Image src="/images/cloud.png" alt="Cloud" width={400} height={200} className="drop-shadow-lg" />
        </div>
        <div className="absolute bottom-[15%] right-[-8%] animate-float-slower opacity-25">
          <Image src="/images/cloud.png" alt="Cloud" width={500} height={250} className="drop-shadow-lg" />
        </div>
      </div>

      <div className="container mx-auto px-4 pt-28 pb-12 relative z-10">
        <div className="max-w-5xl mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-white/50 dark:border-slate-700/50 p-6 md:p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-blue-500/5 to-slate-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-slate-500/10 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-gradient-to-br from-sky-100 to-blue-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-2xl shadow-lg mb-4">
                <svg className="h-12 w-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-sky-600 via-blue-600 to-slate-700 dark:from-blue-400 dark:via-purple-400 dark:to-slate-300 bg-clip-text text-transparent mb-3">
                Create SRS Document
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Fill out the form below to generate a comprehensive Software Requirements Specification document
              </p>
            </div>
            
            {/* Progress Navigation */}
            <div className="mb-8">
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                  <button
                    type="button"
                    onClick={() => setCurrentSection("introduction")}
                    className={`group relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      currentSection === "introduction" 
                        ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-blue-500/30" 
                        : "bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-white/80 hover:shadow-md border border-gray-200"
                    }`}
                  >
                    {currentSection === "introduction" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                    <span className="relative z-10">1. Introduction</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentSection("description")}
                    className={`group relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      currentSection === "description" 
                        ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-blue-500/30" 
                        : "bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-white/80 hover:shadow-md border border-gray-200"
                    }`}
                  >
                    {currentSection === "description" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                    <span className="relative z-10">2. Description</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentSection("features")}
                    className={`group relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      currentSection === "features" 
                        ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-blue-500/30" 
                        : "bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-white/80 hover:shadow-md border border-gray-200"
                    }`}
                  >
                    {currentSection === "features" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                    <span className="relative z-10">3. Features</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentSection("interfaces")}
                    className={`group relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      currentSection === "interfaces" 
                        ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-blue-500/30" 
                        : "bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-white/80 hover:shadow-md border border-gray-200"
                    }`}
                  >
                    {currentSection === "interfaces" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                    <span className="relative z-10">4. Interfaces</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentSection("nonfunctional")}
                    className={`group relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      currentSection === "nonfunctional" 
                        ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-blue-500/30" 
                        : "bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-white/80 hover:shadow-md border border-gray-200"
                    }`}
                  >
                    {currentSection === "nonfunctional" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                    <span className="relative z-10">5. Non-Functional</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentSection("other")}
                    className={`group relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      currentSection === "other" 
                        ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-blue-500/30" 
                        : "bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-white/80 hover:shadow-md border border-gray-200"
                    }`}
                  >
                    {currentSection === "other" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                    <span className="relative z-10">6. Other</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentSection("appendices")}
                    className={`group relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      currentSection === "appendices" 
                        ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-blue-500/30" 
                        : "bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-white/80 hover:shadow-md border border-gray-200"
                    }`}
                  >
                    {currentSection === "appendices" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                    <span className="relative z-10">7. Appendices</span>
                  </button>
              </div>
            </div>
          
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl mb-6 flex items-center gap-3">
                <svg className="h-6 w-6 text-red-500 dark:text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            {renderSection()}
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}
