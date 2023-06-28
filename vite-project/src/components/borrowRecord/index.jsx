import { Layout, Dropdown, message, Input, Modal, Spin, Form, Table } from "antd";
import { DownOutlined, UserOutlined, CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { clearCookie, getCookie } from "@/utils";
import { useNavigate } from "react-router-dom";
import { getbooks, updatePassword, updatePhone, getBorrowRecord } from "@/services/user";

export default function BorrowRecord() {
  const [info, setInfo] = useState([]);

  useEffect(() => {
    getBorrowRecordsFn();
  }, []);

  const getBorrowRecordsFn = async () => {
    const res = await getBorrowRecord({
      userId: getCookie("userInfo"),
    });
    setInfo(res.data);
    console.log("getBorrowRecordsFn", res);
  };

  const columns = [
    {
      title: "书名",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "借阅时间",
      dataIndex: "borrowDate",
      key: "borrowDate",
    },
    {
      title: "归还时间",
      dataIndex: "dueDate",
      key: "dueDate",
    },
    {
      title: "实际归还时间",
      dataIndex: "returnDate",
      key: "returnDate",
    },
    {
      title: "借阅状态",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        return <span>{text === "return" ? "已归还" : "未归还"}</span>;
      },
    },
  ];

  return <Table columns={columns} dataSource={info} />;
}
