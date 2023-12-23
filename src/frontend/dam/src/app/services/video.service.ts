import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class VideoService {
    private URLServer = 'http://192.168.0.70:8000';

    constructor(private _http: HttpClient) {}

    getVideoData(): Observable<any[]> {
        return this._http.get<any[]>(`../assets/video.json`);
    }

}
