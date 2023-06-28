const oam = "/caas-oam";
const caas = "/caas-core";
const book = "/book";
const user = "/user";

// 登录
export const login = `${user}/login`;

// 获得书
export const getbooks = `${book}/getAll`;

// 修改手机号
export const updatePhone = `${user}/update`;

// 修改密码
export const updatePassword = `${user}/pwd`;

// 查看读者借阅记录
export const getBorrowRecords = `/borrow/user`;
