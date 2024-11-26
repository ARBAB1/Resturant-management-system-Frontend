"use client";
import React, { use, useEffect, useState } from "react";
import { Table, Button, Input, Modal, Form, Space, message, Select, Spin } from "antd";
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
interface Category {
  category_id: number,
  category_name: string,
  category_type: string,
  description: string,
  created_at: string,
  updated_at: string

}
interface SubCategory {
sub_category_id: number,
sub_category_name: string,
unit: string,
category_id: number,
category_name: string

}
const SupplierPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [subCategory, setSubCategory] = useState<SubCategory[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [page,setPage]=useState(1)
  const [limit,setLimit] = useState(100)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [form] = Form.useForm();
  const [loadingSubCategory, setLoadingSubCategory] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const fetchCategories = async (search: string = '') => {
    try {
      const response = await fetch(`${baseUrl}/categories/get-all-categories?page=1&limit=100&category_type=supplier&search=${search} `, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': api,
          'accesstoken': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log(data.data)
      if ( response.ok) {

        // setTotalPages(data.totalPages);
        setCategory(data.data);
      } else {
        message.error('Failed to fetch categories');
      }
    } catch (error) {
      message.error('An error occurred while fetching countries');
    }
  };
  const fetchSubCategories = async (categoryId?: number) => {

    try {
      setLoadingSubCategory(true)
      const response = await fetch(`${baseUrl}/subCategory/get-sub-categories-by-category/${categoryId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': api,
          'accesstoken': `Bearer ${token}`
        }
      });
      const data = await response.json();

      console.log(data,"subCategory")
      if ( response.ok) {
    
        // setTotalPages(data.totalPages);
        setSubCategory(data);
        
      } else if (data.message == "No sub-categories found for this category") {
        // message.error('Failed to fetch sub categories');
        setSubCategory([]);
      }
    } catch (error) {
      message.error('An error occurred while fetching countries');
    } finally {
      setLoadingSubCategory(false); // Hide loader
    }
  };
useEffect(() => {
    fetchCategories();
  
  }, []);

 
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
          supplier_id: editingSupplier?.supplier_id,
          company_name: values.company_name,
          email: values.email,
          phone_no: values.phone_no,
          ref_person: values.ref_person,
          ref_person_phone_no: values.ref_person_phone_no,
          category_id: values.category_id,
          sub_category_id: values.sub_category_id,
          about_supplier:values.about_supplier
        })
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
          style={{backgroundColor:"black",color:"white"}}
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
  label="Category"
  rules={[{ required: true, message: 'Please select a category' }]}
>
  
  <Select placeholder="Select a category" onChange={(value) =>{
fetchSubCategories(value), setSelectedCategory(value)} 

  }  >
    {category.map((cat) => (
      <Select.Option key={cat.category_id} value={cat.category_id} >
      {cat.category_name}
    </Select.Option>
    ))}
  </Select>
</Form.Item>

            <Form.Item
  name="sub_category_id"
  label="Sub Category"
  rules={[{ required: true, message: 'Please select sub category' }]}
>
  
{loadingSubCategory ? (
              <Spin />
            ) : (
              <Select placeholder="Select a subcategory">
                {subCategory.map((sub) => (
                  <Select.Option key={sub.sub_category_id} value={sub.sub_category_id}>
                    {sub.sub_category_name}
                  </Select.Option>
                ))}
              </Select>
            )}
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
      </div>
    </DefaultLayout>
  );
};

export default SupplierPage;