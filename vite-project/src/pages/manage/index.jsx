import { Layout, Dropdown, message, Input, Modal, Spin, Form, Table } from "antd";
import { DownOutlined, UserOutlined, CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { clearCookie, getCookie } from "@/utils";
import { useNavigate } from "react-router-dom";
import { getbooks, updatePassword, updatePhone, getBorrowRecord } from "@/services/user";
import BorrowRecord from "@/components/borrowRecord";

const { Header, Content, Footer } = Layout;
const { Search } = Input;
export default function Manage() {
  const navigate = useNavigate();
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

    console.log("click", e);
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
        <div className="content w-[840px] mx-auto h-full flex flex-col"></div>
      </Content>
    </>
  );
}
