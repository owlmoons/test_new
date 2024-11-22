import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Upload,
  message,
  Typography,
  Space,
  Row,
  Col,
  Select,
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import ProductService from "../services/ProductService";
import ElementPageLayout from "../components/ElementPageLayout";
import { useForm } from "antd/lib/form/Form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; 

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = useForm();
  const [loggedIn, setLoggedIn] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  // Fetch products from the server
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await ProductService.getProducts();
        setProducts(productList);

        // Extract unique categories from product list
        const uniqueCategories = [
          ...new Set(productList.map((product) => product.category)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        message.error("Failed to fetch products.");
      }
    };

    fetchProducts();
  }, []);

  // Handle product search
  const handleSearch = (value) => {
    setSearchTerm(value.toLowerCase());
  };

  // Handle category filter
  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  // Filtered products
  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm) &&
      (category ? product.category === category : true)
  );

  // Handle product creation
  const handleCreateProduct = async (values) => {
    const formData = new FormData();

    // Append text data to the FormData
    formData.append("title", values.title);
    formData.append("category", values.category);
    formData.append("price", values.price);
    formData.append("details", values.details);
    formData.append("condition", values.condition);

    // Append file data to the FormData
    const file = values.image?.fileList[0]?.originFileObj;
    if (file) {
      formData.append("image", file);
    }

    try {
      const newProduct = await ProductService.createProduct(formData);
      setProducts([...products, newProduct]);
      message.success("Product created successfully!");
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to create product.");
    }
  };

  const showCreateProductModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container">
        <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
          Product Showcase
        </Title>

        {/* Search and Filter Bar */}
        <Row
          justify="space-between"
          align="middle"
          gutter={[16, 16]}
          style={{ marginBottom: "20px" }}
        >
          <Col span={12}>
            {loggedIn && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showCreateProductModal}
                style={{
                  width: "200px",
                  fontSize: "16px",
                  borderRadius: "8px",
                }}
              >
                Create Product
              </Button>
            )}
          </Col>
          <Col span={12}>
            <Row gutter={8} justify="end">
              <Col>
                <Search
                  placeholder="Search products"
                  enterButton={<SearchOutlined />}
                  onSearch={handleSearch}
                  allowClear
                />
              </Col>
              <Col>
                <Select
                  placeholder="Filter by Category"
                  style={{ width: "200px" }}
                  allowClear
                  onChange={handleCategoryChange}
                >
                  {categories.map((category) => (
                    <Option key={category} value={category}>
                      {category}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Product List */}
        {filteredProducts.length > 0 ? (
          <ElementPageLayout products={filteredProducts} />
        ) : (
          <Typography.Text type="warning">
            No products match your search or filter criteria.
          </Typography.Text>
        )}

        {/* Create Product Modal */}
        <Modal
          title="Create New Product"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          centered
          width={800}
        >
          <Form form={form} layout="vertical" onFinish={handleCreateProduct}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="Title"
                  name="title"
                  rules={[{ required: true, message: "Please input the title!" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Category"
                  name="category"
                  rules={[{ required: true, message: "Please input the category!" }]}
                >
                  <Input />
                </Form.Item>
               

                <Form.Item
                  label="Product Image"
                  name="image"
                  rules={[{ required: true, message: "Please upload an image!" }]}
                >
                  <Upload
                    listType="picture-card"
                    beforeUpload={() => false}
                    maxCount={1}
                  >
                    <Button icon={<PlusOutlined />}>Upload</Button>
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={12}>
              <Form.Item
                  label="Price"
                  name="price"
                  rules={[{ required: true, message: "Please input the price!" }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              <Form.Item
                  label="Condition"
                  name="condition"
                  rules={[{ required: true, message: "Please input the condition!" }]}
                >
                  <Input />
                </Form.Item>
              <Form.Item
                label="Details"
                name="details"
                rules={[{ required: true, message: "Please input the details!" }]}
              >
                <ReactQuill
                  theme="snow"
                  onChange={(value) => form.setFieldsValue({ details: value })}
                  style={{ height: "150px" }}
                />
              </Form.Item>

            
              </Col>
            </Row>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Create Product
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Home;
