import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {

  @Input() currentPage: number = 1;
  @Input() totalPages: number = 10;
  @Output() pageChange = new EventEmitter<number>();

  pages: (number | string)[] = [];

  constructor() {
    this.generatePages();
  }

  generatePages(): void {
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      if (i === 1 || i === this.totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
        this.pages.push(i);
      } else if (i === 2 || i === this.totalPages - 1) {
        this.pages.push('...');
      }
    }
  }

  shouldShowPage(page: number | string): boolean {
    return page === '...' || (typeof page === 'number' && page >= this.currentPage - 1 && page <= this.currentPage + 1);
  }

  onPrevious(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.generatePages();
      this.pageChange.emit(this.currentPage);
    }
  }

  onNext(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.generatePages();
      this.pageChange.emit(this.currentPage);
    }
  }

  onPageClick(page: number | string): void {
    if (typeof page === 'number') {
      this.currentPage = page;
      this.generatePages();
      this.pageChange.emit(this.currentPage);
    }
  }
}