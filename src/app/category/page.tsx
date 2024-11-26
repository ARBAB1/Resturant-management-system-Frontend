"use client"
import { Button, Form, Input, message, Modal, Table } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { api, baseUrl } from '@/constant';
import { Select } from 'antd';
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
const CategoryPage: React.FC = () => {
  const [category, setCategory] = useState<Category[]>([]);
  const [subCategory, setSubCategory] = useState<SubCategory[]>([]);
  
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubEditMode, setIsSubEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchSubQuery, setSearchSubQuery] = useState<string>('');
  const [page, setPage] = useState(1);
  const [subPage, setSubPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [subTotalPages, setSubTotalPages] = useState(0);
  const [limit, setLimit] = useState(100);
  const [subLimit, setSubLimit] = useState(100);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
  const [form] = Form.useForm();
  const router = useRouter();
  const token = localStorage.getItem('access_token');
     console.log(category,"category")
  const fetchCategories = async (search: string = '') => {
    try {
      const response = await fetch(`${baseUrl}/categories/get-all-categories?page=${page}&limit=${limit}&search=${search}`, {
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
  const fetchSubCategories = async (search: string = '') => {

    try {
      console.log(search,"search")
      const response = await fetch(`${baseUrl}/subCategory/get-all-sub-categories?page=${subPage}&limit=${subLimit}&search=${search}`, {
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
        setSubCategory(data.data);
        
      } else {
        message.error('Failed to fetch categories');
      }
    } catch (error) {
      message.error('An error occurred while fetching countries');
    }
  };
useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);
  const handleAddSubCategory = async (values: SubCategory) => {
    try {
  
      const response = await fetch(`${baseUrl}/subCategory/add-sub-category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': api,
          'accesstoken': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          sub_category_name: values.sub_category_name,
          unit: values.unit,
          category_id: values.category_id
         })
      });
      const data = await response.json();
      console.log(data)
      if (response.ok) {
        message.success('Sub Category added successfully');
        fetchSubCategories();
      } else {
        message.error('Failed to add Sub Category');
      }
    } catch (error) {
      message.error('An error occurred while adding the country');
    }
    setIsSubCategoryModalOpen(false);
    form.resetFields();
  };
const handleAddCategory = async (values: Category) => {
    try {
      const response = await fetch(`${baseUrl}/categories/add-category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': api,
          'accesstoken': `Bearer ${token}`
        },
        body: JSON.stringify({ 
            category_name: values.category_name,
            category_type: values.category_type,
            description: values.description
         })
      });
      const data = await response.json();
      if (response.ok) {
        message.success('Sub Category added successfully');
        fetchCategories();
      } else {
        message.error('Failed to add Sub Category');
      }
    } catch (error) {
      message.error('An error occurred while adding the country');
    }
    setIsCategoryModalOpen(false);
    form.resetFields();
  };
  const handleEditCountry = (category: Category) => {
    setIsEditMode(true);
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
    form.setFieldsValue({
        category_name: category.category_name,
        category_type: category.category_type,
        description: category.description
    });
  };
  const handleEditSubCategory = (subCategory: SubCategory) => {
    setIsSubEditMode(true);
    setEditingSubCategory(subCategory);
    setIsCategoryModalOpen(true);
    form.setFieldsValue({
        sub_category_name: subCategory.sub_category_name,
        unit: subCategory.unit,
        category_id : subCategory.category_id

    });
  };
  const handleUpdateCategory = async (values: Category) => {
    try {
      const response = await fetch(`${baseUrl}/categories/update-category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': api,
          'accesstoken': `Bearer ${token}`
        },
        body: JSON.stringify({
          category_id: `${editingCategory?.category_id}`,
          category_name: values.category_name,
          category_type: values.category_type,
          description: values.description
        })
      });
      if (response.ok) {
        message.success('Category updated successfully');
        fetchCategories();
      } else {
        message.error('Failed to update country');
      }
    } catch (error) {
      message.error('An error occurred while updating the country');
    }
    setIsCategoryModalOpen(false);
    setIsEditMode(false);
    setEditingCategory(null);
    form.resetFields();
  };
  const handleUpdateSubCategory = async (values: SubCategory) => {
    try {
      const response = await fetch(`${baseUrl}/subCategory/update-sub-category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': api,
          'accesstoken': `Bearer ${token}`
        },
        body: JSON.stringify({
       
          sub_category_id: `${editingCategory?.category_id}`,
          sub_category_name: values.sub_category_name,
          unit: values.unit,
          category_id: values.category_id
        })
      });
      console.log(response.json())
      if (response.ok) {
        message.success('Sub Category updated successfully');
        fetchCategories();
      } else {
        message.error('Failed to update country');
      }
    } catch (error) {
      message.error('An error occurred while updating the country');
    }
    setIsSubCategoryModalOpen(false);
    setIsSubEditMode(false);
    setEditingSubCategory(null);
    form.resetFields();
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    fetchCategories(e.target.value);
  };
  const handleSubSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchSubQuery(e.target.value);
    fetchSubCategories(e.target.value);
  };
  const handleDeleteCategory = async (category_id: number) => {
  console.log(category_id,"category_id")
    try {
      const response = await fetch(`${baseUrl}/categories/delete-category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': api,
          'accesstoken': `Bearer ${token}`
        },
        body: JSON.stringify(
          { "category_id": `${category_id}` }
        )
      });
      console.log(response)
      if (response.ok) {
        message.success('Category deleted successfully');
        fetchCategories();
      } else {
        message.error('Failed to delete country');
      }
    } catch (error) {
      message.error('An error occurred while deleting the country');
    }
  };
  const categoryColumns = [
    {
      title: 'Category ID',
      dataIndex: 'category_id',
      key: 'category_id',
    },
    {
      title: 'Category Name',
      dataIndex: 'category_name',
      key: 'category_name',
    },
    {
      title: 'Category Type',
      dataIndex: 'category_type',
      key: 'category_type',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Category) => (
        <>
        <Button type="primary" className='bg-black' onClick={() => handleEditCountry(record)}>
          Edit
        </Button>
        <Button type="primary" danger onClick={() => handleDeleteCategory(record.category_id)}>
          Delete
        </Button>
        </>
    )}
  ]
  const subcategoryColumns = [

    {
      title: 'Sub Category ID',
      dataIndex: 'sub_category_id',
      key: 'sub_category_id',
    },
    {
      title: 'Sub Category Name',
      dataIndex: 'sub_category_name',
      key: 'sub_category_name',
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: 'Category ID',
      dataIndex: 'category_id',
      key: 'category_id',
    },
    {
      title: 'Category Name',
      dataIndex: 'category_name',
      key: 'category_name',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record:SubCategory) => (
        <>
        <Button type="primary" className='bg-black' onClick={() => handleEditSubCategory(record)}>
          Edit
        </Button>
        <Button type="primary" danger onClick={() => handleDeleteCategory(record.sub_category_id)}>
          Delete
        </Button>
        </>
    )}
  ]
    return (
        <DefaultLayout>
            <div className='container mx-auto p-0'>
                <h1 className='text-2xl font-bold'>Category</h1>
                <Button type="primary" className='bg-black' onClick={() => {setIsCategoryModalOpen(true);
                setIsEditMode(false);
                }}>
                    Add Category
                </Button>
                <Input
        placeholder="Search by username"
        value={searchQuery}
        onChange={handleSearch}
        style={{ marginBottom: 16, width: '200px' }}
      />
      <Table columns={categoryColumns} dataSource={category} pagination={
        {
         current: page,
 
    total: totalPages
        }
      }/>
      
      <Modal
          title={isEditMode ? "Edit Country" : "Add Country"}
          open={isCategoryModalOpen}
        

          onOk={() => form.submit()}
          onCancel={() => setIsCategoryModalOpen(false)}
        >
          <Form
            form={form}
            layout="vertical"
            
       
            onFinish={isEditMode ? handleUpdateCategory : handleAddCategory}
          >
            <Form.Item name="category_name" label="Category Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="category_type" label="Category Type" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Form>
        </Modal>
            </div>
            <div className='container mx-auto p-0'>
                <h1 className='text-2xl font-bold'>Sub Category</h1>
                <Button type="primary" className='bg-black' onClick={() => {setIsSubCategoryModalOpen(true);
                setIsSubEditMode(false);
                }}>
                    Add Sub-Category
                </Button>
                <Input
        placeholder="Search by username"
        value={searchSubQuery}
        onChange={handleSubSearch}
        style={{ marginBottom: 16, width: '200px' }}
      />
      <Table columns={subcategoryColumns} dataSource={subCategory} pagination={
        {
         current: subPage,
 
    total: subTotalPages
        }
      }/>
      <Modal
          title={isSubEditMode ? "Edit Sub-Category" : "Add Sub-Category"}
          open={isSubCategoryModalOpen}
        

          onOk={() => form.submit()}
          onCancel={() => setIsSubCategoryModalOpen(false)}
        >
      
          <Form
            form={form}
            layout="vertical"
            
       
            onFinish={isSubEditMode ? handleUpdateSubCategory : handleAddSubCategory}
          >
            <Form.Item name="sub_category_name" label="Sub-Category Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="unit" label="Unit" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
  name="category_id"
  label="Category"
  rules={[{ required: true, message: 'Please select a category' }]}
>
  
  <Select placeholder="Select a category">
    {category.map((cat) => (
      <Select.Option key={cat.category_id} value={cat.category_id}>
        {cat.category_name}
      </Select.Option>
    ))}
  </Select>
</Form.Item>
          </Form>
        </Modal>
            </div>
        </DefaultLayout>
    )
}

export default CategoryPage
