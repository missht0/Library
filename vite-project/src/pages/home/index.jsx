import { Layout, Dropdown, message, Input } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getbooks } from "@/services/user";
import { clearCookie } from "@/utils";
import { useNavigate } from "react-router-dom";

const { Header, Content, Footer } = Layout;
const { Search } = Input;

// const mockData = {
//   音乐: ["音乐1", "音乐2", "音乐3"],
//   电影: ["电影1", "电影2", "电影3"],
//   体育: ["书籍1", "书籍2", "书籍3"],
//   历史: ["历史1", "历史2", "历史3"],
// };

export default function Index() {
  const navigate = useNavigate();
  const [active, setActive] = useState("全部");
  const [books, setBooks] = useState([]);

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
  };

  const handleMenuClick = (e) => {
    switch (e.key) {
      case "1":
        break;
      case "2":
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
  const items = [
    {
      label: "修改个人信息",
      key: "1",
      icon: <UserOutlined />,
    },
    {
      label: "退出登录",
      key: "2",
      icon: <UserOutlined />,
    },
  ];
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  const onSearch = (value) => {
    value = value.trim();
  };

  return (
    <Layout className="h-full">
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
                console.log("click");
              }}
            >
              读者 | 管理员
            </Dropdown.Button>
          </div>
        </div>
      </Header>
      <Content className="flex h-full">
        <div className="content w-[840px] mx-auto">
          <div className="h-48 py-8 flex flex-row flex-wrap ">
            {/* <div
              onClick={() => {
                setActive("all");
              }}
              className={`${active == "all" ? "bg-blue-200" : "bg-neutral-100"} min-w-fit mx-4 h-5 px-4 py-4 flex  justify-center items-center  shadow-md rounded-md cursor-pointer hover:bg-blue-200`}
            >
              全部
            </div> */}
            {Object.keys(books).map((item) => {
              return (
                <div
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

          <div>
            {books[active]?.map((item) => {
              return (
                <div className="bg-white shadow-md rounded-md mb-4">
                  <div className="flex justify-between items-center px-4 py-4">
                    <div className="text-xl font-bold h-40">{item.title}</div>
                    <div className="text-gray-400">{item.availableQuantity}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Content>
      <Footer className="flex justify-center items-center h-16 py-2">
        <div className="text-gray-400">HZNU图书馆 ©2023 Created by HZNU</div>
      </Footer>
    </Layout>
  );
}
