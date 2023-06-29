import { Layout, Dropdown, message, Input, Modal, Spin, Form, Table, Button } from "antd";
import { DownOutlined, UserOutlined, CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { clearCookie, getCookie } from "@/utils";
import { useNavigate } from "react-router-dom";
import { getbooks, updatePassword, updatePhone, getBorrowRecord, returnBook } from "@/services/user";

export default function BorrowRecord(props) {
  const { id, getbooksFn } = props;
  const [info, setInfo] = useState([]);

  useEffect(() => {
    getBorrowRecordsFn();
  }, [id]);

  const getBorrowRecordsFn = async () => {
    const res = await getBorrowRecord({
      userId: id ?? getCookie("userInfo"),
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
      render: (text, record) => {
        if (!id) return <span>{text === "return" ? "已归还" : "未归还"}</span>;
        else
          return (
            <span>
              {text === "return" ? (
                <Button disabled>已归还</Button>
              ) : (
                <Button
                  onClick={() =>
                    returnBook({
                      userId: id,
                      bookId: record.bookID,
                    }).then((res) => {
                      if (res.code === 200) {
                        message.success("归还成功");
                        getBorrowRecordsFn();
                        getbooksFn();
                      } else {
                        message.error("归还失败");
                      }
                    })
                  }
                >
                  归还
                </Button>
              )}
            </span>
          );
      },
    },
  ];

  return <Table columns={columns} dataSource={info} />;
}
