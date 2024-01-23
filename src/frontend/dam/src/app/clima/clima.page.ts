// clima.page.ts

import { Component, OnInit } from '@angular/core';
import { ClimaService } from '../services/clima.service';

@Component({
  selector: 'app-clima',
  templateUrl: './clima.page.html',
  styleUrls: ['./clima.page.scss'],
})
export class ClimaPage implements OnInit {
  climaData: any;

  constructor(private climaService: ClimaService) {}

  ngOnInit(): void {

  }
}
