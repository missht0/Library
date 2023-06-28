import { Navigate, Outlet } from "react-router";
import { Layout as ALayout, Dropdown, message, Input, Modal, Spin, Form, Table } from "antd";
import { DownOutlined, UserOutlined, CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { clearCookie, getCookie } from "@/utils";
import { useNavigate } from "react-router-dom";
import { getbooks, updatePassword, updatePhone, getBorrowRecord } from "@/services/user";
import BorrowRecord from "@/components/borrowRecord";

const { Header, Content, Footer } = ALayout;

export default function Layout() {
  return (
    <ALayout className="h-full flex">
      <Outlet />
      <Footer className="flex justify-center items-center h-16 py-2">
        <div className="text-gray-400">HZNU图书馆 ©2023 Created by HZNU</div>
      </Footer>
    </ALayout>
  );
}
