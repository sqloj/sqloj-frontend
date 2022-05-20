import { Md5 } from 'ts-md5';

const enum USER {
  STUDENT = 1,
  TEACHER = 2,
  ADMIN = 3
}

enum RESULT {
  'UNKNOWN' = 1,
  'ACCEPT' = 2,
  'WAITING' = 3,
  'WRONG ANSWER' = 4,
  'COMPLETE ERROR' = 5
}

const encrypt = (str: string) => {
  let md5 = new Md5();
  md5.appendStr(str);
  return md5.end();
};

export { USER, RESULT, encrypt };
