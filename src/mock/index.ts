// 引入mockjs
import Mock from 'mockjs';
// 引入模板函数类

// Mock函数
const { mock } = Mock;

let userGen = () => {
  let ret = mock({
    'user|5-20': [
      {
        'userid|201800000000-202000000000': 100,
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

let question = [
  {
    id: 1,
    content: '查询系编号为‘0501’学生的基本信息（学号、姓名、性别、出生日期）。',
    answer: "SELECT snum, sname, ssex, sbirth FROM s WHERE dnum = '0501'",
    testcase_id: 1
  },
  {
    id: 2,
    content: "查询学号为'201305010101'的学生的姓名。",
    answer: "SELECT sname FROM s WHERE snum = '201305010101'",
    testcase_id: 1
  }
];

// 设置延时
Mock.setup({
  timeout: 200
});

// 使用拦截规则拦截命中的请求，mock(url, post/get, 返回的数据);

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

mock(`/api/user/update/info`, 'post', (option: any) => {
  const userInfo = JSON.parse(option.body);
  for (let u of user) {
    if (u.userid === userInfo.userid) {
      u.username = userInfo.username;
      u.password = userInfo.password;
      console.log(u);
      return {
        ...u,
        message: '信息更新成功',
        success: true
      };
    }
  }
});

mock(`/api/student/manage/list`, 'post', () => {
  return {
    user: user
  };
});

mock(`/api/question/manage/list`, 'post', {
  'question|30-50': [
    {
      'id|3-100': 1,
      content: '@csentence(5, 30)',
      answer: '@sentence(5, 30)',
      'passnum|1-20': 1,
      'testcase_id|1-10': 1
    }
  ]
});

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
