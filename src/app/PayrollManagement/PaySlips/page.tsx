"use client";

import React, { useState } from 'react';
import { Table, Button, Input, Modal, Form, InputNumber, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import DefaultLayout from "@/components/Layouts/DefaultLayout";

interface PayrollRecord {
  key: string;
  employeeId: string;
  employeeName: string;
  hoursWorked: number;
  salary: number;
  deductions: number;
  netPay: number;
}

const PayrollManagementPage: React.FC = () => {
  const [payrollData, setPayrollData] = useState<PayrollRecord[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState<PayrollRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [form] = Form.useForm();

  // Open Add Payroll Modal
  const showAddPayrollModal = () => {
    form.resetFields();
    setIsEditMode(false);
    setIsModalVisible(true);
  };

  // Open Edit Payroll Modal
  const showEditPayrollModal = (record: PayrollRecord) => {
    form.setFieldsValue(record);
    setEditingPayroll(record);
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  // Delete Payroll Record
  const handleDeletePayroll = (key: string) => {
    setPayrollData(payrollData.filter((record) => record.key !== key));
    message.success('Payroll record deleted successfully');
  };

  // Handle Modal Ok (Add or Edit Payroll)
  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const calculatedNetPay = values.salary - values.deductions;

      if (isEditMode && editingPayroll) {
        // Edit existing payroll record
        setPayrollData(payrollData.map((record) =>
          record.key === editingPayroll.key
            ? { ...values, netPay: calculatedNetPay, key: editingPayroll.key }
            : record
        ));
        message.success('Payroll record updated successfully');
      } else {
        // Add new payroll record
        const newRecord = {
          ...values,
          netPay: calculatedNetPay,
          key: `${payrollData.length + 1}`,
        };
        setPayrollData([...payrollData, newRecord]);
        message.success('Payroll record added successfully');
      }
      setIsModalVisible(false);
    });
  };

  // Search Filter
  const filteredPayrollData = payrollData.filter((record) =>
    record.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Payroll Table Columns
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
      title: 'Hours Worked',
      dataIndex: 'hoursWorked',
      key: 'hoursWorked',
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
    },
    {
      title: 'Deductions',
      dataIndex: 'deductions',
      key: 'deductions',
    },
    {
      title: 'Net Pay',
      dataIndex: 'netPay',
      key: 'netPay',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: PayrollRecord) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditPayrollModal(record)}
            style={{ backgroundColor: 'black', color: 'white', borderColor: 'black' }}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeletePayroll(record.key)}
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
        <h1>Payroll Management</h1>
        <Input.Search
          placeholder="Search Employees"
          allowClear
          onSearch={(value) => setSearchTerm(value)}
          style={{ width: 300, marginBottom: 20 }}
        />
        <Button
          type="primary"
          onClick={showAddPayrollModal}
          style={{ backgroundColor: 'black', color: 'white', borderColor: 'black', marginBottom: 20 }}
        >
          Add Payroll
        </Button>
        <Table columns={columns} dataSource={filteredPayrollData} />

        <Modal
          title={isEditMode ? 'Edit Payroll' : 'Add Payroll'}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          okButtonProps={{ style: { backgroundColor: 'black', color: 'white', borderColor: 'black' } }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="employeeId"
              label="Employee ID"
              rules={[{ required: true, message: 'Please enter the employee ID' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="employeeName" label="Employee Name" rules={[{ required: true, message: 'Please enter the employee name' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="hoursWorked" label="Hours Worked" rules={[{ required: true, message: 'Please enter hours worked' }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="salary" label="Salary" rules={[{ required: true, message: 'Please enter the salary' }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="deductions" label="Deductions" rules={[{ required: true, message: 'Please enter the deductions' }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default PayrollManagementPage;
