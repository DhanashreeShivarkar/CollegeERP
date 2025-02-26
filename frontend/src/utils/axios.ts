import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000", // adjust this to match your Django server
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
