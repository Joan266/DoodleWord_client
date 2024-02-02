import axios from "axios";

const { REACT_APP_API_URL, NODE_ENV, REACT_APP_PORT } = process.env;

const URL = NODE_ENV === 'production' ? REACT_APP_API_URL : `http://localhost:${REACT_APP_PORT}/api`;

const http = axios.create({
    baseURL: URL
});
export default class AxiosRoutes {
    static async createRoom(data) {
        try {
            const response = await http.post("/createroom", data);
            return response.data;
        } catch (error) {
            console.error("Error creating room:", error);
            throw error;
        }
    }

    static async joinGame(data) {
        try {
            const response = await http.post("/joinroom", data);
            return response.data;
        } catch (error) {
            console.error("Error joining room:", error);
            throw error;
        }
    }

    static async addWord(data) {
        try {
            const response = await http.post("/addword", data);
            return response.data;
        } catch (error) {
            console.error("Error adding word:", error);
            throw error;
        }
    }

    static async randomWords(data) {
        try {
            const response = await http.post("/randomwords", data);
            return response.data;
        } catch (error) {
            console.error("Error generating random words:", error);
            throw error;
        }
    }
}
