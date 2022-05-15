// 引入mockjs
import Mock from 'mockjs';
import { userGen, questionGen, submitsGen, TestCaseGen } from './array';
// 引入模板函数类

// Mock函数
const { mock } = Mock;
let user = userGen();
let question = questionGen();
let submits = submitsGen();
let TestCase = TestCaseGen();
// 设置延时
Mock.setup({
  timeout: 200
});

// 使用拦截规则拦截命中的请求，mock(url, post/get, 返回的数据);
// 登录
mock(`/api/user/login`, 'post', (option: any) => {
  const { userid, password } = JSON.parse(option.body);
  for (let u of user) {
    if (u.userid === userid && u.password === password) {
      return {
        ...u,
        message: '请求成功',
        success: true
      };
    }
  }
  return {
    message: '请求失败',
    success: false
  };
});
// 学生注册
mock(`/api/student/insert`, 'post', (option: any) => {
  const userInfo = JSON.parse(option.body);
  for (let u of user) {
    if (u.userid === userInfo.userid) {
      return {
        message: '用户ID已存在',
        success: false
      };
    }
  }
  user.push(userInfo);
  console.log(user);

  return {
    message: '注册成功',
    success: true
  };
});
// 用户信息更新
mock(`/api/user/update/info`, 'post', (option: any) => {
  const userInfo = JSON.parse(option.body);
  for (let u of user) {
    if (u.userid === userInfo.userid) {
      u.username = userInfo.username;
      u.password = userInfo.password;
      u.classes = userInfo.classes;
      console.log(u);
      return {
        ...u,
        message: '信息更新成功',
        success: true
      };
    }
  }
});
// 学生列表
mock(`/api/student/manage/list`, 'post', () => {
  return {
    user: user
  };
});
// 题目列表
mock(`/api/question/manage/list`, 'post', () => {
  return {
    question: question
  };
});
// 提交列表
mock(`/api/submission/list`, 'post', () => {
  return {
    submits: submits
  };
});
// 依赖数据库表
mock(`/api/testcase/list`, 'post', () => {
  return {
    testcase: TestCase
  };
});
// 管理员表
mock(`/api/admin/manage/list`, 'post', () => {
  let ret = [];
  for (let i of user) {
    if (i.admin) ret.push(i);
  }
  console.log(ret);
  return {
    admin: ret
  };
});

// 删除学生
mock(`/api/student/delete`, 'post', (option: any) => {
  const { userid } = JSON.parse(option.body);
  let newUser = [];
  let flag = false;
  console.log(userid);

  for (let u of user) {
    if (u.userid !== userid) {
      newUser.push(u);
    } else {
      flag = true;
    }
  }
  console.log(newUser);

  user = newUser;
  if (flag) {
    return {
      success: true,
      message: '删除成功'
    };
  } else {
    return {
      success: false,
      message: '删除失败'
    };
  }
});

// 更新题目
mock(`/api/question/update`, 'post', (option: any) => {
  const que = JSON.parse(option.body);
  for (let t of question) {
    if (t.id === que.id) {
      t.content = que.content;
      t.answer = que.answer;
      t.testcase_id = que.testcase_id;
      return {
        ...t,
        message: '信息更新成功',
        success: true
      };
    }
  }
  return {
    message: '出错！',
    success: false
  };
});
// 通过题目id查找题目 （不需要passnum）
mock(`/api/question/find/{id}`, 'post', (option: any) => {
  const { id } = JSON.parse(option.body);
  for (let t of question) {
    if (t.id === id) {
      return {
        question: t,
        success: true,
        messags: ''
      };
    }
  }
  return {
    success: false,
    message: '未找到题目'
  };
});
// questionid 和 userid 查找
mock(`/api/submit`, 'post', (option: any) => {
  const { questionid, userid } = JSON.parse(option.body);
  let ret = [];
  if (questionid !== '') {
    let queid = Number(questionid);
    for (let t of submits) {
      if (t.questionId == queid) {
        if (userid !== '') {
          if (t.userid == userid) ret.push(t);
        } else {
          ret.push(t);
        }
      }
    }
    return {
      submits: ret
    };
  } else if (userid !== '') {
    for (let t of submits) {
      console.log(t.userid, userid);
      if (t.userid == userid) ret.push(t);
    }
    return {
      submits: ret
    };
  } else {
    return {
      submits: submits
    };
  }
});
