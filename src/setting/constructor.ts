import Mock from 'mockjs';

const Random = Mock.Random;

function autoIncrement(msg: any, count: Number) {
  return msg.initnum + count + 1;
}
function cname() {
  return Random.cname();
}

function boolean(msg: any) {
  return Random.boolean(msg.min, msg.max, true);
}

function integer(msg: any) {
  return Random.integer(msg.min, msg.max);
}

function float(msg: any) {
  return Random.float(msg.min, msg.max, msg.dmin, msg.dmin);
}

const constructor = (body: any) => {
  const tablename = body.tablename;
  const num = body.num;
  const need = body.need;
  console.log(tablename, need);
  let funList: Array<Function> = [];
  let res = 'INSERT INTO `' + tablename + '` (';
  const len = need.length;
  for (let i = 0; i < len; i++) {
    console.log(need[i]);
    if (i > 0) res += ',';
    res += '`' + need[i].colname + '`';
    switch (need[i].choose) {
      case 'auto increment':
        funList.push((msg: any, count: Number) =>
          autoIncrement.call(null, msg, count)
        );
        break;
      case 'cname':
        funList.push(cname);
        break;
      case 'integer':
        funList.push((msg: any) => integer.call(null, msg));
        break;
      case 'boolean':
        funList.push((msg: any) => boolean.call(null, msg));
        break;
      case 'float':
        funList.push((msg: any) => float.call(null, msg));
        break;
    }
  }
  res += ') \r\nVALUES \r\n';
  for (let i = 0; i < num; i++) {
    res += '    (';
    for (let j = 0; j < len; j++) {
      if (j > 0) res += ',';
      res += "'";
      res += funList[j](need[j].message, i);
      res += "'";
    }
    if (i < num - 1) res += '),\r\n';
    else res += ');\r\n';
  }
  console.log(res);
  return res;
};

export { constructor };
