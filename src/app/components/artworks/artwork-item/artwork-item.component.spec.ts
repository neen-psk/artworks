import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NxCardModule } from '@aposin/ng-aquila/card';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';

import { ArtworkItemComponent } from './artwork-item.component';
import { Artwork } from './artwork-item.model';

describe('ArtworkItemComponent', () => {
  let component: ArtworkItemComponent;
  let fixture: ComponentFixture<ArtworkItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArtworkItemComponent],
      imports: [NxCardModule, NxHeadlineModule, NxCopytextModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtworkItemComponent);
    component = fixture.componentInstance;
    component.item = {
      title: 'What is Essential',
      artist_title: 'Yamini Nayar',
      place_of_origin: 'United States',
      date_start: 2006,
      date_end: 2006,
      medium_display: 'Chromogenic print; edition 5/7, plus 2 artist proofs',
      image_id: '839bdf79-52c3-b828-04dc-dfdf34a4b985'
    } as Artwork;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
