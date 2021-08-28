import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtworksComponent } from './artworks.component';

import { NxGridModule } from '@aposin/ng-aquila/grid';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxPaginationModule } from '@aposin/ng-aquila/pagination';
import { NxDropdownModule } from '@aposin/ng-aquila/dropdown';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { SpinnerOverlayModule } from '../spinner-overlay/spinner-overlay.module';
import { ArtworkItemModule } from './artwork-item/artwork-item.module';


@NgModule({
  declarations: [
    ArtworksComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    ArtworkItemModule,
    SpinnerOverlayModule,
    NxGridModule,
    NxHeadlineModule,
    NxFormfieldModule,
    NxInputModule,
    NxDropdownModule,
    NxPaginationModule
  ],
  exports: [ArtworksComponent]
})
export class ArtworksModule { }
