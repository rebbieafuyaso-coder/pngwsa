import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Table, Button, Modal, Form, Input, Select, message, Tag, Space,
  Popconfirm, Typography, Image, Upload, Tooltip, Switch, Divider, Empty,
  Skeleton,
} from "antd";
import {
  PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined,
  LoadingOutlined, PictureOutlined, EyeOutlined, EyeInvisibleOutlined,
  FolderAddOutlined, SettingOutlined,
} from "@ant-design/icons";
import { supabase } from "../supabaseClient";
import { Helmet } from "react-helmet-async";

const { Title, Text } = Typography;
const { TextArea } = Input;

const MAX_FILE_SIZE_MB = 8;
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const slugify = (text) =>
  text.toString().toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const Gallery = () => {
  const [sections, setSections] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(null);

  const [itemOpen, setItemOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  const [sectionOpen, setSectionOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionDesc, setNewSectionDesc] = useState("");
  const [savingSection, setSavingSection] = useState(false);

  /* =========================================================
     FETCH
  ========================================================= */

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [sectionsRes, itemsRes] = await Promise.all([
      supabase.from("gallery_sections").select("*").order("display_order"),
      supabase.from("gallery").select("*").order("display_order"),
    ]);

    if (sectionsRes.error) console.error(sectionsRes.error);
    if (itemsRes.error) console.error(itemsRes.error);

    const secs = sectionsRes.data ?? [];
    setSections(secs);
    setItems(itemsRes.data ?? []);
    if (!activeSection && secs.length > 0) setActiveSection(secs[0].id);
    setLoading(false);
  }, [activeSection]);

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sectionMap = useMemo(() => {
    const m = {};
    sections.forEach((s) => (m[s.id] = s));
    return m;
  }, [sections]);

  const visibleItems = useMemo(
    () => items.filter((i) => i.section_id === activeSection),
    [items, activeSection]
  );

  /* =========================================================
     UPLOAD
  ========================================================= */

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

  const uploadImage = async (file) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const sectionSlug = sectionMap[activeSection]?.slug || "misc";
      const filePath = `gallery/${sectionSlug}/${fileName}`;

      const { error } = await supabase.storage
        .from("media")
        .upload(filePath, file, { cacheControl: "3600", contentType: file.type });

      if (error) throw new Error(error.message);

      const { data } = supabase.storage.from("media").getPublicUrl(filePath);
      return data.publicUrl;
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async ({ fileList: newList }) => {
    const last = newList[newList.length - 1];
    if (last?.originFileObj) {
      try {
        const url = await uploadImage(last.originFileObj);
        form.setFieldValue("image_url", url);
        setFileList([{ uid: last.uid, name: last.name, status: "done", url }]);
      } catch (err) {
        message.error(err.message || "Upload failed");
        setFileList([]);
      }
    } else {
      setFileList(newList);
    }
  };

  /* =========================================================
     ITEM MODAL
  ========================================================= */

  const openCreate = () => {
    if (!activeSection) {
      message.warning("Create a section first");
      return;
    }
    setEditing(null);
    form.resetFields();
    form.setFieldValue("section_id", activeSection);
    setFileList([]);
    setItemOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      title: record.title,
      caption: record.caption,
      event: record.event,
      taken_date: record.taken_date,
      section_id: record.section_id,
      display_order: record.display_order,
      image_url: record.image_url,
    });
    setFileList(
      record.image_url
        ? [{ uid: "-1", name: "image", status: "done", url: record.image_url }]
        : []
    );
    setItemOpen(true);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        section_id: values.section_id,
        image_url: values.image_url,
        title: values.title?.trim() || null,
        caption: values.caption?.trim() || null,
        event: values.event?.trim() || null,
        taken_date: values.taken_date?.trim() || null,
        display_order: Number(values.display_order) || 0,
      };

      if (editing) {
        const { error } = await supabase.from("gallery").update(payload).eq("id", editing.id);
        if (error) throw error;
        message.success("Updated");
      } else {
        const { error } = await supabase.from("gallery").insert(payload);
        if (error) throw error;
        message.success("Added");
      }

      setItemOpen(false);
      form.resetFields();
      setFileList([]);
      setEditing(null);
      fetchAll();
    } catch (err) {
      message.error(err.message || "Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (record) => {
    const { error } = await supabase.from("gallery").delete().eq("id", record.id);
    if (error) message.error("Delete failed");
    else {
      message.success("Deleted");
      fetchAll();
    }
  };

  const togglePublished = async (record) => {
    const { error } = await supabase
      .from("gallery")
      .update({ published: !record.published })
      .eq("id", record.id);
    if (error) message.error("Update failed");
    else fetchAll();
  };

  /* =========================================================
     SECTION MANAGEMENT
  ========================================================= */

  const handleAddSection = async () => {
    if (!newSectionTitle.trim()) {
      message.warning("Enter a title");
      return;
    }
    setSavingSection(true);
    try {
      const nextOrder =
        sections.length > 0
          ? Math.max(...sections.map((s) => s.display_order || 0)) + 1
          : 1;

      const { error } = await supabase.from("gallery_sections").insert({
        title: newSectionTitle.trim(),
        slug: slugify(newSectionTitle),
        description: newSectionDesc.trim() || null,
        display_order: nextOrder,
      });
      if (error) throw error;
      message.success("Section added");
      setNewSectionTitle("");
      setNewSectionDesc("");
      fetchAll();
    } catch (err) {
      if (err.message?.includes("duplicate")) {
        message.error("A section with that name already exists");
      } else {
        message.error(err.message || "Failed");
      }
    } finally {
      setSavingSection(false);
    }
  };

  const handleDeleteSection = async (section) => {
    const { error } = await supabase
      .from("gallery_sections")
      .delete()
      .eq("id", section.id);
    if (error) message.error("Delete failed");
    else {
      message.success("Section deleted");
      if (activeSection === section.id) setActiveSection(null);
      fetchAll();
    }
  };

  /* =========================================================
     TABLE COLUMNS (desktop)
  ========================================================= */

  const columns = [
    {
      title: "Image",
      dataIndex: "image_url",
      width: 90,
      render: (url) =>
        url ? (
          <Image
            src={url}
            width={60}
            height={60}
            style={{ objectFit: "cover", borderRadius: 8 }}
          />
        ) : (
          <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg bg-slate-100 text-slate-300">
            <PictureOutlined />
          </div>
        ),
    },
    {
      title: "Title / Caption",
      render: (_, r) => (
        <div>
          <div className="font-medium text-slate-800">{r.title || "—"}</div>
          <div className="text-xs text-slate-400 line-clamp-1">{r.caption || ""}</div>
        </div>
      ),
    },
    {
      title: "Event",
      dataIndex: "event",
      width: 180,
      render: (t) => <span className="text-sm text-slate-600">{t || "—"}</span>,
    },
    {
      title: "Date",
      dataIndex: "taken_date",
      width: 130,
      render: (t) => <span className="text-sm text-slate-600">{t || "—"}</span>,
    },
    {
      title: "Order",
      dataIndex: "display_order",
      width: 80,
      render: (n) => <span className="text-sm text-slate-500">{n ?? 0}</span>,
    },
    {
      title: "Status",
      dataIndex: "published",
      width: 150,
      render: (pub, r) => (
        <Space>
          <Switch size="small" checked={pub} onChange={() => togglePublished(r)} />
          <Tag color={pub ? "green" : "default"} className="rounded-full!">
            {pub ? "Published" : "Draft"}
          </Tag>
        </Space>
      ),
    },
    {
      title: "Actions",
      width: 130,
      fixed: "right",
      render: (_, r) => (
        <Space>
          <Tooltip title="Edit">
            <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(r)} />
          </Tooltip>
          <Tooltip title={r.published ? "Unpublish" : "Publish"}>
            <Button
              type="text"
              icon={r.published ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              onClick={() => togglePublished(r)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this image?"
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(r)}
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

  const GalleryCard = ({ record }) => (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Image */}
      <div className="relative aspect-square w-full bg-slate-100">
        {record.image_url ? (
          <Image
            src={record.image_url}
            alt={record.title || "gallery image"}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300 text-3xl">
            <PictureOutlined />
          </div>
        )}
        <Tag
          color={record.published ? "green" : "default"}
          className="rounded-full! absolute top-2 right-2"
        >
          {record.published ? "Published" : "Draft"}
        </Tag>
      </div>

      {/* Info + actions */}
      <div className="p-3">
        <p className="font-semibold text-slate-800 truncate text-sm">
          {record.title || "Untitled"}
        </p>
        {record.caption && (
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
            {record.caption}
          </p>
        )}

        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <Switch
              size="small"
              checked={record.published}
              onChange={() => togglePublished(record)}
            />
            <span className="text-[11px] text-slate-500">
              {record.published ? "Live" : "Draft"}
            </span>
          </div>
          <Space size={0}>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => openEdit(record)}
            />
            <Popconfirm
              title="Delete this image?"
              okText="Delete"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDelete(record)}
            >
              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
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
        <title>Gallery | PNG HSA Admin</title>
        <meta name="description" content="Admin page for managing gallery sections and images" />
      </Helmet>

      <div className="w-full">
        {/* Header */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Title level={3} className="mb-1! text-xl sm:text-2xl md:text-3xl">
              Gallery
            </Title>
            <Text type="secondary" className="text-xs sm:text-sm">
              Manage gallery sections and images shown on the public site.
            </Text>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              icon={<SettingOutlined />}
              onClick={() => setSectionOpen(true)}
              className="rounded-lg! w-full sm:w-auto"
            >
              Manage Sections
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreate}
              disabled={!activeSection}
              className="rounded-lg! border-none! bg-orange-500! hover:bg-orange-400! w-full sm:w-auto"
            >
              Add Image
            </Button>
          </div>
        </div>

        {/* Section tabs — horizontally scrollable on mobile */}
        {sections.length > 0 && (
          <div className="mb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin sm:flex-wrap sm:overflow-visible">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    activeSection === s.id
                      ? "bg-orange-500 text-white"
                      : "bg-white text-slate-600 hover:bg-orange-50 border border-slate-200"
                  }`}
                >
                  {s.title}
                  <span className="ml-2 text-xs opacity-70">
                    {items.filter((i) => i.section_id === s.id).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MOBILE: 2-column card grid */}
        <div className="md:hidden">
          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm"
                >
                  <Skeleton.Image active style={{ width: "100%", height: 140 }} />
                  <div className="p-3">
                    <Skeleton active paragraph={{ rows: 1 }} title={false} />
                  </div>
                </div>
              ))}
            </div>
          ) : visibleItems.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                activeSection
                  ? "No images in this section yet"
                  : "Create a section to get started"
              }
            />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {visibleItems.map((record) => (
                <GalleryCard key={record.id} record={record} />
              ))}
            </div>
          )}
        </div>

        {/* DESKTOP: table */}
        <div className="hidden md:block">
          <Table
            rowKey="id"
            loading={loading}
            dataSource={visibleItems}
            columns={columns}
            pagination={{ pageSize: 10, hideOnSinglePage: true }}
            scroll={{ x: 900 }}
            className="overflow-hidden! rounded-2xl! shadow-sm!"
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    activeSection
                      ? "No images in this section yet"
                      : "Create a section to get started"
                  }
                />
              ),
            }}
          />
        </div>

        {/* =====================================================
            ITEM MODAL
        ===================================================== */}

        <Modal
          open={itemOpen}
          onCancel={() => {
            setItemOpen(false);
            form.resetFields();
            setFileList([]);
            setEditing(null);
          }}
          title={editing ? "Edit Image" : "Add Image"}
          width={640}
          okText={editing ? "Update" : "Add"}
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
            <Form.Item
              label="Image"
              required
              rules={[{ required: true, message: "Please upload an image" }]}
            >
              <Upload
                listType="picture-card"
                fileList={fileList}
                beforeUpload={beforeUpload}
                onChange={handleFileChange}
                onRemove={() => {
                  setFileList([]);
                  form.setFieldValue("image_url", null);
                }}
                maxCount={1}
                accept={ALLOWED_FILE_TYPES.join(",")}
              >
                {fileList.length === 0 && (
                  <div className="text-center">
                    {uploading ? (
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

            <Form.Item
              name="image_url"
              hidden
              rules={[{ required: true, message: "Please upload an image" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Section" name="section_id" rules={[{ required: true }]}>
              <Select
                options={sections.map((s) => ({ value: s.id, label: s.title }))}
                placeholder="Choose section"
              />
            </Form.Item>

            <Form.Item label="Title" name="title">
              <Input placeholder="e.g., Registration 2025" />
            </Form.Item>

            <Form.Item label="Caption" name="caption">
              <TextArea
                rows={2}
                placeholder="Short description shown on hover / under image"
              />
            </Form.Item>

            {/* Stacks on phones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Form.Item label="Event" name="event">
                <Input placeholder="e.g., Annual Independence Celebration" />
              </Form.Item>
              <Form.Item label="Date" name="taken_date">
                <Input placeholder="e.g., September 16, 2025" />
              </Form.Item>
            </div>

            <Form.Item
              label="Display Order"
              name="display_order"
              extra="Lower numbers show first"
            >
              <Input type="number" placeholder="0" />
            </Form.Item>
          </Form>
        </Modal>

        {/* =====================================================
            SECTIONS MODAL
        ===================================================== */}

        <Modal
          open={sectionOpen}
          onCancel={() => setSectionOpen(false)}
          title="Manage Sections"
          footer={null}
          width={520}
          destroyOnClose
          style={{ maxWidth: "calc(100vw - 32px)", top: 24 }}
          styles={{
            body: {
              maxHeight: "calc(100vh - 180px)",
              overflowY: "auto",
            },
          }}
        >
          <div className="mt-4">
            <Input
              placeholder="Section title"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              prefix={<FolderAddOutlined className="text-slate-400" />}
            />
            <Input.TextArea
              placeholder="Short description (optional)"
              value={newSectionDesc}
              onChange={(e) => setNewSectionDesc(e.target.value)}
              rows={2}
              className="mt-2"
            />
            <Button
              type="primary"
              block
              onClick={handleAddSection}
              loading={savingSection}
              className="mt-3! border-none! bg-orange-500! hover:bg-orange-400!"
            >
              Add Section
            </Button>
          </div>

          <Divider className="my-4!" />

          <div className="max-h-80 overflow-y-auto pr-1">
            {sections.length === 0 ? (
              <Text type="secondary">No sections yet.</Text>
            ) : (
              <Space direction="vertical" className="w-full" size="small">
                {sections.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-700 truncate">
                        {s.title}
                      </div>
                      {s.description && (
                        <div className="text-xs text-slate-400 line-clamp-1">
                          {s.description}
                        </div>
                      )}
                    </div>
                    <Popconfirm
                      title="Delete this section?"
                      description="All images inside will also be deleted."
                      okText="Delete"
                      okButtonProps={{ danger: true }}
                      onConfirm={() => handleDeleteSection(s)}
                    >
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                      />
                    </Popconfirm>
                  </div>
                ))}
              </Space>
            )}
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Gallery;