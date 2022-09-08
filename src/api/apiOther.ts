import anyApi from "@/api/anyApi";

const getRandomNames = () => {
  // The proxy will cache a response, so we use a random number
  const number = Math.floor(Math.random() * 45) + 5;
  const url = `http://names.drycodes.com/${number}?nameOptions=boy_names,girl_names&separator=space`;
  return anyApi
    .get("/get", {
      params: {
        url,
      },
    })
    .then((response) => {
      if (response.data.contents) {
        try {
          const ret = JSON.parse(response.data.contents);
          if (ret && ret.length > 0) {
            return ret;
          }
        } catch (e) {
          return response.data;
        }
      }
      return response.data;
    });
};

export default {
  getRandomNames,
};
