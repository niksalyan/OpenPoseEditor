export class ViewportModel {
    public readonly node: string = 'viewport';
    public x: number = 0;
    public y: number = 0;
    private _zoom: number = 1;
    public selectedObject: any;
    public draggingObject: any = null;
    public editObject: any = null;

    public creatingConnection: ConnectionModel | any = null;
    public connectingObject: any = null;

    public mouse: PointModel = new PointModel();
    public size: PointModel = new PointModel();

    public items: ItemModel[] = [];
    public connections: ConnectionModel[] = [];

    public drag(drag: any): void {
        if (drag?.dragStart) {
            drag.dragStart();
        }
        if (this.draggingObject?.dragEnd) {
            this.draggingObject.dragEnd();
        }
        this.draggingObject = drag;
    }

    public select(select: any): void {
        if (this.creatingConnection && select?.node === 'item' && this.creatingConnection.source !== select) {
            let connection: ConnectionModel | any = this.findConnection(this.creatingConnection.source, select);
            if (!connection) {
                connection = this.creatingConnection;
                connection.target = select;
                this.connections.push(connection);
            }
            this.selectedObject = connection;
            this.editObject = connection;
            this.creatingConnection = null;
            return;
        }
        this.selectedObject = select;
        this.editObject = null;
        this.creatingConnection = null;
    }

    public edit(edit: any): void {
        this.editObject = edit;
    }

    public align(step: number = 50): void {
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].x = Math.round(this.items[i].x / step) * step;
            this.items[i].y = Math.round(this.items[i].y / step) * step;
        }
    }

    public move(x: number, y: number): void {
        this.x += x;
        this.y += y;
    }

    public get transform(): string {
        return `translate(${this.x},${this.y}) scale(${this._zoom})`;
    }

    public get zoom(): number {
        return this._zoom;
    }

    public set zoom(zoom: number) {
        let x = this.x - this.size.x / 2;
        let y = this.y - this.size.y / 2;

        const oldZoom: number = this.zoom;

        this._zoom = zoom;
        this._zoom = this._zoom < 0.1 ? 0.1 : this._zoom;
        this._zoom = this._zoom > 2 ? 2 : this._zoom;

        const scaleZoom = 1 + (this.zoom - oldZoom);

        x *= scaleZoom;
        y *= scaleZoom;

        this.x = this.size.x / 2 + x;
        this.y = this.size.y / 2 + y;
    }

    public addItem(item?: ItemModel): void {
        item = item || new ItemModel();
        item.setPosition(-this.x + this.size.x / 2 - item.midX, -this.y + this.size.y / 2 - item.midY);
        this.items.push(item);
        this.selectedObject = item;
        this.editObject = item;
        this.creatingConnection = null;
    }

    public addConnection(connection?: ConnectionModel): void {
        if (this.selectedObject?.node === 'item') {
            this.creatingConnection = connection || new ConnectionModel();
            this.creatingConnection.source = this.selectedObject;
            this.selectedObject = null;
        }
    }

    public deleteObject(): void {
        if (this.selectedObject?.onDelete) {
            this.selectedObject.onDelete(this);
            this.selectedObject = null;
        }
        this.editObject = null;
    }

    public findConnection(source: ItemModel, target: ItemModel): ConnectionModel | undefined {
        return this.connections.find((connection: ConnectionModel) => {
            return (connection.source === source && connection.target === target) || (connection.target === source && connection.source === target);
        });
    }

    public fromJson(json: any): void {
        json = json || {};
        this.x = json.x || 0;
        this.y = json.y || 0;
        this._zoom = json.zoom || 1;

        this.items = (json.items || []).map((node: any) => {
            return new ItemModel(node.name || '', node.type || 0).setPosition(node.x, node.y).setSize(node.width, node.height).setData(node.data);
        });

        this.connections = (json.connections || []).map((connection: any) => {
            return new ConnectionModel(connection.type || 0)
                .setConnection(this.items[connection.source], this.items[connection.target])
                .setData(connection.data)
                .setOffset(connection.offsetX, connection.offsetY);
        });
    }

    public toJson(): object {
        return {
            x: this.x,
            y: this.y,
            zoom: this.zoom,
            items: this.items.map((node: ItemModel) => {
                return {
                    name: node.name,
                    type: node.type,
                    x: node.x,
                    y: node.y,
                    width: node.width,
                    height: node.height,
                    data: node.data,
                };
            }),
            connections: this.connections
                .map((connection: ConnectionModel) => {
                    return {
                        type: connection.type,
                        source: this.items.indexOf(connection.source),
                        target: this.items.indexOf(connection.target),
                        offsetX: connection.offset.x,
                        offsetY: connection.offset.y,
                        data: connection.data
                    };
                })
                .filter((connection: any) => {
                    return connection.source > -1 && connection.target > -1;
                })
        };
    }
}

