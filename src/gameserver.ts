import fetch from "node-fetch";

export class Gameserver {
    id: string;
    token: string;

    constructor(id: string, token: string) {
        this.id = id;
        this.token = token;
    }

    /**
     * Ping the api
     * @returns the response from the api
     */
    async ping(): Promise<Response> {
        return await this.request("/gameservers/", "GET");
    }

    /**
     * Start or restart the server
     * @returns the response from the api
     */
    async restart(): Promise<RestartResponse> {
        return await this.request("/gameservers/restart", "POST") as RestartResponse;
    }

    /**
     * Stop the server
     * @returns the response from the api
     */
    async stop(): Promise<RestartResponse> {
        return await this.request("/gameservers/stop", "POST") as RestartResponse;
    }

    /**
     * Get the status of the server
     * @returns the status of the server
     */ 
    async getStatus(): Promise<ServerStatus> {
        return await (await this.request("/gameservers", "GET")).data.gameserver.status as Promise<ServerStatus>;
    }

    /**
     * Get all players
     * @returns all players
     */
    async getPlayers(): Promise<Player[]> {
        return await (await this.request("/gameservers/games/players", "GET")).data.players as Promise<Player[]>;
    }

    /**
     * Get all online players
     * @returns all online players
     */
    async getOnlinePlayers(): Promise<Player[]> {
        return await (await this.getPlayers()).filter(e => e.online);
    }

    /**
     * Make a request to the nitrado api
     * @param path the path to the api endpoint
     * @param method the http method
     * @param data the data to send
     * @returns the response from the api
     */
    async request(path: string, method: 'GET' | 'POST', data?: any): Promise<Response> {
        const response = await fetch(`https://api.nitrado.net/services/${this.id}${path}`, {
            method: method,
            headers: {
                Accept: 'application/json',
                'Authorization': this.token
            },
            body: JSON.stringify(data)
        });
        // if the response is ok, return the json
        if(response.ok) {
            return await response.json() as Promise<Response>;
        }

        throw new Error(`Request failed with status ${response.status}`);
    }
}

interface Response {
    status: Status
    message: string
    data?: any;
}

export interface RestartResponse extends Response {
    status: Status;
}

export interface Player {
    name: string;
    id: string;
    id_type: string;
    online: boolean;
    last_online: Date;
}

export type Status = 'success' | 'failure';
export type ServerStatus = 'started' | 'stopped' | 'stopping' | 'restarting' | 'failure';