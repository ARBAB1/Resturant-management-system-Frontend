"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, Input, Modal, Form, InputNumber, Space, message, DatePicker } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import DefaultLayout from "../../components/Layouts/DefaultLayout";
import { api, baseUrl } from "@/constant";

interface ingredient {
  ingredient_id: number;
  name: string;
  barcode: number;
  unit: number;
  quantity: number;
  expiry_date: number;
  batch_no: number;
  created_at: number;
  updated_at: number;
}

const IngredientPage: React.FC = () => {
  const [ingredients, setIngredients] = useState<ingredient[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<ingredient | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // Updated limit
  const token = localStorage.getItem("access_token");
  const [form] = Form.useForm();

  const fetchIngredients = async (search: string = "") => {
    try {
      const response = await fetch(
        `${baseUrl}/ingredients/get-all-ingredients?page=${page}&limit=${limit}&search=${search}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-api-key": api,
            accesstoken: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setIngredients(data.data);
      } else {
        message.error("Failed to fetch ingredients");
      }
    } catch (error) {
      message.error("An error occurred while fetching ingredients");
    }
  };

  useEffect(() => {
    fetchIngredients(searchTerm);
  }, [page, limit, searchTerm]);

  const handleAddIngredient = async (values: ingredient) => {
    try {
      const response = await fetch(`${baseUrl}/ingredients/add-ingredient`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": api,
          accesstoken: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ingredient_id:values.ingredient_id,  
          name: values.name,
          barcode: values.barcode,
          unit: values.unit,
          quantity: values.quantity,
          expiry_date: values.expiry_date,
          batch_no: values.batch_no,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success("Ingredient added successfully");
        fetchIngredients(); // Corrected function call
      } else {
        message.error(data.message || "Failed to add ingredient");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred while adding the ingredient");
    }
  };

  const handleUpdateIngredient = async (values: ingredient) => {
    try {
      const response = await fetch(`${baseUrl}/ingredients/update-ingredient`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': api,
          'accesstoken': `Bearer ${token}`,
        },
        body: JSON.stringify({
            ingredient_id: `${editingIngredient?.ingredient_id}`,
            name: values.name,
            barcode: values.barcode,
            unit: values.unit,
            quantity: values.quantity,
            expiry_date: values.expiry_date,
            batch_no: values.batch_no,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),         
        })
      });
      if (response.ok) {
        message.success('Category updated successfully');
        fetchIngredients();
      } else {
        message.error('Failed to update country');
      }
    } catch (error) {
      message.error('An error occurred while updating the country');
    }
    setIsModalVisible(false);
    setIsEditMode(false);
    setEditingIngredient(null);
    form.resetFields();
  };
  const handleEditIngredient = (ingredient: ingredient) => {
    setEditingIngredient(ingredient); // Set the ingredient being edited
    form.setFieldsValue(ingredient); // Populate the form with the selected ingredient data
    setIsEditMode(true);
    setIsModalVisible(true);
  };
 
    

  const showAddIngredientModal = () => {
    form.resetFields();
    setIsEditMode(false);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (isEditMode && editingIngredient) {
        handleUpdateIngredient(values); // Call the update handler here
      } else {
        handleAddIngredient(values);
      }
      setIsModalVisible(false);
    });
  };
  

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPage(page);
    setLimit(pageSize);
  };

  const columns = [
    {
        title: "ingredient_id",
        dataIndex: "ingredient_id",
        key: "ingredient_id",
      },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Barcode",
      dataIndex: "barcode",
      key: "barcode",
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Expiry Date",
      dataIndex: "expiry_date",
      key: "expiry_date",
    },
    {
      title: "Batch No",
      dataIndex: "batch_no",
      key: "batch_no",
    },
    {
        title: "Action",
        key: "action",
        render: (_: any, record: ingredient) => (
          <Space size="middle">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEditIngredient(record)}
              style={{ backgroundColor: "black", color: "white", borderColor: "black" }}
            >
              Edit
            </Button>
            <Button
              icon={<DeleteOutlined />}
              onClick={() => console.log("Delete clicked")}
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Input.Search
            placeholder="Search Ingredients"
            allowClear
            onSearch={handleSearch}
            style={{ width: 200, marginBottom: 20 }}
          />
          <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
            Ingredients
          </h2>
          <Button
            type="primary"
            onClick={showAddIngredientModal}
            style={{ backgroundColor: "black", color: "white", borderColor: "black", marginBottom: 20 }}
          >
            Add New Ingredient
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={ingredients}
          rowKey="ingredient_id"
          pagination={{
            current: page,
            pageSize: limit,
            total: 50, // Update with total count from API
            onChange: handlePageChange,
          }}
        />

        <Modal
          title={isEditMode ? "Edit Ingredient" : "Add New Ingredient"}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter the ingredient name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="barcode"
              label="Barcode"
              rules={[{ required: true, message: "Please enter the barcode" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="unit"
              label="Unit"
              rules={[{ required: true, message: "Please enter the unit" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="quantity"
              label="Quantity"
              rules={[{ required: true, message: "Please enter the quantity" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
  name="expiry_date"
  label="Expiry Date"
  rules={[{ required: true, message: "Please enter the expiry date" }]}
>
  <DatePicker style={{ width: "100%" }} />
</Form.Item>

            <Form.Item
              name="batch_no"
              label="Batch No"
              rules={[{ required: true, message: "Please enter the batch number" }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default IngredientPage;
