"use client";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

function OverviewGraph() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  interface DataPoint {
    subject: string;
    Performance: number;
    Attendance: number;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("🔍 Starting data fetch process...");
        setLoading(true);
        const token = localStorage.getItem("token");
        console.log("🔑 Token exists:", !!token);

        // Fetch results for performance data
        console.log("📊 Fetching results data...");
        const resultsResponse = await axios.get(
          "http://localhost:8080/api/v1/student/results",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        console.log("📊 Results data received:", resultsResponse.data);
        
        // Check the exact structure of the response
        console.log("📊 Results data structure:", {
          hasData: !!resultsResponse.data.data,
          dataType: typeof resultsResponse.data.data,
          isArray: Array.isArray(resultsResponse.data.data),
          hasResults: !!resultsResponse.data.data?.results,
          resultsIsArray: Array.isArray(resultsResponse.data.data?.results)
        });

        // Fetch attendance data
        console.log("📋 Fetching attendance data...");
        const attendanceResponse = await axios.get(
          "http://localhost:8080/api/v1/student/attendance",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        console.log("📋 Attendance data received:", attendanceResponse.data);
        console.log("📋 Attendance data structure:", {
          hasData: !!attendanceResponse.data.data,
          dataType: typeof attendanceResponse.data.data,
          isArray: Array.isArray(attendanceResponse.data.data)
        });

        if (resultsResponse.data.success && attendanceResponse.data.success) {
          console.log("✅ Both API calls successful");
          // Process and combine data
          const subjectsMap = new Map();

          // Get the results array - checking both possible structures
          const resultsData = Array.isArray(resultsResponse.data.data) 
            ? resultsResponse.data.data 
            : (resultsResponse.data.data?.results || []);
            
          console.log("🔄 Processing results data:", resultsData);
          
          if (Array.isArray(resultsData)) {
            resultsData.forEach((result: any) => {
              const subject = result.subject;
              console.log(`➕ Processing result for ${subject}:`, result);
              if (!subjectsMap.has(subject)) {
                subjectsMap.set(subject, {
                  subject: subject,
                  Performance: 0,
                  Attendance: 0,
                  resultCount: 0,
                });
              }

              const subjectData = subjectsMap.get(subject);
              subjectData.Performance += (result.marks / result.total_marks) * 100;
              subjectData.resultCount += 1;
              console.log(`🧮 Updated performance for ${subject}:`, subjectData);
            });
          } else {
            console.error("❌ Results data is not in expected array format:", resultsData);
          }

          // Process attendance data - adjust based on actual structure
          const attendanceData = Array.isArray(attendanceResponse.data.data) 
            ? attendanceResponse.data.data 
            : [];
            
          console.log("🔄 Processing attendance data:", attendanceData);
          
          if (Array.isArray(attendanceData)) {
            attendanceData.forEach((item: any) => {
              const subject = item.subject;
              console.log(`➕ Processing attendance for ${subject}:`, item);
              if (subjectsMap.has(subject)) {
                const subjectData = subjectsMap.get(subject);
                // Calculate attendance percentage
                subjectData.Attendance = 
                  (item.present_count / item.total_classes) * 100 || 0;
                console.log(`🧮 Updated attendance for ${subject}:`, subjectData);
              } else {
                // Create entry for subjects that have attendance but no results
                console.log(`🆕 Creating new entry for ${subject} (attendance only)`);
                subjectsMap.set(subject, {
                  subject: subject,
                  Performance: 0,
                  Attendance: (item.present_count / item.total_classes) * 100 || 0,
                  resultCount: 0,
                });
              }
            });
          } else {
            console.error("❌ Attendance data is not in expected array format:", attendanceData);
          }

          // Calculate average performance
          console.log("🔄 Calculating final values...");
          subjectsMap.forEach((value, key) => {
            console.log(`🔄 Processing final data for ${key}:`, {...value});
            if (value.resultCount > 0) {
              value.Performance = value.Performance / value.resultCount;
            }
            // Round values to 2 decimal places for cleaner display
            value.Performance = Number(value.Performance.toFixed(2));
            value.Attendance = Number(value.Attendance.toFixed(2));
            delete value.resultCount;
            console.log(`✅ Final data for ${key}:`, {...value});
          });

          // Convert map to array
          const chartData = Array.from(subjectsMap.values());
          console.log("📈 Final chart data:", chartData);
          setData(chartData);
        } else {
          console.error("❌ API response indicated failure:", {
            resultsSuccess: resultsResponse.data.success,
            attendanceSuccess: attendanceResponse.data.success
          });
          setError("Failed to load data from server");
        }

        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log("🖥️ Rendering component with data:", data);

  if (loading) {
    console.log("⏳ Showing loading state");
    return (
      <div className="bg-white p-6 rounded-lg shadow-md ml-2 border-2 border-neutral-200 h-[385px] flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    console.log("❌ Showing error state:", error);
    return (
      <div className="bg-white p-6 rounded-lg shadow-md ml-2 border-2 border-neutral-200 h-[385px] flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md ml-2 border-2 border-neutral-200 h-[385px]">
      <h3 className="text-lg font-semibold mb-4">Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="subject" />
          <YAxis domain={[0, 100]} />
          <Tooltip formatter={(value) => [`${value}%`, undefined]} />
          <Legend />
          <Line type="monotone" dataKey="Performance" stroke="#8884d4" dot />
          <Line type="monotone" dataKey="Attendance" stroke="#82ca9d" dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default OverviewGraph;