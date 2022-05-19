import { Md5 } from 'ts-md5';

const enum USER {
  STUDENT = 1,
  TEACHER = 2,
  ADMIN = 3
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

export { USER, RESULT, encrypt };
