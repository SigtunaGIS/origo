import Circle from 'ol/style/Circle';
import Point from 'ol/geom/Point';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import getColor from '../getcolor';
import RegularShape from 'ol/style/RegularShape';
import {DEVICE_PIXEL_RATIO} from 'ol/has';

export default function op2022Style() {

  return function style(feature) {

    console.log(feature)

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const pixelRatio = DEVICE_PIXEL_RATIO;

    let geom = feature.getGeometry().getType();
    let layer = feature.getId().substring(0, feature.getId().lastIndexOf("."));
    let properties = feature.getProperties();

    let stroke_color;
    let stroke_width;
    let fill;
    let stroke;
    let style;
    let pattern;
    let rotation;

    function createPattern_dot(ctx_w,ctx_h,arc_fill){

      canvas.width = ctx_w;
      canvas.height = ctx_h;

      context.fillStyle = arc_fill;

      context.beginPath();
      // content.arc(x, y, radius, startAngle, endAngle [, anticlockwise]);
      //The arc is given x-coordinate, y-coordinate, radius. To make a full circle, the arc begins at an angle of 0 radians (0°), and ends at an angle of 2π radians (360°).
      context.arc(canvas.width * pixelRatio, canvas.height * pixelRatio, 2 * pixelRatio, 0, 2 * Math.PI);
      context.fill();
      return context.createPattern(canvas, 'repeat');
    }

    function createPattern_grid(ctx_w,ctx_h,strokestyle,linewidth){

      canvas.width = ctx_w * pixelRatio;
      canvas.height = ctx_h * pixelRatio;
      // Set line width
      context.lineWidth = linewidth;
      // Set line color
      context.strokeStyle = strokestyle;
      context.lineCap = "square";

      context.beginPath();

      context.rect(0, 0, canvas.width, canvas.height);
      context.stroke();

      return context.createPattern(canvas, 'repeat');

    }

    function createPattern_grid_45deg(ctx_w,ctx_h,strokestyle,linewidth){

      canvas.width = ctx_w * pixelRatio;
      canvas.height = ctx_h * pixelRatio;
      // Set line width
      context.lineWidth = linewidth;
      // Set line color
      context.strokeStyle = strokestyle;
      context.lineCap = "miter";
      context.lineJoin = "miter";

      // First path
      context.beginPath();
      context.moveTo(0, canvas.height);
      context.lineTo(canvas.width,0);
      context.stroke();

      // Second path
      context.beginPath();
      context.moveTo(canvas.width,canvas.width);
      context.lineTo(0,0);
      context.stroke();

      return context.createPattern(canvas, 'repeat');

    }

    function createPattern_stroke_0deg(ctx_w,ctx_h,strokestyle,linewidth){

      canvas.width = ctx_w * pixelRatio;
      canvas.height = ctx_h * pixelRatio;
      // Set line width
      context.lineWidth = linewidth;
      // Set line color
      context.strokeStyle = strokestyle;
      context.lineCap = "miter";
      context.lineJoin = "miter";
      context.beginPath();
      context.moveTo(0,0);
      context.lineTo(0,canvas.height);
      context.stroke();
      return context.createPattern(canvas, 'repeat');
    }

    function createPattern_stroke_45deg(ctx_w,ctx_h,strokestyle,linewidth){

      canvas.width = ctx_w * pixelRatio;
      canvas.height = ctx_h * pixelRatio;
      // Set line width
      context.lineWidth = linewidth;
      // Set line color
      context.strokeStyle = strokestyle;
      context.lineCap = "miter";
      context.lineJoin = "miter";
      context.beginPath();
      context.moveTo(0, canvas.height);
      context.lineTo(canvas.width,0);
      context.stroke();
      return context.createPattern(canvas, 'repeat');
    }

    function createPattern_stroke_315deg(ctx_w,ctx_h,strokestyle,linewidth){

      canvas.width = ctx_w * pixelRatio;
      canvas.height = ctx_h * pixelRatio;
      // Set line width
      context.lineWidth = linewidth;
      // Set line color
      context.strokeStyle = strokestyle;
      context.lineCap = "miter";
      context.lineJoin = "miter";
      context.beginPath();
      context.moveTo(canvas.width,canvas.width);
      context.lineTo(0,0);
      context.stroke();
      return context.createPattern(canvas, 'repeat');
    }

    function createPattern_cross(ctx_w,ctx_h,strokestyle,linewidth){

      canvas.width = ctx_w * pixelRatio;
      canvas.height = ctx_h * pixelRatio;
      // Set line width
      context.lineWidth = linewidth;
      // Set line color
      context.strokeStyle = strokestyle;
      context.beginPath();

      context.moveTo(0, 4 * pixelRatio);
      context.lineTo(8 * pixelRatio, 4 * pixelRatio);

      context.moveTo(4 * pixelRatio, 0);
      context.lineTo(4 * pixelRatio, 8 * pixelRatio);

      context.stroke();

      return context.createPattern(canvas, 'repeat');
    }


    /* op2022_ui_kommunikationslinjer_l__vag_enpil */
    if (layer == 'op2022_ui_kommunikationslinjer_l' && properties.sig_typ == 'Kommunikationslänk väg' && properties.beteckning =='E4.65') {
      var styleFunction = function(feature) {

        const arrow_stroke_color = 'rgba(121,121,121,1)'
        const arrow_fill_color = 'rgba(121,121,121,1)'
        const arrow_stroke = new Stroke({color: arrow_stroke_color, width: 4});
        const arrow_fill = new Fill({color: arrow_fill_color});

              var styles = [

                new Style({
                  stroke: new Stroke({
                    color: arrow_stroke_color,
                    width: 6
                  })
                }),
                new Style({
                  stroke: new Stroke({
                    color: arrow_fill_color,
                    width: 4
                  })
                })
              ]

              /* Arrow end of line */
              var lastLine = feature.getGeometry().getCoordinates()[feature.getGeometry().getCoordinates().length - 1];
              var lastPoint = lastLine.slice(-1)[0]
              var secondLast = lastLine.slice(-2)[0]

              var dx = lastPoint[0] - secondLast[0];
              var dy = lastPoint[1] - secondLast[1];
              var rotation = Math.atan2(dy, dx);

              styles.push(new Style({
                geometry: new Point(lastPoint),
                image: new RegularShape({
                  fill: arrow_fill,
                  stroke: arrow_stroke,
                  points: 3,
                  radius: 8,
                  rotation: -rotation,
                  angle: Math.PI / 2 // rotate 90°
                })
              }));

              return styles;

            };

            style = styleFunction(feature)

            return style;
    }

    if (layer == 'op2022_ui_kommunikationslinjer_l' && properties.sig_typ == 'Kommunikationslänk väg' && properties.beteckning !='E4.65') {

      var styleFunction = function(feature) {

        const arrow_stroke_color = 'rgba(121,121,121,1)'
        const arrow_fill_color = 'rgba(121,121,121,1)'
        const arrow_stroke = new Stroke({color: arrow_stroke_color, width: 4});
        const arrow_fill = new Fill({color: arrow_fill_color});

              var styles = [

                new Style({
                  stroke: new Stroke({
                    color: arrow_stroke_color,
                    width: 6
                  })
                }),
                new Style({
                  stroke: new Stroke({
                    color: arrow_fill_color,
                    width: 4
                  })
                })
              ]

              /* Arrow end of line */
              var lastLine = feature.getGeometry().getCoordinates()[feature.getGeometry().getCoordinates().length - 1];
              var lastPoint = lastLine.slice(-1)[0]
              var secondLast = lastLine.slice(-2)[0]

              var dx = lastPoint[0] - secondLast[0];
              var dy = lastPoint[1] - secondLast[1];
              var rotation = Math.atan2(dy, dx);

              styles.push(new Style({
                geometry: new Point(lastPoint),
                image: new RegularShape({
                  fill: arrow_fill,
                  stroke: arrow_stroke,
                  points: 3,
                  radius: 8,
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
                  fill: arrow_fill,
                  stroke: arrow_stroke,
                  points: 3,
                  radius: 8,
                  rotation: -rotation,
                  angle: Math.PI / 2 // rotate 90°
                })
              }));

              return styles;

            };

            style = styleFunction(feature)

            return style;
    };

    if (layer == 'op2022_ui_kommunikationslinjer_l' && properties.sig_typ == 'Kommunikationslänk spår') {

      var styleFunction = function(feature) {

        const arrow_stroke_color = 'rgba(111,111,111,1)'
        const arrow_fill_color = 'rgba(111,111,111,1)'
        const arrow_stroke = new Stroke({color: arrow_stroke_color, width: 4});
        const arrow_fill = new Fill({color: arrow_fill_color});


        var styles = [

          new Style({
            stroke: new Stroke({
              color: arrow_stroke_color,
              width: 6,
              lineDash: [
                5,
                10
              ]
            })
          })
        ]

        /* Arrow end of line */
        var lastLine = feature.getGeometry().getCoordinates()[feature.getGeometry().getCoordinates().length - 1];
        var lastPoint = lastLine.slice(-1)[0]
        var secondLast = lastLine.slice(-2)[0]

        var dx = lastPoint[0] - secondLast[0];
        var dy = lastPoint[1] - secondLast[1];
        var rotation = Math.atan2(dy, dx);

        styles.push(new Style({
          geometry: new Point(lastPoint),
          image: new RegularShape({
            fill: arrow_fill,
            stroke: arrow_stroke,
            points: 3,
            radius: 8,
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
            fill: arrow_fill,
            stroke: arrow_stroke,
            points: 3,
            radius: 8,
            rotation: -rotation,
            angle: Math.PI / 2 // rotate 90°
          })
        }));

        return styles;

      };

      style = styleFunction(feature)

      return style;
    };
    if (layer == 'op2022_ui_kommunikationslinjer_l' && properties.sig_typ == 'Kommunikationslänk spår - föreslagen') {

      var styleFunction = function(feature) {

        const arrow_stroke_color = 'rgba(197,197,197,1)'
        const arrow_fill_color = 'rgba(197,197,197,1)'
        const arrow_stroke = new Stroke({color: arrow_stroke_color, width: 4});
        const arrow_fill = new Fill({color: arrow_fill_color});


        var styles = [

          new Style({
            stroke: new Stroke({
              color: arrow_stroke_color,
              width: 6,
              lineDash: [
                5,
                10
              ]
            })
          })
        ]

        /* Arrow end of line */
        var lastLine = feature.getGeometry().getCoordinates()[feature.getGeometry().getCoordinates().length - 1];
        var lastPoint = lastLine.slice(-1)[0]
        var secondLast = lastLine.slice(-2)[0]

        var dx = lastPoint[0] - secondLast[0];
        var dy = lastPoint[1] - secondLast[1];
        var rotation = Math.atan2(dy, dx);

        styles.push(new Style({
          geometry: new Point(lastPoint),
          image: new RegularShape({
            fill: arrow_fill,
            stroke: arrow_stroke,
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
        //     fill: arrow_fill,
        //     stroke: arrow_stroke,
        //     points: 3,
        //     radius: 8,
        //     rotation: -rotation,
        //     angle: Math.PI / 2 // rotate 90°
        //   })
        // }));

        return styles;

      };

      style = styleFunction(feature)

      return style;
    };

    if (layer == 'op2022_ui_natur_friluftslivslinjer_l' && properties.bestammelsekod == 'OP_UT_NAT_ViktigtSamband') {

      var styleFunction = function(feature) {

        const arrow_stroke_color = 'rgba(90,115,92,1)'
        const arrow_fill_color = 'rgba(139,176,141,1)'
        const arrow_stroke = new Stroke({color: arrow_stroke_color, width: 2});
        const arrow_fill = new Fill({color: arrow_fill_color});

              var styles = [

                new Style({
                  stroke: new Stroke({
                    color: arrow_stroke_color,
                    width: 8
                  })
                }),
                new Style({
                  stroke: new Stroke({
                    color: arrow_fill_color,
                    width: 6
                  })
                })
              ]

              /* Arrow end of line */
              var lastLine = feature.getGeometry().getCoordinates()[feature.getGeometry().getCoordinates().length - 1];
              var lastPoint = lastLine.slice(-1)[0]
              var secondLast = lastLine.slice(-2)[0]

              var dx = lastPoint[0] - secondLast[0];
              var dy = lastPoint[1] - secondLast[1];
              var rotation = Math.atan2(dy, dx);

              styles.push(new Style({
                geometry: new Point(lastPoint),
                image: new RegularShape({
                  fill: arrow_fill,
                  stroke: arrow_stroke,
                  points: 3,
                  radius: 10,
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
                  fill: arrow_fill,
                  stroke: arrow_stroke,
                  points: 3,
                  radius: 10,
                  rotation: -rotation,
                  angle: Math.PI / 2 // rotate 90°
                })
              }));

              return styles;

            };

            style = styleFunction(feature)

            return style;
    };

    if(layer == 'op2022_mak_mangfunktionell_bebyggelse_y_planerad'){

      // Pattern style
      const pat_width = 12;
      const pat_height = 12;
      const pat_line_color = 'rgba(245,168,140,1)';
      const pat_line_width = 2;
      //Outline style
      const pat_outline_color = 'rgba(245,168,140,1)';
      const pat_outline_width = 3;

      pattern = createPattern_stroke_45deg(pat_width,pat_height,pat_line_color,pat_line_width);

      fill = new Fill({
        color: pattern
      });
      stroke = new Stroke({
        color: pat_outline_color,
        width: pat_outline_width,
        lineCap: 'square',
        lineJoin: 'square'
      });

      style = new Style({
        fill,
        stroke
      });
      return style;
    }

    if(layer == 'op2022_mak_sammanhangande_bostadsbebyggelse_y_planerad'){

      // Pattern style
      const pat_width = 12;
      const pat_height = 12;
      const pat_line_color = 'rgba(251,213,116,1)';
      const pat_line_width = 2;
      //Outline style
      const pat_outline_color = 'rgba(251,213,116,1)';
      const pat_outline_width = 3;

      pattern = createPattern_stroke_45deg(pat_width,pat_height,pat_line_color,pat_line_width);

      fill = new Fill({
        color: pattern
      });
      stroke = new Stroke({
        color: pat_outline_color,
        width: pat_outline_width,
        lineCap: 'square',
        lineJoin: 'square'
      });

      style = new Style({
        fill,
        stroke
      });
      return style;
    }
    if(layer == 'op2022_mak_verksamheter_industri_y_planerad'){

      // Pattern style
      const pat_width = 12;
      const pat_height = 12;
      const pat_line_color = 'rgba(203,190,162,1)';
      const pat_line_width = 2;
      //Outline style
      const pat_outline_color = 'rgba(203,190,162,1)';
      const pat_outline_width = 3;

      pattern = createPattern_stroke_45deg(pat_width,pat_height,pat_line_color,pat_line_width);

      fill = new Fill({
        color: pattern
      });
      stroke = new Stroke({
        color: pat_outline_color,
        width: pat_outline_width,
        lineCap: 'square',
        lineJoin: 'square'
      });

      style = new Style({
        fill,
        stroke
      });
      return style;
    }

    if(layer == 'op2022_mak_verksamheter_industri_y'){

      switch(properties.bestammelsekod) {
        case 'OP_MVA_VI_A':
          // Pattern style
          const pat_width = 12;
          const pat_height = 12;
          const pat_line_color = 'rgba(0,0,0,1)';
          const pat_line_width = 1;
          //Outline style
          const pat_outline_color = 'rgba(0,0,0,1)';
          const pat_outline_width = 1;

          pattern = createPattern_grid(pat_width,pat_height,pat_line_color,pat_line_width);

          fill = new Fill({
            color: pattern
          });
          stroke = new Stroke({
            color: pat_outline_color,
            width: pat_outline_width,
            lineCap: 'square',
            lineJoin: 'square'
          });

          style = new Style({
            fill,
            stroke
          });
          return style;
          break;
        case 'OP_MVA_VI':
          //Style
          stroke_color = 'rgba(69,69,69,0)';
          stroke_width = 1.5;
          fill = 'rgba(203,190,162,0.6)';


          fill = new Fill({
            color: fill
          });
          stroke = new Stroke({
            color: stroke_color,
            width: stroke_width,
          });

          style = new Style({
            fill,
            stroke
          });
          return style;
          break;
        case 'OP_MVA_VI_Besoksanlaggning':
          //Style
          stroke_color = 'rgba(69,69,69,0)';
          stroke_width = 1.5;
          fill = 'rgba(183,173,218,0.8)';


          fill = new Fill({
            color: fill
          });
          stroke = new Stroke({
            color: stroke_color,
            width: stroke_width,
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

    if(layer == 'op2022_mak_natur_friluftsliv_y'){

      switch(properties.bestammelsekod) {
        case 'OP_MVA_NF_A':
          // Pattern style
          const pat_width = 8;
          const pat_height = 8;
          const pat_arc_fill = 'rgba(55,126,184,1)';

          //Outline style
          const pat_outline_color = 'rgba(55,126,184,1)';
          const pat_outline_width = 2;

          pattern = createPattern_dot(pat_width,pat_height,pat_arc_fill);

          fill = new Fill({
            color: pattern
          });
          stroke = new Stroke({
            color: pat_outline_color,
            width: pat_outline_width,
            lineCap: 'square',
            lineJoin: 'square'
          });

          style = new Style({
            fill,
            stroke
          });
          return style;
          break;

        case 'OP_MVA_NF':
          //Style
          stroke_color = 'rgba(69,69,69,0)';
          stroke_width = 1.5;
          fill = 'rgba(125,194,140,0.6)';


          fill = new Fill({
            color: fill
          });
          stroke = new Stroke({
            color: stroke_color,
            width: stroke_width,
          });

          style = new Style({
            fill,
            stroke
          });
          return style;

          break;

        default:
          // code block
      }

    }

    if(layer == 'op2022_tema_gi_friluftsliv_hoga_varden_y'){

      // Pattern style
      const pat_width = 16;
      const pat_height = 16;
      const pat_line_color = 'rgba(21,118,79,1)';
      const pat_line_width = 2;
      //Outline style
      const pat_outline_color = 'rgba(21,118,79,1)';
      const pat_outline_width = 3;

      pattern = createPattern_stroke_315deg(pat_width,pat_height,pat_line_color,pat_line_width);

      fill = new Fill({
        color: pattern
      });
      stroke = new Stroke({
        color: pat_outline_color,
        width: pat_outline_width,
        lineCap: 'square',
        lineJoin: 'square'
      });

      style = new Style({
        fill,
        stroke
      });
      return style;

    }

    if(layer == 'op2022_tema_km_kultur_narmiljo_y'){
      // Pattern style
      const pat_width = 12;
      const pat_height = 12;
      const pat_line_color = 'rgba(74,20,20,1)';
      const pat_line_width = 2;
      //Outline style
      const pat_outline_color = 'rgba(74,20,20,1)';
      const pat_outline_width = 2;

      pattern = createPattern_stroke_0deg(pat_width,pat_height,pat_line_color,pat_line_width);

      fill = new Fill({
        color: pattern
      });
      stroke = new Stroke({
        color: pat_outline_color,
        width: pat_outline_width,
        lineCap: 'square',
        lineJoin: 'square'
      });

      style = new Style({
        fill,
        stroke
      });
      return style;
    }

    if(layer == 'op2022_ri_lst_ri_rorligt_friluftsliv_mb4kap2_y'){
      // Pattern style
      const pat_width = 12;
      const pat_height = 12;
      const pat_line_color = 'rgba(81,96,76,1)';
      const pat_line_width = 2;
      //Outline style
      const pat_outline_color = 'rgba(81,96,76,1)';
      const pat_outline_width = 2;

      pattern = createPattern_stroke_0deg(pat_width,pat_height,pat_line_color,pat_line_width);

      fill = new Fill({
        color: pattern
      });
      stroke = new Stroke({
        color: pat_outline_color,
        width: pat_outline_width,
        lineCap: 'square',
        lineJoin: 'square'
      });

      style = new Style({
        fill,
        stroke
      });
      return style;
    }

    if(layer == 'op2022_ri_tv_paverkan_lagfartsflyg_y'){
      // Pattern style
      const pat_width = 14;
      const pat_height = 14;
      const pat_line_color = 'rgba(105,90,90,0.5)';
      const pat_line_width = 2;
      //Outline style
      const pat_outline_color = 'rgba(105,90,90,0.5)';
      const pat_outline_width = 8;

      pattern = createPattern_stroke_315deg(pat_width,pat_height,pat_line_color,pat_line_width);

      fill = new Fill({
        color: pattern
      });
      stroke = new Stroke({
        color: pat_outline_color,
        width: pat_outline_width,
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

    if(layer == 'op2022_av_lstab_djurskyddsomraden_y'){

      // Pattern style
      const pat_width = 16;
      const pat_height = 16;
      const pat_line_color = 'rgba(46,100,100,1)';
      const pat_line_width = 1;
      //Outline style
      const pat_outline_color = 'rgba(46,100,100,1)';
      const pat_outline_width = 2;

      pattern = createPattern_grid_45deg(pat_width,pat_height,pat_line_color,pat_line_width);

      fill = new Fill({
        color: pattern
      });
      stroke = new Stroke({
        color: pat_outline_color,
        width: pat_outline_width,
      });

      style = new Style({
        fill,
        stroke
      });
      return style;

    }

    if(layer == 'op2022_av_nv_vattenskyddsomrade_y'){
      // Pattern style
      const pat_width = 12;
      const pat_height = 12;
      const pat_line_color = 'rgba(133,120,82,1)';
      const pat_line_width = 1;
      //Outline style
      const pat_outline_color = 'rgba(133,120,82,1)';
      const pat_outline_width = 2;

      pattern = createPattern_stroke_45deg(pat_width,pat_height,pat_line_color,pat_line_width);

      fill = new Fill({
        color: pattern
      });
      stroke = new Stroke({
        color: pat_outline_color,
        width: pat_outline_width,
        lineCap: 'square',
        lineJoin: 'square'
      });

      style = new Style({
        fill,
        stroke
      });
      return style;
    }

    if(layer == 'op2022_ri_jarnvag_befintlig_l'){
      // // Pattern style
      // const pat_width = 12;
      // const pat_height = 12;
      // const pat_line_color = 'rgba(245,168,140,1)';
      // const pat_line_width = 2;
      // //Outline style
      // const pat_outline_color = 'rgba(245,168,140,1)';
      // const pat_outline_width = 3;
      //
      // pattern = createPattern_stroke_45deg(pat_width,pat_height,pat_line_color,pat_line_width);
      //
      // fill = new Fill({
      //   color: pattern
      // });
      // stroke = new Stroke({
      //   color: pat_outline_color,
      //   width: pat_outline_width,
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
}
}
