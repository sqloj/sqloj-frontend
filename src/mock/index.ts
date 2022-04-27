// 引入mockjs
import Mock from 'mockjs';
// 引入模板函数类

// Mock函数
const { mock } = Mock;

// 设置延时
Mock.setup({
  timeout: 200
});

// 使用拦截规则拦截命中的请求，mock(url, post/get, 返回的数据);
// mock(/\/api\/login/, 'post', data)
mock(/\/api\/user\/login/, 'post', (option: any) => {
  const { userid, password } = JSON.parse(option.body);
  if (userid === 'admin' && password === '123456') {
    return {
      message: '请求成功',
      success: true,
      username: '老师',
      admin: 1
    };
  } else if (userid === 'stu' && password === '123456') {
    return {
      message: '请求成功',
      success: true,
      username: '学生',
      admin: 0
    };
  }
  return {
    message: '请求失败',
    success: false
  };
});

mock(/\/api\/logon/, 'post', () => ({
  success: true,
  message: '注册成功！'
}));

mock(/\/api\/studentlist/, 'post', {
  'user|5-20': [
    {
      'id|201800000000-202000000000': 100,
      name: '@cname',
      classes: '寄科221',
      'acnum|1-10': 10
    }
  ]
});
