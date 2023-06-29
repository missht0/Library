import { Layout, Dropdown, message, Input, Modal, Spin, Form, Table, Button, Divider, Select, InputNumber, Popconfirm } from "antd";
import { DownOutlined, UserOutlined, CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { clearCookie, getCookie } from "@/utils";
import { useNavigate } from "react-router-dom";
import { getbooks, updatePassword, updatePhone, getBorrowRecord, addBook, deleteBook, addUser, getUsers, deleteUser, borrowBook } from "@/services/user";
import BorrowRecord from "@/components/borrowRecord";

const { Header, Content, Footer } = Layout;
const { Search } = Input;
// 书籍类别
const booktypes = [
  "计算机",
  "文学",
  "哲学",
  "经济",
  "管理",
  "法律",
  "历史",
  "军事",
  "政治",
  "社会科学总论",
  "语言",
  "数理科学和化学",
  "天文学、地球科学",
  "生物科学",
  "医药、卫生",
  "农业科学",
  "工业技术",
  "交通运输",
  "航空、航天",
  "环境科学、劳动保护科学（安全科学）",
  "综合性图书",
];

export default function Manage() {
  const navigate = useNavigate();
  const [addform] = Form.useForm();
  const [userform] = Form.useForm();
  const [recordform] = Form.useForm();
  const [books, setBooks] = useState([]);
  const [showBooks, setShowBooks] = useState([]);
  const [typefilter, setTypefilter] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [recordOpen, setRecordOpen] = useState(false);
  const [borrowOpen, setBorrowOpen] = useState(false);
  const [queryId, setQueryId] = useState(undefined);
  const [bookID, setBookID] = useState(undefined);
  const [users, setUsers] = useState([]);
  const [debt, setDebt] = useState(0);

  useEffect(() => {
    getbooksFn();
  }, []);

  const getUsersFn = async () => {
    const res = await getUsers();
    setUsers(
      res.data.filter((item) => {
        return item.userType === "2" || item.userType === "3";
      })
    );
  };

  const getbooksFn = async () => {
    const res = await getbooks();
    let data = res.data;
    const all = [];
    Object.keys(data).forEach((key) => {
      all.push(...data[key]);
    });
    console.log("getbooksFn", all);
    setBooks(all);
    setShowBooks(all);
    setTypefilter(() => {
      let filter = [];
      Object.keys(data).forEach((key) => {
        filter.push({
          text: key,
          value: key,
        });
      });
      return filter;
    });
  };

  const checkdebt = async (id) => {
    const res = await getBorrowRecord({
      userId: id,
    });
    let debt = 0;
    res.data.forEach((item) => {
      if (item.status !== "return") {
        let d = dayjs().diff(dayjs(item.dueDate), "day") * 0.1;
        if (d > 0) {
          debt += d;
        }
      }
    });
    setDebt(debt);
    return debt;
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
      title: "书名",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "作者",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "出版社",
      dataIndex: "publisher",
      key: "publisher",
    },
    {
      title: "类别",
      dataIndex: "category",
      key: "category",
      filters: typefilter,
      onFilter: (value, record) => record.category.indexOf(value) === 0,
    },
    {
      title: "余量",
      dataIndex: "availableQuantity",
      key: "availableQuantity",
    },
    {
      title: () => {
        return <span className="pl-4">操作</span>;
      },
      key: "action",
      render: (text, record) => (
        <>
          <Popconfirm
            title="确认删除?"
            onConfirm={async () => {
              const res = await deleteBook({
                bookId: record.bookID,
              });
              if (res.code === 200) {
                message.success("删除成功");
                getbooksFn();
              } else {
                message.error("删除失败");
              }
            }}
            onCancel={() => {}}
            okText="确认"
            cancelText="取消"
          >
            <Button type="link">删除</Button>
          </Popconfirm>
          <Divider type="vertical" />
          <Button
            type="link"
            onClick={() => {
              setBorrowOpen(true);
              setBookID(record.bookID);
            }}
            disabled={record.availableQuantity === 0}
          >
            借阅
          </Button>
        </>
      ),
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
      <Content className="flex h-full">
        <div className="content w-[840px] mx-auto h-full flex flex-col py-8">
          <div className="flex flex-row justify-start mb-5">
            <Button
              type="primary"
              className="mr-4"
              onClick={() => {
                setAddOpen(true);
              }}
            >
              添加书籍
            </Button>
            <Button
              type="primary"
              className="mr-4"
              onClick={() => {
                setUserOpen(true);
              }}
            >
              添加读者
            </Button>
            <Button
              type="primary"
              className="mr-4"
              onClick={() => {
                setRecordOpen(true);
                getUsersFn();
              }}
            >
              借阅记录
            </Button>

            <Search
              placeholder="输入书名"
              allowClear
              onSearch={(value) => {
                setShowBooks(books.filter((item) => item.title.includes(value)));
              }}
              className="w-1/3 h-10"
            />
          </div>
          <Table dataSource={showBooks} columns={columns} />
        </div>
      </Content>
      <Modal
        title="新增图书"
        open={addOpen}
        onCancel={() => {
          setAddOpen(false);
        }}
        onOk={async () => {
          const values = await addform.validateFields();
          const res = await addBook(values);
          if (res.code === 200) {
            message.success("添加成功");
            setAddOpen(false);
            getbooksFn();
          } else {
            message.error("添加失败");
          }
        }}
        okText="确认"
        cancelText="取消"
      >
        <Form form={addform} labelCol={{ span: 4 }} labelAlign="left" className="my-4">
          <Form.Item label="书名" name="title" rules={[{ required: true, message: "请输入书名" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="作者" name="author" rules={[{ required: true, message: "请输入作者" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="出版社" name="publisher" rules={[{ required: true, message: "请输入出版社" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="类别" name="category" rules={[{ required: true, message: "请选择类别" }]}>
            <Select
              options={booktypes.map((item) => {
                return {
                  label: item,
                  value: item,
                };
              })}
            />
          </Form.Item>
          <Form.Item label="数量" name="quantity" rules={[{ required: true, message: "请输入数量" }]}>
            <InputNumber min={0} max={100} defaultValue={0} className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="新增读者"
        open={userOpen}
        onCancel={() => {
          setUserOpen(false);
        }}
        onOk={async () => {
          const values = await userform.validateFields();
          values.userType = values.userType === "学生" ? 3 : 2;
          values.passwordHash = "hznu123456";
          const res = await addUser(values);
          if (res.code === 200) {
            message.success("添加成功");
            setUserOpen(false);
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
          <Form.Item label="学号" name="id" rules={[{ required: true, message: "请输入学号" }]}>
            <Input />
          </Form.Item>

          <Form.Item label="手机号" name="phoneNumber" rules={[{ required: true, message: "请输入手机号" }]}>
            <Input />
          </Form.Item>

          <Form.Item label="读者类型" name="userType" rules={[{ required: true, message: "请选择读者类型" }]}>
            <Select
              options={["教师", "学生"].map((item) => {
                return {
                  label: item,
                  value: item,
                };
              })}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="借阅记录"
        open={recordOpen}
        onCancel={() => {
          setRecordOpen(false);
          setQueryId(undefined);
        }}
        footer={null}
      >
        <div className="w-full flex justify-between">
          <Search
            placeholder="输入学号"
            onSearch={async (value) => {
              setQueryId(value);
            }}
            style={{
              width: 200,
            }}
          />
          {queryId && (
            <div>
              <Button
                type="primary"
                onClick={() => {
                  setQueryId(undefined);
                }}
                className="mr-4"
              >
                返回
              </Button>
              <Popconfirm
                title="确认删除该用户？"
                onConfirm={async () => {
                  let res = await deleteUser({
                    userId: queryId,
                  });
                  if (res.code === 200) {
                    message.success("删除成功");
                    setQueryId(undefined);
                    getUsersFn();
                  } else {
                    message.error("删除失败");
                  }
                }}
                okText="确认"
                cancelText="取消"
              >
                <Button type="primary" danger>
                  删除用户
                </Button>
              </Popconfirm>
            </div>
          )}
        </div>
        {/* <Table dataSource={records} columns={recordColumns} /> */}
        {queryId ? (
          <BorrowRecord id={queryId} getbooksFn={getbooksFn} />
        ) : (
          <Table
            dataSource={users}
            columns={[
              {
                title: "姓名",
                dataIndex: "name",
                key: "name",
              },
              {
                title: "学号",
                dataIndex: "id",
                key: "id",
              },
              {
                title: "操作",
                dataIndex: "act",
                key: "act",
                render: (text, record) => (
                  <Button
                    type="primary"
                    onClick={() => {
                      setQueryId(record.id);
                    }}
                  >
                    查询
                  </Button>
                ),
              },
            ]}
          />
        )}
      </Modal>
      <Modal
        title="输入学号"
        open={borrowOpen}
        onCancel={() => {
          setBorrowOpen(false);
          setDebt(0);
        }}
        footer={null}
      >
        <Search
          placeholder="输入学号"
          enterButton={debt ? "还款并借阅" : "确定借阅"}
          size="large"
          onSearch={async (value) => {
            let d = await checkdebt(value);
            if (d > 0 && debt == 0) {
              message.error("请先还清欠款");
              return;
            } else if (debt == d) {
              const res = await borrowBook({
                userId: value,
                bookId: bookID,
              });
              if (res.code === 200) {
                message.success("借阅成功");
                setBorrowOpen(false);
                getbooksFn();
                if (debt > 0) {
                  message.success("还款成功");
                  setDebt(0);
                }
              } else {
                message.error("借阅失败");
              }
            }
          }}
        />
      </Modal>
    </>
  );
}
