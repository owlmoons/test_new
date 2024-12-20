import React, { useEffect, useState } from "react";
import { Button, message, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ProductService from "../services/ProductService";
import ProductTable from "../components/ProductTable";
import ProductModal from "../components/ProductModal";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const fetchProducts = async () => {
    try {
      const productList = await ProductService.getProductsByCurrentUser();
      setProducts(productList);
    } catch (error) {
      message.error("Failed to fetch products.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFormSubmit = async (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("category", values.category);
    formData.append("price", values.price);
    formData.append("details", values.details);
    formData.append("condition", values.condition);

    if (!isEditing || values.image?.fileList.length > 0) {
      const file = values.image?.fileList[0]?.originFileObj;
      if (file) {
        formData.append("image", file);
      }
    }

    try {
      if (isEditing) {
        await ProductService.updateProduct(currentProduct.productId, formData);
        message.success("Product updated successfully!");
      } else {
        await ProductService.createProduct(formData);
        message.success("Product created successfully!");
      }
      fetchProducts();
      setIsModalVisible(false);
      setIsEditing(false);
      setCurrentProduct(null);
    } catch (error) {
      message.error("Failed to save product.");
    }
  };

  const showCreateProductModal = () => {
    setIsModalVisible(true);
    setIsEditing(false);
  };

  const showEditProductModal = (product) => {
    setIsModalVisible(true);
    setIsEditing(true);
    setCurrentProduct(product);
  };

  const confirmDeleteProduct = (productId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this product?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await ProductService.deleteProduct(productId);
          message.success("Product deleted successfully!");
          fetchProducts(); 
        } catch (error) {
          message.error("Failed to delete product.");
        }
      },
      onCancel() {
        message.info("Product deletion cancelled.");
      },
    });
  };

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={showCreateProductModal}
        style={{ marginBottom: "20px" }}
      >
        Create Product
      </Button>

      <ProductTable
        products={products}
        showEditProductModal={showEditProductModal}
        handleDeleteProduct={confirmDeleteProduct} 
      />

      <ProductModal
        isVisible={isModalVisible}
        isEditing={isEditing}
        currentProduct={currentProduct}
        handleFormSubmit={handleFormSubmit}
        setIsModalVisible={setIsModalVisible}
      />
    </div>
  );
};

export default ProductPage;
