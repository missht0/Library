import { Layout, Dropdown, message, Input, Modal, Spin, Form, Table } from "antd";
import { DownOutlined, UserOutlined, CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { clearCookie, getCookie } from "@/utils";
import { useNavigate } from "react-router-dom";
import { getbooks, updatePassword, updatePhone, getBorrowRecord, getUser } from "@/services/user";
import BorrowRecord from "@/components/borrowRecord";

const { Header, Content, Footer } = Layout;
const { Search } = Input;

const typemap = {
  0: "系统管理员",
  1: "图书管理员",
  2: "教师",
  3: "学生",
};

export default function Index() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [active, setActive] = useState("全部");
  const [books, setBooks] = useState({});
  const [showBooks, setShowBooks] = useState({});
  const [visible, setVisible] = useState(false);
  const [infoVisible, setinfoVisible] = useState(false);
  const [loading, setLoading] = useState({
    0: false,
    1: false,
  });

  useEffect(() => {
    getbooksFn();
  }, []);

  const getbooksFn = async () => {
    const res = await getbooks();
    let data = res.data;
    const all = [];
    Object.keys(data).forEach((key) => {
      all.push(...data[key]);
    });
    data = { 全部: all, ...data };
    setBooks(data);
    setShowBooks(data);
  };

  const getUserFn = async () => {
    const res = await getUser({
      id: getCookie("userInfo"),
    });
    console.log(res.data);
    form.setFieldsValue({
      phoneNumber: res.data.phoneNumber,
      name: res.data.name,
      id: res.data.id,
    });
  };

  const changephoneFn = () => {
    setLoading({ ...loading, 0: true });
    let phoneNumber = form.getFieldValue("phoneNumber");
    let params = {
      phoneNumber: phoneNumber,
      id: getCookie("userInfo"),
    };
    updatePhone(params).then((res) => {
      if (res.code == 200) {
        message.success("修改成功");
      } else {
        message.error("修改失败");
      }
      setLoading({ ...loading, 0: false });
    });
  };

  const changepwdFn = () => {
    let params = form.getFieldValue();
    if (!params.old_pwd || !params.new_pwd) {
      message.error("密码不能为空");
      return;
    }
    if (params.old_pwd == params.new_pwd) {
      message.error("新密码不能与原密码相同");
      return;
    }
    setLoading({ ...loading, 1: true });
    params.id = getCookie("userInfo");
    updatePassword(params).then((res) => {
      if (res.code == 200) {
        message.success("修改成功");
      } else {
        message.error("修改失败");
      }
      setLoading({ ...loading, 1: false });
    });
  };

  const handleMenuClick = (e) => {
    switch (e.key) {
      case "1":
        getUserFn();
        setVisible(true);
        break;
      case "2":
        setinfoVisible(true);
        break;
      case "3":
        // 退出登录
        message.info("退出登录");
        clearCookie("userInfo");
        navigate("/login");
        break;
      default:
        break;
    }

    console.log("click", e);
  };

  const items = () => {
    if (getCookie("userType") === "0" || getCookie("userType") === "1") {
      return [
        {
          key: "1",
          label: "查看和修改个人信息",
        },
        {
          key: "3",
          label: "退出登录",
        },
      ];
    } else {
      return [
        {
          label: "查看和修改个人信息",
          key: "1",
        },
        {
          label: "查看借阅记录",
          key: "2",
        },
        {
          label: "退出登录",
          key: "3",
        },
      ];
    }
  };

  const menuProps = {
    items: items(),
    onClick: handleMenuClick,
  };

  const onSearch = (value) => {
    value = value.trim();
    const data = {};
    Object.keys(books).forEach((key) => {
      data[key] = books[key].filter((item) => item?.title.indexOf(value) > -1);
    });
    setShowBooks(data);
  };

  return (
    <>
      <Header className="flex justify-between items-center px-4 bg-white shadow-md h-16">
        <div className="flex justify-between items-center px-4  h-16 w-[900px] mx-auto">
          <div className="logo w-auto h-full text-blue-400 font-bold text-2xl flex justify-center items-center">HZNU图书馆</div>
          <Search size="large" placeholder="输入书名" allowClear onSearch={onSearch} className="w-1/3 h-10" />
          <div className="h-full flex justify-end items-center">
            <Dropdown.Button
              menu={menuProps}
              placement="bottom"
              icon={<UserOutlined />}
              onClick={() => {
                switch (getCookie("userType")) {
                  case "0":
                    navigate("/admin");
                    break;
                  case "1":
                    navigate("/manage");
                    break;
                  case "2":
                    break;
                  case "3":
                    break;
                  default:
                    break;
                }
              }}
            >
              {typemap[getCookie("userType")]}
            </Dropdown.Button>
          </div>
        </div>
      </Header>
      <Content className="flex h-full">
        <div className="content w-[840px] mx-auto h-full flex flex-col">
          <div className="min-h-[100px] py-8 flex flex-row flex-wrap ">
            {Object.keys(showBooks).map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    setActive(item);
                  }}
                  className={`${active == item ? "bg-blue-200" : "bg-neutral-100"} min-w-fit mx-4 h-5 px-4 py-4 flex  justify-center items-center  shadow-md rounded-md cursor-pointer hover:bg-blue-200`}
                >
                  {item}
                </div>
              );
            })}
          </div>

          <div className="h-auto overflow-auto">
            {showBooks[active]?.map((item, index) => {
              return (
                <div className="bg-white shadow-md rounded-md mb-4" key={index}>
                  <div className="flex justify-between items-center pl-4 pr-8 py-4">
                    <div className="text-xl font-bold h-40 w-32 bg-slate-300 rounded-md px-3 py-3 flex justify-center">
                      <span>{item.title}</span>
                    </div>
                    <div className="flex flex-col gap-2 text-base font-normal w-60">
                      <div>作者：{item.author}</div>
                      <div>出版社：{item.publisher}</div>
                      <div>分类：{item.category}</div>
                    </div>
                    <div className="text-gray-400 text-lg ">{`余量： ${item.availableQuantity}  本`}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* 修改手机号和密码 */}
        <Modal
          title="查询和修改个人信息"
          open={visible}
          onCancel={() => {
            setVisible(false);
          }}
          footer={null}
        >
          <Form form={form} layout="vertical" name="form_in_modal" preserve={false}>
            <div className="flex flex-col">
              {/* 名字 */}
              <div className="flex flex-row items-center my-2">
                <div className="w-32">姓名：</div>
                <Form.Item name="name" className="mb-0">
                  <Input disabled className="w-64" />
                </Form.Item>
              </div>
              {/* 学号 */}
              <div className="flex flex-row items-center my-2">
                <div className="w-32">学号：</div>
                <Form.Item name="id" className="mb-0">
                  <Input disabled className="w-64" />
                </Form.Item>
              </div>

              {/* 手机号 */}
              <div className="flex flex-row items-center my-2">
                <div className="w-32">手机号：</div>
                <Form.Item name="phoneNumber" className="mb-0">
                  <Input className="w-64" />
                </Form.Item>
                <div onClick={changephoneFn} className="ml-5 w-8 h-8 rounded-full flex justify-center items-center  hover:bg-gray-200 cursor-pointer">
                  {loading[0] ? <LoadingOutlined className="text-lg flex justify-center items-center" /> : <CheckCircleOutlined className="text-lg flex justify-center items-center" />}
                </div>
              </div>
              {/* 密码 */}
              <div className="flex flex-row items-center mt-5 mb-2">
                <div className="w-32">原密码：</div>
                <Form.Item name="old_pwd" className="mb-0">
                  <Input.Password className="w-64" />
                </Form.Item>
              </div>
              <div className="flex flex-row items-center my-2">
                <div className="w-32">新密码：</div>
                <Form.Item name="new_pwd" className="mb-0">
                  <Input.Password className="w-64" />
                </Form.Item>
                <div onClick={changepwdFn} className="ml-5 w-8 h-8 rounded-full flex justify-center items-center  hover:bg-gray-200 cursor-pointer">
                  {loading[1] ? <LoadingOutlined className="text-lg flex justify-center items-center" /> : <CheckCircleOutlined className="text-lg flex justify-center items-center" />}
                </div>
              </div>
            </div>
          </Form>
        </Modal>
        {/* 借阅记录 */}
        <Modal
          title="借阅记录"
          open={infoVisible}
          onCancel={() => {
            setinfoVisible(false);
          }}
          footer={null}
          width={800}
        >
          <BorrowRecord />
        </Modal>
      </Content>
    </>
  );
}
