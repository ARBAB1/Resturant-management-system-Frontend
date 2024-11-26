"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, Input, Modal, Form, Space, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import DefaultLayout from "../../components/Layouts/DefaultLayout";
import { api, baseUrl } from "@/constant";

interface Supplier {
  key: string;
  supplier_id: number;
  company_name: string;
  email: string;
  phone_no: number;
  ref_person: string;
  ref_person_phone_no: number;
  category_id: number;
  sub_category_id: number;
  about_supplier: string;
}

const SupplierPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [form] = Form.useForm();
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const fetchSupplier = async (search: string = "") => {
    try {
      const response = await fetch(
        `${baseUrl}/supplier/get-all-suppliers?page=1&limit=10&search=${search}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": api,
            accesstoken: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setSuppliers(data.data);
      } else {
        message.error("Failed to fetch suppliers");
      }
    } catch (error) {
      message.error("An error occurred while fetching suppliers");
    }
  };

  useEffect(() => {
    if (token) fetchSupplier();
  }, [token]);

  const handleAddSupplier = async (values: Supplier) => {
    try {
      const response = await fetch(`${baseUrl}/supplier/add-supplier`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": api,
          accesstoken: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        message.success("Supplier added successfully!");
        fetchSupplier();
        setIsModalVisible(false);
      } else {
        const data = await response.json();
        message.error(data.message || "Failed to add supplier");
      }
    } catch (error) {
      message.error("An error occurred while adding the supplier");
    }
  };

  const handleUpdateSupplier = async (values: Supplier) => {
    try {
      const response = await fetch(`${baseUrl}/supplier/update-supplier`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": api,
          accesstoken: `Bearer ${token}`,
        },
        body: JSON.stringify({
          // supplier_id: editingSupplier?.supplier_id,
          ...values,
        }),
      });
      if (response.ok) {
        message.success("Supplier updated successfully");
        fetchSupplier();
      } else {
        const data = await response.json();
        message.error(data.message || "Failed to update supplier");
      }
    } catch (error) {
      message.error("An error occurred while updating the supplier");
    }
    setIsModalVisible(false);
    setIsEditMode(false);
    setEditingSupplier(null);
    form.resetFields();
  };

  const handleDeleteSupplier = async (supplier_id: number) => {
    try {
      const response = await fetch(`${baseUrl}/supplier/delete-supplier`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": api,
          accesstoken: `Bearer ${token}`,
        },
        body: JSON.stringify({ supplier_id }),
      });
      if (response.ok) {
        message.success("Supplier deleted successfully");
        fetchSupplier();
      } else {
        message.error("Failed to delete supplier");
      }
    } catch (error) {
      message.error("An error occurred while deleting the supplier");
    }
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (isEditMode && editingSupplier) {
        handleUpdateSupplier(values);
      } else {
        handleAddSupplier(values);
      }
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "supplier_id",
      key: "supplier_id",
    },
    {
      title: "Supplier Name",
      dataIndex: "company_name",
      key: "company_name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phone_no",
      key: "phone_no",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Supplier) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setIsEditMode(true);
              setIsModalVisible(true);
              setEditingSupplier(record);
              form.setFieldsValue(record); // Set values for editing
            }}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteSupplier(record.supplier_id)}
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
      <div>
        <h1>Suppliers</h1>
        <Input.Search
          placeholder="Search Suppliers"
          onSearch={(value) => fetchSupplier(value)}
          style={{ width: 300, marginBottom: 20 }}
        />
        <Button
          type="primary"
          onClick={() => {
            setIsEditMode(false);
            setIsModalVisible(true);
            form.resetFields();
          }}
        >
          Add Supplier
        </Button>
        <Table columns={columns} dataSource={suppliers} rowKey="supplier_id" />
        <Modal
          title={isEditMode ? "Edit Supplier" : "Add New Supplier"}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="company_name"
              label="Company Name"
              rules={[{ required: true, message: "Please enter the company name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Please enter the email address" }]}
            >
              <Input type="email" />
            </Form.Item>
            <Form.Item
              name="phone_no"
              label="Phone Number"
              rules={[{ required: true, message: "Please enter the phone number" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="ref_person"
              label="Reference Person"
              rules={[{ required: true, message: "Please enter the reference person name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="ref_person_phone_no"
              label="Reference Person Phone Number"
              rules={[{ required: true, message: "Please enter the reference person's phone number" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="category_id"
              label="Category ID"
              rules={[{ required: true, message: "Please enter the category ID" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="sub_category_id"
              label="Sub Category ID"
              rules={[{ required: true, message: "Please enter the sub-category ID" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="about_supplier"
              label="About Supplier"
              rules={[{ required: true, message: "Please enter details about the supplier" }]}
            >
              <Input.TextArea />
            </Form.Item>
          </Form>
        </Modal>
        <Form>
          <Form.Item>
            
          </Form.Item>
        </Form>
      </div>
    </DefaultLayout>
  );
};

export default SupplierPage;
