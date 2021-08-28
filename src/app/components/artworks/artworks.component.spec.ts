import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NxDropdownModule } from '@aposin/ng-aquila/dropdown';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxGridModule } from '@aposin/ng-aquila/grid';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxPaginationModule } from '@aposin/ng-aquila/pagination';
import { ArtworksComponent } from './artworks.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ArtworkItemModule } from './artwork-item/artwork-item.module';
import { SpinnerOverlayModule } from '../spinner-overlay/spinner-overlay.module';
import { Artwork } from './artwork-item/artwork-item.model';
import { title } from 'process';

describe('ArtworksComponent', () => {
  let component: ArtworksComponent;
  let fixture: ComponentFixture<ArtworksComponent>;
  let httpTestingController: HttpTestingController;
  const mockArtworks = [
    {
      title: 'Skidmore',
      artist_title: 'Toshiko Takaezu',
      place_of_origin: 'Quakertown',
      date_start: 1990,
      date_end: 1990,
      medium_display: 'Glazed stoneware',
      style_titles: ['Modernism']
    },
    {
      title: 'Terrace and Observation Deck at the Moulin de Blute-Fin, Montmartre',
      artist_title: 'Vincent van Gogh',
      place_of_origin: 'Netherlands',
      date_start: 1887,
      date_end: 1887,
      medium_display: 'Oil on canvas, mounted on pressboard',
      style_titles: ['Post-Impressionism']
    },
    {
      title: 'Coverlet',
      artist_title: 'John Landis',
      place_of_origin: 'Pennsylvania',
      date_start: 1810,
      date_end: 1840,
      medium_display: 'Cotton and wool',
      style_titles: ['Modernism']
    }
  ] as Artwork[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArtworksComponent],
      imports: [
        HttpClientTestingModule,
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
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtworksComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('fetchArtworks', () => {
    it('should call processArtworkList without fetching a new list', () => {
      spyOn(component, 'processArtworkList');
      component.artworkData[2] = {
        data: mockArtworks,
        styleOptions: []
      };
      component.page = 2;
      component.fetchArtworks();
      expect(component.processArtworkList).toHaveBeenCalled();
      httpTestingController.expectNone(`${component.url}?limit=24&page=2`);
    });

    it('should fetch new list and process the data', fakeAsync(() => {
      spyOn(component, 'getPageData').and.returnValue({ data: [], styleOptions: [] });
      spyOn(component, 'processArtworkList');
      httpTestingController.expectOne(`${component.url}?limit=24&page=1`).flush({ pagination: null, data: mockArtworks });
      tick();
      expect(component.getPageData).toHaveBeenCalled();
      expect(component.processArtworkList).toHaveBeenCalled();
    }));

    it('should handle unavailable data', fakeAsync(() => {
      spyOn(component, 'getPageData');
      spyOn(component, 'processArtworkList');
      httpTestingController.expectOne(`${component.url}?limit=24&page=1`).flush({ pagination: null, data: [] });
      tick();
      expect(component.getPageData).not.toHaveBeenCalled();
      expect(component.processArtworkList).not.toHaveBeenCalled();
      expect(component.artworkData[1]).toEqual({
        data: [],
        styleOptions: []
      });
      expect(component.artworkList).toEqual([]);
    }));

    it('should handle fetching error', fakeAsync(() => {
      spyOn(component, 'getPageData');
      spyOn(component, 'processArtworkList');
      httpTestingController.expectOne(`${component.url}?limit=24&page=1`).error(new ErrorEvent('network error'));
      tick();
      expect(component.getPageData).not.toHaveBeenCalled();
      expect(component.processArtworkList).not.toHaveBeenCalled();
      expect(component.artworkData[1]).toEqual({
        data: [],
        styleOptions: []
      });
      expect(component.artworkList).toEqual([]);
    }));
  });

  describe('getPageData', () => {
    it('should return correct data', () => {
      expect(component.getPageData(mockArtworks)).toEqual({
        data: mockArtworks,
        styleOptions: [
          {
            label: 'Modernism (2)',
            value: 'Modernism'
          },
          {
            label: 'Post-Impressionism (1)',
            value: 'Post-Impressionism'
          }
        ]
      });
    });
  });

  describe('filterList', () => {
    it('should return filter out irrelevant items', () => {
      component.artworkData[1] = {
        data: mockArtworks,
        styleOptions: []
      };
      component.formGroup.patchValue({ filter: ['Modernism'] });
      expect(component.filterList().length).toBe(2);

      component.formGroup.patchValue({ filter: ['Modernism', 'Post-Impressionism'] });
      expect(component.filterList().length).toBe(3);
    });
  });

  describe('sortList', () => {
    it('should return sorted list correctly', () => {
      component.formGroup.patchValue({ sortType: 'title' });
      let sortedList = component.sortList(mockArtworks);
      expect(sortedList[0].title).toEqual('Coverlet');
      expect(sortedList[1].title).toEqual('Skidmore');
      expect(sortedList[2].title).toEqual('Terrace and Observation Deck at the Moulin de Blute-Fin, Montmartre');

      component.formGroup.patchValue({ sortType: 'artist_title' });
      sortedList = component.sortList(mockArtworks);
      expect(sortedList[0].artist_title).toEqual('John Landis');
      expect(sortedList[1].artist_title).toEqual('Toshiko Takaezu');
      expect(sortedList[2].artist_title).toEqual('Vincent van Gogh');

      component.formGroup.patchValue({ sortType: 'date_start' });
      sortedList = component.sortList(mockArtworks);
      expect(sortedList[0].date_start).toEqual(1810);
      expect(sortedList[1].date_start).toEqual(1887);
      expect(sortedList[2].date_start).toEqual(1990);
    });
  });

  describe('Page change', () => {
    const testCases = [
      { currentPage: 1, navigationType: 'NEXT' as 'NEXT', navigationDescription: 'next', result: 2 },
      { currentPage: 2, navigationType: 'BACK' as 'BACK', navigationDescription: 'back', result: 1 },
      { currentPage: 2, navigationType: 15, navigationDescription: 'page 15', result: 15 },
    ];

    testCases.forEach((test) => {
      it(`if the current page is ${test.currentPage}, it should navigate to page ${test.result} when user clicks ${test.navigationDescription}`, () => {
        spyOn(component, 'fetchArtworks');
        component.formGroup.patchValue({
          filter: ['21st Century'],
          sortType: 'title'
        });
        component.page = test.currentPage;
        component.changePage(test.navigationType);
        expect(component.page).toEqual(test.result);
        expect(component.formGroup.value).toEqual({
          filter: null,
          sortType: 'title'
        });
        expect(component.fetchArtworks).toHaveBeenCalled();
      });
    });
  });
});
