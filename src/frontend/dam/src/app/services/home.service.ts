import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  URLServer = 'http://192.168.0.70:8000'

  config = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }

  constructor(private _http: HttpClient) {}

}
