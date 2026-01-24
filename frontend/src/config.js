const apiUrl = process.env.REACT_APP_API_URL || "/api";
const hubUrl = process.env.REACT_APP_HUB_URL || "http://localhost:5000/api/gamehub";

const config = {
  serverUrl: apiUrl,
  hubUrl
};

export default config;