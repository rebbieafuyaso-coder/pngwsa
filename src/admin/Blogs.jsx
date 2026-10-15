import { useEffect, useState, useCallback } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Tag,
  Space,
  Popconfirm,
  Typography,
  Upload,
  Image,
  Tooltip,
  Switch,
  Select,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  UploadOutlined,
  LoadingOutlined,
  FileTextOutlined,
  LinkOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { supabase } from "../supabaseClient";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const BLOG_TYPES = ["News", "Announcement", "Story", "Update", "Event Recap"];

/* =========================================================
   SLUG HELPER
========================================================= */

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

/* =========================================================
   COMPONENT
========================================================= */

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [imageFileList, setImageFileList] = useState([]);
  const [imageUploading, setImageUploading] = useState(false);

  const [form] = Form.useForm();

  /* =========================================================
     FETCH
  ========================================================= */

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      message.error("Failed to load blogs");
      console.error(error);
    } else {
      setBlogs(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  /* =========================================================
     IMAGE UPLOAD
  ========================================================= */

  const uploadImage = async (file) => {
    setImageUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const filePath = `blogs/${fileName}`;

      const { error } = await supabase.storage
        .from("media")
        .upload(filePath, file, {
          cacheControl: "3600",
          contentType: file.type,
        });

      if (error) throw new Error(error.message);

      const { data } = supabase.storage.from("media").getPublicUrl(filePath);
      return data.publicUrl;
    } finally {
      setImageUploading(false);
    }
  };

  const handleImageChange = async ({ fileList: newList }) => {
    const last = newList[newList.length - 1];

    if (last?.originFileObj) {
      try {
        const url = await uploadImage(last.originFileObj);
        form.setFieldValue("image_url", url);
        setImageFileList([
          {
            uid: last.uid,
            name: last.name,
            status: "done",
            url,
          },
        ]);
      } catch (err) {
        message.error(err.message || "Upload failed");
        setImageFileList([]);
      }
    } else {
      setImageFileList(newList);
    }
  };

  const beforeUpload = (file) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      message.error("Only JPEG, PNG, WebP, or GIF allowed");
      return Upload.LIST_IGNORE;
    }
    if (file.size / 1024 / 1024 >= MAX_FILE_SIZE_MB) {
      message.error(`Max ${MAX_FILE_SIZE_MB}MB`);
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  /* =========================================================
     MODAL
  ========================================================= */

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setImageFileList([]);
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      title: record.title,
      type: record.type,
      excerpt: record.excerpt,
      content: record.content,
      link: record.link,
      author: record.author,
      publish_date: record.publish_date,
      image_url: record.image_url,
    });
    setImageFileList(
      record.image_url
        ? [{ uid: "-1", name: "cover", status: "done", url: record.image_url }]
        : []
    );
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    form.resetFields();
    setImageFileList([]);
    setEditing(null);
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        title: values.title.trim(),
        image_url: values.image_url || null,
        type: values.type,
        excerpt: values.excerpt?.trim() || null,
        content: values.content?.trim() || null,
        link: values.link?.trim() || slugify(values.title),
        author: values.author?.trim() || null,
        publish_date: values.publish_date?.trim() || null,
      };

      if (editing) {
        const { error } = await supabase
          .from("blogs")
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq("id", editing.id);
        if (error) throw error;
        message.success("Blog updated");
      } else {
        const { error } = await supabase.from("blogs").insert(payload);
        if (error) throw error;
        message.success("Blog created");
      }

      closeModal();
      fetchBlogs();
    } catch (err) {
      console.error(err);
      message.error(err.message || "Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================================
     PUBLISH TOGGLE
  ========================================================= */

  const togglePublished = async (record) => {
    const { error } = await supabase
      .from("blogs")
      .update({ published: !record.published })
      .eq("id", record.id);

    if (error) {
      message.error("Update failed");
    } else {
      message.success(record.published ? "Blog unpublished" : "Blog published");
      fetchBlogs();
    }
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async (record) => {
    const { error } = await supabase.from("blogs").delete().eq("id", record.id);
    if (error) {
      message.error("Delete failed");
    } else {
      message.success("Blog deleted");
      fetchBlogs();
    }
  };

  /* =========================================================
     TABLE COLUMNS
  ========================================================= */

  const columns = [
    {
      title: "Cover",
      dataIndex: "image_url",
      width: 90,
      render: (url) =>
        url ? (
          <Image
            src={url}
            width={60}
            height={60}
            style={{ objectFit: "cover", borderRadius: 8 }}
            preview
          />
        ) : (
          <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg bg-slate-100 text-slate-300">
            <FileTextOutlined />
          </div>
        ),
    },
    {
      title: "Title",
      dataIndex: "title",
      render: (text, record) => (
        <div>
          <div className="font-medium text-slate-800">{text}</div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <LinkOutlined /> /{record.link}
          </div>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      width: 140,
      render: (type) => (
        <Tag color="blue" className="rounded-full!">
          {type}
        </Tag>
      ),
    },
    {
      title: "Author",
      dataIndex: "author",
      width: 170,
      render: (author) => (
        <span className="flex items-center gap-1 text-sm text-slate-600">
          <UserOutlined className="text-slate-400" />
          {author || "—"}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "publish_date",
      width: 150,
      render: (date) => (
        <span className="flex items-center gap-1 text-sm text-slate-600">
          <CalendarOutlined className="text-slate-400" />
          {date || "—"}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "published",
      width: 160,
      render: (published, record) => (
        <Space>
          <Switch
            size="small"
            checked={published}
            onChange={() => togglePublished(record)}
          />
          <Tag color={published ? "green" : "default"} className="rounded-full!">
            {published ? "Published" : "Draft"}
          </Tag>
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openEdit(record)}
            />
          </Tooltip>
          <Tooltip title={record.published ? "Unpublish" : "Publish"}>
            <Button
              type="text"
              icon={
                record.published ? <EyeInvisibleOutlined /> : <EyeOutlined />
              }
              onClick={() => togglePublished(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this blog post?"
            description="This action cannot be undone."
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Title level={3} className="mb-1!">
            Blogs
          </Title>
          <Text type="secondary">
            Manage news, stories, and updates for the community.
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={openCreate}
          className="rounded-lg! border-none! bg-orange-500! hover:bg-orange-400!"
        >
          New Blog
        </Button>
      </div>

      <Table
        rowKey="id"
        loading={loading}
        dataSource={blogs}
        columns={columns}
        pagination={{ pageSize: 10, hideOnSinglePage: true }}
        scroll={{ x: 1000 }}
        className="overflow-hidden! rounded-2xl! shadow-sm!"
      />

      {/* =====================================================
          CREATE / EDIT MODAL
      ===================================================== */}

      <Modal
        open={modalOpen}
        onCancel={closeModal}
        title={editing ? "Edit Blog" : "New Blog"}
        width={760}
        okText={editing ? "Update" : "Create"}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          className="mt-4"
        >
          {/* Cover image */}
          <Form.Item label="Cover Image">
            <Upload
              listType="picture-card"
              fileList={imageFileList}
              beforeUpload={beforeUpload}
              onChange={handleImageChange}
              onRemove={() => {
                setImageFileList([]);
                form.setFieldValue("image_url", null);
              }}
              maxCount={1}
              accept={ALLOWED_FILE_TYPES.join(",")}
            >
              {imageFileList.length === 0 && (
                <div className="text-center">
                  {imageUploading ? (
                    <LoadingOutlined />
                  ) : (
                    <>
                      <UploadOutlined />
                      <div className="mt-1 text-xs">Upload</div>
                    </>
                  )}
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item name="image_url" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input
              placeholder="e.g., PNGWSA welcomes first batch of STEM students"
              onBlur={(e) => {
                if (!form.getFieldValue("link")) {
                  form.setFieldValue("link", slugify(e.target.value));
                }
              }}
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: "Please select a type" }]}
            >
              <Select placeholder="Select type">
                {BLOG_TYPES.map((t) => (
                  <Option key={t} value={t}>
                    {t}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Author" name="author">
              <Input placeholder="e.g., Rebbie Afuyaso" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Publish Date"
              name="publish_date"
              extra="Free text — e.g., '15 December 2025'"
            >
              <Input placeholder="e.g., 15 December 2025" />
            </Form.Item>

            <Form.Item
              label="URL Slug"
              name="link"
              rules={[
                { required: true, message: "Please enter a slug" },
                {
                  pattern: /^[a-z0-9-]+$/,
                  message: "Only lowercase letters, numbers, and dashes",
                },
              ]}
              extra="Used in: /blogs/your-slug"
            >
              <Input placeholder="pngwsa-welcomes-stem-students" />
            </Form.Item>
          </div>

          <Form.Item
            label="Excerpt"
            name="excerpt"
            rules={[{ required: true, message: "Please enter an excerpt" }]}
            extra="Short teaser shown on the blog listing and homepage"
          >
            <TextArea
              rows={3}
              placeholder="One or two sentences summarizing the post"
              maxLength={300}
              showCount
            />
          </Form.Item>

          <Form.Item
            label="Full Content"
            name="content"
            rules={[{ required: true, message: "Please enter the content" }]}
            extra="Use blank lines to separate paragraphs"
          >
            <TextArea
              rows={12}
              placeholder="Full article. Separate paragraphs with a blank line."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Blogs;