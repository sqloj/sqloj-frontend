const enum USER {
  STUDENT = 1,
  TEACHER = 2,
  ADMIN = 3
}

enum RESULT {
  'UNKNOWN' = 0,
  'ACCEPT' = 1,
  'WAITING' = 2,
  'WRONG ANSWER' = 3,
  'COMPLETE ERROR' = 4,
  'SERVER ERROR' = 5
}

enum DATABASE {
  'MariaDB' = 1,
  'SQL Server' = 2,
  'MySQL' = 3,
  'H2 Database' = 4,
  'REDIS' = 5
}

export { USER, RESULT, DATABASE };

// 记录在 localStorage 中的数据
/*
user {
  id: '',
  password: ''
}
*/

/*
user {
  id: '',
  password: '',
  username: '',
  department: '',
  signature: '',
  role: ''
}
*/
