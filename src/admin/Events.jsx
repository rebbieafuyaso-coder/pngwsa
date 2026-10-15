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
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  UploadOutlined,
  LoadingOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { supabase } from "../supabaseClient";

const { Title, Text } = Typography;
const { TextArea } = Input;

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

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

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [posterFileList, setPosterFileList] = useState([]);
  const [posterUploading, setPosterUploading] = useState(false);

  const [form] = Form.useForm();

  /* =========================================================
     FETCH EVENTS
  ========================================================= */

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      message.error("Failed to load events");
      console.error(error);
    } else {
      setEvents(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  /* =========================================================
     POSTER UPLOAD
  ========================================================= */

  const uploadPoster = async (file) => {
    setPosterUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const filePath = `events/${fileName}`;

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
      setPosterUploading(false);
    }
  };

  const handlePosterChange = async ({ fileList: newList }) => {
    const last = newList[newList.length - 1];

    if (last?.originFileObj) {
      try {
        const url = await uploadPoster(last.originFileObj);
        form.setFieldValue("poster_url", url);
        setPosterFileList([
          {
            uid: last.uid,
            name: last.name,
            status: "done",
            url,
          },
        ]);
      } catch (err) {
        message.error(err.message || "Upload failed");
        setPosterFileList([]);
      }
    } else {
      setPosterFileList(newList);
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
     MODAL OPEN
  ========================================================= */

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setPosterFileList([]);
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      title: record.title,
      event_date: record.event_date,
      location: record.location,
      summary: record.summary,
      description: record.description,
      link: record.link,
      poster_url: record.poster_url,
    });
    setPosterFileList(
      record.poster_url
        ? [{ uid: "-1", name: "poster", status: "done", url: record.poster_url }]
        : []
    );
    setModalOpen(true);
  };

  /* =========================================================
     SUBMIT (create or update)
  ========================================================= */

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        title: values.title.trim(),
        poster_url: values.poster_url || null,
        event_date: values.event_date.trim(),
        location: values.location?.trim() || null,
        summary: values.summary?.trim() || null,
        description: values.description?.trim() || null,
        link: values.link?.trim() || slugify(values.title),
      };

      if (editing) {
        const { error } = await supabase
          .from("events")
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq("id", editing.id);
        if (error) throw error;
        message.success("Event updated");
      } else {
        const { error } = await supabase.from("events").insert(payload);
        if (error) throw error;
        message.success("Event created");
      }

      setModalOpen(false);
      form.resetFields();
      setPosterFileList([]);
      setEditing(null);
      fetchEvents();
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
      .from("events")
      .update({ published: !record.published })
      .eq("id", record.id);

    if (error) {
      message.error("Update failed");
    } else {
      message.success(record.published ? "Event unpublished" : "Event published");
      fetchEvents();
    }
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async (record) => {
    const { error } = await supabase.from("events").delete().eq("id", record.id);
    if (error) {
      message.error("Delete failed");
    } else {
      message.success("Event deleted");
      fetchEvents();
    }
  };

  /* =========================================================
     TABLE COLUMNS
  ========================================================= */

  const columns = [
    {
      title: "Poster",
      dataIndex: "poster_url",
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
            <CalendarOutlined />
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
      title: "Date",
      dataIndex: "event_date",
      width: 160,
      render: (text) => <span className="text-sm text-slate-600">{text}</span>,
    },
    {
      title: "Location",
      dataIndex: "location",
      width: 220,
      render: (text) => (
        <span className="flex items-center gap-1 text-sm text-slate-600">
          <EnvironmentOutlined className="text-slate-400" />
          {text || "—"}
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
            title="Delete this event?"
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
            Events
          </Title>
          <Text type="secondary">
            Manage upcoming events, their posters, and details.
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={openCreate}
          className="rounded-lg! border-none! bg-orange-500! hover:bg-orange-400!"
        >
          New Event
        </Button>
      </div>

      <Table
        rowKey="id"
        loading={loading}
        dataSource={events}
        columns={columns}
        pagination={{ pageSize: 10, hideOnSinglePage: true }}
        scroll={{ x: 900 }}
        className="overflow-hidden! rounded-2xl! shadow-sm!"
      />

      {/* =====================================================
          CREATE / EDIT MODAL
      ===================================================== */}

      <Modal
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
          setPosterFileList([]);
          setEditing(null);
        }}
        title={editing ? "Edit Event" : "New Event"}
        width={720}
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
          {/* Poster uploader */}
          <Form.Item label="Poster Image">
            <Upload
              listType="picture-card"
              fileList={posterFileList}
              beforeUpload={beforeUpload}
              onChange={handlePosterChange}
              onRemove={() => {
                setPosterFileList([]);
                form.setFieldValue("poster_url", null);
              }}
              maxCount={1}
              accept={ALLOWED_FILE_TYPES.join(",")}
            >
              {posterFileList.length === 0 && (
                <div className="text-center">
                  {posterUploading ? (
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

          <Form.Item name="poster_url" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input
              placeholder="e.g., Wuhan University of Technology Cultural Day"
              onBlur={(e) => {
                if (!form.getFieldValue("link")) {
                  form.setFieldValue("link", slugify(e.target.value));
                }
              }}
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Date"
              name="event_date"
              rules={[{ required: true, message: "Please enter the date" }]}
            >
              <Input placeholder="e.g., November, 2026" />
            </Form.Item>

            <Form.Item label="Location" name="location">
              <Input placeholder="e.g., Wuhan University of Technology" />
            </Form.Item>
          </div>

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
            extra="Used in the URL: /events/your-slug"
          >
            <Input placeholder="pngwsa-wut-cultural-celebration" />
          </Form.Item>

          <Form.Item label="Summary" name="summary">
            <TextArea
              rows={3}
              placeholder="Short teaser shown on listing pages"
              maxLength={300}
              showCount
            />
          </Form.Item>

          <Form.Item label="Full Description" name="description">
            <TextArea
              rows={8}
              placeholder="Full event details. Use blank lines to separate paragraphs."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Events;