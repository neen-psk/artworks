import { Artwork } from './artwork-item/artwork-item.model';

export interface Option {
    label: string;
    value: string;
}

export interface ArtworkResponse {
    pagination: Pagination;
    data: Artwork[];
    info: Info;
    config: Config;
}

export interface ArtworkData {
    pagination: Pagination;
    data: Artwork[][];
}

export interface DisplayData {
    data: Artwork[];
    styleOptions: Option[];
}

export interface Pagination {
    total: number;
    limit: number;
    offset?: number;
    total_pages: number;
    current_page: number;
    next_url?: string;
}

export interface Info {
    license_text: string;
    license_links: string[];
    version: string;
}

export interface Config {
    iiif_url: string;
    website_url: string;
}
