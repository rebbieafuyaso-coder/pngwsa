import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Table, Button, Modal, Form, Select, message, Tag, Space, Popconfirm,
  Typography, Avatar, Tooltip, Switch, Input, Divider, Empty, Skeleton, Drawer,
} from "antd";
import {
  PlusOutlined, DeleteOutlined, UserOutlined, CrownOutlined,
  EditOutlined, SettingOutlined, EyeOutlined, EyeInvisibleOutlined,
} from "@ant-design/icons";
import { supabase } from "../supabaseClient";

const { Title, Text } = Typography;
const { Option } = Select;

const Executives = () => {
  const [executives, setExecutives] = useState([]);
  const [members, setMembers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [assignOpen, setAssignOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const [rolesOpen, setRolesOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [addingRole, setAddingRole] = useState(false);

  /* =========================================================
     FETCH
  ========================================================= */

  const fetchAll = useCallback(async () => {
    setLoading(true);

    const [execRes, membersRes, rolesRes] = await Promise.all([
      supabase
        .from("executives")
        .select(`
          id, term, display_order, active, created_at,
          member:members(id, fullname, email, avatar_url, university, course),
          role:roles(id, name, display_order)
        `)
        .order("display_order", { ascending: true }),
      supabase
        .from("members")
        .select("id, fullname, email, avatar_url, university")
        .order("fullname"),
      supabase
        .from("roles")
        .select("*")
        .order("display_order", { ascending: true }),
    ]);

    if (execRes.error) console.error("executives:", execRes.error);
    if (membersRes.error) console.error("members:", membersRes.error);
    if (rolesRes.error) console.error("roles:", rolesRes.error);

    setExecutives(execRes.data ?? []);
    setMembers(membersRes.data ?? []);
    setRoles(rolesRes.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  /* =========================================================
     ASSIGN / EDIT EXECUTIVE
  ========================================================= */

  const openAssign = () => {
    setEditing(null);
    form.resetFields();
    setAssignOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      member_id: record.member?.id,
      role_id: record.role?.id,
      term: record.term,
      display_order: record.display_order,
    });
    setAssignOpen(true);
  };

  const closeAssign = () => {
    setAssignOpen(false);
    form.resetFields();
    setEditing(null);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        member_id: values.member_id,
        role_id: values.role_id,
        term: values.term?.trim() || null,
        display_order: Number(values.display_order) || 0,
      };

      if (editing) {
        const { error } = await supabase
          .from("executives")
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq("id", editing.id);
        if (error) throw error;
        message.success("Executive updated");
      } else {
        const { error } = await supabase.from("executives").insert(payload);
        if (error) throw error;
        message.success("Executive assigned");
      }

      closeAssign();
      fetchAll();
    } catch (err) {
      console.error(err);
      if (err.message?.includes("duplicate")) {
        message.error("This member already has this role");
      } else {
        message.error(err.message || "Save failed");
      }
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async (record) => {
    const { error } = await supabase
      .from("executives")
      .delete()
      .eq("id", record.id);
    if (error) message.error("Delete failed");
    else {
      message.success("Removed");
      fetchAll();
    }
  };

  /* =========================================================
     TOGGLE ACTIVE
  ========================================================= */

  const toggleActive = async (record) => {
    const { error } = await supabase
      .from("executives")
      .update({ active: !record.active })
      .eq("id", record.id);

    if (error) message.error("Update failed");
    else {
      message.success(record.active ? "Marked inactive" : "Marked active");
      fetchAll();
    }
  };

  /* =========================================================
     ROLES MANAGEMENT
  ========================================================= */

  const handleAddRole = async () => {
    if (!newRoleName.trim()) {
      message.warning("Enter a role name");
      return;
    }
    setAddingRole(true);
    try {
      const nextOrder =
        roles.length > 0
          ? Math.max(...roles.map((r) => r.display_order || 0)) + 1
          : 1;

      const { error } = await supabase
        .from("roles")
        .insert({ name: newRoleName.trim(), display_order: nextOrder });

      if (error) throw error;
      message.success("Role added");
      setNewRoleName("");
      fetchAll();
    } catch (err) {
      if (err.message?.includes("duplicate")) {
        message.error("That role already exists");
      } else {
        message.error(err.message || "Failed");
      }
    } finally {
      setAddingRole(false);
    }
  };

  const handleDeleteRole = async (role) => {
    const { error } = await supabase.from("roles").delete().eq("id", role.id);
    if (error) {
      message.error(
        "Cannot delete — this role is assigned to one or more executives"
      );
    } else {
      message.success("Role deleted");
      fetchAll();
    }
  };

  /* =========================================================
     MEMBER LOOKUP MAP
  ========================================================= */

  const memberMap = useMemo(() => {
    const m = {};
    members.forEach((mem) => {
      m[mem.id] = mem;
    });
    return m;
  }, [members]);

  /* =========================================================
     TABLE COLUMNS (desktop)
  ========================================================= */

  const columns = [
    {
      title: "",
      width: 60,
      render: (_, record) => (
        <Avatar
          src={record.member?.avatar_url}
          icon={!record.member?.avatar_url && <UserOutlined />}
        >
          {!record.member?.avatar_url && record.member?.fullname?.[0]}
        </Avatar>
      ),
    },
    {
      title: "Member",
      dataIndex: ["member", "fullname"],
      render: (_, record) => (
        <div>
          <div className="font-medium text-slate-800">
            {record.member?.fullname || "—"}
          </div>
          <div className="text-xs text-slate-400">{record.member?.email}</div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: ["role", "name"],
      width: 200,
      render: (_, record) => (
        <Tag color="orange" className="rounded-full!">
          {record.role?.name || "—"}
        </Tag>
      ),
    },
    {
      title: "Term",
      dataIndex: "term",
      width: 140,
      render: (t) => (
        <span className="text-sm text-slate-600">{t || "—"}</span>
      ),
    },
    {
      title: "Order",
      dataIndex: "display_order",
      width: 80,
      render: (n) => <span className="text-sm text-slate-500">{n ?? 0}</span>,
    },
    {
      title: "Status",
      dataIndex: "active",
      width: 150,
      render: (active, record) => (
        <Space>
          <Switch
            size="small"
            checked={active}
            onChange={() => toggleActive(record)}
          />
          <Tag
            color={active ? "green" : "default"}
            className="rounded-full!"
          >
            {active ? "Active" : "Inactive"}
          </Tag>
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 130,
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
          <Tooltip title={record.active ? "Deactivate" : "Activate"}>
            <Button
              type="text"
              icon={
                record.active ? <EyeInvisibleOutlined /> : <EyeOutlined />
              }
              onClick={() => toggleActive(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Remove this executive?"
            description="The member stays in the members table."
            okText="Remove"
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

  const ExecutiveCard = ({ record }) => (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
      {/* Top: avatar + member + status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar
            size={44}
            src={record.member?.avatar_url}
            icon={!record.member?.avatar_url && <UserOutlined />}
          >
            {!record.member?.avatar_url && record.member?.fullname?.[0]}
          </Avatar>
          <div className="min-w-0">
            <p className="font-semibold text-slate-800 truncate">
              {record.member?.fullname || "—"}
            </p>
            {record.member?.email && (
              <p className="text-xs text-slate-400 truncate">
                {record.member.email}
              </p>
            )}
          </div>
        </div>
        <Tag
          color={record.active ? "green" : "default"}
          className="rounded-full! shrink-0"
        >
          {record.active ? "Active" : "Inactive"}
        </Tag>
      </div>

      <Divider className="!my-3" />

      {/* Role + term */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Tag color="orange" className="rounded-full!">
          {record.role?.name || "—"}
        </Tag>
        {record.term && (
          <span className="text-xs text-slate-500">{record.term}</span>
        )}
        <span className="text-xs text-slate-400 ml-auto">
          Order: {record.display_order ?? 0}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <Switch
            size="small"
            checked={record.active}
            onChange={() => toggleActive(record)}
          />
          <span className="text-xs text-slate-500">
            {record.active ? "Active" : "Inactive"}
          </span>
        </div>
        <Space size={0}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
          />
          <Popconfirm
            title="Remove this executive?"
            description="The member stays in the members table."
            okText="Remove"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      </div>
    </div>
  );

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Title level={3} className="mb-1! text-xl sm:text-2xl md:text-3xl">
            Executives
          </Title>
          <Text type="secondary" className="text-xs sm:text-sm">
            Assign roles to members of the association.
          </Text>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            icon={<SettingOutlined />}
            onClick={() => setRolesOpen(true)}
            className="rounded-lg! w-full sm:w-auto"
          >
            Manage Roles
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openAssign}
            className="rounded-lg! border-none! bg-orange-500! hover:bg-orange-400! w-full sm:w-auto"
          >
            Assign Role
          </Button>
        </div>
      </div>

      {/* MOBILE: cards */}
      <div className="md:hidden">
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <Skeleton avatar active paragraph={{ rows: 2 }} />
              </div>
            ))}
          </div>
        ) : executives.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No executives yet — tap 'Assign Role' to get started"
          />
        ) : (
          <div className="space-y-3">
            {executives.map((record) => (
              <ExecutiveCard key={record.id} record={record} />
            ))}
          </div>
        )}
      </div>

      {/* DESKTOP: table */}
      <div className="hidden md:block">
        <Table
          rowKey="id"
          loading={loading}
          dataSource={executives}
          columns={columns}
          pagination={{ pageSize: 10, hideOnSinglePage: true }}
          scroll={{ x: 900 }}
          className="overflow-hidden! rounded-2xl! shadow-sm!"
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No executives yet — click 'Assign Role' to get started"
              />
            ),
          }}
        />
      </div>

      {/* =====================================================
          ASSIGN / EDIT MODAL
      ===================================================== */}

      <Modal
        open={assignOpen}
        onCancel={closeAssign}
        title={editing ? "Edit Executive" : "Assign Role"}
        width={540}
        okText={editing ? "Update" : "Assign"}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        destroyOnClose
        style={{ maxWidth: "calc(100vw - 32px)" }}
        styles={{ body: { paddingTop: 12 } }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          className="mt-2"
        >
          <Form.Item
            label="Member"
            name="member_id"
            rules={[{ required: true, message: "Please select a member" }]}
          >
            <Select
              showSearch
              placeholder="Search and select a member"
              optionFilterProp="label"
              options={members.map((m) => ({
                value: m.id,
                label: m.fullname,
                email: m.email,
              }))}
              optionRender={(option) => (
                <div className="flex items-center gap-2">
                  <Avatar
                    size={24}
                    src={memberMap[option.value]?.avatar_url}
                    icon={
                      !memberMap[option.value]?.avatar_url && <UserOutlined />
                    }
                  />
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm">{option.label}</span>
                    <span className="text-xs text-slate-400">
                      {option.data.email}
                    </span>
                  </div>
                </div>
              )}
            />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role_id"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select
              placeholder="Select a role"
              suffixIcon={<CrownOutlined className="text-slate-400" />}
            >
              {roles.map((r) => (
                <Option key={r.id} value={r.id}>
                  {r.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* grid-cols-1 on phones, 2 on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Form.Item label="Term (Optional)" name="term">
              <Input placeholder="e.g., 2025–2026" />
            </Form.Item>
            <Form.Item
              label="Display Order"
              name="display_order"
              extra="Lower numbers show first"
            >
              <Input type="number" placeholder="0" />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* =====================================================
          MANAGE ROLES MODAL
      ===================================================== */}

      <Modal
        open={rolesOpen}
        onCancel={() => setRolesOpen(false)}
        title="Manage Roles"
        footer={null}
        width={480}
        destroyOnClose
        style={{ maxWidth: "calc(100vw - 32px)" }}
      >
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="New role name"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            onPressEnter={handleAddRole}
            prefix={<CrownOutlined className="text-slate-400" />}
          />
          <Button
            type="primary"
            onClick={handleAddRole}
            loading={addingRole}
            className="border-none! bg-orange-500! hover:bg-orange-400! w-full sm:w-auto"
          >
            Add
          </Button>
        </div>

        <Divider className="my-4!" />

        <div className="max-h-80 overflow-y-auto pr-1">
          {roles.length === 0 ? (
            <Text type="secondary" className="text-sm!">
              No roles yet.
            </Text>
          ) : (
            <Space direction="vertical" className="w-full" size="small">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <CrownOutlined className="text-amber-500 shrink-0" />
                    <span className="text-sm font-medium text-slate-700 truncate">
                      {role.name}
                    </span>
                  </div>
                  <Popconfirm
                    title="Delete this role?"
                    description="Only possible if no one is assigned."
                    okText="Delete"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => handleDeleteRole(role)}
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
  );
};

export default Executives;