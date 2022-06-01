import fetch from "node-fetch";
export class Gameserver {
    id: string;
    token: string;

    constructor(id: string, token: string) {
        this.id = id;
        this.token = token; 
    }

    async restart(): Promise<RestartResponse> {
        const response = await fetch(`https://api.nitrado.net/services/${this.id}/gameservers/restart`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Authorization': this.token
            }
           
        });
        return await response.json() as RestartResponse;
    }

    async stop(): Promise<RestartResponse> {
        const response = await fetch(`https://api.nitrado.net/services/${this.id}/gameservers/stop`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Authorization': this.token
            }
           
        });
        return await response.json() as RestartResponse;
    }

    async getStatus(): Promise<ServerStatus> {
        const response = await fetch(`https://api.nitrado.net/services/${this.id}/gameservers`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Authorization': this.token
            }
        });
        await response.json().then(response => {
            return response.data.gameserver.status as ServerStatus;
        });
        return 'stopped' as ServerStatus;
    }
}

export interface RestartResponse {
    status:  Status;
    message: string
}

export type Status = 'success' | 'failure';
export type ServerStatus = 'started' | 'stopped' | 'stopping' | 'restarting';