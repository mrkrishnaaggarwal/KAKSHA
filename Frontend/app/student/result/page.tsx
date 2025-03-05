"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import {
  FaChartLine,
  FaFilter,
  FaCalendarAlt,
  FaBook,
  FaCheckCircle,
  FaTimesCircle,
  FaGraduationCap,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

// Type definitions
interface Result {
  id: number;
  exam: string;
  date: string;
  student_id: string;
  subject: string;
  marks: number;
  total_marks: number;
  semester: number;
}

interface Stats {
  totalMarksObtained: number;
  totalMaxMarks: number;
  averagePercentage: string;
}

interface ResultsResponse {
  results: Result[];
  stats: Stats;
}

const examTypeMap: Record<string, string> = {
  Finals: "Final Examination",
  Midterms: "Mid-Term Examination",
  Quarterly: "Quarterly Examination",
};

const Results = () => {
  const router = useRouter();
  const [results, setResults] = useState<Result[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [examTypeFilter, setExamTypeFilter] = useState<string | null>(null);
  const [semesterFilter, setSemesterFilter] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>({
    key: "date",
    direction: "descending",
  });

  // Get available exam types and semesters from data
  const examTypes = [...new Set(results.map((result) => result.exam))];
  const semesters = [...new Set(results.map((result) => result.semester))].sort(
    (a, b) => a - b
  );

  useEffect(() => {
    const fetchResults = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get<{
          statusCode: number;
          data: ResultsResponse;
          message: string;
          success: number;
        }>("http://localhost:8080/api/v1/student/results", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const { results, stats } = response.data.data;
        setResults(results);
        setStats(stats);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch results:", err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }
        setError("Failed to load results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [router]);

  // Calculate grades based on percentage
  const calculateGrade = (marks: number, totalMarks: number): string => {
    const percentage = (marks / totalMarks) * 100;
    if (percentage >= 90) return "A+";
    if (percentage >= 85) return "A";
    if (percentage >= 80) return "A-";
    if (percentage >= 75) return "B+";
    if (percentage >= 70) return "B";
    if (percentage >= 65) return "B-";
    if (percentage >= 60) return "C+";
    if (percentage >= 55) return "C";
    if (percentage >= 50) return "C-";
    if (percentage >= 45) return "D+";
    if (percentage >= 40) return "D";
    if (percentage >= 35) return "D-";
    return "F";
  };

  // Check if passed
  const isPassed = (marks: number): boolean => {
    return marks > 35;
  };

  // Filter results based on selected filters
  const filteredResults = results.filter((result) => {
    // Filter by exam type
    if (examTypeFilter && result.exam !== examTypeFilter) {
      return false;
    }

    // Filter by semester
    if (semesterFilter !== null && result.semester !== semesterFilter) {
      return false;
    }

    return true;
  });

  // Sort the filtered results
  const sortedResults = [...filteredResults].sort((a, b) => {
    if (!sortConfig) return 0;

    let aValue: any = a[sortConfig.key as keyof Result];
    let bValue: any = b[sortConfig.key as keyof Result];

    // Special case for date
    if (sortConfig.key === "date") {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Request sort by column
  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Get sort direction icon for column
  const getSortDirectionIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === "ascending" ? (
      <FaSortAmountUp size={14} className="inline ml-1" />
    ) : (
      <FaSortAmountDown size={14} className="inline ml-1" />
    );
  };

  // Calculate filtered stats
  const calculateFilteredStats = () => {
    if (!filteredResults.length) {
      return {
        totalMarksObtained: 0,
        totalMaxMarks: 0,
        averagePercentage: "0.00",
      };
    }

    const totalMarksObtained = filteredResults.reduce(
      (sum, result) => sum + result.marks,
      0
    );
    const totalMaxMarks = filteredResults.reduce(
      (sum, result) => sum + result.total_marks,
      0
    );
    const averagePercentage = (
      (totalMarksObtained / totalMaxMarks) *
      100
    ).toFixed(2);

    return {
      totalMarksObtained,
      totalMaxMarks,
      averagePercentage,
    };
  };

  const filteredStats = calculateFilteredStats();

  // Prepare chart data
  const chartData = {
    labels: ["Obtained", "Remaining"],
    datasets: [
      {
        data: [
          parseFloat(filteredStats.averagePercentage),
          100 - parseFloat(filteredStats.averagePercentage),
        ],
        backgroundColor: ["#6366F1", "#E2E8F0"],
        borderColor: ["#4F46E5", "#CBD5E1"],
        borderWidth: 1,
        hoverOffset: 5,
      },
    ],
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  // Map exam type to display name
  const getExamTypeDisplay = (examType: string): string => {
    return examTypeMap[examType] || examType;
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-purple-100 via-white to-white min-h-screen p-4 md:p-6 overflow-auto">
      <div className="max-w-7xl mx-auto overflow-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-5">
            <h1 className="text-white text-2xl md:text-3xl font-bold flex items-center">
              <FaGraduationCap className="mr-3" size={28} />
              Academic Results
            </h1>
            <p className="text-blue-100 mt-2 text-lg">
              View and analyze your examination performance
            </p>
          </div>

          {/* Summary Stats */}
          {!loading && !error && stats && (
            <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white border-b border-gray-200">
              <div className="bg-purple-50 rounded-lg p-4 flex flex-col transition-all duration-200 hover:shadow-md border border-purple-100">
                <span className="text-purple-600 text-sm font-medium">
                  Total Subjects
                </span>
                <span className="text-purple-900 text-2xl font-bold">
                  {filteredResults.length}
                </span>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 flex flex-col transition-all duration-200 hover:shadow-md border border-purple-100">
                <span className="text-purple-600 text-sm font-medium">
                  Overall Score
                </span>
                <span className="text-purple-900 text-2xl font-bold">
                  {filteredStats.totalMarksObtained} /{" "}
                  {filteredStats.totalMaxMarks}
                </span>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 flex flex-col transition-all duration-200 hover:shadow-md border border-purple-100">
                <span className="text-purple-600 text-sm font-medium">
                  Average Percentage
                </span>
                <span className="text-purple-900 text-2xl font-bold">
                  {filteredStats.averagePercentage}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center h-80 bg-white rounded-xl shadow-md border border-gray-200">
            <div className="relative">
              <div className="w-12 h-12 border-2 border-gray-200 border-opacity-60 rounded-full"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">
              Loading your academic results...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-auto">
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <FaTimesCircle className="text-red-500" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {error}
              </h3>
              <p className="text-gray-500 mb-4">
                We couldn't load your results. Please try again later.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        )}

        {/* Results Content */}
        {!loading && !error && results.length > 0 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            {/* Filters Section */}
            <div className="p-4 md:p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div>
                    <label
                      htmlFor="examType"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Exam Type
                    </label>
                    <select
                      id="examType"
                      value={examTypeFilter || ""}
                      onChange={(e) =>
                        setExamTypeFilter(e.target.value || null)
                      }
                      className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 sm:text-sm"
                    >
                      <option value="">All Exams</option>
                      {examTypes.map((type) => (
                        <option key={type} value={type}>
                          {getExamTypeDisplay(type)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="semester"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Semester
                    </label>
                    <select
                      id="semester"
                      value={semesterFilter !== null ? semesterFilter : ""}
                      onChange={(e) =>
                        setSemesterFilter(
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                      className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 sm:text-sm"
                    >
                      <option value="">All Semesters</option>
                      {semesters.map((semester) => (
                        <option key={semester} value={semester}>
                          Semester {semester}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FaFilter className="text-purple-400" />
                  <span>
                    Showing{" "}
                    <strong className="font-medium text-purple-700">
                      {filteredResults.length}
                    </strong>{" "}
                    of{" "}
                    <strong className="font-medium text-purple-700">
                      {results.length}
                    </strong>{" "}
                    results
                  </span>
                </div>
              </div>
            </div>

            {/* Chart and Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 md:p-6 border-b border-gray-200">
              {/* Performance Chart */}
              <div className="md:col-span-1 bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300">
                <h3 className="text-gray-700 font-semibold mb-4 flex items-center">
                  <FaChartLine className="mr-2 text-purple-600" />
                  Performance Summary
                </h3>

                <div className="h-48 flex items-center justify-center">
                  <Doughnut
                    data={{
                      labels: ["Obtained", "Remaining"],
                      datasets: [
                        {
                          data: [
                            parseFloat(filteredStats.averagePercentage),
                            100 - parseFloat(filteredStats.averagePercentage),
                          ],
                          backgroundColor: ["#8B5CF6", "#E2E8F0"],
                          borderColor: ["#7C3AED", "#CBD5E1"],
                          borderWidth: 1,
                          hoverOffset: 5,
                        },
                      ],
                    }}
                    options={{
                      cutout: "70%",
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              return `${context.label}: ${context.raw}%`;
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>

                <div className="mt-4 text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {filteredStats.averagePercentage}%
                  </div>
                  <div className="text-sm text-gray-500">Average Score</div>

                  <div className="mt-3 text-center">
                    <div
                      className={`text-sm inline-flex items-center px-2.5 py-1 rounded-full ${
                        parseFloat(filteredStats.averagePercentage) >= 60
                          ? "bg-green-100 text-green-800"
                          : parseFloat(filteredStats.averagePercentage) >= 35
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {parseFloat(filteredStats.averagePercentage) >= 60 ? (
                        <>
                          <FaCheckCircle className="mr-1" />
                          Excellent
                        </>
                      ) : parseFloat(filteredStats.averagePercentage) >= 35 ? (
                        <>
                          <FaCheckCircle className="mr-1" />
                          Satisfactory
                        </>
                      ) : (
                        <>
                          <FaTimesCircle className="mr-1" />
                          Needs Improvement
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Table */}
              <div className="md:col-span-2">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-purple-700"
                          onClick={() => requestSort("subject")}
                        >
                          <div className="flex items-center">
                            <FaBook
                              className="mr-1 text-purple-400"
                              size={12}
                            />
                            Subject
                            {getSortDirectionIcon("subject")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-purple-700"
                          onClick={() => requestSort("semester")}
                        >
                          <div className="flex items-center">
                            <span>Sem</span>
                            {getSortDirectionIcon("semester")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-purple-700"
                          onClick={() => requestSort("date")}
                        >
                          <div className="flex items-center">
                            <FaCalendarAlt
                              className="mr-1 text-purple-400"
                              size={12}
                            />
                            Date
                            {getSortDirectionIcon("date")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-purple-700"
                          onClick={() => requestSort("marks")}
                        >
                          <div className="flex items-center justify-end">
                            <span>Marks</span>
                            {getSortDirectionIcon("marks")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Grade
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <AnimatePresence>
                        {sortedResults.map((result) => (
                          <motion.tr
                            key={result.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                            className="hover:bg-purple-50"
                          >
                            <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                              {result.subject}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {result.semester}
                              </span>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
                              {formatDate(result.date)}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-right font-medium">
                              <span className="font-bold text-gray-800">
                                {result.marks}
                              </span>
                              <span className="text-gray-500">
                                / {result.total_marks}
                              </span>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-center">
                              <span
                                className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                                  calculateGrade(
                                    result.marks,
                                    result.total_marks
                                  ) === "F"
                                    ? "bg-red-100 text-red-800"
                                    : calculateGrade(
                                        result.marks,
                                        result.total_marks
                                      ).includes("A")
                                    ? "bg-green-100 text-green-800"
                                    : calculateGrade(
                                        result.marks,
                                        result.total_marks
                                      ).includes("B")
                                    ? "bg-blue-100 text-blue-800"
                                    : calculateGrade(
                                        result.marks,
                                        result.total_marks
                                      ).includes("C")
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-orange-100 text-orange-800"
                                }`}
                              >
                                {calculateGrade(
                                  result.marks,
                                  result.total_marks
                                )}
                              </span>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-center">
                              {isPassed(result.marks) ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <FaCheckCircle className="mr-1" />
                                  Pass
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  <FaTimesCircle className="mr-1" />
                                  Fail
                                </span>
                              )}
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>

                      {filteredResults.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-3 py-8 text-center text-sm text-gray-500"
                          >
                            <div className="flex flex-col items-center justify-center">
                              <div className="rounded-full bg-gray-100 p-3 mb-3">
                                <FaFilter className="h-6 w-6 text-gray-400" />
                              </div>
                              <p className="font-medium">
                                No results match your filters
                              </p>
                              <p className="mt-1">
                                Try adjusting your search criteria
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Legend with improved styling */}
            <div className="p-4 md:p-6 bg-purple-50 text-xs text-gray-600 rounded-b-xl">
              <div className="flex flex-wrap gap-x-6 gap-y-3 justify-center md:justify-start">
                <div className="flex items-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-800 text-xs font-medium mr-2">
                    A
                  </span>
                  <span>Excellent (85%+)</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-medium mr-2">
                    B
                  </span>
                  <span>Good (65-84%)</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium mr-2">
                    C
                  </span>
                  <span>Average (50-64%)</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-800 text-xs font-medium mr-2">
                    D
                  </span>
                  <span>Below Average (35-49%)</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-800 text-xs font-medium mr-2">
                    F
                  </span>
                  <span>Fail (Below 35%)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Results State */}
        {!loading && !error && results.length === 0 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
                <FaBook className="text-purple-500" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Results Available
              </h3>
              <p className="text-gray-500 mb-4">
                There are no examination results to display at this moment.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
