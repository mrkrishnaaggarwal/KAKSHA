"use client";

import React, { useState } from "react";
import ResultCard from "@/app/components/ResultCard";
import { Download, Calendar } from "lucide-react";

const Results = () => {
  // Static data for results
  const staticData = [
    {
      code: "ENG252",
      subjectTitle: "English",
      creditPoint: 4.5,
      grade: "A",
      obtainedMarks: 85,
      maxMarks: 100,
    },
    {
      code: "PHY252",
      subjectTitle: "Physics",
      creditPoint: 4.0,
      grade: "B",
      obtainedMarks: 75,
      maxMarks: 100,
    },
    {
      code: "MAIC252",
      subjectTitle: "Mathematics",
      creditPoint: 4.5,
      grade: "A",
      obtainedMarks: 90,
      maxMarks: 100,
    },
    {
      code: "CHEM175",
      subjectTitle: "Organic Chemistry",
      creditPoint: 4.0,
      grade: "C+",
      obtainedMarks: 68,
      maxMarks: 100,
    },
    {
      code: "COMP265",
      subjectTitle: "Data Structures",
      creditPoint: 4.5,
      grade: "A-",
      obtainedMarks: 87,
      maxMarks: 100,
    },
    {
      code: "HIST145",
      subjectTitle: "World History",
      creditPoint: 3.0,
      grade: "B",
      obtainedMarks: 78,
      maxMarks: 100,
    },
    {
      code: "ECON101",
      subjectTitle: "Principles of Economics",
      creditPoint: 3.5,
      grade: "B-",
      obtainedMarks: 74,
      maxMarks: 100,
    },
    {
      code: "PSYC205",
      subjectTitle: "Cognitive Psychology",
      creditPoint: 3.0,
      grade: "A",
      obtainedMarks: 30,
      maxMarks: 100,
    },
  ];

  // State to manage results
  const [result, setResult] = useState(staticData);
  const [selectedExam, setSelectedExam] = useState("exam1");

  // Calculate summary statistics
  const totalObtainedMarks = result.reduce(
    (sum, item) => sum + item.obtainedMarks,
    0
  );
  const totalMaxMarks = result.reduce((sum, item) => sum + item.maxMarks, 0);
  const percentage = (totalObtainedMarks / totalMaxMarks) * 100;

  return (
    <div className="flex w-full min-h-screen bg-gray-50 overflow-auto">
      {/* Main Content */}
      <div className="w-full px-6 py-8 md:px-12">
        <div className="flex flex-col">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Academic Results
            </h1>
            <p className="mt-2 text-gray-600">
              Review your examination performance
            </p>
          </div>

          {/* Controls Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Left side - Stats */}
            <div className="flex flex-col">
              <div className="text-sm text-gray-500 mb-1">
                Overall Performance
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-800">
                  {percentage.toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500 mb-1">
                  ({totalObtainedMarks}/{totalMaxMarks})
                </span>
              </div>
            </div>

            {/* Right side - Controls */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  className="pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  value={selectedExam}
                  onChange={(e) => {
                    setSelectedExam(e.target.value);
                    console.log("Selected exam:", e.target.value);
                  }}
                >
                  <option value="exam1">Mid-Term Examination</option>
                  <option value="exam2">Final Examination</option>
                  <option value="exam3">Quarterly Examination</option>
                </select>
              </div>

              <button
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg transition-colors shadow-sm"
                onClick={() => {
                  console.log("Download button clicked");
                }}
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="w-full mb-8">
            <ResultCard results={result} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
