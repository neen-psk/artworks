import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Artwork } from './artwork-item/artwork-item.model';
import { ArtworkResponse, DisplayData, Option } from './artworks.model';

@Component({
  selector: 'app-artworks',
  templateUrl: './artworks.component.html',
  styleUrls: ['./artworks.component.scss']
})
export class ArtworksComponent implements OnInit, OnDestroy {
  readonly url = 'https://api.artic.edu/api/v1/artworks';
  page = 1;

  // The api returns total artworks = 115286 and total pages = 4804
  // but the actual availability is different, thus hard code needed
  readonly pagination = {
    total: 4800,
    limit: 24,
    totalPages: 200
  };
  artworkData: DisplayData[] = [];
  artworkList: Artwork[];
  formGroup = new FormGroup({
    filter: new FormControl(),
    sortType: new FormControl('default')
  });

  componentDestroyed$: Subject<boolean> = new Subject();
  isLoading = false;

  constructor(private readonly http: HttpClient) { }

  ngOnInit(): void {
    this.fetchArtworks();
    this.formGroup.valueChanges
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(() => {
        this.processArtworkList();
      });
  }

  fetchArtworks(): void {
    if (this.artworkData[this.page]?.data?.length) {
      this.processArtworkList();
      return;
    }

    this.isLoading = true;
    this.http
      .get<ArtworkResponse>(this.url, {
        params: {
          limit: `${this.pagination.limit}`,
          page: `${this.page}`
        }
      })
      .pipe(
        takeUntil(this.componentDestroyed$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response) => {
          if (!response?.data?.length) {
            this.artworkData[this.page] = { data: [], styleOptions: [] };
            this.artworkList = [];
            return;
          }

          this.artworkData[this.page] = this.getPageData(response.data);
          this.artworkList = [...this.artworkData[this.page].data];
          this.processArtworkList();
        },
        () => {
          this.artworkData[this.page] = { data: [], styleOptions: [] };
          this.artworkList = [];
        }
      );
  }

  getPageData(data: Artwork[]): DisplayData {
    const styleOptions = {};

    data.forEach((item: Artwork) => {
      item.style_titles?.forEach(style => {
        if (styleOptions[style]) {
          styleOptions[style]++;
        } else {
          styleOptions[style] = 1;
        }
      });
    });

    return {
      data: [...data],
      styleOptions: this.getOptions(styleOptions)
    };
  }

  getOptions(options: { [key: string]: number }): Option[] {
    return Object.keys(options).map(key => ({
      label: key !== 'null' ? `${key} (${options[key]})` : `Unknown (${options[key]})`,
      value: key !== 'null' ? key : null
    }));
  }

  processArtworkList(): void {
    const filteredList = (this.formGroup.value.filter?.length) ? this.filterList() : [...(this.artworkData[this.page]?.data || [])];
    this.artworkList = this.formGroup.value.sortType === 'default' ? filteredList : this.sortList(filteredList);
  }

  filterList(): Artwork[] {
    return this.artworkData[this.page]?.data.filter(item => {
      const validStyle = item.style_titles.reduce((result, style) => {
        return result || this.formGroup.value.filter.includes(style);
      }, false);

      return validStyle;
    });
  }

  sortList(list: Artwork[] = []): Artwork[] {
    return list.sort((a: Artwork, b: Artwork) => {
      if (typeof a[this.formGroup.value.sortType] === 'string') {
        return a[this.formGroup.value.sortType].localeCompare(b[this.formGroup.value.sortType]);
      }

      return a[this.formGroup.value.sortType] - b[this.formGroup.value.sortType];
    });
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  changePage(page: 'NEXT' | 'BACK' | number): void {
    this.formGroup.controls.filter.reset();

    if (page === 'NEXT') {
      this.page++;
    } else if (page === 'BACK') {
      this.page--;
    } else {
      this.page = page;
    }

    this.fetchArtworks();
    window.scrollTo(0, 0);
  }
}
