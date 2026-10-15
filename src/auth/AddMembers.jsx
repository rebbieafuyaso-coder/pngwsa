import {
  Form,
  Input,
  message,
  Select,
  Button,
  Card,
  Row,
  Col,
  Upload,
  Avatar,
  Divider,
  Typography,
  Alert,
  Progress,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useState, useCallback } from "react";
import {
  UserOutlined,
  MailOutlined,
  UploadOutlined,
  LinkedinOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  IdcardOutlined,
  BankOutlined,
  BookOutlined,
  SafetyCertificateOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { supabase } from "../supabaseClient";
import ImageCropModal from "../components/ImageCropModal";
import { Helmet } from "react-helmet-async";

const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_NAME_LENGTH = 50;
const MIN_NAME_LENGTH = 2;

const AddMembers = () => {
  const [form] = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [cropOpen, setCropOpen] = useState(false);
  const [cropImage, setCropImage] = useState(null);

  const beforeUpload = useCallback((file) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      message.error("Please upload a valid image (JPEG, PNG, WebP, or GIF)");
      return Upload.LIST_IGNORE;
    }
    if (file.size / 1024 / 1024 >= MAX_FILE_SIZE_MB) {
      message.error(`Image must be smaller than ${MAX_FILE_SIZE_MB}MB`);
      return Upload.LIST_IGNORE;
    }

    // Read the file as a data URL, then open the crop modal
    const reader = new FileReader();
    reader.onload = (e) => {
      setCropImage(e.target.result);
      setCropOpen(true);
    };
    reader.readAsDataURL(file);

    // Block AntD's automatic upload — we handle it manually
    return Upload.LIST_IGNORE;
  }, []);

  const handleCropConfirm = useCallback(
    (croppedFile) => {
      const newFile = {
        uid: `${Date.now()}`,
        name: croppedFile.name,
        status: "done",
        originFileObj: croppedFile,
        url: URL.createObjectURL(croppedFile),
      };
      setFileList([newFile]);
      setPreview(URL.createObjectURL(croppedFile));
      form.setFieldValue("profile_picture", [newFile]);
      setCropOpen(false);
      setCropImage(null);
    },
    [form]
  );

  const handleCropCancel = useCallback(() => {
    setCropOpen(false);
    setCropImage(null);
  }, []);

  const handleRemoveFile = useCallback(() => {
    setFileList([]);
    setPreview(null);
    form.setFieldValue("profile_picture", undefined);
  }, [form]);

  // Upload avatar to Supabase Storage
  const uploadAvatar = async (file) => {
    setUploadProgress(20);
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = `pending/${fileName}`;

    setUploadProgress(50);

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) throw new Error(uploadError.message);

    setUploadProgress(90);

    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    setUploadProgress(100);
    return urlData.publicUrl;
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setUploadProgress(0);

    try {
      let avatarUrl = null;

      if (values.profile_picture?.length > 0) {
        const file = values.profile_picture[0].originFileObj;
        avatarUrl = await uploadAvatar(file);
      }

      // Insert directly into members table
      const { error } = await supabase.from("members").insert({
        fullname: values.fullname.trim(),
        email: values.email.trim().toLowerCase(),
        university: values.university?.trim() || null,
        course: values.course?.trim() || null,
        graduate_level: values.graduate_level,
        city: values.city?.trim() || null,
        linkedin_url: values.linkedin_url?.trim() || null,
        avatar_url: avatarUrl,
      });

      if (error) throw new Error(error.message);

      message.success({
        content: "Member registered successfully!",
        icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
        duration: 4,
      });

      form.resetFields();
      setPreview(null);
      setFileList([]);
      setUploadProgress(0);
    } catch (error) {
      console.error("Error creating member:", error);
      message.error({
        content: error.message || "Something went wrong. Please try again.",
        duration: 4,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const uploadProps = {
    listType: "picture-card",
    fileList,
    onChange: ({ fileList: newFileList }) => {
      // Block direct changes; only crop confirm updates the list
      if (newFileList.length === 0) handleRemoveFile();
    },
    onRemove: handleRemoveFile,
    beforeUpload,
    accept: ALLOWED_FILE_TYPES.join(","),
    maxCount: 1,
    disabled: submitting,
    showUploadList: { showPreviewIcon: true, showRemoveIcon: !submitting },
  };

  return (
    <>
    <Helmet>
      <title>PNG HSA | Register</title>
      <meta name="description" content="Register as a Member for PNG HSA" />
    </Helmet>
    <div style={{ maxWidth: 820, margin: "24px auto", padding: "0 16px" }}>
      <Card
        variant="border"
        style={{
          borderRadius: 14,
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}
        styles={{ body: { padding: "24px 28px" } }}
      >
        {/* Compact header */}
        <div
          style={{ textAlign: "center", marginBottom: 20 }}
          className="flex max-w-full items-center justify-around p-4"
        >
          <div className="justify-center self-center flex">
            <Avatar
              size={100}
              src="/papua-new-guinea-wuhan-students-association-logo.png"
              style={{ border: "3px solid #f59e0b", marginBottom: 10 }}
            >
              PNG
            </Avatar>
          </div>
          <div className="max-w-full text-left!">
            <Title
              level={4}
              style={{ margin: 0, color: "#1a1a2e" }}
              className="font-display!"
            >
              PNG HSA Member Registration
            </Title>
            <Paragraph
              type="secondary"
              style={{ fontSize: 13, margin: "4px 0 0" }}
              className="font-sans!"
            >
              Register a new member — credentials will be emailed automatically
            </Paragraph>
          </div>
        </div>

        <Divider />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          requiredMark={false}
          size="middle"
          scrollToFirstError
        >
          <Row gutter={20}>
            {/* Avatar */}
            <Col xs={24} md={7}>
              <Form.Item
                name="profile_picture"
                label="Profile Photo"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                rules={[{ required: true, message: "Please upload a photo" }]}
                style={{ marginBottom: 8 }}
              >
                <Upload {...uploadProps}>
                  {fileList.length === 0 && (
                    <div style={{ padding: "12px 4px", textAlign: "center" }}>
                      <UploadOutlined style={{ fontSize: 20, color: "#1677ff" }} />
                      <div
                        style={{ fontSize: 12, color: "#1677ff", marginTop: 4 }}
                      >
                        Upload Profile Pic
                      </div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
              <Text type="secondary" style={{ fontSize: 11 }}>
                JPG, PNG, WebP · Max 5MB
              </Text>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <Progress
                  percent={uploadProgress}
                  size="small"
                  strokeColor="#1677ff"
                />
              )}
            </Col>

            {/* Core fields */}
            <Col xs={24} md={17}>
              <Row gutter={16}>
                <Col xs={24}>
                  <Form.Item
                    label="Full Name"
                    name="fullname"
                    rules={[
                      { required: true, message: "Please enter full name" },
                      {
                        min: MIN_NAME_LENGTH,
                        message: `Min ${MIN_NAME_LENGTH} characters`,
                      },
                      {
                        max: MAX_NAME_LENGTH,
                        message: `Max ${MAX_NAME_LENGTH} characters`,
                      },
                      {
                        pattern: /^[a-zA-Z\s'-]+$/,
                        message: "Only letters, spaces, hyphens, apostrophes",
                      },
                    ]}
                    style={{ marginBottom: 14 }}
                  >
                    <Input
                      className="border border-gray-200!"
                      classNames={{ input: "text-gray-700! font-sans!" }}
                      prefix={<UserOutlined style={{ color: "#9ca3af" }} />}
                      placeholder="Full name"
                      disabled={submitting}
                      maxLength={MAX_NAME_LENGTH}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label="University"
                    name="university"
                    rules={[
                      { required: true, message: "Please enter university" },
                    ]}
                    style={{ marginBottom: 14 }}
                  >
                    <Input
                      className="border border-gray-200!"
                      classNames={{ input: "text-gray-700! font-sans!" }}
                      prefix={<BankOutlined style={{ color: "#9ca3af" }} />}
                      placeholder="e.g Wuhan University of Technology"
                      disabled={submitting}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label="Course / Field"
                    name="course"
                    rules={[{ required: true, message: "Please enter course" }]}
                    style={{ marginBottom: 14 }}
                  >
                    <Input
                      className="border border-gray-200!"
                      classNames={{ input: "text-gray-700! font-sans!" }}
                      prefix={<IdcardOutlined style={{ color: "#9ca3af" }} />}
                      placeholder="e.g., Computer Science"
                      disabled={submitting}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>

          <Divider style={{ margin: "4px 0 16px" }} />

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Graduate Level"
                name="graduate_level"
                rules={[{ required: true, message: "Select level" }]}
                style={{ marginBottom: 14 }}
              >
                <Select
                  placeholder="Select level"
                  disabled={submitting}
                  suffixIcon={<BookOutlined style={{ color: "#9ca3af" }} />}
                >
                  <Option value="undergraduate">Undergraduate</Option>
                  <Option value="graduate">Graduate / Master's</Option>
                  <Option value="phd">PhD / Doctorate</Option>
                  <Option value="postdoc">Postdoctoral</Option>
                  <Option value="professional">Professional</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: "Please enter city" }]}
                style={{ marginBottom: 14 }}
              >
                <Input
                  className="border border-gray-200!"
                  classNames={{ input: "text-gray-700! font-sans!" }}
                  prefix={<EnvironmentOutlined style={{ color: "#9ca3af" }} />}
                  placeholder="e.g., Wuhan"
                  disabled={submitting}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="LinkedIn (Optional)"
                name="linkedin_url"
                rules={[{ type: "url", message: "Enter a valid URL" }]}
                style={{ marginBottom: 14 }}
              >
                <Input
                  className="border border-gray-200!"
                  classNames={{ input: "text-gray-700! font-sans!" }}
                  prefix={<LinkedinOutlined style={{ color: "#9ca3af" }} />}
                  placeholder="linkedin.com/in/..."
                  disabled={submitting}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider />
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Enter a valid email" },
                ]}
                style={{ marginBottom: 14 }}
              >
                <Input
                  className="border border-gray-200!"
                  classNames={{ input: "text-gray-700! font-sans!" }}
                  prefix={<MailOutlined style={{ color: "#9ca3af" }} />}
                  placeholder="member@example.com"
                  type="email"
                  disabled={submitting}
                />
              </Form.Item>
            </Col>
          </Row>

          <Alert
            type="info"
            showIcon
            icon={<SafetyCertificateOutlined />}
            message="Your details will be added to the members directory."
            style={{ marginBottom: 16, fontSize: 12 }}
          />

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              icon={submitting ? <LoadingOutlined /> : <UserOutlined />}
              block
              className="bg-orange-400! text-gray-100! border border-gray-200! hover:bg-orange-300!"
              style={{ height: 36, fontSize: 15, borderRadius: 10 }}
              disabled={submitting}
            >
              {submitting ? "Creating Member..." : "Create Member Profile"}
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <ImageCropModal
        open={cropOpen}
        image={cropImage}
        onCancel={handleCropCancel}
        onConfirm={handleCropConfirm}
      />
    </div>
    </>
  );
};

export default AddMembers;