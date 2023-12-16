import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { VideoPage } from './video.page';
import { VideoPageRoutingModule } from './video-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideoPageRoutingModule,
  ],
  declarations: [VideoPage]
})

export class VideoPageModule {}