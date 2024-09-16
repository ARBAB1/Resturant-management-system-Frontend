"use client";

import React, { useState } from 'react';
import { Table, Button, Input, Modal, Form, Upload, Space, message, Select, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import DefaultLayout from "../../components/Layouts/DefaultLayout";

interface Supplier {
  name: string;
  contactNo: string;
  quotationFile: File | null;
  status: string;
}

interface Requirement {
  key: string;
  orderCode: string;
  requirementId: string;
  suppliers: Supplier[];
}

// Generate random Requirement ID
const generateRandomRequirementId = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const SupplierQuotationPage: React.FC = () => {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSupplierModalVisible, setIsSupplierModalVisible] = useState(false);
  const [isQuotationModalVisible, setIsQuotationModalVisible] = useState(false);
  const [isViewSuppliersModalVisible, setIsViewSuppliersModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<Requirement | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier[] | null>(null);
  const [mainSearchTerm, setMainSearchTerm] = useState<string>('');
  const [supplierSearchTerm, setSupplierSearchTerm] = useState<string>('');

  const [form] = Form.useForm();
  const [supplierForm] = Form.useForm();

  const showAddRequirementModal = () => {
    form.resetFields();
    form.setFieldsValue({ requirementId: generateRandomRequirementId() }); // Generate random Requirement ID
    setSuppliers([]);
    setIsEditMode(false);
    setIsModalVisible(true);
  };

  const showEditRequirementModal = (requirement: Requirement) => {
    form.setFieldsValue({
      ...requirement,
    });
    setSuppliers(requirement.suppliers);
    setEditingRequirement(requirement);
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  const handleDeleteRequirement = (key: string) => {
    setRequirements(requirements.filter((requirement) => requirement.key !== key));
    message.success('Requirement deleted successfully');
  };

  const handleModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        const newRequirement: Requirement = {
          ...values,
          suppliers,
        };

        if (isEditMode && editingRequirement) {
          setRequirements(requirements.map((requirement) =>
            requirement.key === editingRequirement.key
              ? { ...newRequirement, key: editingRequirement.key }
              : requirement
          ));
          message.success('Requirement edited successfully');
        } else {
          const newRequirementWithKey = {
            ...newRequirement,
            key: `${requirements.length + 1}`,
          };
          setRequirements([...requirements, newRequirementWithKey]);
          message.success('Requirement added successfully');
        }

        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleAddSupplier = () => {
    supplierForm
      .validateFields()
      .then((values) => {
        const newSupplier: Supplier = {
          ...values,
          quotationFile: null,
          status: 'Pending',
        };
        setSuppliers([...suppliers, newSupplier]);
        supplierForm.resetFields();
        setIsSupplierModalVisible(false);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleDeleteSupplier = (name: string) => {
    setSuppliers(suppliers.filter((supplier) => supplier.name !== name));
  };

  const handleQuotationUpload = (file: File, supplierName: string) => {
    const updatedSuppliers = suppliers.map((supplier) =>
      supplier.name === supplierName ? { ...supplier, quotationFile: file, status: 'Pending' } : supplier
    );
    setSuppliers(updatedSuppliers);
    return false; // Prevent auto-upload
  };

  const handleViewQuotation = (file: File) => {
    const pdfBlob = new Blob([file], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(pdfUrl);
    setIsQuotationModalVisible(true);
  };

  const filteredRequirements = requirements.filter(
    (requirement) =>
      requirement.orderCode.toLowerCase().includes(mainSearchTerm.toLowerCase()) ||
      requirement.requirementId.toLowerCase().includes(mainSearchTerm.toLowerCase())
  );

  const filteredSuppliers = (suppliers: Supplier[]) => {
    return suppliers.filter((supplier) =>
      supplier.name.toLowerCase().includes(supplierSearchTerm.toLowerCase())
    );
  };

  const requirementColumns = [
    {
      title: 'Order Code',
      dataIndex: 'orderCode',
      key: 'orderCode',
    },
    {
      title: 'Requirement ID',
      dataIndex: 'requirementId',
      key: 'requirementId',
    },
    {
      title: 'Suppliers',
      key: 'suppliers',
      render: (_: any, record: Requirement) => (
        <Button
          onClick={() => {
            setSelectedSupplier(record.suppliers);
            setIsViewSuppliersModalVisible(true);
          }}
          style={{ backgroundColor: 'black', color: 'white', borderColor: 'black' }}
        >
          View Suppliers
        </Button>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Requirement) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditRequirementModal(record)}
            style={{ backgroundColor: 'black', color: 'white', borderColor: 'black' }}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteRequirement(record.key)}
            danger
            style={{ backgroundColor: 'black', color: 'white', borderColor: 'black' }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Define supplierColumns with a flag to show or hide columns
  const supplierColumns = (showAllColumns: boolean) => [
    {
      title: 'Supplier Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Contact No',
      dataIndex: 'contactNo',
      key: 'contactNo',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Approved' ? 'green' : status === 'Rejected' ? 'red' : 'orange'}>{status}</Tag>
      ),
    },
    showAllColumns
      ? {
          title: 'Select Status',
          key: 'selectStatus',
          render: (_: any, record: Supplier) =>
            record.quotationFile && (
              <Select
                defaultValue={record.status}
                onChange={(value) => {
                  const updatedSuppliers = suppliers.map((supplier) =>
                    supplier.name === record.name ? { ...supplier, status: value } : supplier
                  );
                  setSuppliers(updatedSuppliers);
                }}
                style={{ width: 120 }}
              >
                <Select.Option value="Pending">Pending</Select.Option>
                <Select.Option value="Approved">Approved</Select.Option>
                <Select.Option value="Rejected">Rejected</Select.Option>
              </Select>
            ),
        }
      : {},
    showAllColumns
      ? {
          title: 'Quotation',
          dataIndex: 'quotationFile',
          key: 'quotationFile',
          render: (quotationFile: File | null) =>
            quotationFile ? (
              <Button
                onClick={() => handleViewQuotation(quotationFile)}
                style={{ backgroundColor: 'black', color: 'white', borderColor: 'black' }}
              >
                View Quotation
              </Button>
            ) : (
              'No File'
            ),
        }
      : {},
    showAllColumns
      ? {
          title: 'Upload Quotation',
          key: 'uploadQuotation',
          render: (_: any, record: Supplier) => (
            <Upload
              beforeUpload={(file) => handleQuotationUpload(file, record.name)}
              fileList={record.quotationFile ? [{ uid: '-1', name: record.quotationFile.name, status: 'done' }] : []}
              maxCount={1}
              accept=".pdf"
            >
              <Button icon={<UploadOutlined />}>Upload Quotation</Button>
            </Upload>
          ),
        }
      : {},
    showAllColumns
      ? {
          title: 'Action',
          key: 'action',
          render: (_: any, record: Supplier) => (
            <Button
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteSupplier(record.name)}
              danger
            />
          ),
        }
      : {},
  ].filter(Boolean); // Filter out empty objects

  return (
    <DefaultLayout>
      <div style={{ padding: '20px' }}>
        <h1>Supplier Quotations</h1>

        <Input.Search
          placeholder="Search Orders or Requirements"
          allowClear
          onSearch={setMainSearchTerm}
          style={{ width: 300, marginBottom: 20 }}
        />
        <Button
          type="primary"
          onClick={showAddRequirementModal}
          style={{ backgroundColor: 'black', color: 'white', borderColor: 'black', marginBottom: 20 }}
        >
          Add Requirement
        </Button>
        <Table columns={requirementColumns} dataSource={filteredRequirements} />

        {/* Main Modal for Adding Requirement */}
        <Modal
          title={isEditMode ? 'Edit Requirement' : 'Add Requirement'}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          width={1000}
          okButtonProps={{ style: { backgroundColor: 'black', color: 'white', borderColor: 'black' } }}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="orderCode" label="Order Code" rules={[{ required: true, message: 'Please enter the order code' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="requirementId" label="Requirement ID" rules={[{ required: true, message: 'Please enter the requirement ID' }]}>
              <Input readOnly />
            </Form.Item>

            <h3>Suppliers</h3>
            <Button
              type="primary"
              onClick={() => setIsSupplierModalVisible(true)}
              style={{ backgroundColor: 'black', color: 'white', borderColor: 'black' }}
            >
              Add Supplier
            </Button>

            <Table
              columns={supplierColumns(true)} // Show all columns
              dataSource={suppliers}
              pagination={{ pageSize: 3 }}
              style={{ marginTop: 20 }}
            />
          </Form>
        </Modal>

        {/* Modal for Adding Suppliers */}
        <Modal
          title="Add Supplier"
          open={isSupplierModalVisible}
          onOk={handleAddSupplier}
          onCancel={() => setIsSupplierModalVisible(false)}
          okButtonProps={{ style: { backgroundColor: 'black', color: 'white', borderColor: 'black' } }}
        >
          <Form form={supplierForm} layout="vertical">
            <Form.Item name="name" label="Supplier Name" rules={[{ required: true, message: 'Please enter the supplier name' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="contactNo" label="Contact No" rules={[{ required: true, message: 'Please enter the contact number' }]}>
              <Input />
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal for Viewing Suppliers */}
        <Modal
          title="Suppliers List"
          open={isViewSuppliersModalVisible}
          onCancel={() => setIsViewSuppliersModalVisible(false)}
          footer={null}
          width={600}
        >
          <Input.Search
            placeholder="Search Suppliers"
            allowClear
            onSearch={setSupplierSearchTerm}
            style={{ width: 300, marginBottom: 20 }}
          />
          <Table columns={supplierColumns(false)} dataSource={filteredSuppliers(selectedSupplier || [])} pagination={false} />
        </Modal>

        {/* Modal for Viewing Quotation */}
        <Modal
          title="Quotation"
          open={isQuotationModalVisible}
          onCancel={() => setIsQuotationModalVisible(false)}
          footer={null}
          width={800}
        >
          {pdfUrl && (
            <iframe
              src={pdfUrl}
              width="100%"
              height="600px"
              title="Quotation PDF"
              style={{ border: 'none' }}
            />
          )}
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default SupplierQuotationPage;
