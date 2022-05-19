import { Md5 } from 'ts-md5';

/* 
    1 -> 学生
    2 -> 老师
*/
const STUDENT = 1;
const TEACHER = 2;

enum SQL {
  'MySql' = 1,
  'SQL Server' = 2
}

enum RESULT {
  'UNKNOWN',
  'ACCEPT',
  'WAITING',
  'WRONG ANSWER',
  'COMPLETE ERROR'
}

const encrypt = (str: string) => {
  let md5 = new Md5();
  md5.appendStr(str);
  return md5.end();
};

export { STUDENT, TEACHER, RESULT, SQL, encrypt };
