import Mock from 'mockjs';

const { mock } = Mock;
const Random = Mock.Random;

function autoIncrement(i: Number) {
  return i;
}
function cname() {
  return Random.cname();
}

function integer() {}

const constructor = (body: any) => {
  const tablename = body.tablename;
  const num = body.num;
  const need = body.need;
  console.log(tablename, num, need);
  let funList: Array<Function> = [];
  let res = 'INSERT INTO `' + tablename + '` (';
  const len = need.length;
  for (let i = 0; i < len; i++) {
    console.log(need[i]);
    if (i > 0) res += ',';
    res += '`' + need[i].colname + '`';
    switch (need[i].choose) {
      case 'auto increment':
        console.log(1);
        funList.push((index: any) => autoIncrement.call(null, index));
        break;
      case 'cname':
        funList.push(cname);
        break;
      case 'integer':
        // funList.push(Random.integer());
        break;
    }
  }
  res += ') \r\n VALUES \r\n';
  for (let i = 0; i < num; i++) {
    res += '(';
    for (let j = 0; j < len; j++) {
      if (j > 0) res += ',';
      res += "'";
      res += funList[j](i);
      res += "'";
    }
    res += ')\r\n';
  }
  console.log(res);
  return res;
};

export { constructor };
