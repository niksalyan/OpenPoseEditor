import {Component, HostListener, Input, OnInit} from '@angular/core';
import {PointModel, ViewportModel} from './node-graph-viewport.model';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  standalone: true,
    selector: 'app-node-graph-editor',
    templateUrl: './node-graph-editor.component.html',
    styleUrls: ['./node-graph-editor.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class NodeGraphEditorComponent implements OnInit {

    @Input() viewport: ViewportModel = new ViewportModel();

    private lastPoint: PointModel = new PointModel();

    constructor() {
    }

    ngOnInit(): void {
    }

    public onMouseDown(event: any): void {
        this.viewport.drag(true);
        this.viewport.select(null);
    }

    public onMouseUp(event: any): void {
        this.viewport.drag(false);
    }

    public onMouseMove(event: any, editor: any): void {

        const movementX: number = event.clientX - this.lastPoint.x;
        const movementY: number = event.clientY - this.lastPoint.y;
        this.lastPoint.x = event.clientX;
        this.lastPoint.y = event.clientY;

        if (this.viewport.draggingObject) {
            if (this.viewport.draggingObject === true) {
                this.viewport.move(movementX, movementY);
            } else {
                this.viewport.draggingObject.move(movementX / this.viewport.zoom, movementY / this.viewport.zoom);
            }
        }

        if (this.viewport.mouse.active) {
            this.viewport.mouse.x = event.layerX / this.viewport.zoom - this.viewport.x / this.viewport.zoom;
            this.viewport.mouse.y = event.layerY / this.viewport.zoom - this.viewport.y / this.viewport.zoom;
            this.viewport.size.x = editor.clientWidth;
            this.viewport.size.y = editor.clientHeight;
        }
    }

    onMouseWheel(event: any): void {
        if (event.wheelDelta > 0) {
            this.viewport.zoom += 0.05;
        } else if (event.wheelDelta < 0) {
            this.viewport.zoom -= 0.05;
        }
    }

    @HostListener('document:keyup', ['$event'])
    handleDeleteKeyboardEvent(event: KeyboardEvent): void {
        if(event.key === 'Delete')
        {
            this.viewport.deleteObject();
        }
    }

}
