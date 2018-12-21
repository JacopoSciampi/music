import { Injectable } from "@angular/core";
import { Http } from "@angular/http";

@Injectable()
export class SongService{
    constructor(
        private http: Http
    ) {
    }
    public getTestSong(){
        return this.http.get('http://localhost:8888/music/testSong.php');
    }
}