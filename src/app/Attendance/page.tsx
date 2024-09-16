"use client";

import React, { useState } from "react";
import { Table, Button, Select } from "antd";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

interface AttendanceRecord {
  employeeId: string;
  employeeName: string;
  totalLate: number;
  totalAbsent: number;
  totalPresent: number;
}

const AttendanceManagement: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([
    {
      employeeId: "1",
      employeeName: "John Doe",
      totalLate: 2,
      totalAbsent: 1,
      totalPresent: 27,
    },
    // Add more sample data here...
  ]);

  const [selectedMonth, setSelectedMonth] = useState<string>("January");
  const router = useRouter();

  // Handle Month Change
  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    // Implement data filtering based on selected month.
  };

  const columns = [
    {
      title: "Employee ID",
      dataIndex: "employeeId",
      key: "employeeId",
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      key: "employeeName",
    },
    {
      title: "Total Late",
      dataIndex: "totalLate",
      key: "totalLate",
    },
    {
      title: "Total Absent",
      dataIndex: "totalAbsent",
      key: "totalAbsent",
    },
    {
      title: "Total Present",
      dataIndex: "totalPresent",
      key: "totalPresent",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: AttendanceRecord) => (
        <Button
          type="primary"
          onClick={() => router.push(`/Attendance/${record.employeeId}`)}
          style={{ backgroundColor: "black", color: "white", borderColor: "black" }}
        >
          View History
        </Button>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div style={{ padding: "20px" }}>
        <h1>Attendance Management</h1>
        <Select
          value={selectedMonth}
          onChange={handleMonthChange}
          style={{ width: 200, marginBottom: 20 }}
        >
          <Select.Option value="January">January</Select.Option>
          <Select.Option value="February">February</Select.Option>
          {/* Add more months */}
        </Select>
        <Table columns={columns} dataSource={attendanceData} rowKey="employeeId" />
      </div>
    </DefaultLayout>
  );
};

export default AttendanceManagement;
