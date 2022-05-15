import Mock from 'mockjs';

const { mock } = Mock;

let userGen = () => {
  let ret = mock({
    'user|10-20': [
      {
        'userid|+10000': 201800000101,
        username: '@cname',
        classes: '寄科221',
        'acnum|1-10': 10
      }
    ]
  }).user;

  ret.push(
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
  );
  return ret;
};

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
      id: 1,
      content:
        '查询系编号为‘0501’学生的基本信息（学号、姓名、性别、出生日期）。',
      answer: "SELECT snum, sname, ssex, sbirth FROM s WHERE dnum = '0501'",
      passnum: 100,
      testcase_id: 1
    },
    {
      id: 2,
      content: "查询学号为'201305010101'的学生的姓名。",
      answer: "SELECT sname FROM s WHERE snum = '201305010101'",
      passnum: 100,
      testcase_id: 2
    }
  );
  return ret;
};

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

let TestCaseGen = () => [
  {
    id: 1,
    describe: '全校学生表',
    sql: 'Mysql'
  },
  {
    id: 2,
    describe: '计算机专业表',
    sql: 'sqlServer'
  },
  {
    id: 3,
    describe: '数据库班级信息表',
    sql: 'mysql'
  }
];

export { userGen, questionGen, submitsGen, TestCaseGen };
