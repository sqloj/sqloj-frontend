// 引入mockjs
import Mock from 'mockjs';
import { encrypt } from '../setting/const';
import {
  userGen,
  questionGen,
  submitsGen,
  TestCaseGen,
  ServerGen
} from './array';
// 引入模板函数类

// Mock函数
const { mock } = Mock;
let user = userGen();
let question = questionGen();
let submits = submitsGen();
let TestCase = TestCaseGen();
let server = ServerGen();
// 设置延时
Mock.setup({
  timeout: 200
});

function parseQueryString(url: String, key: String) {
  let arr;
  url = url.split('#')[0];
  arr = url.split('?');
  arr.shift();
  let queryStr = arr.join('?');

  //获取参数
  arr = queryStr.split('&');
  for (let i = 0; i < arr.length; i++) {
    let itemArr = arr[i].split('=');
    let name = itemArr.shift();
    let value = itemArr.join('=');
    if (name === key) return value;
  }
}

// 使用拦截规则拦截命中的请求，mock(url, post/get, 返回的数据);
// 登录
mock(/\/api\/v1\/user\/login/, 'post', (option: any) => {
  let id = parseQueryString(option.url, 'id');
  let password = parseQueryString(option.url, 'password');
  console.log(id, password);
  for (let u of user) {
    if (u.id === id && u.password === password) {
      return {
        data: u,
        message: '请求成功',
        code: 0
      };
    }
  }
  return {
    message: '请求失败',
    code: 1
  };
});
// 学生注册
mock(`/api/v1/user/register`, 'post', (option: any) => {
  const userInfo = JSON.parse(option.body);
  for (let u of user) {
    if (u.id === userInfo.id) {
      return {
        message: '用户ID已存在',
        success: false
      };
    }
  }
  user.push(userInfo);

  return {
    message: '注册成功',
    success: true
  };
});
// 用户信息更新
mock(`/api/v1/user/update`, 'post', (option: any) => {
  const userInfo = JSON.parse(option.body);
  for (let u of user) {
    if (u.id === userInfo.id) {
      u.username = userInfo.username;
      u.password = userInfo.password;
      u.classes = userInfo.classes;
      return {
        ...u,
        message: '信息更新成功',
        success: true
      };
    }
  }
});
// 学生列表
mock(`/mapi/v1/user/list`, 'post', () => {
  return {
    data: user
  };
});
// 题目列表
mock(`/api/v1/question/list`, 'get', () => {
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
mock(`/api/v1/testcase/list`, 'get', () => {
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
  return {
    admin: ret
  };
});

mock(`/api/server/list`, 'post', () => {
  return {
    server: server
  };
});

// 删除学生
mock(`/api/v1/user/delete`, 'post', (option: any) => {
  const { id } = JSON.parse(option.body);
  let newUser = [];
  let flag = false;

  for (let u of user) {
    if (u.id !== id) {
      newUser.push(u);
    } else {
      flag = true;
    }
  }

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
mock(`/api/v1/question/update`, 'post', (option: any) => {
  const { id, content, answer, testcase_id } = JSON.parse(option.body);
  for (let t of question) {
    if (t.id === id) {
      t.content = content;
      t.answer = answer;
      t.testcase_id = testcase_id;
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
mock(`/api/v1/question/info/{id}`, 'post', (option: any) => {
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
// questionid 和 id 查找
mock(`/api/submit`, 'post', (option: any) => {
  const { questionid, id } = JSON.parse(option.body);
  let ret = [];
  if (questionid !== '') {
    let queid = Number(questionid);
    for (let t of submits) {
      if (t.questionId == queid) {
        if (id !== '') {
          if (t.id == id) ret.push(t);
        } else {
          ret.push(t);
        }
      }
    }
    return {
      submits: ret
    };
  } else if (id !== '') {
    for (let t of submits) {
      if (t.id == id) ret.push(t);
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
// 删除题目
mock(`/api/v1/question/delete`, 'post', (option: any) => {
  const { id } = JSON.parse(option.body);
  let newquestion = [];
  let flag = false;
  for (let i of question) {
    if (id == i.id) {
      flag = true;
    } else {
      newquestion.push(i);
    }
  }
  if (flag) {
    question = newquestion;
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

// 添加题目
mock(`/api/v1/question/insert`, 'post', (option: any) => {
  const que = JSON.parse(option.body);
  let id = question.length + 1;
  question.push({
    id: id,
    ...que
  });

  return {
    id: id,
    message: '添加成功',
    success: true
  };
});

// 删除测试集
mock(`/api/testcase/delete`, 'post', (option: any) => {
  const { id } = JSON.parse(option.body);
  let newTestCase = [];
  let flag = false;
  for (let i of TestCase) {
    if (id == i.id) {
      flag = true;
    } else {
      newTestCase.push(i);
    }
  }
  if (flag) {
    TestCase = newTestCase;
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
