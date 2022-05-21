import { Md5 } from 'ts-md5';

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

const encrypt = (str: string) => {
  let md5 = new Md5();
  md5.appendStr(str);
  return md5.end();
};

export { USER, RESULT, encrypt };