export class ItemModel {
    public readonly node: string = 'item';
    public x: number = 0;
    public y: number = 0;

    public size: PointModel = new PointModel(120, 70).onDragEnd(() => {
        this.dragEnd();
    });

    public data: any = {};

    constructor(public name: string = '', public type: number = 0) {

    }

    public dragEnd(): void {

        this.x = Math.round(this.x / 10) * 10;
        this.y = Math.round(this.y / 10) * 10;

        this.size.x = this.width;
        this.size.y = this.height;
    }

    public get midX(): number {
        return this.x + this.width / 2;
    }

    public get midY(): number {
        return this.y + this.height / 2;
    }

    public get width(): number {
        return 6;
    }

    public get height(): number {
        return 6;
    }

    public setPosition(x: number, y: number): ItemModel {
        this.x = x || 0;
        this.y = y || 0;
        return this;
    }

    public setSize(width: number, height: number): ItemModel {
        this.size.x = width || 120;
        this.size.y = height || 70;
        return this;
    }

    public setData(data: any): ItemModel {
        this.data = data || {};
        return this;
    }

    public move(x: number, y: number): void {
        this.x += x;
        this.y += y;
    }

    public onDelete(viewport: ViewportModel) {
        const index = viewport.items.indexOf(this);
        if (index > -1) {
            for (let n = viewport.connections.length - 1; n >= 0; n--) {
                if (viewport.connections[n].source === viewport.selectedObject || viewport.connections[n].target === viewport.selectedObject) {
                    viewport.connections.splice(n, 1);
                }
            }
            viewport.items.splice(index, 1);
        }
    }
}

export class ConnectionModel {
    public readonly node: string = 'connection';
    public source: ItemModel | any = undefined;
    public target: ItemModel | any = undefined;
    public offset: PointModel = new PointModel();

    public data: any = {};

    constructor(public type: number = 0) {

    }

    public setConnection(source: ItemModel, target: ItemModel): ConnectionModel {
        this.source = source;
        this.target = target;
        return this;
    }

    public setData(data: any): ConnectionModel {
        this.data = data || {};
        return this;
    }

    public setOffset(x: number, y: number): ConnectionModel {
        this.offset.x = x || 0;
        this.offset.y = y || 0;
        return this;
    }

    public get midX(): number {
        return this.source.midX + (this.target.midX - this.source.midX) / 2 + this.offset.x;
    }

    public get midY(): number {
        return this.source.midY + (this.target.midY - this.source.midY) / 2 + this.offset.y;
    }

    public get path(): string {
        if (this.source && this.target) {
            if (this.data.adjustPath && this.data.rectPath) {
                return this.renderPath(this.source.midX, this.source.midY, this.midX, this.midY) + ' ' + this.renderPath(this.midX, this.midY, this.target.midX, this.target.midY);
            } else {
                return this.renderPath(this.source.midX, this.source.midY, this.target.midX, this.target.midY);
            }
        } else {
            return '';
        }
    }

    public renderPath(sx: number, sy: number, tx: number, ty: number): string {
        if (this.data.roundPath) {
            const horizontal: boolean = Math.abs(sx - tx) > Math.abs(sy - ty);
            if (horizontal === !this.data.swapXY) {
                return `M ${sx} ${sy} C ${tx} ${sy} , ${sx} ${ty} , ${tx} ${ty}`;
            } else {
                return `M ${sx} ${sy} C ${sx} ${ty} , ${tx} ${sy} , ${tx} ${ty}`;
            }
        } else if (this.data.rectPath) {
            const horizontal: boolean = Math.abs(sx - tx) > Math.abs(sy - ty);
            if (horizontal === !this.data.swapXY) {
                return `M ${sx} ${sy} L ${this.midX} ${sy} L ${this.midX} ${ty} L ${tx} ${ty}`;
            } else {
                return `M ${sx} ${sy} L ${sx} ${this.midY} L ${tx} ${this.midY} L ${tx} ${ty}`;
            }
        } else {
            return `M ${sx} ${sy} L ${tx} ${ty}`;
        }
    }

    public move(x: number, y: number): void {
        if (this.source && this.target) {
            this.source.move(x, y);
            this.target.move(x, y);
        }
    }

    public onDelete(viewport: ViewportModel) {
        const index = viewport.connections.indexOf(this);
        if (index > -1) {
            viewport.connections.splice(index, 1);
        }
    }
}

export class PointModel {
    public readonly node: string = 'point';
    public active: boolean = true;

    private dragEndFn: Function | null = null;

    constructor(public x: number = 0, public y: number = 0) {

    }

    public move(x: number, y: number): void {
        this.x += x;
        this.y += y;
    }

    public dragEnd(): void {
        if (this.dragEndFn) {
            this.dragEndFn();
        }
    }

    public onDragEnd(dragEndFn: Function): PointModel {
        this.dragEndFn = dragEndFn;
        return this;
    }
}
