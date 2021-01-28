import axios from "axios";

export const serverUrl = "http://localhost:8081"
export default function setTokenHeader(token) {
  console.log("agdygdugduduu")
  if (token) {
    localStorage.setItem("jwtToken",token)
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
}

// export function apiCall(method, path, data = null) {
//   return new Promise((resolve, reject) => {
//     return axios[method.toLowerCase()](path, data)
//       .then(res => {
//         return resolve(res.data);
//       })
//       .catch(err => {
//         return reject(err.response.data.error);
//       });
//   });
// }
