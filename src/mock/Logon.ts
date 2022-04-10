import Mock from 'mockjs';

const user = Mock.mock({
  account: [
    {
      username: 'admin',
      passward: '123456'
    }
  ]
});

function data() {
  // res是一个请求对象，包含: url, type, body
  return {
    code: 200,
    data: user.account,
    message: '请求成功',
    success: true
  };
}

export default { data };
