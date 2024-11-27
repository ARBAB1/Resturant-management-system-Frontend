"use client";
import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Modal, Form, InputNumber, Upload, Space, message } from 'antd';
import { UploadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import DefaultLayout from "../../components/Layouts/DefaultLayout";
import { api, baseUrl } from '@/constant';

interface Product {
  key: string;
  name: string;
  code: string;
  type: string;
  price: number;
  quantity: number;
  image: string;
}

const InventoryPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const token = localStorage.getItem('access_token');
  const [form] = Form.useForm();

  const fetchProducts = async (search: string = '') => {
    try{
      const response = await fetch(`${baseUrl}/inventoryOrder/get-all-inventory-orders?page=1&limit=100&search=&{search}`,{
          method: 'GET',
          headers:{
             'Content-Type':'application/json',
             'X-api-key':api,
             'accesstoken': `Bearer ${token}`,
          }
          });
          const data = await response.json() 
          console.log(data.data)
          if(response.ok){
           setProducts(data.data)
           console.log('kjhgfds')
          }else{
            message.error('failed to fetch products')
          }
          }catch(error){
             message.error('An error occurred while fetching products')
          };
          };

          useEffect(() => {
            fetchProducts();
          }, []);

  const showAddProductModal = () => {
    form.resetFields();
    setImageUrl('');
    setIsEditMode(false);
    setIsModalVisible(true);
  };

  const showEditProductModal = (product: Product) => {
    form.setFieldsValue(product);
    setEditingProduct(product);
    setImageUrl(product.image);
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  const handleDeleteProduct = (key: string) => {
    setProducts(products.filter((product) => product.key !== key));
    message.success('Product deleted successfully');
  };

  const handleModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        const newProduct = { ...values, image: imageUrl };
        if (isEditMode && editingProduct) {
          // Edit product
          setProducts(products.map((product) => (product.key === editingProduct.key ? { ...newProduct, key: editingProduct.key } : product)));
          message.success('Product edited successfully');
        } else {
          // Add new product
          const newProductWithKey = { ...newProduct, key: `${products.length + 1}` };
          setProducts([...products, newProductWithKey]);
          message.success('Product added successfully');
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

  const handleImageUpload = (file: any) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const filteredProducts = products.filter(
    (product) => product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (text: string) => <img src={text} alt="product" style={{ width: '50px', height: '50px' }} />,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Product) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditProductModal(record)}
            style={{ backgroundColor: 'black', color: 'white', borderColor: 'black' }}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteProduct(record.key)}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

        <Input.Search
          placeholder="Search Products"
          allowClear
          onSearch={handleSearch}
          style={{ width: 200, marginBottom: 20 }}
        />
      <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
               Inventory
              </h2>
        <Button
          type="primary"
          onClick={showAddProductModal}
          style={{ backgroundColor: 'black', color: 'white', borderColor: 'black', marginBottom: 20 }}
        >
            Add New Product
            </Button>
        </div>
        
        <Table columns={columns} dataSource={filteredProducts} />

        <Modal
          title={isEditMode ? 'Edit Product' : 'Add New Product'}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter the product name' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="code" label="Code" rules={[{ required: true, message: 'Please enter the product code' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Please enter the product type' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please enter the product price' }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: 'Please enter the product quantity' }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="image" label="Image" rules={[{ required: true, message: 'Please upload a product image' }]}>
              <Upload
                listType="picture-card"
                beforeUpload={handleImageUpload}
                showUploadList={false}
              >
                {imageUrl ? <img src={imageUrl} alt="product" style={{ width: '100%' }} /> : <UploadOutlined />}
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default InventoryPage;
