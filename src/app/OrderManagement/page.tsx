"use client";

import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, InputNumber } from 'antd';
import DefaultLayout from '@/components/Layouts/DefaultLayout';

interface Order {
  key: string;
  orderCode: string;
  menuItems: string[];
  specialRequest: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  price: number;
}

const menuOptions = [
  { label: 'Pizza', value: 'Pizza' },
  { label: 'Burger', value: 'Burger' },
  { label: 'Pasta', value: 'Pasta' },
  { label: 'Salad', value: 'Salad' },
];

const statusOptions = ['Pending', 'In Progress', 'Completed', 'Cancelled'];

const RestaurantOrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [form] = Form.useForm();

  const showAddOrderModal = () => {
    form.resetFields();
    setIsEditMode(false);
    setIsModalVisible(true);
  };

  const showEditOrderModal = (order: Order) => {
    form.setFieldsValue(order);
    setEditingOrder(order);
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  const handleDeleteOrder = (key: string) => {
    setOrders(orders.filter((order) => order.key !== key));
    message.success('Order deleted successfully');
  };

  const handleModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        const newOrder = {
          ...values,
        };

        if (isEditMode && editingOrder) {
          // Edit order
          setOrders(orders.map((order) => (order.key === editingOrder.key ? { ...newOrder, key: editingOrder.key } : order)));
          message.success('Order updated successfully');
        } else {
          // Add new order
          const newOrderWithKey = { ...newOrder, key: `${orders.length + 1}` };
          setOrders([...orders, newOrderWithKey]);
          message.success('Order added successfully');
        }

        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log('Validation Failed:', info);
      });
  };

  const columns = [
    {
      title: 'Order Code',
      dataIndex: 'orderCode',
      key: 'orderCode',
    },
    {
      title: 'Menu Items',
      dataIndex: 'menuItems',
      key: 'menuItems',
      render: (items: string[]) => items.join(', '),
    },
    {
      title: 'Special Request',
      dataIndex: 'specialRequest',
      key: 'specialRequest',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Order) => (
        <Space size="middle">
          <Button onClick={() => showEditOrderModal(record)} style={{ backgroundColor: 'black', color: 'white' }}>
            Edit
          </Button>
          <Button onClick={() => handleDeleteOrder(record.key)} danger>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div style={{ padding: '20px' }}>
        <h1>Sales Orders</h1>
        <Button
          type="primary"
          onClick={showAddOrderModal}
          style={{ backgroundColor: 'black', color: 'white', marginBottom: 20 }}
        >
          Add New Order
        </Button>
        <Table columns={columns} dataSource={orders} rowKey="key" />

        <Modal
          title={isEditMode ? 'Edit Order' : 'Add New Order'}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          okButtonProps={{ style: { backgroundColor: 'black', color: 'white' } }}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="orderCode" label="Order Code" rules={[{ required: true, message: 'Please enter the order code' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="menuItems" label="Menu Items" rules={[{ required: true, message: 'Please select menu items' }]}>
              <Select mode="multiple" options={menuOptions} />
            </Form.Item>
            <Form.Item name="specialRequest" label="Special Request">
              <Input />
            </Form.Item>
            {isEditMode && (
              <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select the order status' }]}>
                <Select>
                  {statusOptions.map((status) => (
                    <Select.Option key={status} value={status}>
                      {status}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
            <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please enter the price' }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default RestaurantOrderPage;
