export const makeAccountNo = () => {
  const length = 7;
  const random = Math.floor(
    Math.random() *
      (new Date().getTime() +
        Math.floor(Math.random() * new Date().getTime()) +
        Math.floor(Math.random() * new Date().getTime()))
  );

  const subPart = random.toString().slice(-length);
  const diffInLength = length - subPart.length;
  const addToSub = "0".repeat(diffInLength);

  return `002${subPart}${addToSub}`;
};
export const makeOtp = () => {
  return `${
    new Date().getTime() + Math.round(Math.random() * new Date().getTime())
  }`.slice(-4);
};
