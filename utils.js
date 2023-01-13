export const status = {
  success: "success",
  fail: "fail",
};

export function delay(second) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, second * 1000);
  });
}

export function ignoreNumKey(obj) {
  Object.keys(obj).forEach(
    (key) => {
      if (!isNaN(+key)) {
        delete obj[key];
      }
    },
  );
  return obj;
}
