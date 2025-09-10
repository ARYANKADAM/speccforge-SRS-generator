"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">1. Introduction</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
                <textarea
                  name="projectName"
                  value={form.projectName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose *</label>
                <textarea
                  name="purpose"
                  value={form.purpose}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scope *</label>
                <textarea
                  name="scope"
                  value={form.scope}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Definitions/Acronyms</label>
                <textarea
                  name="definitions"
                  value={form.definitions}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">References</label>
                <textarea
                  name="references"
                  value={form.references}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentSection("description")}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition shadow-md"
              >
                Next: Overall Description
              </button>
            </div>
          </div>
        );
        
      case "description":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">2. Overall Description</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Perspective</label>
                <textarea
                  name="productPerspective"
                  value={form.productPerspective}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Functions</label>
                <textarea
                  name="productFunctions"
                  value={form.productFunctions}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User Classes</label>
                <textarea
                  name="userClasses"
                  value={form.userClasses}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Operating Environment</label>
                <textarea
                  name="operatingEnvironment"
                  value={form.operatingEnvironment}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Constraints</label>
                <textarea
                  name="constraints"
                  value={form.constraints}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User Documentation</label>
                <textarea
                  name="userDocumentation"
                  value={form.userDocumentation}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assumptions & Dependencies</label>
                <textarea
                  name="assumptions"
                  value={form.assumptions}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentSection("introduction")}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition shadow-md"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentSection("features")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
              >
                Next: Features
              </button>
            </div>
          </div>
        );
        
      case "features":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">3. System Features</h3>
            
            {form.features.map((feature, index) => (
              <div key={index} className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-medium text-gray-800">Feature {index + 1}</h4>
                  {form.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-500 hover:text-red-700 flex items-center"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      value={feature.name}
                      onChange={(e) => handleFeatureChange(index, "name", e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={feature.description}
                      onChange={(e) => handleFeatureChange(index, "description", e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                    <textarea
                      value={feature.requirements}
                      onChange={(e) => handleFeatureChange(index, "requirements", e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addFeature}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-md flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Another Feature
            </button>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentSection("description")}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition shadow-md"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentSection("interfaces")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
              >
                Next: Interfaces
              </button>
            </div>
          </div>
        );
        
      case "interfaces":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">4. External Interface Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User Interfaces</label>
                <textarea
                  name="userInterfaces"
                  value={form.userInterfaces}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hardware Interfaces</label>
                <textarea
                  name="hardwareInterfaces"
                  value={form.hardwareInterfaces}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Software Interfaces</label>
                <textarea
                  name="softwareInterfaces"
                  value={form.softwareInterfaces}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Communication Interfaces</label>
                <textarea
                  name="communicationInterfaces"
                  value={form.communicationInterfaces}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentSection("features")}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition shadow-md"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentSection("nonfunctional")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
              >
                Next: Non-Functional Requirements
              </button>
            </div>
          </div>
        );
        
      case "nonfunctional":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">5. Non-Functional Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Performance Requirements</label>
                <textarea
                  name="performance"
                  value={form.performance}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Security Requirements</label>
                <textarea
                  name="security"
                  value={form.security}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reliability & Availability</label>
                <textarea
                  name="reliability"
                  value={form.reliability}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maintainability & Supportability</label>
                <textarea
                  name="maintainability"
                  value={form.maintainability}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usability</label>
                <textarea
                  name="usability"
                  value={form.usability}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Portability</label>
                <textarea
                  name="portability"
                  value={form.portability}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentSection("interfaces")}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition shadow-md"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentSection("other")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
              >
                Next: Other Requirements
              </button>
            </div>
          </div>
        );
        
      case "other":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">6. Other Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Rules</label>
                <textarea
                  name="businessRules"
                  value={form.businessRules}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Legal/Regulatory Compliance</label>
                <textarea
                  name="legalCompliance"
                  value={form.legalCompliance}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Standards Compliance</label>
                <textarea
                  name="standardsCompliance"
                  value={form.standardsCompliance}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentSection("nonfunctional")}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition shadow-md"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentSection("appendices")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
              >
                Next: Appendices
              </button>
            </div>
          </div>
        );
        
      case "appendices":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">7. Appendices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Glossary</label>
                <textarea
                  name="glossary"
                  value={form.glossary}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Other Notes</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentSection("other")}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition shadow-md"
              >
                Back
              </button>
              <button
                type="button"
                onClick={generateSRS}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-md flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
                    </svg>
                    Generate SRS Document
                  </>
                )}
              </button>
            </div>
          </div>
        );
        
      case "preview":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Generated SRS Document</h3>
            
            {error && (
              <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg mb-4">
                {error}
              </div>
            )}
            
            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h4 className="text-lg font-medium text-gray-800">Markdown Preview</h4>
                {cloudinaryUrl ? (
                  <a
                    href={cloudinaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Download from Cloudinary
                  </a>
                ) : (
                  <span className="text-yellow-600 bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200">
                    Note: Cloudinary upload failed. Document was saved to database only.
                  </span>
                )}
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 overflow-auto max-h-[500px]">
                <pre className="text-gray-800 whitespace-pre-wrap font-mono text-sm">{srs}</pre>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentSection("appendices")}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition shadow-md"
              >
                Back to Form
              </button>
              <Link href="/" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-md flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden bg-cover bg-center bg-no-repeat bg-[url('/images/rays.png')]">
      {/* Background Rays */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.9),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.9),transparent_70%)]"></div>
      </div>

      {/* 🌥️ Clouds Layer - Hidden on smaller screens */}
      <div className="absolute inset-0 z-0 hidden sm:block">
        <Image
          src="/images/cloud.png"
          alt="Cloud Bottom Right"
          width={700}
          height={300}
          className="absolute bottom-[-10%] right-[-20%] opacity-25"
        />
        <Image
          src="/images/cloud.png"
          alt="Cloud Top Left"
          width={500}
          height={300}
          className="absolute top-[8%] left-[-10%] opacity-30"
        />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Software Requirements Specification (SRS) Form</h2>
          
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setCurrentSection("introduction")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    currentSection === "introduction" ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  1. Introduction
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentSection("description")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    currentSection === "description" ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  2. Description
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentSection("features")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    currentSection === "features" ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  3. Features
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentSection("interfaces")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    currentSection === "interfaces" ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  4. Interfaces
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentSection("nonfunctional")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    currentSection === "nonfunctional" ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  5. Non-Functional
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentSection("other")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    currentSection === "other" ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  6. Other
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentSection("appendices")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    currentSection === "appendices" ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  7. Appendices
                </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">
                {error}
              </div>
            )}
            {renderSection()}
          </form>
        </div>
      </div>
    </div>
  );
}