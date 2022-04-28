// 引入mockjs
import Mock from 'mockjs';
// 引入模板函数类

// Mock函数
const { mock } = Mock;

const user = [
  {
    userid : 'admin',
    username : '老师',
    password : '123456',
    calss : '',
    admin : 1
  },
  {
    userid : 'stu',
    username : '学生',
    password : '123456',
    class : '',
    admin : 0
  }, 
  {
    userid : 'tec',
    username : 't老师',
    password : '123456',
    calss : '',
    admin : 1
  }
]


// 设置延时
Mock.setup({
  timeout: 200
});

// 使用拦截规则拦截命中的请求，mock(url, post/get, 返回的数据);

mock(/\/api\/user\/login/, 'post', (option: any) => {
  const { userid, password } = JSON.parse(option.body);
  for(let i = 0; i < user.length; i ++) {
    if(user[i].userid === userid && user[i].password === password) {
      return {
        ...user[i],
        message: '请求成功',
        success: true
      }
    }
  }
  return {
    message: '请求失败',
    success: false
  };
});

mock(/\/api\/student\/insert/, 'post', (option: any) => {
  const { userid, password } = JSON.parse(option.body);
  for(let i = 0; i < user.length; i ++) {
    if(user[i].userid === userid) {
      return {
        ...user[i],
        message: '用户ID已存在',
        success: false
      }
    }
  }
  return {
    message: '注册成功',
    success: true
  };
});

mock(/\api\/studentlist/, 'post', {
  'user|5-20': [ 
    {
      'id|201800000000-202000000000': 100,
      name: '@cname',
      classes: '寄科221',
      'acnum|1-10': 10
    }
  ]
})