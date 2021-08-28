import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtworkItemComponent } from './artwork-item.component';
import { NxCardModule } from '@aposin/ng-aquila/card';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';

@NgModule({
  declarations: [ArtworkItemComponent],
  imports: [CommonModule, NxCardModule, NxHeadlineModule, NxCopytextModule],
  exports: [ArtworkItemComponent],
})
export class ArtworkItemModule {}
