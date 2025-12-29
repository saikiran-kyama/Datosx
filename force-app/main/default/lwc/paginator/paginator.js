import { LightningElement, api } from 'lwc';

export default class Paginator extends LightningElement {
    @api totalSize = 0;
    @api pageSizeOptions = [5, 10, 25, 50, 100];
    @api pageSize = 25;
    @api pageIndex = 0; // zero-based

    renderedCallback() {
        const sel = this.template.querySelector('select');
        if (sel && sel.value !== String(this.pageSize)) {
            sel.value = String(this.pageSize);
        }
    }

    get totalPages() {
        return Math.max(1, Math.ceil(this.totalSize / this.pageSize));
    }

    get isFirst() {
        return this.pageIndex <= 0;
    }

    get isLast() {
        return this.pageIndex >= this.totalPages - 1;
    }

    get startRecord() {
        if (this.totalSize === 0) return 0;
        return this.pageIndex * this.pageSize + 1;
    }

    get endRecord() {
        return Math.min(this.totalSize, (this.pageIndex + 1) * this.pageSize);
    }

    dispatchPageChange() {
        this.dispatchEvent(new CustomEvent('pagechange', { detail: { pageIndex: this.pageIndex, pageSize: this.pageSize } }));
    }

    onSizeChange(event) {
        const newSize = parseInt(event.target.value, 10);
        if (!isNaN(newSize) && newSize > 0) {
            this.pageSize = newSize;
            this.pageIndex = 0;
            this.dispatchPageChange();
        }
    }

    previous() {
        if (!this.isFirst) {
            this.pageIndex = Math.max(0, this.pageIndex - 1);
            this.dispatchPageChange();
        }
    }

    next() {
        if (!this.isLast) {
            this.pageIndex = Math.min(this.totalPages - 1, this.pageIndex + 1);
            this.dispatchPageChange();
        }
    }

    goToFirst() {
        if (!this.isFirst) {
            this.pageIndex = 0;
            this.dispatchPageChange();
        }
    }

    goToLast() {
        if (!this.isLast) {
            this.pageIndex = Math.max(0, this.totalPages - 1);
            this.dispatchPageChange();
        }
    }
}
