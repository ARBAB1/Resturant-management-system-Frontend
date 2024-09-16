"use client";

import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, message, Select, Space } from "antd";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface Department {
  id: string;
  name: string;
}

interface JobTitle {
  id: string;
  name: string;
  departmentId: string;
}

const DepartmentManagement: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [isDeptModalVisible, setIsDeptModalVisible] = useState(false);
  const [isJobModalVisible, setIsJobModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [editingJobTitle, setEditingJobTitle] = useState<JobTitle | null>(null);
  const [form] = Form.useForm();
  const [jobForm] = Form.useForm();

  // Department Management
  const handleAddDept = () => {
    setIsEditMode(false);
    form.resetFields();
    setIsDeptModalVisible(true);
  };

  const handleEditDept = (department: Department) => {
    setIsEditMode(true);
    form.setFieldsValue(department);
    setEditingDept(department);
    setIsDeptModalVisible(true);
  };

  const handleDeleteDept = (id: string) => {
    setDepartments(departments.filter((dept) => dept.id !== id));
    setJobTitles(jobTitles.filter((job) => job.departmentId !== id));
    message.success("Department deleted successfully");
  };

  const handleDeptModalOk = () => {
    form.validateFields().then((values) => {
      if (isEditMode && editingDept) {
        // Edit Department
        setDepartments(
          departments.map((dept) => (dept.id === editingDept.id ? { ...values, id: dept.id } : dept))
        );
        message.success("Department updated successfully");
      } else {
        // Add New Department
        const newDept = { ...values, id: `${departments.length + 1}` };
        setDepartments([...departments, newDept]);
        message.success("Department added successfully");
      }
      setIsDeptModalVisible(false);
    });
  };

  // Job Title Management
  const handleAddJob = () => {
    setIsEditMode(false);
    jobForm.resetFields();
    setIsJobModalVisible(true);
  };

  const handleEditJob = (jobTitle: JobTitle) => {
    setIsEditMode(true);
    jobForm.setFieldsValue(jobTitle);
    setEditingJobTitle(jobTitle);
    setIsJobModalVisible(true);
  };

  const handleDeleteJob = (id: string) => {
    setJobTitles(jobTitles.filter((job) => job.id !== id));
    message.success("Job title deleted successfully");
  };

  const handleJobModalOk = () => {
    jobForm.validateFields().then((values) => {
      if (isEditMode && editingJobTitle) {
        // Edit Job Title
        setJobTitles(
          jobTitles.map((job) => (job.id === editingJobTitle.id ? { ...values, id: job.id } : job))
        );
        message.success("Job title updated successfully");
      } else {
        // Add New Job Title
        const newJob = { ...values, id: `${jobTitles.length + 1}` };
        setJobTitles([...jobTitles, newJob]);
        message.success("Job title added successfully");
      }
      setIsJobModalVisible(false);
    });
  };

  const deptColumns = [
    {
      title: "Department Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Department) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEditDept(record)}>
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteDept(record.id)}
            danger
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const jobColumns = [
    {
      title: "Job Title",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Department",
      dataIndex: "departmentId",
      key: "departmentId",
      render: (deptId: string) => {
        const dept = departments.find((d) => d.id === deptId);
        return dept ? dept.name : "N/A";
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: JobTitle) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEditJob(record)}>
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteJob(record.id)}
            danger
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
        <h1>Department Management</h1>
        <Button
          type="primary"
          onClick={handleAddDept}
          style={{ backgroundColor: "black", color: "white", borderColor: "black", marginBottom: 20 }}
        >
          Add Department
        </Button>
        <Table columns={deptColumns} dataSource={departments} rowKey="id" />

        <h1 style={{ marginTop: "40px" }}>Job Title Management</h1>
        <Button
          type="primary"
          onClick={handleAddJob}
          style={{ backgroundColor: "black", color: "white", borderColor: "black", marginBottom: 20 }}
        >
          Add Job Title
        </Button>
        <Table columns={jobColumns} dataSource={jobTitles} rowKey="id" />

        {/* Department Modal */}
        <Modal
          title={isEditMode ? "Edit Department" : "Add Department"}
          visible={isDeptModalVisible}
          onOk={handleDeptModalOk}
          onCancel={() => setIsDeptModalVisible(false)}
          okButtonProps={{ style: { backgroundColor: "black", color: "white", borderColor: "black" } }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Department Name"
              rules={[{ required: true, message: "Please enter the department name" }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>

        {/* Job Title Modal */}
        <Modal
          title={isEditMode ? "Edit Job Title" : "Add Job Title"}
          visible={isJobModalVisible}
          onOk={handleJobModalOk}
          onCancel={() => setIsJobModalVisible(false)}
          okButtonProps={{ style: { backgroundColor: "black", color: "white", borderColor: "black" } }}
        >
          <Form form={jobForm} layout="vertical">
            <Form.Item
              name="name"
              label="Job Title"
              rules={[{ required: true, message: "Please enter the job title" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="departmentId"
              label="Department"
              rules={[{ required: true, message: "Please select a department" }]}
            >
              <Select>
                {departments.map((dept) => (
                  <Select.Option key={dept.id} value={dept.id}>
                    {dept.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default DepartmentManagement;
