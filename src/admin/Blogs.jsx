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
  Empty,
  Skeleton,
  Divider,
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
import { Helmet } from "react-helmet-async";

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
          { uid: last.uid, name: last.name, status: "done", url },
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
     MOBILE CARD
  ========================================================= */

  const BlogCard = ({ record }) => (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Cover */}
      <div className="relative h-40 w-full bg-slate-100">
        {record.image_url ? (
          <Image
            src={record.image_url}
            alt={record.title}
            className="h-full w-full object-cover"
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
            preview
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300 text-3xl">
            <FileTextOutlined />
          </div>
        )}
        <Tag
          color={record.published ? "green" : "default"}
          className="rounded-full! absolute top-2 right-2"
        >
          {record.published ? "Published" : "Draft"}
        </Tag>
        {record.type && (
          <Tag
            color="blue"
            className="rounded-full! absolute top-2 left-2"
          >
            {record.type}
          </Tag>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="font-semibold text-slate-800 line-clamp-2 mb-1">
          {record.title}
        </p>
        <p className="text-xs text-slate-400 flex items-center gap-1 mb-3 truncate">
          <LinkOutlined /> /{record.link}
        </p>

        <div className="space-y-1.5 text-sm text-slate-600 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <UserOutlined className="text-slate-400 shrink-0" />
            <span className="truncate">{record.author || "—"}</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <CalendarOutlined className="text-slate-400 shrink-0" />
            <span className="truncate">{record.publish_date || "—"}</span>
          </div>
        </div>

        <Divider className="!my-3" />

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch
              size="small"
              checked={record.published}
              onChange={() => togglePublished(record)}
            />
            <span className="text-xs text-slate-500">
              {record.published ? "Published" : "Draft"}
            </span>
          </div>
          <Space size={0}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openEdit(record)}
            />
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
        </div>
      </div>
    </div>
  );

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      <Helmet>
        <title>Blogs | PNG HSA Admin</title>
        <meta name="description" content="Admin page for managing blogs" />
      </Helmet>
      <div className="w-full">
        {/* Header */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Title level={3} className="mb-1! text-xl sm:text-2xl md:text-3xl">
              Blogs
            </Title>
            <Text type="secondary" className="text-xs sm:text-sm">
              Manage news, stories, and updates for the community.
            </Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreate}
            className="rounded-lg! border-none! bg-orange-500! hover:bg-orange-400! w-full sm:w-auto"
          >
            New Blog
          </Button>
        </div>

        {/* MOBILE: cards */}
        <div className="md:hidden">
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm"
                >
                  <Skeleton.Image active style={{ width: "100%", height: 160 }} />
                  <div className="p-4">
                    <Skeleton active paragraph={{ rows: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No blog posts yet — tap 'New Blog' to get started"
            />
          ) : (
            <div className="space-y-3">
              {blogs.map((record) => (
                <BlogCard key={record.id} record={record} />
              ))}
            </div>
          )}
        </div>

        {/* DESKTOP: table */}
        <div className="hidden md:block">
          <Table
            rowKey="id"
            loading={loading}
            dataSource={blogs}
            columns={columns}
            pagination={{ pageSize: 10, hideOnSinglePage: true }}
            scroll={{ x: 1000 }}
            className="overflow-hidden! rounded-2xl! shadow-sm!"
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No blog posts yet — click 'New Blog' to get started"
                />
              ),
            }}
          />
        </div>

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
          style={{ maxWidth: "calc(100vw - 32px)", top: 24 }}
          styles={{
            body: {
              maxHeight: "calc(100vh - 180px)",
              overflowY: "auto",
              paddingTop: 12,
            },
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
            className="mt-2"
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

            {/* Type + Author */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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

            {/* Date + Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                rows={8}
                placeholder="Full article. Separate paragraphs with a blank line."
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default Blogs;