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
// 添加图书
export const addBook = `${book}/add`;
// 删除图书
export const deleteBook = `${book}/delete`;
// 归还图书
export const returnBook = `${book}/return`;
// 借阅图书
export const borrowBook = `${book}/borrow`;
// 添加用户
export const addUser = `${user}/add`;
// 删除用户
export const deleteUser = `${user}/delete`;
// 获取所有用户
export const getAllUser = `${user}/all`;
// 获取单独用户
export const getUser = `${user}/one`;
