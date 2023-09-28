import * as crypto from "crypto";

const sendRequest = async <T>(
    url: string,
    options: RequestInit = { cache: "no-cache" },
): Promise<{ data: T; ok: boolean; status: number }> => {
    try {
        const baseUrl = process.env.BASE_URL;
        const apiKey = process.env.API_KEY as string;
        const dataSign = `${apiKey}:${url}`;
        const signGasskeun = crypto.createHmac("md5", apiKey).update(dataSign).digest("hex");
        const opt: RequestInit = {
            ...options,
            credentials: "include",
            headers: {
                "x-gasskeun-sign": signGasskeun,
                "ngrok-skip-browser-warning": "true",
            },
        };
        const response = await fetch(baseUrl + url, opt);
        const data = await response.json();
        return { data, ok: response.ok, status: response.status };
    } catch (error) {
        throw error;
    }
};

export default sendRequest;
