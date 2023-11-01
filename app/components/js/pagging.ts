const pagging = (data: any[], start: string, end: string): any[] => {
  const st = parseInt(start);
  const en = parseInt(end);
  const returnData: any[] = [];

  for (let i = st; i < data.length && i <= en; i++) {
    returnData.push(data[i]);
  }
  return returnData;
};
export default pagging;
