"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Badge } from "antd";
import { useSearchParams } from "next/navigation"; // Import useSearchParams
import DefaultLayout from "@/components/Layouts/DefaultLayout";

interface AttendanceDetail {
  date: string;
  clockInTime: string;
  clockOutTime: string;
  status: "Present" | "Late" | "Absent";
}

const AttendanceHistory: React.FC = () => {
  const searchParams = useSearchParams(); // Use useSearchParams to access query parameters
  const employeeId = searchParams.get("employeeId"); // Get employeeId from the query parameters

  const [attendanceDetails, setAttendanceDetails] = useState<AttendanceDetail[]>([
    {
      date: "2024-08-01",
      clockInTime: "09:00 AM",
      clockOutTime: "05:00 PM",
      status: "Present",
    },
    // Add more sample data...
  ]);

  useEffect(() => {
    if (employeeId) {
      // Fetch employee attendance details based on employeeId.
    }
  }, [employeeId]);

  const getListData = (value: any) => {
    const dateString = value.format("YYYY-MM-DD");
    const dayDetails = attendanceDetails.find((detail) => detail.date === dateString);

    return dayDetails
      ? [
          { type: dayDetails.status === "Present" ? "success" : "warning", content: dayDetails.clockInTime },
          { type: dayDetails.status === "Present" ? "success" : "warning", content: dayDetails.clockOutTime },
        ]
      : [];
  };

  const dateCellRender = (value: any) => {
    const listData = getListData(value);
    return (
      <ul>
        {listData.map((item, index) => (
          <li key={index}>
            <Badge status={item.type as "success" | "warning" | "processing" | "error" | "default" | undefined} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <DefaultLayout>
      <div style={{ padding: "20px" }}>
        <h1>Attendance History for Employee {employeeId}</h1>
        <Calendar dateCellRender={dateCellRender} />
      </div>
    </DefaultLayout>
  );
};

export default AttendanceHistory;
