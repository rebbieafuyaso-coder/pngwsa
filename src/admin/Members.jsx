import { useEffect, useState, useCallback } from "react";
import {
  Table, Input, message, Tag, Typography, Avatar, Button, Modal, Form,
  Select, Popconfirm, Empty, Skeleton, Space, Divider,
} from "antd";
import {
  SearchOutlined, UserOutlined, MailOutlined, BankOutlined,
  EnvironmentOutlined, EditOutlined, DeleteOutlined, PlusOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { supabase } from "../supabaseClient";

const { Title, Text } = Typography;
const { Option } = Select;

/* =========================================================
   FORM OPTIONS
========================================================= */
const GRADUATE_LEVELS = [
  "Undergraduate",
  "Masters",
  "PhD",
  "Language Student",
  "Other",
];

/* =========================================================
   COMPONENT
========================================================= */
const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = create, object = edit
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  /* -----------------------------------------------------
     FETCH
  ----------------------------------------------------- */
  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      message.error("Failed to load members");
      console.error(error);
    } else {
      setMembers(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  /* -----------------------------------------------------
     FILTER
  ----------------------------------------------------- */
  const filtered = members.filter((m) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return [m.fullname, m.email, m.university, m.course, m.city]
      .filter(Boolean)
      .some((v) => v.toLowerCase().includes(term));
  });

  /* -----------------------------------------------------
     OPEN MODAL
  ----------------------------------------------------- */
  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (member) => {
    setEditing(member);
    form.setFieldsValue({
      fullname: member.fullname,
      email: member.email,
      university: member.university,
      course: member.course,
      graduate_level: member.graduate_level,
      city: member.city,
    });
    setModalOpen(true);
  };

  /* -----------------------------------------------------
     SAVE (create or update)
  ----------------------------------------------------- */
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      if (editing) {
        // UPDATE
        const { error } = await supabase
          .from("members")
          .update(values)
          .eq("id", editing.id);

        if (error) throw error;
        message.success("Member updated");
      } else {
        // CREATE
        const { error } = await supabase.from("members").insert(values);
        if (error) throw error;
        message.success("Member added");
      }

      setModalOpen(false);
      form.resetFields();
      setEditing(null);
      fetchMembers();
    } catch (err) {
      if (err?.errorFields) return; // validation error, ignore
      console.error(err);
      message.error(err.message || "Failed to save member");
    } finally {
      setSaving(false);
    }
  };

  /* -----------------------------------------------------
     DELETE
  ----------------------------------------------------- */
  const handleDelete = async (member) => {
    const { error } = await supabase
      .from("members")
      .delete()
      .eq("id", member.id);

    if (error) {
      message.error("Failed to delete member");
      console.error(error);
      return;
    }
    message.success("Member deleted");
    fetchMembers();
  };

  /* -----------------------------------------------------
     COLUMNS (desktop table)
  ----------------------------------------------------- */
  const columns = [
    {
      title: "",
      dataIndex: "avatar_url",
      width: 60,
      render: (url, r) => (
        <Avatar src={url} icon={!url && <UserOutlined />}>
          {!url && r.fullname?.[0]}
        </Avatar>
      ),
    },
    {
      title: "Name",
      dataIndex: "fullname",
      render: (text) => (
        <span className="font-medium text-slate-800">{text}</span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text) => (
        <span className="flex items-center gap-1 text-sm text-slate-600">
          <MailOutlined className="text-slate-400" />
          {text}
        </span>
      ),
    },
    {
      title: "University",
      dataIndex: "university",
      render: (text) => (
        <span className="flex items-center gap-1 text-sm text-slate-600">
          <BankOutlined className="text-slate-400" />
          {text || "—"}
        </span>
      ),
    },
    { title: "Course", dataIndex: "course", render: (t) => t || "—" },
    {
      title: "Level",
      dataIndex: "graduate_level",
      width: 140,
      render: (level) =>
        level ? (
          <Tag color="blue" className="rounded-full!">
            {level}
          </Tag>
        ) : (
          "—"
        ),
    },
    {
      title: "City",
      dataIndex: "city",
      width: 130,
      render: (text) => (
        <span className="flex items-center gap-1 text-sm text-slate-600">
          <EnvironmentOutlined className="text-slate-400" />
          {text || "—"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 110,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
          />
          <Popconfirm
            title="Delete this member?"
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

  /* -----------------------------------------------------
     MOBILE CARD
  ----------------------------------------------------- */
  const MemberCard = ({ member }) => (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
      {/* Top row: avatar + name + actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar
            size={44}
            src={member.avatar_url}
            icon={!member.avatar_url && <UserOutlined />}
          >
            {!member.avatar_url && member.fullname?.[0]}
          </Avatar>
          <div className="min-w-0">
            <p className="font-semibold text-slate-800 truncate">
              {member.fullname || "Unnamed"}
            </p>
            {member.graduate_level && (
              <Tag color="blue" className="rounded-full! mt-1">
                {member.graduate_level}
              </Tag>
            )}
          </div>
        </div>
        <Space size={0}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openEdit(member)}
          />
          <Popconfirm
            title="Delete this member?"
            description="This action cannot be undone."
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(member)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      </div>

      <Divider className="!my-3" />

      {/* Details */}
      <div className="space-y-2 text-sm text-slate-600">
        {member.email && (
          <div className="flex items-center gap-2 min-w-0">
            <MailOutlined className="text-slate-400 shrink-0" />
            <span className="truncate">{member.email}</span>
          </div>
        )}
        {member.university && (
          <div className="flex items-center gap-2 min-w-0">
            <BankOutlined className="text-slate-400 shrink-0" />
            <span className="truncate">{member.university}</span>
          </div>
        )}
        {member.course && (
          <div className="flex items-center gap-2 min-w-0">
            <BookOutlined className="text-slate-400 shrink-0" />
            <span className="truncate">{member.course}</span>
          </div>
        )}
        {member.city && (
          <div className="flex items-center gap-2 min-w-0">
            <EnvironmentOutlined className="text-slate-400 shrink-0" />
            <span className="truncate">{member.city}</span>
          </div>
        )}
      </div>
    </div>
  );

  /* -----------------------------------------------------
     RENDER
  ----------------------------------------------------- */
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Title level={3} className="mb-1! text-xl sm:text-2xl md:text-3xl">
            Members
          </Title>
          <Text type="secondary" className="text-xs sm:text-sm">
            {members.length} registered{" "}
            {members.length === 1 ? "member" : "members"}
          </Text>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            placeholder="Search members..."
            prefix={<SearchOutlined className="text-slate-400" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            className="w-full sm:max-w-xs"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreate}
            className="w-full sm:w-auto"
          >
            Add Member
          </Button>
        </div>
      </div>

      {/* MOBILE: cards (hidden on md and up) */}
      <div className="md:hidden">
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <Skeleton avatar active paragraph={{ rows: 3 }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Empty description={search ? "No matches found" : "No members yet"} />
        ) : (
          <div className="space-y-3">
            {filtered.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </div>

      {/* DESKTOP: table (hidden below md) */}
      <div className="hidden md:block">
        <Table
          rowKey="id"
          loading={loading}
          dataSource={filtered}
          columns={columns}
          pagination={{ pageSize: 10, hideOnSinglePage: true }}
          scroll={{ x: 900 }}
          className="overflow-hidden! rounded-2xl! shadow-sm!"
        />
      </div>

      {/* EDIT / CREATE MODAL */}
      <Modal
        title={editing ? "Edit Member" : "Add Member"}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
          setEditing(null);
        }}
        onOk={handleSave}
        confirmLoading={saving}
        okText={editing ? "Save Changes" : "Add Member"}
        destroyOnClose
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="fullname"
            label="Full Name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="John Doe" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter the email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="john@example.com" />
          </Form.Item>

          <Form.Item name="university" label="University">
            <Input prefix={<BankOutlined />} placeholder="Wuhan University" />
          </Form.Item>

          <Form.Item name="course" label="Course">
            <Input prefix={<BookOutlined />} placeholder="Computer Science" />
          </Form.Item>

          <Form.Item name="graduate_level" label="Graduate Level">
            <Select placeholder="Select level" allowClear>
              {GRADUATE_LEVELS.map((lvl) => (
                <Option key={lvl} value={lvl}>
                  {lvl}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="city" label="City">
            <Input
              prefix={<EnvironmentOutlined />}
              placeholder="Wuhan"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Members;