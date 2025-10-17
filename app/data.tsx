import type { Players } from '~/types';

export async function getGameweekData(gameweek:number) : Promise<any> {
    const response = await fetch(`https://storage.googleapis.com/2024_2025/${gameweek}.json`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        } as HeadersInit,
    });

    if (!response.ok) {
       throw new Error("Error accessing gameweek data");
    }
    
    const data = await response.json();
    return data;
}
