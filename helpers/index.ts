export const checkEmpty = (data: string) => {
  data = data.replace(/\s/g, "");
  const err = data == "" || data == null || data == undefined;
  return err;
};
