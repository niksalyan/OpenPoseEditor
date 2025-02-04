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

  viewport: ViewportModel = new ViewportModel();

  pose:any = {
      "keypoints": [
        {"id": 0, "x": 300, "y": 50, "confidence": 0.95, "color": "#FF0000"},  // Nose (red)
        {"id": 1, "x": 290, "y": 100, "confidence": 0.90, "color": "#FF7F00"}, // Neck (orange)
        {"id": 2, "x": 250, "y": 100, "confidence": 0.85, "color": "#FFFF00"}, // Right Shoulder (yellow)
        {"id": 3, "x": 220, "y": 150, "confidence": 0.87, "color": "#7FFF00"}, // Right Elbow (light green)
        {"id": 4, "x": 200, "y": 200, "confidence": 0.89, "color": "#00FF00"}, // Right Wrist (green)
        {"id": 5, "x": 330, "y": 100, "confidence": 0.88, "color": "#00FFFF"}, // Left Shoulder (cyan)
        {"id": 6, "x": 360, "y": 150, "confidence": 0.86, "color": "#007FFF"}, // Left Elbow (blue)
        {"id": 7, "x": 380, "y": 200, "confidence": 0.84, "color": "#0000FF"}, // Left Wrist (dark blue)
        {"id": 8, "x": 290, "y": 200, "confidence": 0.92, "color": "#8000FF"}, // Mid Hip (purple)
        {"id": 9, "x": 250, "y": 300, "confidence": 0.89, "color": "#FF007F"}, // Right Knee (pink)
        {"id": 10, "x": 230, "y": 400, "confidence": 0.91, "color": "#FF00FF"}, // Right Ankle (magenta)
        {"id": 11, "x": 330, "y": 300, "confidence": 0.90, "color": "#800080"}, // Left Knee (violet)
        {"id": 12, "x": 350, "y": 400, "confidence": 0.93, "color": "#FF1493"}, // Left Ankle (deep pink)
        {"id": 14, "x": 280, "y": 30, "confidence": 0.85, "color": "#FFA07A"}, // Right Eye (light coral)
        {"id": 15, "x": 320, "y": 30, "confidence": 0.84, "color": "#FFD700"}, // Left Eye (gold)
        {"id": 16, "x": 270, "y": 20, "confidence": 0.88, "color": "#DAA520"}, // Right Ear (goldenrod)
        {"id": 17, "x": 330, "y": 20, "confidence": 0.86, "color": "#8B4513"}  // Left Ear (saddle brown)
      ],
      "bones": [
        {"from": 0, "to": 1, "color": "#FF4500"},  // Nose to Neck (orange-red)
        {"from": 1, "to": 2, "color": "#FFD700"},  // Neck to Right Shoulder (gold)
        {"from": 1, "to": 5, "color": "#ADFF2F"},  // Neck to Left Shoulder (green-yellow)
        {"from": 2, "to": 3, "color": "#32CD32"},  // Right Shoulder to Right Elbow (lime green)
        {"from": 3, "to": 4, "color": "#00FF00"},  // Right Elbow to Right Wrist (green)
        {"from": 5, "to": 6, "color": "#00CED1"},  // Left Shoulder to Left Elbow (dark cyan)
        {"from": 6, "to": 7, "color": "#1E90FF"},  // Left Elbow to Left Wrist (dodger blue)
        {"from": 1, "to": 8, "color": "#4B0082"},  // Neck to Mid Hip (indigo)
        {"from": 8, "to": 9, "color": "#FF69B4"},  // Mid Hip to Right Knee (hot pink)
        {"from": 9, "to": 10, "color": "#FF1493"}, // Right Knee to Right Ankle (deep pink)
        {"from": 8, "to": 11, "color": "#9400D3"}, // Mid Hip to Left Knee (dark violet)
        {"from": 11, "to": 12, "color": "#8A2BE2"}, // Left Knee to Left Ankle (blue violet)
        {"from": 0, "to": 14, "color": "#FF6347"}, // Nose to Right Eye (tomato)
        {"from": 0, "to": 15, "color": "#FF7F50"}, // Nose to Left Eye (coral)
        {"from": 14, "to": 16, "color": "#D2691E"}, // Right Eye to Right Ear (chocolate)
        {"from": 15, "to": 17, "color": "#8B4513"}  // Left Eye to Left Ear (saddle brown)
      ]
    };


  ngOnInit() {

    (window as any).editor = this;

    for (let keypoint of this.pose.keypoints) {
      this.viewport.addItem(new ItemModel().setPosition(-500 + keypoint.x, -500 + 400 - keypoint.y).setData(keypoint));
    }

    for (let bone of this.pose.bones) {
      this.viewport.connections.push(new ConnectionModel(0).setConnection(this.viewport.items[bone.from], this.viewport.items[bone.to]).setData(bone));
    }
  }

}
