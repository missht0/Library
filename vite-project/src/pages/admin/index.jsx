import { Layout, Dropdown, message, Input, Modal, Spin, Form, Table, Button, Popconfirm } from "antd";
import { DownOutlined, UserOutlined, CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { clearCookie, getCookie } from "@/utils";
import { useNavigate } from "react-router-dom";
import { getbooks, updatePassword, updatePhone, getBorrowRecord, getUsers, addUser, deleteUser } from "@/services/user";
import BorrowRecord from "@/components/borrowRecord";

const { Header, Content, Footer } = Layout;
const { Search } = Input;

export default function Admin() {
  const navigate = useNavigate();
  const [userform] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [userOpen, setUserOpen] = useState(false);

  useEffect(() => {
    getUsersFn();
  }, []);

  const getUsersFn = async () => {
    const res = await getUsers();
    setUsers(
      res.data.filter((item) => {
        return item.userType === "1";
      })
    );
  };

  const handleMenuClick = (e) => {
    switch (e.key) {
      case "3":
        // 退出登录
        message.info("退出登录");
        clearCookie("userInfo");
        navigate("/login");
        break;
      default:
        break;
    }
  };
  const items = [
    {
      label: "退出登录",
      key: "3",
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const columns = [
    {
      title: "用户名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "手机号",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "操作",
      dataIndex: "userId",
      key: "userId",
      render: (text, record) => {
        return (
          <Popconfirm
            title="确认删除该图书管理员吗？"
            onConfirm={async () => {
              console.log("record", record);
              let res = await deleteUser({
                userId: record.id,
              });
              if (res.code === 200) {
                message.success("删除成功");
                getUsersFn();
              } else {
                message.error("删除失败");
              }
            }}
            okText="确认"
            cancelText="取消"
          >
            <Button type="primary" danger>
              删除
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <>
      <Header className="flex justify-between items-center px-4 bg-white shadow-md h-16">
        <div className="flex justify-between items-center px-4  h-16 w-[900px] mx-auto">
          <div className="logo w-auto h-full text-blue-400 font-bold text-2xl flex justify-center items-center">HZNU图书馆</div>
          <div className="h-full flex justify-end items-center">
            <Dropdown.Button
              onClick={() => {
                navigate(-1);
              }}
              menu={menuProps}
              placement="bottom"
              icon={<UserOutlined />}
            >
              返回
            </Dropdown.Button>
          </div>
        </div>
      </Header>
      <Content className="flex h-full ">
        <div className="content w-[840px] mx-auto h-full flex flex-col py-8">
          <div className="flex flex-row justify-start mb-5">
            <Button
              type="primary"
              className="mr-4"
              onClick={() => {
                setUserOpen(true);
              }}
            >
              添加图书管理员
            </Button>
          </div>
          <div className="content w-[840px] mx-auto h-full flex flex-col">
            <Table dataSource={users} columns={columns} />
          </div>
        </div>
      </Content>
      <Modal
        title="新增读者"
        open={userOpen}
        onCancel={() => {
          setUserOpen(false);
        }}
        onOk={async () => {
          const values = await userform.validateFields();
          values.userType = "1";
          values.passwordHash = "hznu123456";
          const res = await addUser(values);
          if (res.code === 200) {
            message.success("添加成功");
            setUserOpen(false);
            getUsersFn();
          } else {
            message.error("添加失败");
          }
        }}
        okText="确认"
        cancelText="取消"
      >
        <Form form={userform} labelCol={{ span: 4 }} labelAlign="left" className="my-4">
          <Form.Item label="姓名" name="name" rules={[{ required: true, message: "请输入姓名" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="ID" name="id" rules={[{ required: true, message: "请输入学号" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="手机号" name="phoneNumber" rules={[{ required: true, message: "请输入手机号" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
