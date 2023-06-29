import http from "./axiosInstance";
import * as USER from "./constants";
import cache from "@/utils/storage";

// 获取集群列表
export const getAllCluster = async (param) => {
  return await http.get(
    USER.getAllCluster,
    { param },
    {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    }
  );
  // 参数： dataCenter, currentUserCluster, includeDisable, includePlatformCluster, includeAllocatedResource
};
export const getOnlineCluster = async (param) => {
  return await http.get(
    USER.getOnlineCluster,
    { param },
    {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    }
  );
  // 参数： dataCenter, currentUserCluster, includeDisable, includePlatformCluster, includeAllocatedResource
};

// 获取命名空间
export const getNameSpace = async (clusterName) => {
  return await http.get(USER.getNameSpace, { clusterName });
};
// 获取部署
export const getDeploy = async (clusterName) => {
  return await http.get(USER.getDeploy, {
    clusterName,
  });
};
// 获取有状态部署
export const getStatefulSet = async (clusterName) => {
  return await http.get(USER.getStatefulSet, {
    clusterName,
  });
};
// 部署查pod
export const getDeployPod = async (clusterName, namespace, deployment) => {
  return await http.get(USER.getDeployPod, {
    clusterName,
    namespace,
    deployment,
  });
};
// 有状态部署查pod
export const getStatefulSetPod = async (clusterName, namespace, statefulSet) => {
  return await http.get(USER.getStatefulSetPod, {
    clusterName,
    namespace,
    statefulSet,
  });
};

// 分页查询平台层面，组织层面，项目层面的所有用户
export async function getUserData(params) {
  const result = await http.get(USER.users, params);
  return result;
}

//#region  ----日志

// 获取日志
export const getapplogs = async (appName, param) => {
  return await http.get(USER.getapplogs, { appName, ...param });
};
// 获取日志文件名
export const getapplogsfile = async (appName, param) => {
  return await http.get(USER.getapplogsfile, { appName, ...param });
};
// 导出日志
export const exportapplogs = async (appName, param) => {
  return await http.get(USER.exportapplogs, { appName, ...param });
};
// 查看上下文
export const getapplogscontext = async (appName, param) => {
  return await http.get(USER.getapplogscontext, { appName, ...param });
};

// 获取快照
export const getSnapshot = async (param) => {
  return await http.get(USER.snapshot, param);
};
// 创建快照
export const createSnapshot = async (param) => {
  return await http.post(USER.snapshot, param, {
    params: { ...param },
  });
};
// 删除快照
export const deleteSnapshot = async (param) => {
  return await http.delete(USER.snapshot, param);
};
// 查询快照规则
export const getBackuprules = async (param) => {
  return await http.get(USER.snapshotrules, param);
};
// 创建快照规则
export const createSnapshotrules = async (param) => {
  return await http.post(USER.snapshotrules, param, {
    params: { ...param },
  });
};
// 更新快照规则
export const updateSnapshotrules = async (param) => {
  return await http.put(USER.updateSnapshotrules, param, {
    params: { ...param },
  });
};
// 删除快照规则
export const deleteSnapshotrules = async (ruleId) => {
  return await http.delete(USER.updateSnapshotrules, { ruleId });
};
// 启动快照规则
export const startSnapshotrules = async (ruleId) => {
  return await http.put(USER.startSnapshotrules, { ruleId });
};
// 停止快照规则
export const stopSnapshotrules = async (ruleId) => {
  return await http.put(USER.stopSnapshotrules, { ruleId });
};
// 恢复备份
export const snapshotRestore = async (param) => {
  return await http.put(USER.snapshotRestore, param);
};

// 备份恢复日期删除
export const deleteSnapshotRestored = async (params) => {
  return await http.delete(USER.snapshotRestored, { ...params }, { params: { ...params } });
};

// 获取系统服务日志文件列表
export const getSystemLogFiles = async (deployName, param) => {
  return await http.get(USER.getSystemlogfiles, { deployName, ...param });
};
// 获取系统日志信息
export const getSystemLogInfo = async (deployName, param) => {
  return await http.get(USER.getSystemloginfo, { deployName, ...param });
};
// 导出系统日志
export const exportSystemLog = async (deployName, param) => {
  return await http.get(USER.exportSystemlog, { deployName, ...param });
};
// 获取系统日志上下文
export const getSystemLogContext = async (deployName, param) => {
  return await http.get(USER.getSystemlogcontext, { deployName, ...param });
};

// #endregion

// 登录
export const login = async (param) => {
  return await http.post(USER.login, param);
};
// 获取所有图书
export const getbooks = async (param) => {
  return await http.get(USER.getbooks, param);
};
// 修改密码
export const updatePassword = async (param) => {
  return await http.post(USER.updatePassword, param);
};
// 修改手机号
export const updatePhone = async (param) => {
  return await http.post(USER.updatePhone, param);
};
// 查看读者借阅记录
export const getBorrowRecord = async (param) => {
  return await http.get(USER.getBorrowRecords, param);
};
// 添加图书
export const addBook = async (param) => {
  return await http.post(USER.addBook, param);
};
// 删除图书
export const deleteBook = async (param) => {
  return await http.post(USER.deleteBook, param);
};
// 归还图书
export const returnBook = async (param) => {
  return await http.post(USER.returnBook, param);
};
// 借阅图书
export const borrowBook = async (param) => {
  return await http.post(USER.borrowBook, param);
};
// 添加用户
export const addUser = async (param) => {
  return await http.post(USER.addUser, param);
};
// 删除用户
export const deleteUser = async (param) => {
  return await http.post(USER.deleteUser, param);
};
// 获取用户列表
export const getUsers = async (param) => {
  return await http.get(USER.getAllUser, param);
};
// 获取单独用户
export const getUser = async (param) => {
  return await http.get(USER.getUser, param);
};
