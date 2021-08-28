import { Component, Input, OnInit } from '@angular/core';
import { Artwork } from './artwork-item.model';

@Component({
  selector: 'app-artwork-item',
  templateUrl: './artwork-item.component.html',
  styleUrls: ['./artwork-item.component.scss']
})
export class ArtworkItemComponent implements OnInit {
  @Input() item: Artwork;
  image: string;

  ngOnInit(): void {
    this.setImagePath();
  }

  setImagePath(): void {
    this.image = `https://www.artic.edu/iiif/2/${this.item.image_id}/full/843,/0/default.jpg`;
  }
}
