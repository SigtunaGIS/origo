import Point from 'ol/geom/Point';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import RegularShape from 'ol/style/RegularShape';
import { DEVICE_PIXEL_RATIO } from 'ol/has';

export default function op2022Style() {
  // eslint-disable-next-line consistent-return
  return function styleFunc(feature) {
    console.log(feature);

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const pixelRatio = DEVICE_PIXEL_RATIO;

    // let geom = feature.getGeometry().getType();
    const layer = feature.getId().substring(0, feature.getId().lastIndexOf('.'));
    const properties = feature.getProperties();

    let strokeColor;
    let strokeWidth;
    let fill;
    let stroke;
    let style;
    let pattern;

    function createPatternDot(ctxW, ctxH, arcFill) {
      canvas.width = ctxW;
      canvas.height = ctxH;

      context.fillStyle = arcFill;

      context.beginPath();
      // content.arc(x, y, radius, startAngle, endAngle [, anticlockwise]);
      // The arc is given x-coordinate, y-coordinate, radius. To make a full circle, the arc begins at an angle of 0 radians (0°), and ends at an angle of 2π radians (360°).
      context.arc(canvas.width * pixelRatio, canvas.height * pixelRatio, 2 * pixelRatio, 0, 2 * Math.PI);
      context.fill();
      return context.createPattern(canvas, 'repeat');
    }

    function createPatternGrid(ctxW, ctxH, strokestyle, linewidth) {
      canvas.width = ctxW * pixelRatio;
      canvas.height = ctxH * pixelRatio;
      // Set line width
      context.lineWidth = linewidth;
      // Set line color
      context.strokeStyle = strokestyle;
      context.lineCap = 'square';

      context.beginPath();

      context.rect(0, 0, canvas.width, canvas.height);
      context.stroke();

      return context.createPattern(canvas, 'repeat');
    }

    function createPatternGrid45deg(ctxW, ctxH, strokestyle, linewidth) {
      canvas.width = ctxW * pixelRatio;
      canvas.height = ctxH * pixelRatio;
      // Set line width
      context.lineWidth = linewidth;
      // Set line color
      context.strokeStyle = strokestyle;
      context.lineCap = 'miter';
      context.lineJoin = 'miter';

      // First path
      context.beginPath();
      context.moveTo(0, canvas.height);
      context.lineTo(canvas.width, 0);
      context.stroke();

      // Second path
      context.beginPath();
      context.moveTo(canvas.width, canvas.width);
      context.lineTo(0, 0);
      context.stroke();

      return context.createPattern(canvas, 'repeat');
    }

    function createPatternStroke0deg(ctxW, ctxH, strokestyle, linewidth) {
      canvas.width = ctxW * pixelRatio;
      canvas.height = ctxH * pixelRatio;
      // Set line width
      context.lineWidth = linewidth;
      // Set line color
      context.strokeStyle = strokestyle;
      context.lineCap = 'miter';
      context.lineJoin = 'miter';
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(0, canvas.height);
      context.stroke();
      return context.createPattern(canvas, 'repeat');
    }

    function createPatternStroke45deg(ctxW, ctxH, strokestyle, linewidth) {
      canvas.width = ctxW * pixelRatio;
      canvas.height = ctxH * pixelRatio;
      // Set line width
      context.lineWidth = linewidth;
      // Set line color
      context.strokeStyle = strokestyle;
      context.lineCap = 'miter';
      context.lineJoin = 'miter';
      context.beginPath();
      context.moveTo(0, canvas.height);
      context.lineTo(canvas.width, 0);
      context.stroke();
      return context.createPattern(canvas, 'repeat');
    }

    function createPatternStroke315deg(ctxW, ctxH, strokestyle, linewidth) {
      canvas.width = ctxW * pixelRatio;
      canvas.height = ctxH * pixelRatio;
      // Set line width
      context.lineWidth = linewidth;
      // Set line color
      context.strokeStyle = strokestyle;
      context.lineCap = 'miter';
      context.lineJoin = 'miter';
      context.beginPath();
      context.moveTo(canvas.width, canvas.width);
      context.lineTo(0, 0);
      context.stroke();
      return context.createPattern(canvas, 'repeat');
    }

    // function createPatternCross(ctxW, ctxH, strokestyle, linewidth) {
    //   canvas.width = ctxW * pixelRatio;
    //   canvas.height = ctxH * pixelRatio;
    //   // Set line width
    //   context.lineWidth = linewidth;
    //   // Set line color
    //   context.strokeStyle = strokestyle;
    //   context.beginPath();

    //   context.moveTo(0, 4 * pixelRatio);
    //   context.lineTo(8 * pixelRatio, 4 * pixelRatio);

    //   context.moveTo(4 * pixelRatio, 0);
    //   context.lineTo(4 * pixelRatio, 8 * pixelRatio);

    //   context.stroke();

    //   return context.createPattern(canvas, 'repeat');
    // }

    /* op2022_ui_kommunikationslinjer_l__vag_enpil */
    if (layer === 'op2022_ui_kommunikationslinjer_l' && properties.sig_typ === 'Kommunikationslänk väg' && properties.beteckning === 'E4.65') {
      const styleFunction = () => {
        const arrowStrokeColor = 'rgba(121,121,121,1)';
        const arrowFillColor = 'rgba(121,121,121,1)';
        const arrowStroke = new Stroke({ color: arrowStrokeColor, width: 4 });
        const arrowFill = new Fill({ color: arrowFillColor });

        const styles = [

          new Style({
            stroke: new Stroke({
              color: arrowStrokeColor,
              width: 6
            })
          }),
          new Style({
            stroke: new Stroke({
              color: arrowFillColor,
              width: 4
            })
          })
        ];

        /* Arrow end of line */
        const lastLine = feature.getGeometry().getCoordinates()[feature.getGeometry().getCoordinates().length - 1];
        const lastPoint = lastLine.slice(-1)[0];
        const secondLast = lastLine.slice(-2)[0];

        const dx = lastPoint[0] - secondLast[0];
        const dy = lastPoint[1] - secondLast[1];
        const rotation = Math.atan2(dy, dx);

        styles.push(new Style({
          geometry: new Point(lastPoint),
          image: new RegularShape({
            fill: arrowFill,
            stroke: arrowStroke,
            points: 3,
            radius: 8,
            rotation: -rotation,
            angle: Math.PI / 2 // rotate 90°
          })
        }));

        return styles;
      };

      style = styleFunction(feature);

      return style;
    }

    if (layer === 'op2022_ui_kommunikationslinjer_l' && properties.sig_typ === 'Kommunikationslänk väg' && properties.beteckning !== 'E4.65') {
      const styleFunction = () => {
        const arrowStrokeColor = 'rgba(121,121,121,1)';
        const arrowFillColor = 'rgba(121,121,121,1)';
        const arrowStroke = new Stroke({ color: arrowStrokeColor, width: 4 });
        const arrowFill = new Fill({ color: arrowFillColor });

        const styles = [

          new Style({
            stroke: new Stroke({
              color: arrowStrokeColor,
              width: 6
            })
          }),
          new Style({
            stroke: new Stroke({
              color: arrowFillColor,
              width: 4
            })
          })
        ];

        /* Arrow end of line */
        const lastLine = feature.getGeometry().getCoordinates()[feature.getGeometry().getCoordinates().length - 1];
        const lastPoint = lastLine.slice(-1)[0];
        const secondLast = lastLine.slice(-2)[0];

        const dx = lastPoint[0] - secondLast[0];
        const dy = lastPoint[1] - secondLast[1];
        let rotation = Math.atan2(dy, dx);

        styles.push(new Style({
          geometry: new Point(lastPoint),
          image: new RegularShape({
            fill: arrowFill,
            stroke: arrowStroke,
            points: 3,
            radius: 8,
            rotation: -rotation,
            angle: Math.PI / 2 // rotate 90°
          })
        }));

        /* Arrow start of line */
        const firstLine = feature.getGeometry().getCoordinates()[0];
        const firstPoint = firstLine[0];
        const secondPoint = firstLine[1];

        const dx2 = firstPoint[0] - secondPoint[0];
        const dy2 = firstPoint[1] - secondPoint[1];
        rotation = Math.atan2(dy2, dx2);
        //
        styles.push(new Style({
          geometry: new Point(firstPoint),
          image: new RegularShape({
            fill: arrowFill,
            stroke: arrowStroke,
            points: 3,
            radius: 8,
            rotation: -rotation,
            angle: Math.PI / 2 // rotate 90°
          })
        }));

        return styles;
      };

      style = styleFunction(feature);

      return style;
    }

    if (layer === 'op2022_ui_kommunikationslinjer_l' && properties.sig_typ === 'Kommunikationslänk spår') {
      const styleFunction = () => {
        const arrowStrokeColor = 'rgba(111,111,111,1)';
        const arrowFillColor = 'rgba(111,111,111,1)';
        const arrowStroke = new Stroke({ color: arrowStrokeColor, width: 4 });
        const arrowFill = new Fill({ color: arrowFillColor });

        const styles = [

          new Style({
            stroke: new Stroke({
              color: arrowStrokeColor,
              width: 6,
              lineDash: [
                5,
                10
              ]
            })
          })
        ];

        /* Arrow end of line */
        const lastLine = feature.getGeometry().getCoordinates()[feature.getGeometry().getCoordinates().length - 1];
        const lastPoint = lastLine.slice(-1)[0];
        const secondLast = lastLine.slice(-2)[0];

        const dx = lastPoint[0] - secondLast[0];
        const dy = lastPoint[1] - secondLast[1];
        let rotation = Math.atan2(dy, dx);

        styles.push(new Style({
          geometry: new Point(lastPoint),
          image: new RegularShape({
            fill: arrowFill,
            stroke: arrowStroke,
            points: 3,
            radius: 8,
            rotation: -rotation,
            angle: Math.PI / 2 // rotate 90°
          })
        }));

        /* Arrow start of line */
        const firstLine = feature.getGeometry().getCoordinates()[0];
        const firstPoint = firstLine[0];
        const secondPoint = firstLine[1];

        const dx2 = firstPoint[0] - secondPoint[0];
        const dy2 = firstPoint[1] - secondPoint[1];
        rotation = Math.atan2(dy2, dx2);
        //
        styles.push(new Style({
          geometry: new Point(firstPoint),
          image: new RegularShape({
            fill: arrowFill,
            stroke: arrowStroke,
            points: 3,
            radius: 8,
            rotation: -rotation,
            angle: Math.PI / 2 // rotate 90°
          })
        }));

        return styles;
      };

      style = styleFunction(feature);

      return style;
    }
    if (layer === 'op2022_ui_kommunikationslinjer_l' && properties.sig_typ === 'Kommunikationslänk spår - föreslagen') {
      const styleFunction = () => {
        const arrowStrokeColor = 'rgba(197,197,197,1)';
        const arrowFillColor = 'rgba(197,197,197,1)';
        const arrowStroke = new Stroke({ color: arrowStrokeColor, width: 4 });
        const arrowFill = new Fill({ color: arrowFillColor });

        const styles = [

          new Style({
            stroke: new Stroke({
              color: arrowStrokeColor,
              width: 6,
              lineDash: [
                5,
                10
              ]
            })
          })
        ];

        /* Arrow end of line */
        const lastLine = feature.getGeometry().getCoordinates()[feature.getGeometry().getCoordinates().length - 1];
        const lastPoint = lastLine.slice(-1)[0];
        const secondLast = lastLine.slice(-2)[0];

        const dx = lastPoint[0] - secondLast[0];
        const dy = lastPoint[1] - secondLast[1];
        const rotation = Math.atan2(dy, dx);

        styles.push(new Style({
          geometry: new Point(lastPoint),
          image: new RegularShape({
            fill: arrowFill,
            stroke: arrowStroke,
            points: 3,
            radius: 8,
            rotation: -rotation,
            angle: Math.PI / 2 // rotate 90°
          })
        }));

        /* Arrow start of line */
        // var firstLine = feature.getGeometry().getCoordinates()[0];
        // var firstPoint = firstLine[0]
        // var secondPoint = firstLine[1]
        //
        // var dx2 = firstPoint[0] - secondPoint[0];
        // var dy2 = firstPoint[1] - secondPoint[1];
        // var rotation = Math.atan2(dy2, dx2);
        // //
        // styles.push(new Style({
        //   geometry: new Point(firstPoint),
        //   image: new RegularShape({
        //     fill: arrowFill,
        //     stroke: arrowStroke,
        //     points: 3,
        //     radius: 8,
        //     rotation: -rotation,
        //     angle: Math.PI / 2 // rotate 90°
        //   })
        // }));

        return styles;
      };

      style = styleFunction(feature);

      return style;
    }

    if (layer === 'op2022_ui_natur_friluftslivslinjer_l' && properties.bestammelsekod === 'OP_UT_NAT_ViktigtSamband') {
      const styleFunction = () => {
        const arrowStrokeColor = 'rgba(90,115,92,1)';
        const arrowFillColor = 'rgba(139,176,141,1)';
        const arrowStroke = new Stroke({ color: arrowStrokeColor, width: 2 });
        const arrowFill = new Fill({ color: arrowFillColor });

        const styles = [

          new Style({
            stroke: new Stroke({
              color: arrowStrokeColor,
              width: 8
            })
          }),
          new Style({
            stroke: new Stroke({
              color: arrowFillColor,
              width: 6
            })
          })
        ];

        /* Arrow end of line */
        const lastLine = feature.getGeometry().getCoordinates()[feature.getGeometry().getCoordinates().length - 1];
        const lastPoint = lastLine.slice(-1)[0];
        const secondLast = lastLine.slice(-2)[0];

        const dx = lastPoint[0] - secondLast[0];
        const dy = lastPoint[1] - secondLast[1];
        let rotation = Math.atan2(dy, dx);

        styles.push(new Style({
          geometry: new Point(lastPoint),
          image: new RegularShape({
            fill: arrowFill,
            stroke: arrowStroke,
            points: 3,
            radius: 10,
            rotation: -rotation,
            angle: Math.PI / 2 // rotate 90°
          })
        }));

        /* Arrow start of line */
        const firstLine = feature.getGeometry().getCoordinates()[0];
        const firstPoint = firstLine[0];
        const secondPoint = firstLine[1];

        const dx2 = firstPoint[0] - secondPoint[0];
        const dy2 = firstPoint[1] - secondPoint[1];
        rotation = Math.atan2(dy2, dx2);
        //
        styles.push(new Style({
          geometry: new Point(firstPoint),
          image: new RegularShape({
            fill: arrowFill,
            stroke: arrowStroke,
            points: 3,
            radius: 10,
            rotation: -rotation,
            angle: Math.PI / 2 // rotate 90°
          })
        }));
        return styles;
      };

      style = styleFunction(feature);

      return style;
    }

    if (layer === 'op2022_mak_mangfunktionell_bebyggelse_y_planerad') {
      // Pattern style
      const patWidth = 12;
      const patHeight = 12;
      const patLineColor = 'rgba(245,168,140,1)';
      const patLineWidth = 2;
      // Outline style
      const patOutlineColor = 'rgba(245,168,140,1)';
      const patOutlineWidth = 3;

      pattern = createPatternStroke45deg(patWidth, patHeight, patLineColor, patLineWidth);

      fill = new Fill({
        color: pattern
      });
      stroke = new Stroke({
        color: patOutlineColor,
        width: patOutlineWidth,
        lineCap: 'square',
        lineJoin: 'square'
      });

      style = new Style({
        fill,
        stroke
      });
      return style;
    }

    if (layer === 'op2022_mak_sammanhangande_bostadsbebyggelse_y_planerad') {
      // Pattern style
      const patWidth = 12;
      const patHeight = 12;
      const patLineColor = 'rgba(251,213,116,1)';
      const patLineWidth = 2;
      // Outline style
      const patOutlineColor = 'rgba(251,213,116,1)';
      const patOutlineWidth = 3;

      pattern = createPatternStroke45deg(patWidth, patHeight, patLineColor, patLineWidth);

      fill = new Fill({
        color: pattern
      });
      stroke = new Stroke({
        color: patOutlineColor,
        width: patOutlineWidth,
        lineCap: 'square',
        lineJoin: 'square'
      });

      style = new Style({
        fill,
        stroke
      });
      return style;
    }
    if (layer === 'op2022_mak_verksamheter_industri_y_planerad') {
      // Pattern style
      const patWidth = 12;
      const patHeight = 12;
      const patLineColor = 'rgba(203,190,162,1)';
      const patLineWidth = 2;
      // Outline style
      const patOutlineColor = 'rgba(203,190,162,1)';
      const patOutlineWidth = 3;

      pattern = createPatternStroke45deg(patWidth, patHeight, patLineColor, patLineWidth);

      fill = new Fill({
        color: pattern
      });
      stroke = new Stroke({
        color: patOutlineColor,
        width: patOutlineWidth,
        lineCap: 'square',
        lineJoin: 'square'
      });

      style = new Style({
        fill,
        stroke
      });
      return style;
    }

    if (layer === 'op2022_mak_verksamheter_industri_y') {
      // Pattern style
      const patWidth = 12;
      const patHeight = 12;
      const patLineColor = 'rgba(0,0,0,1)';
      const patLineWidth = 1;
      // Outline style
      const patOutlineColor = 'rgba(0,0,0,1)';
      const patOutlineWidth = 1;

      switch (properties.bestammelsekod) {
        case 'OP_MVA_VI_A':

          pattern = createPatternGrid(patWidth, patHeight, patLineColor, patLineWidth);

          fill = new Fill({
            color: pattern
          });
          stroke = new Stroke({
            color: patOutlineColor,
            width: patOutlineWidth,
            lineCap: 'square',
            lineJoin: 'square'
          });

          style = new Style({
            fill,
            stroke
          });
          return style;
        case 'OP_MVA_VI':
          // Style
          strokeColor = 'rgba(69,69,69,0)';
          strokeWidth = 1.5;
          fill = 'rgba(203,190,162,0.6)';

          fill = new Fill({
            color: fill
          });
          stroke = new Stroke({
            color: strokeColor,
            width: strokeWidth
          });

          style = new Style({
            fill,
            stroke
          });
          return style;
        case 'OP_MVA_VI_Besoksanlaggning':
          // Style
          strokeColor = 'rgba(69,69,69,0)';
          strokeWidth = 1.5;
          fill = 'rgba(183,173,218,0.8)';

          fill = new Fill({
            color: fill
          });
          stroke = new Stroke({
            color: strokeColor,
            width: strokeWidth
          });

          style = new Style({
            fill,
            stroke
          });
          return style;
        default:
          // code block
      }
    }

    if (layer === 'op2022_mak_natur_friluftsliv_y') {
      // Pattern style
      const patWidth = 8;
      const patHeight = 8;
      const patArcFill = 'rgba(55,126,184,1)';

      // Outline style
      const patOutlineColor = 'rgba(55,126,184,1)';
      const patOutlineWidth = 2;
      switch (properties.bestammelsekod) {
        case 'OP_MVA_NF_A':

          pattern = createPatternDot(patWidth, patHeight, patArcFill);

          fill = new Fill({
            color: pattern
          });
          stroke = new Stroke({
            color: patOutlineColor,
            width: patOutlineWidth,
            lineCap: 'square',
            lineJoin: 'square'
          });

          style = new Style({
            fill,
            stroke
          });
          return style;

        case 'OP_MVA_NF':
          // Style
          strokeColor = 'rgba(69,69,69,0)';
          strokeWidth = 1.5;
          fill = 'rgba(125,194,140,0.6)';

          fill = new Fill({
            color: fill
          });
          stroke = new Stroke({
            color: strokeColor,
            width: strokeWidth
          });

          style = new Style({
            fill,
            stroke
          });
          return style;

        default:
          // code block
      }
    }

    if (layer === 'op2022_tema_gi_friluftsliv_hoga_varden_y') {
      // Pattern style
      const patWidth = 16;
      const patHeight = 16;
      const patLineColor = 'rgba(21,118,79,1)';
      const patLineWidth = 2;
      // Outline style
      const patOutlineColor = 'rgba(21,118,79,1)';
      const patOutlineWidth = 3;

      pattern = createPatternStroke315deg(patWidth, patHeight, patLineColor, patLineWidth);

      fill = new Fill({
        color: pattern
      });
      stroke = new Stroke({
        color: patOutlineColor,
        width: patOutlineWidth,
        lineCap: 'square',
        lineJoin: 'square'
      });

      style = new Style({
        fill,
        stroke
      });
      return style;
    }

    if (layer === 'op2022_tema_km_kultur_narmiljo_y') {
      // Pattern style
      const patWidth = 12;
      const patHeight = 12;
      const patLineColor = 'rgba(74,20,20,1)';
      const patLineWidth = 2;
      // Outline style
      const patOutlineColor = 'rgba(74,20,20,1)';
      const patOutlineWidth = 2;

      pattern = createPatternStroke0deg(patWidth, patHeight, patLineColor, patLineWidth);

      fill = new Fill({
        color: pattern
      });
      stroke = new Stroke({
        color: patOutlineColor,
        width: patOutlineWidth,
        lineCap: 'square',
        lineJoin: 'square'
      });

      style = new Style({
        fill,
        stroke
      });
      return style;
    }

    if (layer === 'op2022_ri_lst_ri_rorligt_friluftsliv_mb4kap2_y') {
      // Pattern style
      const patWidth = 12;
      const patHeight = 12;
      const patLineColor = 'rgba(81,96,76,1)';
      const patLineWidth = 2;
      // Outline style
      const patOutlineColor = 'rgba(81,96,76,1)';
      const patOutlineWidth = 2;

      pattern = createPatternStroke0deg(patWidth, patHeight, patLineColor, patLineWidth);

      fill = new Fill({
        color: pattern
      });
      stroke = new Stroke({
        color: patOutlineColor,
        width: patOutlineWidth,
        lineCap: 'square',
        lineJoin: 'square'
      });

      style = new Style({
        fill,
        stroke
      });
      return style;
    }

    if (layer === 'op2022_ri_tv_paverkan_lagfartsflyg_y') {
      // Pattern style
      const patWidth = 14;
      const patHeight = 14;
      const patLineColor = 'rgba(105,90,90,0.5)';
      const patLineWidth = 2;
      // Outline style
      const patOutlineColor = 'rgba(105,90,90,0.5)';
      const patOutlineWidth = 8;

      pattern = createPatternStroke315deg(patWidth, patHeight, patLineColor, patLineWidth);

      fill = new Fill({
        color: pattern
      });
      stroke = new Stroke({
        color: patOutlineColor,
        width: patOutlineWidth,
        lineDash: [
          5,
          12
        ]
      });

      style = new Style({
        fill,
        stroke
      });
      return style;
    }

    if (layer === 'op2022_av_lstab_djurskyddsomraden_y') {
      // Pattern style
      const patWidth = 16;
      const patHeight = 16;
      const patLineColor = 'rgba(46,100,100,1)';
      const patLineWidth = 1;
      // Outline style
      const patOutlineColor = 'rgba(46,100,100,1)';
      const patOutlineWidth = 2;

      pattern = createPatternGrid45deg(patWidth, patHeight, patLineColor, patLineWidth);

      fill = new Fill({
        color: pattern
      });
      stroke = new Stroke({
        color: patOutlineColor,
        width: patOutlineWidth
      });

      style = new Style({
        fill,
        stroke
      });
      return style;
    }

    if (layer === 'op2022_av_nv_vattenskyddsomrade_y') {
      // Pattern style
      const patWidth = 12;
      const patHeight = 12;
      const patLineColor = 'rgba(133,120,82,1)';
      const patLineWidth = 1;
      // Outline style
      const patOutlineColor = 'rgba(133,120,82,1)';
      const patOutlineWidth = 2;

      pattern = createPatternStroke45deg(patWidth, patHeight, patLineColor, patLineWidth);

      fill = new Fill({
        color: pattern
      });
      stroke = new Stroke({
        color: patOutlineColor,
        width: patOutlineWidth,
        lineCap: 'square',
        lineJoin: 'square'
      });

      style = new Style({
        fill,
        stroke
      });
      return style;
    }

    if (layer === 'op2022_ri_jarnvag_befintlig_l') {
      // // Pattern style
      // const patWidth = 12;
      // const patHeight = 12;
      // const patLineColor = 'rgba(245,168,140,1)';
      // const patLineWidth = 2;
      // //Outline style
      // const patOutlineColor = 'rgba(245,168,140,1)';
      // const patOutlineWidth = 3;
      //
      // pattern = createPatternStroke45deg(patWidth,patHeight,patLineColor,patLineWidth);
      //
      // fill = new Fill({
      //   color: pattern
      // });
      // stroke = new Stroke({
      //   color: patOutlineColor,
      //   width: patOutlineWidth,
      //   lineCap: 'square',
      //   lineJoin: 'square'
      // });
      //
      // style = new Style({
      //   fill,
      //   stroke
      // });
      // return style;
    }
  };
}
