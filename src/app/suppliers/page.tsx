"use client";

import React, { useState } from 'react';
import { Table, Button, Input, Modal, Form, Space, Upload, message } from 'antd';
import { UploadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import DefaultLayout from "../../components/Layouts/DefaultLayout";

interface Supplier {
  key: string;
  name: string;
  email: string;
  contactNumber: string;
  suppliedItem: string;
  about: string;
  pdfFile: File | null;
}

const SupplierPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const [form] = Form.useForm();

  const showAddSupplierModal = () => {
    form.resetFields();
    setPdfFile(null);
    setIsEditMode(false);
    setIsModalVisible(true);
  };

  const showEditSupplierModal = (supplier: Supplier) => {
    form.setFieldsValue(supplier);
    setEditingSupplier(supplier);
    setPdfFile(supplier.pdfFile || null);
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  const showViewSupplierModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setPdfUrl(supplier.pdfFile ? URL.createObjectURL(supplier.pdfFile) : null);
    setIsViewModalVisible(true);
  };

  const handleDeleteSupplier = (key: string) => {
    setSuppliers(suppliers.filter((supplier) => supplier.key !== key));
    message.success('Supplier deleted successfully');
  };

  const handleModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        const newSupplier = {
          ...values,
          pdfFile: pdfFile,
        };
        if (isEditMode && editingSupplier) {
          // Edit supplier
          setSuppliers(suppliers.map((supplier) => (supplier.key === editingSupplier.key ? { ...newSupplier, key: editingSupplier.key } : supplier)));
          message.success('Supplier edited successfully');
        } else {
          // Add new supplier
          const newSupplierWithKey = { ...newSupplier, key: `${suppliers.length + 1}` };
          setSuppliers([...suppliers, newSupplierWithKey]);
          message.success('Supplier added successfully');
        }
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handlePdfUpload = (file: File) => {
    setPdfFile(file);
    return false;
  };

  const handleViewPdf = (pdf: File | null) => {
    if (pdf) {
      const fileUrl = URL.createObjectURL(pdf);
      setPdfUrl(fileUrl);
    } else {
      message.error('No PDF available to view.');
    }
  };

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: 'Supplier Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Contact Number',
      dataIndex: 'contactNumber',
      key: 'contactNumber',
    },
    {
      title: 'Supplied Item',
      dataIndex: 'suppliedItem',
      key: 'suppliedItem',
    },
    {
      title: 'About Supplier',
      key: 'about',
      render: (_: any, record: Supplier) => (
        <Button
          type="link"
          onClick={() => showViewSupplierModal(record)}
          style={{ color: 'black' }}
        >
          View Supplier
        </Button>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Supplier) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditSupplierModal(record)}
            style={{ backgroundColor: 'black', color: 'white', borderColor: 'black' }}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteSupplier(record.key)}
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
        <h1>Supplier</h1>
        <Input.Search
          placeholder="Search Suppliers"
          allowClear
          onSearch={handleSearch}
          style={{ width: 300, marginBottom: 20 }}
        />
        <Button
          type="primary"
          onClick={showAddSupplierModal}
          style={{ backgroundColor: 'black', color: 'white', borderColor: 'black', marginBottom: 20 }}
        >
          Add New Supplier
        </Button>
        <Table columns={columns} dataSource={filteredSuppliers} />

        <Modal
          title={isEditMode ? 'Edit Supplier' : 'Add New Supplier'}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          okButtonProps={{ style: { backgroundColor: 'black', color: 'white', borderColor: 'black' } }}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="Supplier Name" rules={[{ required: true, message: 'Please enter the supplier name' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter the email address' }]}>
              <Input type="email" />
            </Form.Item>
            <Form.Item name="contactNumber" label="Contact Number" rules={[{ required: true, message: 'Please enter the contact number' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="suppliedItem" label="Supplied Item" rules={[{ required: true, message: 'Please enter the supplied item' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="about" label="About Supplier" rules={[{ required: true, message: 'Please enter details about the supplier' }]}>
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="pdfFile" label="Upload Supplier Document (PDF)" rules={[{ required: true, message: 'Please upload a supplier document' }]}>
              <Upload
                beforeUpload={handlePdfUpload}
                fileList={pdfFile ? [pdfFile as any] : []}
                onRemove={() => setPdfFile(null)}
                accept=".pdf"
              >
                <Button icon={<UploadOutlined />}>Upload PDF</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Supplier Details"
          open={isViewModalVisible}
          footer={null}
          onCancel={() => setIsViewModalVisible(false)}
        >
          {selectedSupplier && (
            <>
              <p><strong>Name:</strong> {selectedSupplier.name}</p>
              <p><strong>Email:</strong> {selectedSupplier.email}</p>
              <p><strong>Contact Number:</strong> {selectedSupplier.contactNumber}</p>
              <p><strong>Supplied Item:</strong> {selectedSupplier.suppliedItem}</p>
              <p><strong>About:</strong> {selectedSupplier.about}</p>
              {pdfUrl && (
                <div>
                  <p><strong>Supplier Document:</strong></p>
                  <iframe src={pdfUrl} style={{ width: '100%', height: '500px' }} />
                </div>
              )}
            </>
          )}
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default SupplierPage;
