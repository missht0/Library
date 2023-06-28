import { Input, Button, Form, message } from "antd";
import { login } from "@/services/user";
import { setCookie } from "@/utils/index";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const handlesubmit = async () => {
    form.validateFields();
    const params = form.getFieldsValue();
    params.id = params.id.trim();
    const res = await login(params);
    console.log("login", res);
    if (res.code === 200) {
      setCookie("userInfo", res.data.id, 3600);
      setCookie("userType", res.data.userType, 3600);
      navigate("/");
    } else {
      message.error(res.message);
    }
    // setCookie("userInfo", "lstsb", 3600);
    // navigate("/");
  };

  return (
    <Form form={form} name="loginform" className="h-full">
      <div className="flex flex-row min-h-full flex-1  justify-center  ">
        <div className="flex flex-col justify-center min-h-full w-1/3 bg-slate-50 px-6 py-12 lg:px-8 ">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">HZNU图书管理系统</h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    学号
                  </label>
                </div>
                <div className="mt-2">
                  <Form.Item
                    name="id"
                    rules={[
                      {
                        required: true,
                        message: "请输入学号",
                      },
                    ]}
                  >
                    <Input className=" w-full rounded-md  py-1.5 " />
                  </Form.Item>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    密码
                  </label>
                </div>
                <div className="mt-2">
                  <Form.Item
                    name="pwd"
                    rules={[
                      {
                        required: true,
                        message: "请输入密码",
                      },
                    ]}
                  >
                    <Input.Password className=" w-full rounded-md  py-1.5 " />
                  </Form.Item>
                </div>
              </div>

              <div>
                <Button
                  type="primary"
                  size="large"
                  className="w-full"
                  style={{
                    fontSize: "18px",
                    lineHeight: "20px",
                  }}
                  onClick={handlesubmit}
                >
                  登录
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex min-h-full w-2/3  "
          style={{
            backgroundImage: `url(/back.jpg)`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        ></div>
      </div>
    </Form>
  );
}
