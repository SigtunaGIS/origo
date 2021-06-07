import Circle from 'ol/style/Circle';
import Point from 'ol/geom/Point';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import getColor from '../getcolor';
import RegularShape from 'ol/style/RegularShape';
import {DEVICE_PIXEL_RATIO} from 'ol/has';

export default function hovaStyle() {

  return function style(feature) {

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const pixelRatio = DEVICE_PIXEL_RATIO;

    const geom = feature.getGeometry().getType();
    const layer = feature.getId().substring(0, feature.getId().lastIndexOf("."));

    let fill;
    let stroke;
    let style;
    let pattern;
    let rotation;

    // Generate a canvasPattern with circle 'o'
    const prickmark = (function pm() {
      canvas.width = 10 * pixelRatio;
      canvas.height = 10 * pixelRatio;
      context.fillStyle = 'rgb(0,0,0,1)';
      context.beginPath();
      // content.arc(x, y, radius, startAngle, endAngle [, anticlockwise]);
      //The arc is given x-coordinate, y-coordinate, radius. To make a full circle, the arc begins at an angle of 0 radians (0°), and ends at an angle of 2π radians (360°).
      context.arc(canvas.width * pixelRatio, canvas.height * pixelRatio, 2 * pixelRatio, 0, 2 * Math.PI);
      context.fill();
      return context.createPattern(canvas, 'repeat');
    }());

    // Generate a canvasPattern with cross '+'
    const korsmark = (function km() {
      canvas.width = 20 * pixelRatio;
      canvas.height = 20 * pixelRatio;
      // Set line width
      context.lineWidth = 1;
      // Set line color
      context.strokeStyle = 'rgb(0,0,0,1)';
      context.beginPath();

      context.moveTo(0, 4 * pixelRatio);
      context.lineTo(8 * pixelRatio, 4 * pixelRatio);

      context.moveTo(4 * pixelRatio, 0);
      context.lineTo(4 * pixelRatio, 8 * pixelRatio);

      context.stroke();

      return context.createPattern(canvas, 'repeat');
    }());

    function createPattern_grid(ctx_w,ctx_h,strokestyle,linewidth){

      canvas.width = ctx_w * pixelRatio;
      canvas.height = ctx_h * pixelRatio;
      // Set line width
      context.lineWidth = linewidth;
      // Set line color
      context.strokeStyle = strokestyle;
      context.beginPath();

      context.rect(0, 0, canvas.width, canvas.height);
      context.stroke();

      return context.createPattern(canvas, 'repeat');

    }

    function createPattern_stroke45deg(ctx_w,ctx_h,strokestyle,linewidth){
      canvas.width = ctx_w * pixelRatio;
      canvas.height = ctx_h * pixelRatio;
      // Set line width
      context.lineWidth = linewidth;
      // Set line color
      context.strokeStyle = strokestyle;
      context.beginPath();
      context.moveTo(0, canvas.height);
      context.lineTo(canvas.width,0);
      context.stroke();
      return context.createPattern(canvas, 'repeat');
    }

    switch (layer) {
      /* Områden olämpliga för ny bebyggelse */
      case 'hova_ej_lampligt_pga_hall_isar_byar_y':

        pattern = createPattern_stroke45deg(10,10,'rgb(0,0,0,0.6)',1)

        fill = new Fill({
          color: pattern
        });
        stroke = new Stroke({
          color: 'rgb(0,0,0,0)',
          width: 1,
          lineCap: 'square',
          lineJoin: 'miter'
        });

        style = new Style({
          fill,
          stroke
        });
        return style;
      break;

      /* 20 m buffer runt vägar med viss bullerpåverkan */
      case 'hova_vagar_bullerpaverkan_buffer_y':

      // Generate a canvasPattern with grid
      pattern = createPattern_grid(10,10,'rgb(0,0,0,1)',1)

        fill = new Fill({
          color: pattern
        });
        stroke = new Stroke({
          color: 'rgb(0,0,0,1)',
          width: 1,
          lineCap: 'square',
          lineJoin: 'miter'
        });

        style = new Style({
          fill,
          stroke
        });
        return style;
      break;

      /* Linjeavgränsning av område som inte får bebyggas med bostadshus */
      case 'hova_bebyggelse_olamplig_far_att_inte_skapa_tatorter_y':

      // Generate a canvasPattern with stroke line 45 degree
        pattern = createPattern_stroke45deg(10,10,'rgb(255,0,0,0.5)',1)

        fill = new Fill({
          color: pattern
        });
        stroke = new Stroke({
          color: 'rgb(0,0,0,0)',
          width: 1,
          lineCap: 'square',
          lineJoin: 'miter'
        });

        style = new Style({
          fill,
          stroke
        });
        return style;
      break;

      /* Höga naturvärden (ekar */
      case 'hova_hoga_naturvarden_y':

      // Generate a canvasPattern with stroke line 45 degree
        pattern = createPattern_stroke45deg(10,10,'rgb(0,146,0,1)',1)

        fill = new Fill({
          color: pattern
        });
        stroke = new Stroke({
          color: 'rgb(0,0,0,0)',
          width: 1,
          lineCap: 'square',
          lineJoin: 'miter'
        });

        style = new Style({
          fill,
          stroke
        });
        return style;
      break;

      /* Värdefull mark enligt jordbruksverkets äng och betemark inventering */
      case 'hova_vard_2_y':

      // Generate a canvasPattern with stroke line 45 degree
        pattern = createPattern_stroke45deg(10,10,'rgb(0,146,0,1)',1)

        fill = new Fill({
          color: pattern
        });
        stroke = new Stroke({
          color: 'rgb(0,0,0,0)',
          width: 1,
          lineCap: 'square',
          lineJoin: 'miter'
        });

        style = new Style({
          fill,
          stroke
        });
        return style;
      break;

      case 'hova_potentiell_strak_friluftsliv_l':

        var styleFunction = function(feature) {

          stroke = new Stroke({
            color: 'rgb(0,185,74,1)',
            width: 3,
          });
          var styles = [
            // linestring
            style = new Style({
              stroke
            })
          ];

          /* Arrow end of line */
          var lastLine = feature.getGeometry().getCoordinates()[feature.getGeometry().getCoordinates().length - 1];
          var lastPoint = lastLine.slice(-1)[0]
          var secondLast = lastLine.slice(-2)[0]

          var dx = lastPoint[0] - secondLast[0];
          var dy = lastPoint[1] - secondLast[1];
          var rotation = Math.atan2(dy, dx);

          // Use image example
          // styles.push(new Style({
          //   geometry: new Point(lastPoint),
          //   image: new Icon({
          //     src: 'https://openlayers.org/en/v3.20.1/examples/data/arrow.png',
          //     anchor: [0.75, 0.5],
          //     rotateWithView: true,
          //     rotation: -rotation
          //   })
          // }));

          styles.push(new Style({
            geometry: new Point(lastPoint),
            image: new RegularShape({
              fill: new Fill({color: 'rgb(0,185,74,1)'}),
              points: 3,
              radius: 6,
              rotation: -rotation,
              angle: Math.PI / 2 // rotate 90°
            })
          }));

          /* Arrow start of line */
          var firstLine = feature.getGeometry().getCoordinates()[0];
          var firstPoint = firstLine[0]
          var secondPoint = firstLine[1]

          var dx2 = firstPoint[0] - secondPoint[0];
          var dy2 = firstPoint[1] - secondPoint[1];
          var rotation = Math.atan2(dy2, dx2);
          //
          styles.push(new Style({
            geometry: new Point(firstPoint),
            image: new RegularShape({
              fill: new Fill({color: 'rgb(0,185,74,1)'}),
              points: 3,
              radius: 6,
              rotation: -rotation,
              angle: Math.PI / 2 // rotate 90°
            })
          }));

          return styles;

        };

        style = styleFunction(feature)

        return style;
      break;
  };
}
}
