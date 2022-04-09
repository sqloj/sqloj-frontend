import Mock from 'mockjs'
const user = Mock.mock({
  'account': [{
    username: "admin",
    passward: "123456",
  }]
})

function data(option: any) {
  console.log("in data")
  console.log(option.body);
  const { username, password } = JSON.parse(option.body);
  console.log(username);
  console.log(password);
  if (username === 'admin' && password === "123456") {
    return {
      data: user.account,
      message: '请求成功',
      success: true
    }
  } else {
    return {
      data: user.account,
      message: '用户名或密码错误',
      success: false
    }
  }
}

export default { data }