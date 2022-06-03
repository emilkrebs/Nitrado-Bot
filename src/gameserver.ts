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
        return await response.json().then(response => {
            return response.data.gameserver.status as ServerStatus;
        });
    }
    async getPlayers(): Promise<Player[]> {
        const response = await fetch(`https://api.nitrado.net/services/${this.id}/gameservers/games/players`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Authorization': this.token
            }
        });
        return await response.json().then(response => {
            return response.data.players as Player[];
        });
    }

    async getOnlinePlayers(): Promise<Player[]> {
        const response = await fetch(`https://api.nitrado.net/services/${this.id}/gameservers/games/players`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Authorization': this.token
            }
        });
        return await response.json().then(response => {
            let players = response.data.players as Player[];            
            return players.filter(e => e.online);
        });
    }
}

export interface RestartResponse {
    status: Status;
    message: string
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