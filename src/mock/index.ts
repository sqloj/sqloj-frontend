// 引入mockjs
import Mock from 'mockjs';
// 引入模板函数类

// Mock函数
const { mock } = Mock;

let user = [
  {
    userid: 'admin',
    username: '老师',
    password: '123456',
    classes: '',
    admin: true
  },
  {
    userid: 'stu',
    username: '学生',
    password: '123456',
    classes: '101',
    admin: false
  },
  {
    userid: 'tourist',
    username: 't老师',
    password: '123456',
    classes: 'codeforce',
    admin: true
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

mock(`/api/student/manage/list`, 'post', {
  'user|5-20': [
    {
      'id|201800000000-202000000000': 100,
      name: '@cname',
      classes: '寄科221',
      'acnum|1-10': 10
    }
  ]
});

mock(`/api/student/delete`, 'post', {
  return: {
    success: true,
    message: '删除成功'
  }
});
