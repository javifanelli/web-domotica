import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClimaService {
  private apiUrl = 'https://developer.accuweather.com/accuweather-current-conditions-api/apis/get/currentconditions/v1/';
  private apiKey = 'y8xWsCFyDQQfjZ7BeoAWJbYCo7Y3tqWY';

  constructor(private http: HttpClient) {}

  getWeather(locationKey: string): Observable<any> {
    const url = `${this.apiUrl}${locationKey}?apikey=${this.apiKey}`;
    return this.http.get(url);
  }
}
