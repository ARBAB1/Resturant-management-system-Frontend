"use client";

import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Select, message, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  department: string;
  role: string;
}

const { Option } = Select;

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      jobTitle: "Software Engineer",
      department: "Engineering",
      role: "User",
    },
    // Add more employees here...
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [form] = Form.useForm();

  const showAddEmployeeModal = () => {
    form.resetFields();
    setIsEditMode(false);
    setIsModalVisible(true);
  };

  const showEditEmployeeModal = (employee: Employee) => {
    form.setFieldsValue(employee);
    setSelectedEmployee(employee);
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter((employee) => employee.id !== id));
    message.success("Employee deleted successfully");
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (isEditMode && selectedEmployee) {
        setEmployees((prevEmployees) =>
          prevEmployees.map((emp) => (emp.id === selectedEmployee.id ? { ...values, id: emp.id } : emp))
        );
        message.success("Employee updated successfully");
      } else {
        const newEmployee = { ...values, id: `${employees.length + 1}` };
        setEmployees([...employees, newEmployee]);
        message.success("Employee added successfully");
      }
      setIsModalVisible(false);
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.firstName.toLowerCase().includes(searchTerm) ||
      employee.lastName.toLowerCase().includes(searchTerm) ||
      employee.email.toLowerCase().includes(searchTerm) ||
      employee.id.toLowerCase().includes(searchTerm)
  );

  const handleViewEmployee = (employee: Employee) => {
    Modal.info({
      title: "Employee Details",
      content: (
        <div>
          <p>
            <b>Employee ID:</b> {employee.id}
          </p>
          <p>
            <b>Full Name:</b> {employee.firstName} {employee.lastName}
          </p>
          <p>
            <b>Email:</b> {employee.email}
          </p>
          <p>
            <b>Job Title:</b> {employee.jobTitle}
          </p>
          <p>
            <b>Department:</b> {employee.department}
          </p>
          <p>
            <b>Role:</b> {employee.role}
          </p>
        </div>
      ),
    });
  };

  const columns = [
    {
      title: "Employee ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Job Title",
      dataIndex: "jobTitle",
      key: "jobTitle",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Employee) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditEmployeeModal(record)}
            style={{ backgroundColor: "black", color: "white", borderColor: "black" }}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteEmployee(record.id)}
            danger
            style={{ backgroundColor: "black", color: "white", borderColor: "black" }}
          >
            Delete
          </Button>
          <Button
            onClick={() => handleViewEmployee(record)}
            style={{ backgroundColor: "black", color: "white", borderColor: "black" }}
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div style={{ padding: "20px" }}>
        <h1>Employee Management</h1>
        <Input.Search
          placeholder="Search Employees"
          allowClear
          onChange={handleSearch}
          style={{ width: 300, marginBottom: 20 }}
        />
        <Button
          type="primary"
          onClick={showAddEmployeeModal}
          style={{ backgroundColor: "black", color: "white", borderColor: "black", marginBottom: 20 }}
        >
          Add New Employee
        </Button>
        <Table columns={columns} dataSource={filteredEmployees} rowKey="id" />

        <Modal
          title={isEditMode ? "Edit Employee" : "Add New Employee"}
          visible={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          okButtonProps={{ style: { backgroundColor: "black", color: "white", borderColor: "black" } }}
        >
          <Form form={form} layout="vertical">
            {isEditMode && (
              <Form.Item name="id" label="Employee ID">
                <Input disabled />
              </Form.Item>
            )}
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: "Please enter the first name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: "Please enter the last name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Please enter the email" }, { type: "email", message: "Invalid email" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="jobTitle"
              label="Job Title"
              rules={[{ required: true, message: "Please enter the job title" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="department"
              label="Department"
              rules={[{ required: true, message: "Please enter the department" }]}
            >
              <Input />
            </Form.Item>
            {isEditMode && (
              <Form.Item name="role" label="Role" rules={[{ required: true, message: "Please select a role" }]}>
                <Select>
                  <Option value="Admin">Admin</Option>
                  <Option value="User">User</Option>
                  <Option value="Manager">Manager</Option>
                </Select>
              </Form.Item>
            )}
          </Form>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default EmployeeManagement;
