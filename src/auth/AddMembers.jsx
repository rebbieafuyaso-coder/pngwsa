import { Form, Input, message, Select, Button, Card, Row, Col, Upload, Avatar, Space, Divider, Typography, Alert } from "antd";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";
import { 
  UserOutlined, 
  MailOutlined, 
  PlusOutlined, 
  UploadOutlined,
  LinkedinOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";

const { Option } = Select;
const { Title, Text } = Typography;

const AddMembers = () => {
  const [form] = useForm();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fileList, setFileList] = useState([]);

  // Handle file upload change
  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    
    // Generate preview
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(newFileList[0].originFileObj);
    } else {
      setPreview(null);
    }
  };

  // Handle file removal
  const handleRemoveFile = () => {
    setFileList([]);
    setPreview(null);
    form.setFieldValue('profile_picture', null);
  };

  // Form submission
  const handleSubmit = async (values) => {
    setUploading(true);
    try {
      let profilePictureUrl = null;

      // Upload image to Cloudflare backend
      if (values.profile_picture?.fileList?.length > 0) {
        const file = values.profile_picture.fileList[0].originFileObj;
        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await fetch("/api/upload-profile-picture", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.message || "Failed to upload profile picture.");
        }
        
        const uploadData = await uploadResponse.json();
        profilePictureUrl = uploadData.url;
      }

      // Prepare profile data for Supabase
      const profileData = {
        name: values.name,
        email: values.email,
        university: values.university,
        major: values.major,
        graduate_level: values.graduate_level,
        profile_picture_url: profilePictureUrl,
        linkedin_url: values.linkedin_url || null,
      };

      console.log("Profile Data:", profileData);

      // Here you would send to your API/Supabase
      // const response = await api.post('/api/members', profileData);

      message.success({
        content: "Profile created successfully!",
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        duration: 3,
      });
      
      form.resetFields();
      setPreview(null);
      setFileList([]);
    } catch (error) {
      console.error("Error creating profile:", error);
      message.error({
        content: error.message || "Something went wrong",
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
        duration: 3,
      });
    } finally {
      setUploading(false);
    }
  };

  // Upload props configuration
  const uploadProps = {
    listType: 'picture-card',
    fileList,
    onChange: handleFileChange,
    onRemove: handleRemoveFile,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Please upload an image file');
        return false;
      }
      const isLt5MB = file.size / 1024 / 1024 < 5;
      if (!isLt5MB) {
        message.error('Image must be smaller than 5MB');
        return false;
      }
      return false; // Prevent auto upload
    },
    accept: 'image/jpeg,image/png,image/webp,image/gif',
    maxCount: 1,
  };

  return (
    <div style={{ 
      maxWidth: 800, 
      margin: '0 auto', 
      padding: '24px',
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <Card 
        bordered={false}
        style={{ 
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ margin: 0, color: '#1a1a2e' }}>
            PNG WSA Member Registration
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Join the Papua New Guinea Women in STEM Association
          </Text>
          <Divider style={{ marginTop: 16 }} />
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          requiredMark="optional"
          size="large"
        >
          <Row gutter={24}>
            {/* Profile Picture Upload */}
            <Col xs={24} md={8}>
              <Form.Item
                name="profile_picture"
                label="Profile Picture"
                valuePropName="fileList"
                getValueFromEvent={(e) => e.fileList}
              >
                <Upload {...uploadProps}>
                  {fileList.length === 0 && (
                    <div>
                      <PlusOutlined style={{ fontSize: 24 }} />
                      <div style={{ marginTop: 8 }}>Upload Photo</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
              {preview && (
                <div style={{ marginTop: 8, textAlign: 'center' }}>
                  <Avatar size={64} src={preview} />
                </div>
              )}
            </Col>

            {/* Personal Information */}
            <Col xs={24} md={16}>
              <Row gutter={16}>
                <Col xs={24}>
                  <Form.Item
                    label="Full Name"
                    name="name"
                    rules={[
                      { required: true, message: "Please enter your full name" },
                      { min: 2, message: "Name must be at least 2 characters" },
                      { max: 100, message: "Name must not exceed 100 characters" }
                    ]}
                    tooltip="Enter your full legal name as it appears on official documents"
                  >
                    <Input 
                      prefix={<UserOutlined />} 
                      placeholder="Enter your full name" 
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24}>
                  <Form.Item
                    label="Email Address"
                    name="email"
                    rules={[
                      { required: true, message: "Please enter your email" },
                      { type: 'email', message: "Please enter a valid email address" }
                    ]}
                  >
                    <Input 
                      prefix={<MailOutlined />} 
                      placeholder="joeblow@example.com" 
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>

          <Divider orientation="left">
            <Text type="secondary">Education & Professional Information</Text>
          </Divider>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="University / Institution"
                name="university"
                rules={[{ required: true, message: "Please enter your university" }]}
              >
                <Input 
                  placeholder="e.g., University of Papua New Guinea" 
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Major / Field of Study"
                name="major"
                rules={[{ required: true, message: "Please enter your major" }]}
              >
                <Input 
                  placeholder="e.g., Computer Science" 
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Graduate Level"
                name="graduate_level"
                rules={[{ required: true, message: "Please select your graduate level" }]}
              >
                <Select placeholder="Select graduate level" size="large">
                  <Option value="undergraduate">Undergraduate</Option>
                  <Option value="graduate">Graduate / Master's</Option>
                  <Option value="phd">PhD / Doctorate</Option>
                  <Option value="postdoc">Postdoctoral</Option>
                  <Option value="professional">Professional / Working</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="LinkedIn URL (Optional)"
                name="linkedin_url"
                rules={[
                  { type: 'url', message: "Please enter a valid URL" }
                ]}
              >
                <Input 
                  prefix={<LinkedinOutlined />} 
                  placeholder="https://linkedin.com/in/username" 
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Form.Item style={{ marginBottom: 0 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Alert
                message="Important Information"
                description="By submitting this form, you agree to become a member of the PNG Women in STEM Association and consent to our privacy policy."
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
              <Button
                type="primary"
                htmlType="submit"
                loading={uploading}
                icon={uploading ? <UploadOutlined spin /> : <UserOutlined />}
                size="large"
                block
                style={{ height: 48, fontSize: 16, borderRadius: 8 }}
                disabled={uploading}
              >
                {uploading ? "Creating Profile..." : "Create Member Profile"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddMembers;