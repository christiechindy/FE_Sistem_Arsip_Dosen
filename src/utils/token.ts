"use client";

const getToken = () => {
    const access_token = window.localStorage.getItem("access_token");
    return access_token;
}

const auth = {
    headers: { Authorization: `Bearer ${getToken()}` }
};

export {auth};