import {Component, OnInit} from '@angular/core';
import {NodeGraphEditorComponent} from './components/node-graph-editor/node-graph-editor.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ConnectionModel, ItemModel, ViewportModel} from './components/node-graph-editor/node-graph-viewport.model';

@Component({
  selector: 'app-root',
  imports: [CommonModule, NodeGraphEditorComponent, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'OpenPoseEditor';

  viewport!: ViewportModel;

  pose:any = {
      "keypoints": [
        {"id": 0, "x": 300, "y": 50, "confidence": 0.95, "color": "#B30000"},  // Nose (red)
        {"id": 1, "x": 290, "y": 100, "confidence": 0.90, "color": "#FF7F00"}, // Neck (orange)
        {"id": 2, "x": 250, "y": 100, "confidence": 0.85, "color": "#3CB300"}, // Right Shoulder (yellow)
        {"id": 3, "x": 220, "y": 150, "confidence": 0.87, "color": "#7FFF00"}, // Right Elbow (light green)
        {"id": 4, "x": 200, "y": 200, "confidence": 0.89, "color": "#00FF00"}, // Right Wrist (green)
        {"id": 5, "x": 330, "y": 100, "confidence": 0.88, "color": "#B37700"}, // Left Shoulder (cyan)
        {"id": 6, "x": 360, "y": 150, "confidence": 0.86, "color": "#B3B300"}, // Left Elbow (blue)
        {"id": 7, "x": 380, "y": 200, "confidence": 0.84, "color": "#77B300"}, // Left Wrist (dark blue)
        {"id": 8, "x": 280, "y": 200, "confidence": 0.92, "color": "#003CB3"}, // Mid Hip (purple)
        {"id": 9, "x": 250, "y": 300, "confidence": 0.89, "color": "#0000B3"}, // Right Knee (pink)
        {"id": 10, "x": 230, "y": 400, "confidence": 0.91, "color": "#3C00B3"}, // Right Ankle (magenta)
        {"id": 11, "x": 330, "y": 300, "confidence": 0.90, "color": "#00B3B3"}, // Left Knee (violet)
        {"id": 12, "x": 350, "y": 400, "confidence": 0.93, "color": "#0077B3"}, // Left Ankle (deep pink)
        {"id": 13, "x": 300, "y": 200, "confidence": 0.92, "color": "#00B377"}, // Mid Hip 2 (purple)
        {"id": 14, "x": 280, "y": 30, "confidence": 0.85, "color": "#B300B3"}, // Right Eye (light coral)
        {"id": 15, "x": 320, "y": 30, "confidence": 0.84, "color": "#7700B3"}, // Left Eye (gold)
        {"id": 16, "x": 270, "y": 40, "confidence": 0.88, "color": "#B3003C"}, // Right Ear (goldenrod)
        {"id": 17, "x": 330, "y": 40, "confidence": 0.86, "color": "#B30077"},  // Left Ear (saddle brown)
      ],
      "bones": [
        {"from": 0, "to": 1, "color": "#B30000"},  // Nose to Neck (orange-red)
        {"from": 1, "to": 2, "color": "#77B300"},  // Neck to Right Shoulder (gold)
        {"from": 1, "to": 5, "color": "#B33C00"},  // Neck to Left Shoulder (green-yellow)
        {"from": 2, "to": 3, "color": "#3CB300"},  // Right Shoulder to Right Elbow (lime green)
        {"from": 3, "to": 4, "color": "#00B300"},  // Right Elbow to Right Wrist (green)
        {"from": 5, "to": 6, "color": "#B37700"},  // Left Shoulder to Left Elbow (dark cyan)
        {"from": 6, "to": 7, "color": "#B3B300"},  // Left Elbow to Left Wrist (dodger blue)
        {"from": 1, "to": 8, "color": "#0077B3"},  // Neck to Mid Hip (indigo)
        {"from": 8, "to": 9, "color": "#003CB3"},  // Mid Hip to Right Knee (hot pink)
        {"from": 9, "to": 10, "color": "#0000B3"}, // Right Knee to Right Ankle (deep pink)
        {"from": 13, "to": 11, "color": "#00B377"}, // Mid Hip to Left Knee (dark violet)
        {"from": 11, "to": 12, "color": "#00B3B3"}, // Left Knee to Left Ankle (blue violet)
        {"from": 0, "to": 14, "color": "#B300B3"}, // Nose to Right Eye (tomato)
        {"from": 0, "to": 15, "color": "#3C00B3"}, // Nose to Left Eye (coral)
        {"from": 14, "to": 16, "color": "#B30077"}, // Right Eye to Right Ear (chocolate)
        {"from": 15, "to": 17, "color": "#7700B3"},  // Left Eye to Left Ear (saddle brown)
        {"from": 1, "to": 13, "color": "#00B33C"}, // Mid Hip to Left Knee (dark violet)
      ]
    };


  ngOnInit() {

    (window as any).editor = this;



    this.reset();
  }

  public reset() {
    this.viewport = new ViewportModel();
    for (let keypoint of this.pose.keypoints) {
      this.viewport.items.push(new ItemModel().setPosition(500 - keypoint.x, keypoint.y).setColor(keypoint.color));
    }

    for (let bone of this.pose.bones) {
      this.viewport.connections.push(new ConnectionModel(0).setConnection(this.viewport.items[bone.from], this.viewport.items[bone.to]).setColor(bone.color));
    }
  }

  public toJson() {
    return this.viewport.toJson();
  }

  public fromJson(json: string) {
    if (json) {
      return this.viewport.fromJson(json);
    }
  }

}
