import Mock from 'mockjs';

const Random = Mock.Random;

function autoIncrement(msg: any, count: Number) {
  return msg.initnum + count;
}
function cname() {
  return Random.cname();
}
function name() {
  return Random.name();
}

function boolean(msg: any) {
  return Random.boolean(msg.min, msg.max, true);
}

function integer(msg: any) {
  return Random.integer(msg.min, msg.max);
}

function float(msg: any) {
  return Random.float(msg.min, msg.max, msg.dmin, msg.dmax);
}

function date(msg: any) {
  return Random.date(msg.date);
}
function time(msg: any) {
  return Random.time(msg.time);
}
function datetime(msg: any) {
  return Random.datetime(msg.date + ' ' + msg.time);
}
function pick(msg: any) {
  return Random.pick(msg.model.tags);
}
function sentence(msg: any) {
  return Random.sentence(msg.min, msg.max);
}
function paragraph(msg: any) {
  return Random.paragraph(msg.min, msg.max);
}
function url() {
  return Random.url();
}
function ip() {
  return Random.ip();
}
function email() {
  return Random.email();
}
function domain() {
  return Random.domain();
}
function province() {
  return Random.province();
}
function region() {
  return Random.region();
}
function id() {
  return Random.id();
}

const constructor = (body: any) => {
  const tablename = body.tablename;
  const num = body.num;
  const need = body.need;
  const quotation = body.quotation;
  let funList: Array<Function> = [];
  let res = '';
  if (quotation !== '?') {
    res = 'INSERT INTO ' + quotation + tablename + quotation + ' (';
  } else {
    res = 'INSERT INTO [' + tablename + '] (';
  }
  const len = need.length;
  for (let i = 0; i < len; i++) {
    if (i > 0) res += ',';
    if (quotation !== '?') {
      res += quotation + need[i].colname + quotation;
    } else {
      res += '[' + need[i].colname + ']';
    }
    switch (need[i].choose) {
      case 'auto increment':
        funList.push((msg: any, count: Number) =>
          autoIncrement.call(null, msg, count)
        );
        break;
      case 'cname':
        funList.push(cname);
        break;
      case 'name':
        funList.push(name);
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
      case 'date':
        funList.push((msg: any) => date.call(null, msg));
        break;
      case 'time':
        funList.push((msg: any) => time.call(null, msg));
        break;
      case 'datetime':
        funList.push((msg: any) => datetime.call(null, msg));
        break;
      case 'pick':
        funList.push((msg: any) => pick.call(null, msg));
        break;
      case 'sentence':
        funList.push((msg: any) => sentence.call(null, msg));
        break;
      case 'paragraph':
        funList.push((msg: any) => paragraph.call(null, msg));
        break;
      case 'url':
        funList.push(url);
        break;
      case 'ip':
        funList.push(ip);
        break;
      case 'email':
        funList.push(email);
        break;
      case 'domain':
        funList.push(domain);
        break;
      case 'province':
        funList.push(province);
        break;
      case 'region':
        funList.push(region);
        break;
      case 'id':
        funList.push(id);
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
  return res;
};

export { constructor };
