// 引入mockjs
import Mock from 'mockjs';
// 引入模板函数类

// Mock函数
const { mock } = Mock;

let userGen = () => {
  let ret = mock({
    'user|5-20': [
      {
        'userid|+10000': 201800000101,
        username: '@cname',
        classes: '寄科221',
        'acnum|1-10': 10
      }
    ]
  }).user;

  ret.push({
    userid: 'admin',
    username: '老师',
    password: '123456',
    classes: '',
    admin: true
  });
  ret.push({
    userid: 'stu',
    username: '学生',
    password: '123456',
    classes: '101',
    admin: false
  });
  ret.push({
    userid: 'tourist',
    username: 't老师',
    password: '123456',
    classes: 'codeforce',
    admin: true
  });
  return ret;
};

let user = userGen();

let questionGen = () => {
  let ret = mock({
    'question|5-20': [
      {
        'id|+1': 3,
        content: '@csentence(5, 30)',
        answer: '@sentence(5, 30)',
        'passnum|1-20': 1,
        'testcase_id|1-2': 1
      }
    ]
  }).question;
  ret.push(
    {
      id: '1',
      content:
        '查询系编号为‘0501’学生的基本信息（学号、姓名、性别、出生日期）。',
      answer: "SELECT snum, sname, ssex, sbirth FROM s WHERE dnum = '0501'",
      passnum: 100,
      testcase_id: 1
    },
    {
      id: '2',
      content: "查询学号为'201305010101'的学生的姓名。",
      answer: "SELECT sname FROM s WHERE snum = '201305010101'",
      passnum: 100,
      testcase_id: 2
    }
  );
  return ret;
};

let question = questionGen();

let TestCase = [
  {
    id: 1,
    describe: '全校学生表',
    sql: 'Mysql'
  },
  {
    id: 2,
    describe: '计算机专业表',
    sql: 'sqlServer'
  }
];

let submitsGen = () => {
  let ret = mock({
    'submits|5-20': [
      {
        'id|+1': 3,
        userid: '@cname',
        'questionId|1-20': 1,
        content: '@sentence(5, 30)',
        result:
          '@pick(["accept", "wrong answer", "TLE", "MLE", "complete wrong"])',
        time: '@datetime'
      }
    ]
  }).submits;
  ret.push(
    {
      id: 1,
      userid: 'admin',
      questionId: 1,
      content: 'answer',
      result: 'accept',
      time: '2021-9-10'
    },
    {
      id: 2,
      userid: 'stu',
      questionId: 1,
      content: 'answer',
      result: 'wrong answer',
      time: '2022-1-1'
    }
  );
  return ret;
};

let submits = submitsGen();

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
