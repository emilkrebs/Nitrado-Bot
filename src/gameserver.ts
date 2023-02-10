import fetch from "node-fetch";

export class Gameserver {
    id: string;
    token: string;

    constructor(id: string, token: string) {
        this.id = id;
        this.token = token;
    }


    //ping server and wait for response
    async ping(): Promise<Response> {
        return await this.request("/gameservers/", "GET");
    }

    async restart(): Promise<RestartResponse> {
        return await this.request("/gameservers/restart", "POST") as RestartResponse;
    }

    async stop(): Promise<RestartResponse> {
        return await this.request("/gameservers/stop", "POST") as RestartResponse;
    }

    async getStatus(): Promise<ServerStatus> {
        return await (await this.request("/gameservers", "GET")).data.gameserver.status as Promise<ServerStatus>;
    }
    async getPlayers(): Promise<Player[]> {
        return await (await this.request("/gameservers/games/players", "GET")).data.players as Promise<Player[]>;
    }


    async getOnlinePlayers(): Promise<Player[]> {
        return await (await this.getPlayers()).filter(e => e.online);
    }

    // handle all requests to the nitrado api
    async request(path: string, method: 'GET' | 'POST', data?: any): Promise<Response> {
        const response = await fetch(`https://api.nitrado.net/services/${this.id}${path}`, {
            method: method,
            headers: {
                Accept: 'application/json',
                'Authorization': this.token
            },
            body: JSON.stringify(data)
        });
        return await response.json() as Promise<Response>;
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