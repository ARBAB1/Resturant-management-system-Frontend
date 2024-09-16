"use client";

import React, { useState } from 'react';
import { Table, Button, Input, Modal, Form, Space, Select, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import DefaultLayout from "@/components/Layouts/DefaultLayout";

interface BenefitRecord {
  key: string;
  employeeId: string;
  employeeName: string;
  benefits: string[];
  enrollmentDate: string;
  status: string;
}

const BenefitsManagementPage: React.FC = () => {
  const [benefitsData, setBenefitsData] = useState<BenefitRecord[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<BenefitRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [form] = Form.useForm();

  // Open Add Benefit Modal
  const showAddBenefitModal = () => {
    form.resetFields();
    setIsEditMode(false);
    setIsModalVisible(true);
  };

  // Open Edit Benefit Modal
  const showEditBenefitModal = (record: BenefitRecord) => {
    form.setFieldsValue(record);
    setEditingBenefit(record);
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  // Delete Benefit Record
  const handleDeleteBenefit = (key: string) => {
    setBenefitsData(benefitsData.filter((record) => record.key !== key));
    message.success('Benefit record deleted successfully');
  };

  // Handle Modal Ok (Add or Edit Benefit)
  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const newBenefit = {
        ...values,
        enrollmentDate: new Date().toISOString().split('T')[0], // Automatically add the enrollment date
      };

      if (isEditMode && editingBenefit) {
        // Edit existing benefit record
        setBenefitsData(benefitsData.map((record) =>
          record.key === editingBenefit.key
            ? { ...newBenefit, key: editingBenefit.key }
            : record
        ));
        message.success('Benefit record updated successfully');
      } else {
        // Add new benefit record
        const newBenefitWithKey = { ...newBenefit, key: `${benefitsData.length + 1}` };
        setBenefitsData([...benefitsData, newBenefitWithKey]);
        message.success('Benefit record added successfully');
      }
      setIsModalVisible(false);
    });
  };

  // Search Filter
  const filteredBenefitsData = benefitsData.filter((record) =>
    record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    record.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Benefit Table Columns
  const columns = [
    {
      title: 'Employee ID',
      dataIndex: 'employeeId',
      key: 'employeeId',
    },
    {
      title: 'Employee Name',
      dataIndex: 'employeeName',
      key: 'employeeName',
    },
    {
      title: 'Benefits',
      key: 'benefits',
      render: (text: any, record: BenefitRecord) => (
        <ul>
          {record.benefits.map((benefit, index) => (
            <li key={index}>{benefit}</li>
          ))}
        </ul>
      ),
    },
    {
      title: 'Enrollment Date',
      dataIndex: 'enrollmentDate',
      key: 'enrollmentDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: BenefitRecord) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditBenefitModal(record)}
            style={{ backgroundColor: 'black', color: 'white', borderColor: 'black' }}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteBenefit(record.key)}
            danger
            style={{ backgroundColor: 'black', color: 'white', borderColor: 'black' }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div style={{ padding: '20px' }}>
        <h1>Benefits Management</h1>
        <Input.Search
          placeholder="Search by Employee Name or ID"
          allowClear
          onSearch={(value) => setSearchTerm(value)}
          style={{ width: 300, marginBottom: 20 }}
        />
        <Button
          type="primary"
          onClick={showAddBenefitModal}
          style={{ backgroundColor: 'black', color: 'white', borderColor: 'black', marginBottom: 20 }}
        >
          Add Benefit
        </Button>
        <Table columns={columns} dataSource={filteredBenefitsData} />

        <Modal
          title={isEditMode ? 'Edit Benefit' : 'Add Benefit'}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          okButtonProps={{ style: { backgroundColor: 'black', color: 'white', borderColor: 'black' } }}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="employeeId" label="Employee ID" rules={[{ required: true, message: 'Please enter the employee ID' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="employeeName" label="Employee Name" rules={[{ required: true, message: 'Please enter the employee name' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="benefits" label="Benefit Types" rules={[{ required: true, message: 'Please select the benefit types' }]}>
              <Select mode="multiple" placeholder="Select Benefit Types">
                <Select.Option value="Health Insurance">Health Insurance</Select.Option>
                <Select.Option value="Retirement Plan">Retirement Plan</Select.Option>
                <Select.Option value="Vacation">Vacation</Select.Option>
                <Select.Option value="Stock Options">Stock Options</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select the benefit status' }]}>
              <Select placeholder="Select Status">
                <Select.Option value="Active">Active</Select.Option>
                <Select.Option value="Inactive">Inactive</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default BenefitsManagementPage;
