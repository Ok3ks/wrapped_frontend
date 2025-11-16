import type { Season } from './types';



export async function getGameweekData(gameweek:number, year:Season) : Promise<any> {
    const response = await fetch(`https://storage.googleapis.com/${year}/${gameweek}.json`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        } as HeadersInit,
        // cache: 'reload'
    });

    if (!response.ok) {
       throw new Error("Error accessing gameweek data");
    }
    
    const data = await response.json();
    return data;
}

export async function getFixturesData(gameweek:number, year:Season) : Promise<any> {
    const response = await fetch(`https://storage.googleapis.com/${year}/${gameweek}_fixture.json`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        } as HeadersInit,
        // cache: 'reload'
    });

    if (!response.ok) {
       throw new Error("Error accessing gameweek data");
    }
    
    const data = await response.json();
    return data;
}
