"use client";

import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Select, DatePicker, Space, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import moment from "moment";

interface LeaveRecord {
  key: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: string;
  leaveBalance: number;
}

const { Option } = Select;

const LeaveManagementPage: React.FC = () => {
  const [leaveData, setLeaveData] = useState<LeaveRecord[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingLeave, setEditingLeave] = useState<LeaveRecord | null>(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Open Add Leave Modal
  const showAddLeaveModal = () => {
    form.resetFields();
    setIsEditMode(false);
    setIsModalVisible(true);
  };

  // Open Edit Leave Modal
  const showEditLeaveModal = (record: LeaveRecord) => {
    form.setFieldsValue({
      ...record,
      startDate: moment(record.startDate),
      endDate: moment(record.endDate),
    });
    setEditingLeave(record);
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  // Handle Modal Ok (Add or Edit Leave)
  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const newLeave = {
        ...values,
        startDate: values.startDate.format("YYYY-MM-DD"),
        endDate: values.endDate.format("YYYY-MM-DD"),
      };

      if (isEditMode && editingLeave) {
        // Edit existing leave record
        setLeaveData(
          leaveData.map((record) =>
            record.key === editingLeave.key ? { ...newLeave, key: editingLeave.key } : record
          )
        );
        message.success("Leave record updated successfully");
      } else {
        // Add new leave record
        const newLeaveWithKey = { ...newLeave, key: `${leaveData.length + 1}`, leaveBalance: 20 }; // Set initial leave balance
        setLeaveData([...leaveData, newLeaveWithKey]);
        message.success("Leave record added successfully");
      }
      setIsModalVisible(false);
    });
  };

  // Handle Delete Leave Record
  const handleDeleteLeave = (key: string) => {
    setLeaveData(leaveData.filter((record) => record.key !== key));
    message.success("Leave record deleted successfully");
  };

  // Search Filter
  const filteredLeaveData = leaveData.filter((record) =>
    record.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Leave Table Columns
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
      title: "Leave Type",
      dataIndex: "leaveType",
      key: "leaveType",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Leave Balance",
      dataIndex: "leaveBalance",
      key: "leaveBalance",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: LeaveRecord) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditLeaveModal(record)}
            style={{ backgroundColor: "black", color: "white", borderColor: "black" }}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteLeave(record.key)}
            danger
            style={{ backgroundColor: "black", color: "white", borderColor: "black" }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div style={{ padding: "20px" }}>
        <h1>Leave Management</h1>
        <Input.Search
          placeholder="Search Employees"
          allowClear
          onSearch={(value) => setSearchTerm(value)}
          style={{ width: 300, marginBottom: 20 }}
        />
        <Button
          type="primary"
          onClick={showAddLeaveModal}
          style={{ backgroundColor: "black", color: "white", borderColor: "black", marginBottom: 20 }}
        >
          Add Leave
        </Button>
        <Table columns={columns} dataSource={filteredLeaveData} />

        <Modal
          title={isEditMode ? "Edit Leave" : "Add Leave"}
          visible={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          okButtonProps={{ style: { backgroundColor: "black", color: "white", borderColor: "black" } }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="employeeId"
              label="Employee ID"
              rules={[{ required: true, message: "Please enter the employee ID" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="employeeName"
              label="Employee Name"
              rules={[{ required: true, message: "Please enter the employee name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="leaveType"
              label="Leave Type"
              rules={[{ required: true, message: "Please select the leave type" }]}
            >
              <Select placeholder="Select Leave Type">
                <Option value="Sick Leave">Sick Leave</Option>
                <Option value="Vacation">Vacation</Option>
                <Option value="Personal Leave">Personal Leave</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="startDate"
              label="Start Date"
              rules={[{ required: true, message: "Please select the start date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="endDate"
              label="End Date"
              rules={[{ required: true, message: "Please select the end date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select the leave status" }]}
            >
              <Select placeholder="Select Status">
                <Option value="Pending">Pending</Option>
                <Option value="Approved">Approved</Option>
                <Option value="Rejected">Rejected</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default LeaveManagementPage;
