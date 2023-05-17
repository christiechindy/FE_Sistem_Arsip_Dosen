import { getCookie } from "cookies-next";

const getToken = () => {
    const access_token = getCookie("access_token");
    return access_token;
}

const auth = {
    headers: { Authorization: `Bearer ${getToken()}` }
};

export {auth, getToken};