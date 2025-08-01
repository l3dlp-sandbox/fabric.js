import { FabricNamespace, renderTestType } from '../../../types';
import { Canvas } from 'fabric';

function toSVGCanvas(
  canvas: Canvas,
  callback: (canvas: HTMLCanvasElement) => void,
  fabric: FabricNamespace,
): void {
  const svg = canvas.toSVG();
  const dataUrl = svgToDataURL(svg);
  const image = fabric.getFabricDocument().createElement('img');
  image.onload = function () {
    const newCanvas = fabric.util.createCanvasElement();
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;
    newCanvas
      .getContext('2d')!
      .drawImage(image, 0, 0, canvas.width, canvas.height);
    callback(newCanvas);
  };
  image.onerror = console.log;
  image.src = dataUrl;
}

function svgToDataURL(svgStr: string) {
  const encoded = encodeURIComponent(svgStr)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return 'data:image/svg+xml,' + encoded;
}

export const zSvgExport: renderTestType[] = [
  {
    title: 'Clip a rect with a circle, no zoom',
    golden: 'clipping0-SVG.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const clip = new fabric.Circle({ radius: 100, top: -10, left: -10 });
      const rect = new fabric.Rect({
        width: 200,
        height: 200,
        strokeWidth: 0,
        fill: 'rgba(0,255,0,0.5)',
      });
      rect.clipPath = clip;
      canvas.add(rect);
    },
  },
  {
    title: 'A clippath ignores fill and stroke for drawing',
    golden: 'clipping01_SVG.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const clip = new fabric.Circle({
        radius: 50,
        strokeWidth: 40,
        top: -50,
        left: -50,
        fill: 'transparent',
      });
      const rect = new fabric.Rect({
        width: 200,
        height: 200,
        strokeWidth: 0,
        fill: 'rgba(0,255,0,0.5)',
      });
      rect.clipPath = clip;
      canvas.add(rect);
    },
  },
  {
    title: 'Clip a rect with a circle, with zoom',
    golden: 'clipping1_SVG.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      canvas.setZoom(20);
      const clip = new fabric.Circle({
        radius: 5,
        top: -2,
        left: -2,
        strokeWidth: 0,
      });
      const rect = new fabric.Rect({
        width: 10,
        height: 10,
        strokeWidth: 0,
        fill: 'rgba(255,0,0,0.5)',
      });
      rect.clipPath = clip;
      canvas.add(rect);
    },
  },
  {
    title: 'Clip a group with a circle',
    golden: 'clipping2_SVG.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const clip = new fabric.Circle({ radius: 100, top: -100, left: -100 });
      const group = new fabric.Group(
        [
          new fabric.Rect({
            width: 100,
            height: 100,
            fill: 'red',
            strokeWidth: 0,
          }),
          new fabric.Rect({
            width: 100,
            height: 100,
            fill: 'yellow',
            left: 100,
            strokeWidth: 0,
          }),
          new fabric.Rect({
            width: 100,
            height: 100,
            fill: 'blue',
            top: 100,
            strokeWidth: 0,
          }),
          new fabric.Rect({
            width: 100,
            height: 100,
            fill: 'green',
            left: 100,
            top: 100,
            strokeWidth: 0,
          }),
        ],
        { clipPath: clip, strokeWidth: 0 },
      );
      canvas.add(group);
    },
  },
  {
    title: 'Isolation of clipPath of group and inner objects',
    golden: 'clipping3_SVG.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const clip = new fabric.Circle({ radius: 100, top: -100, left: -100 });
      const small1 = new fabric.Circle({ radius: 50, top: -50, left: -50 });
      const small2 = new fabric.Rect({
        width: 30,
        height: 30,
        top: -50,
        left: -50,
      });
      const group = new fabric.Group(
        [
          new fabric.Rect({
            width: 100,
            height: 100,
            fill: 'red',
            clipPath: small1,
            strokeWidth: 0,
          }),
          new fabric.Rect({
            width: 100,
            height: 100,
            fill: 'yellow',
            left: 100,
            strokeWidth: 0,
          }),
          new fabric.Rect({
            width: 100,
            height: 100,
            fill: 'blue',
            top: 100,
            clipPath: small2,
            strokeWidth: 0,
          }),
          new fabric.Rect({
            width: 100,
            height: 100,
            fill: 'green',
            left: 100,
            top: 100,
            strokeWidth: 0,
          }),
        ],
        { clipPath: clip, strokeWidth: 0 },
      );
      canvas.add(group);
    },
  },
  {
    title: 'ClipPath can be transformed',
    golden: 'clipping4_SVG.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const clip = new fabric.Circle({
        radius: 20,
        top: -10,
        left: -10,
        scaleX: 2,
        skewY: 45,
        strokeWidth: 0,
      });
      const rect = new fabric.Rect({ width: 200, height: 200, strokeWidth: 0 });
      rect.fill = new fabric.Gradient({
        type: 'linear',
        coords: { x1: 0, y1: 0, x2: 200, y2: 200 },
        colorStops: [
          { offset: 0, color: 'red' },
          { offset: 1, color: 'blue' },
        ],
      });
      rect.clipPath = clip;
      canvas.add(rect);
    },
  },
  {
    title: 'ClipPath can be a group with many objects',
    golden: 'clipping5_SVG.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const clip1 = new fabric.Circle({
        radius: 20,
        top: -10,
        left: -10,
        scaleX: 2,
        skewY: 45,
        strokeWidth: 0,
      });
      const clip2 = new fabric.Circle({
        radius: 15,
        top: -100,
        left: -50,
        scaleX: 2,
        skewY: 45,
        strokeWidth: 0,
        angle: 45,
      });
      const clip3 = new fabric.Circle({
        radius: 10,
        top: -20,
        left: -20,
        scaleY: 2,
        skewX: 45,
        strokeWidth: 0,
      });
      const groupClip = new fabric.Group([clip1, clip2, clip3]);
      const rect = new fabric.Rect({ width: 200, height: 200, strokeWidth: 0 });
      rect.fill = new fabric.Gradient({
        type: 'linear',
        coords: { x1: 0, y1: 0, x2: 200, y2: 200 },
        colorStops: [
          { offset: 0, color: 'red' },
          { offset: 1, color: 'blue' },
        ],
      });
      rect.clipPath = groupClip;
      canvas.add(rect);
    },
  },
  {
    title: 'ClipPath can be inverted (outside area)',
    golden: 'clipping6_SVG.png',
    percentage: 0.06,
    size: [200, 200],
    disabled: true,
    async renderFunction(canvas, fabric) {
      const clip1 = new fabric.Circle({
        radius: 20,
        top: -10,
        left: -10,
        scaleX: 2,
        skewY: 45,
        strokeWidth: 0,
      });
      const clip2 = new fabric.Circle({
        radius: 15,
        top: -100,
        left: -50,
        scaleX: 2,
        skewY: 45,
        strokeWidth: 0,
        angle: 45,
      });
      const clip3 = new fabric.Circle({
        radius: 10,
        top: -20,
        left: -20,
        scaleY: 2,
        skewX: 45,
        strokeWidth: 0,
      });
      const groupClip = new fabric.Group([clip1, clip2, clip3]);
      groupClip.inverted = true;
      const rect = new fabric.Rect({ width: 200, height: 200, strokeWidth: 0 });
      rect.fill = new fabric.Gradient({
        type: 'linear',
        coords: { x1: 0, y1: 0, x2: 200, y2: 200 },
        colorStops: [
          { offset: 0, color: 'red' },
          { offset: 1, color: 'blue' },
        ],
      });
      rect.clipPath = groupClip;
      canvas.add(rect);
    },
  },
  {
    title: 'Many objects can share the same clipPath',
    golden: 'clipping7_SVG.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const clip = new fabric.Circle({
        radius: 30,
        top: -30,
        left: -30,
        skewY: 45,
        strokeWidth: 0,
      });
      const makeRect = (top: number, left: number, fill: string) =>
        new fabric.Rect({
          top,
          left,
          width: 100,
          height: 100,
          fill,
          strokeWidth: 0,
        });
      const r1 = makeRect(0, 100, 'rgba(0,255,0,0.8)');
      const r2 = makeRect(0, 0, 'rgba(255,255,0,0.8)');
      const r3 = makeRect(100, 0, 'rgba(0,255,255,0.8)');
      const r4 = makeRect(100, 100, 'rgba(255,0,0,0.8)');
      [r1, r2, r3, r4].forEach((r) => (r.clipPath = clip) && canvas.add(r));
    },
  },
  {
    title: 'An absolute positioned clipPath, shared',
    golden: 'clipping8_SVG.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const clip = new fabric.Circle({
        radius: 60,
        top: 40,
        left: 40,
        absolutePositioned: true,
        strokeWidth: 0,
      });
      const makeRect = (top: number, left: number, fill: string) =>
        new fabric.Rect({
          top,
          left,
          width: 100,
          height: 100,
          fill,
          strokeWidth: 0,
        });
      const r1 = makeRect(0, 100, 'rgba(0,255,0,0.8)');
      const r2 = makeRect(0, 0, 'rgba(255,255,0,0.8)');
      const r3 = makeRect(100, 0, 'rgba(0,255,255,0.8)');
      const r4 = makeRect(100, 100, 'rgba(255,0,0,0.8)');
      [r1, r2, r3].forEach((r) => (r.clipPath = clip) && canvas.add(r));
      canvas.add(r4);
    },
  },
  {
    title: 'A clipPath on the canvas',
    golden: 'clipping9_SVG.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const clip = new fabric.Circle({
        radius: 60,
        top: 10,
        left: 10,
        strokeWidth: 0,
      });
      const makeRect = (top: number, left: number, fill: string) =>
        new fabric.Rect({
          top,
          left,
          width: 100,
          height: 100,
          fill,
          strokeWidth: 0,
        });
      canvas.add(makeRect(0, 100, 'rgba(0,255,0,0.8)'));
      canvas.add(makeRect(0, 0, 'rgba(255,255,0,0.8)'));
      canvas.add(makeRect(100, 0, 'rgba(0,255,255,0.8)'));
      canvas.add(makeRect(100, 100, 'rgba(255,0,0,0.8)'));
      canvas.clipPath = clip;
    },
  },
  {
    title: 'clipPath with a path on simple elements',
    golden: 'clipping10_SVG.png',
    percentage: 0.06,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const jsonData =
        '{"version":"2.4.5","objects":[{"type":"Path","version":"2.4.5","originX":"left","originY":"top","left":12.844238038518533,"top":75.97237569060775,"width":50.4,"height":25.4,"fill":"#b8d783","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":2.07,"scaleY":2.07,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"clipPath":{"type":"Circle","version":"2.4.5","originX":"left","originY":"top","left":-31.1,"top":-48.7,"width":61.2,"height":61.2,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"radius":30.6,"startAngle":0,"endAngle":360,"inverted":false,"absolutePositioned":false},"path":[["M",31.8,36.8],["c",-10.7,0,-25.2,6.8,-25.1,25.4],["L",57.1,62],["C",57.1,43.5,42.6,36.8,31.8,36.8],["z"]]},{"type":"Circle","version":"2.4.5","originX":"left","originY":"top","left":38.95,"top":28.53,"width":25.6,"height":25.6,"fill":"#d7b047","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":2.07,"scaleY":2.07,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"clipPath":{"type":"Circle","version":"2.4.5","originX":"left","originY":"top","left":-31.3,"top":-25.9,"width":61.2,"height":61.2,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"radius":30.6,"startAngle":0,"endAngle":360,"inverted":false,"absolutePositioned":false},"radius":12.8,"startAngle":0,"endAngle":360},{"type":"Circle","version":"2.4.5","originX":"left","originY":"top","left":0.1,"top":2.87,"width":61.2,"height":61.2,"fill":"transparent","stroke":"#567bde","strokeWidth":2.5,"strokeDashArray":null,"strokeLineCap":"round","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":2.06,"scaleY":2.06,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"radius":30.6,"startAngle":0,"endAngle":360}]}';
      await canvas.loadFromJSON(jsonData);
    },
  },
  {
    title: 'clipPath made of polygons and paths',
    golden: 'clippath-9_SVG.png',
    percentage: 0.06,
    size: [400, 400],
    async renderFunction(canvas, fabric) {
      const jsonData =
        '{"version":"2.4.5","objects":[{"type":"Group","version":"2.4.5","originX":"left","originY":"top","left":-1,"top":0,"width":400,"height":400,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"objects":[{"type":"Circle","version":"2.4.5","originX":"left","originY":"top","left":-618.26087,"top":-618.26087,"width":600,"height":600,"fill":"#396","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.73913,"scaleY":1.73913,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"clipPath":{"type":"Group","version":"2.4.5","originX":"left","originY":"top","left":-50.026294,"top":-16.249678,"width":318.906599,"height":295.383789,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":0.575,"scaleY":0.575,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"objects":[{"type":"Polygon","version":"2.4.5","originX":"left","originY":"top","left":-125.590179,"top":-145.137671,"width":148,"height":146,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":245.45,"y":333.29},{"x":313.95,"y":405.79},{"x":393.45,"y":318.29},{"x":316.95,"y":259.79}]},{"type":"Polygon","version":"2.4.5","originX":"left","originY":"top","left":-145.600613,"top":-4.528975,"width":78.96,"height":78.57,"fill":"#8E8029","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":234.99,"y":339.36},{"x":245.45,"y":333.29},{"x":313.95,"y":405.79},{"x":303.49,"y":411.86}]},{"type":"Polygon","version":"2.4.5","originX":"left","originY":"top","left":-145.600613,"top":-145.137671,"width":81.96,"height":79.57,"fill":"#8E8029","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":305.6,"y":264.97},{"x":316.95,"y":259.79},{"x":245.45,"y":333.29},{"x":234.99,"y":339.36}]},{"type":"Path","version":"2.4.5","originX":"left","originY":"top","left":-152.94670044656436,"top":-106.34114919417823,"width":29.46,"height":35.71,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",231.15,283.42],["c",1.18,2.07,2.56,4.26,4.14,6.57],["l",10.62,13.65],["c",3.39,3.94,7.17,8.01,11.29,12.14],["l",3.41,-3.41],["c",0,0,-16.5,-17.25,-26.11,-32.3],["L",231.15,283.42],["z"]]},{"type":"Path","version":"2.4.5","originX":"left","originY":"top","left":-159.45329955343573,"top":-147.691894284083,"width":68.811177,"height":29.095162,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",229.7,259.54],["c",-1.9,1.43,-2.31,3.86,-1.67,6.91],["l",0.08,0.15],["c",3.5,-2.53,11.03,-1.57,19.8,0.98],["h",0],["l",0,0],["c",20.02,5.83,46.53,19.97,46.53,19.97],["l",2.12,-3.62],["C",267.45,266.79,236.17,254.67,229.7,259.54],["z"]]}],"inverted":false,"absolutePositioned":false},"radius":300,"startAngle":0,"endAngle":360},{"type":"Circle","version":"2.4.5","originX":"left","originY":"top","left":-148.695652,"top":-148.695652,"width":660,"height":660,"fill":"#900","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.73913,"scaleY":1.73913,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"clipPath":{"type":"Group","version":"2.4.5","originX":"left","originY":"top","left":-350.026294,"top":-316.249678,"width":318.906599,"height":295.383789,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":0.575,"scaleY":0.575,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"objects":[{"type":"Polygon","version":"2.4.5","originX":"left","originY":"top","left":-125.590179,"top":-145.137671,"width":148,"height":146,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":245.45,"y":333.29},{"x":313.95,"y":405.79},{"x":393.45,"y":318.29},{"x":316.95,"y":259.79}]},{"type":"Polygon","version":"2.4.5","originX":"left","originY":"top","left":-145.600613,"top":-4.528975,"width":78.96,"height":78.57,"fill":"#8E8029","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":234.99,"y":339.36},{"x":245.45,"y":333.29},{"x":313.95,"y":405.79},{"x":303.49,"y":411.86}]},{"type":"Polygon","version":"2.4.5","originX":"left","originY":"top","left":-145.600613,"top":-145.137671,"width":81.96,"height":79.57,"fill":"#8E8029","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":305.6,"y":264.97},{"x":316.95,"y":259.79},{"x":245.45,"y":333.29},{"x":234.99,"y":339.36}]},{"type":"Path","version":"2.4.5","originX":"left","originY":"top","left":-152.94670044656436,"top":-106.34114919417823,"width":29.46,"height":35.71,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",231.15,283.42],["c",1.18,2.07,2.56,4.26,4.14,6.57],["l",10.62,13.65],["c",3.39,3.94,7.17,8.01,11.29,12.14],["l",3.41,-3.41],["c",0,0,-16.5,-17.25,-26.11,-32.3],["L",231.15,283.42],["z"]]},{"type":"Path","version":"2.4.5","originX":"left","originY":"top","left":-159.45329955343573,"top":-147.691894284083,"width":68.811177,"height":29.095162,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",229.7,259.54],["c",-1.9,1.43,-2.31,3.86,-1.67,6.91],["l",0.08,0.15],["c",3.5,-2.53,11.03,-1.57,19.8,0.98],["h",0],["l",0,0],["c",20.02,5.83,46.53,19.97,46.53,19.97],["l",2.12,-3.62],["C",267.45,266.79,236.17,254.67,229.7,259.54],["z"]]}],"inverted":false,"absolutePositioned":false},"radius":330,"startAngle":0,"endAngle":360},{"type":"Circle","version":"2.4.5","originX":"left","originY":"top","left":-183.478261,"top":-1070.434783,"width":700,"height":700,"fill":"#009","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.73913,"scaleY":1.73913,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"clipPath":{"type":"Group","version":"2.4.5","originX":"left","originY":"top","left":-350.026294,"top":193.750322,"width":318.906599,"height":295.383789,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":0.575,"scaleY":0.575,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"objects":[{"type":"Polygon","version":"2.4.5","originX":"left","originY":"top","left":-125.590179,"top":-145.137671,"width":148,"height":146,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":245.45,"y":333.29},{"x":313.95,"y":405.79},{"x":393.45,"y":318.29},{"x":316.95,"y":259.79}]},{"type":"Polygon","version":"2.4.5","originX":"left","originY":"top","left":-145.600613,"top":-4.528975,"width":78.96,"height":78.57,"fill":"#8E8029","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":234.99,"y":339.36},{"x":245.45,"y":333.29},{"x":313.95,"y":405.79},{"x":303.49,"y":411.86}]},{"type":"Polygon","version":"2.4.5","originX":"left","originY":"top","left":-145.600613,"top":-145.137671,"width":81.96,"height":79.57,"fill":"#8E8029","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"points":[{"x":305.6,"y":264.97},{"x":316.95,"y":259.79},{"x":245.45,"y":333.29},{"x":234.99,"y":339.36}]},{"type":"Path","version":"2.4.5","originX":"left","originY":"top","left":-152.94670044656436,"top":-106.34114919417823,"width":29.46,"height":35.71,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",231.15,283.42],["c",1.18,2.07,2.56,4.26,4.14,6.57],["l",10.62,13.65],["c",3.39,3.94,7.17,8.01,11.29,12.14],["l",3.41,-3.41],["c",0,0,-16.5,-17.25,-26.11,-32.3],["L",231.15,283.42],["z"]]},{"type":"Path","version":"2.4.5","originX":"left","originY":"top","left":-159.45329955343573,"top":-147.691894284083,"width":68.811177,"height":29.095162,"fill":"#D8CB3F","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1.913043,"scaleY":1.913043,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",229.7,259.54],["c",-1.9,1.43,-2.31,3.86,-1.67,6.91],["l",0.08,0.15],["c",3.5,-2.53,11.03,-1.57,19.8,0.98],["h",0],["l",0,0],["c",20.02,5.83,46.53,19.97,46.53,19.97],["l",2.12,-3.62],["C",267.45,266.79,236.17,254.67,229.7,259.54],["z"]]}],"inverted":false,"absolutePositioned":false},"radius":350,"startAngle":0,"endAngle":360}]}]}';

      await canvas.loadFromJSON(jsonData);
    },
  },
  {
    title: 'Export a radial svg with scaling',
    golden: 'export12_SVG.png',
    percentage: 0.06,
    size: [220, 300],
    async renderFunction(canvas, fabric) {
      const jsonData =
        '{"version":"2.4.6","objects":[{"type":"Ellipse","version":"2.4.6","left":2.5,"top":-56.5,"width":220,"height":300,"fill":{"type":"radial","coords":{"x1":110.00000000000001,"y1":110.00000000000001,"x2":110.00000000000001,"y2":110.00000000000001,"r1":0,"r2":110.00000000000001},"colorStops":[{"offset":1,"color":"rgb(0,0,255)","opacity":1},{"offset":0.6,"color":"rgba(0,153,153,0.5)"},{"offset":0.3,"color":"rgb(0,0,255)","opacity":1},{"offset":0,"color":"rgba(255,0,0, 0.8)"}],"offsetX":0,"offsetY":0,"gradientTransform":[1,0,0,1.3636363636363635,0,0]},"scaleX":0.69,"scaleY":1.07,"skewY":-32.03,"rx":110,"ry":150}]}';

      await canvas.loadFromJSON(jsonData);
    },
  },
  {
    title: 'Export complex gradients',
    golden: 'export13_SVG.png',
    percentage: 0.06,
    size: [290, 400],
    async renderFunction(canvas, fabric) {
      const jsonData =
        '{"version":"2.4.6","objects":[{"type":"Path","version":"2.4.6","left":84.63385601266276,"top":385.11623376730074,"width":3.14,"height":10.44,"fill":{"type":"linear","coords":{"x1":481.066,"y1":785.465,"x2":480.953,"y2":793.102},"colorStops":[{"offset":1,"color":"rgb(160,137,44)","opacity":1},{"offset":0.9,"color":"rgb(85,68,0)","opacity":1},{"offset":0.78,"color":"rgb(80,68,22)","opacity":1},{"offset":0.607,"color":"rgb(160,137,44)","opacity":1},{"offset":0.467,"color":"rgb(255,255,255)","opacity":1},{"offset":0.299,"color":"rgb(200,171,55)","opacity":1},{"offset":0.24,"color":"rgb(160,137,44)","opacity":1},{"offset":0.096,"color":"rgb(120,103,33)","opacity":1},{"offset":0,"color":"rgb(211,188,95)","opacity":1}],"offsetX":-439.1113425994523,"offsetY":-783.951,"gradientTransform":[-1,0,0,1,921.58,0]},"scaleX":9.32,"scaleY":10.58,"angle":-90,"path":[["M",442.142,794.394],["l",-2.583,-1.46],["c",-0.644,-2.39,-0.512,-5.004,-0.113,-7.693],["l",2.808,-1.29]]},{"type":"Path","version":"2.4.6","left":78.08737427855635,"top":315.5127636903678,"width":2.42,"height":11.51,"fill":{"type":"linear","coords":{"x1":473.934,"y1":792.821,"x2":473.822,"y2":784.005},"colorStops":[{"offset":1,"color":"rgb(211,188,95)","opacity":1},{"offset":0.904,"color":"rgb(120,103,33)","opacity":1},{"offset":0.76,"color":"rgb(160,137,44)","opacity":1},{"offset":0.701,"color":"rgb(200,171,55)","opacity":1},{"offset":0.533,"color":"rgb(255,255,255)","opacity":1},{"offset":0.393,"color":"rgb(160,137,44)","opacity":1},{"offset":0.22,"color":"rgb(80,68,22)","opacity":1},{"offset":0.1,"color":"rgb(85,68,0)","opacity":1},{"offset":0,"color":"rgb(160,137,44)","opacity":1}],"offsetX":-446.578,"offsetY":-783.332,"gradientTransform":[-1,0,0,1,921.58,0]},"scaleX":9.32,"scaleY":10.58,"angle":-90,"path":[["M",448.32,783.332],["l",0.673,2.02],["c",-0.885,1.242,-0.83,2.952,-0.075,7.92],["l",-1.16,1.57],["l",-1.18,-4.49],["l",0.17,-5.673],["z"]]},{"type":"Path","version":"2.4.6","left":92.34368668174653,"top":366.5275069557187,"width":6.57,"height":5.67,"fill":{"type":"linear","coords":{"x1":475.081,"y1":785.381,"x2":479.3,"y2":788.975},"colorStops":[{"offset":1,"color":"rgb(120,103,33)","opacity":1},{"offset":0,"color":"rgb(200,171,55)","opacity":1}],"offsetX":-441.1054336190674,"offsetY":-784.68,"gradientTransform":[-1,0,0,1,921.58,0]},"scaleX":9.32,"scaleY":10.58,"angle":-90,"path":[["M",447.365,784.68],["h",-5.616],["c",-0.592,1.87,-0.812,3.743,-0.506,5.615],["l",5.952,0.056],["c",0.658,-1.976,0.554,-3.843,0.17,-5.67],["z"]]},{"type":"Path","version":"2.4.6","left":151.23029459047214,"top":365.75783100618594,"width":6.58,"height":4.48,"fill":{"type":"linear","coords":{"x1":476.181,"y1":791.235,"x2":477.099,"y2":794.257},"colorStops":[{"offset":1,"color":"rgb(120,103,33)","opacity":1},{"offset":0,"color":"rgb(200,171,55)","opacity":1}],"offsetX":-441.18800000000005,"offsetY":-790.248,"gradientTransform":[-1,0,0,1,921.58,0]},"scaleX":9.32,"scaleY":10.58,"angle":-90,"path":[["M",447.196,790.248],["c",0.397,1.492,0.613,3.14,0.562,4.483],["l",-5.503,-0.056],["c",-0.974,-1.853,-0.957,-3.128,-1.067,-4.406],["z"]]},{"type":"Path","version":"2.4.6","left":78.67962464545468,"top":360.50959855742764,"width":6.4,"height":1.35,"fill":{"type":"linear","coords":{"x1":473.32,"y1":784.06,"x2":479.896,"y2":784.06},"colorStops":[{"offset":1,"color":"rgb(200,171,55)","opacity":1},{"offset":0,"color":"rgb(120,103,33)","opacity":1}],"offsetX":-441.751,"offsetY":-783.3879999999999,"gradientTransform":[-1,0,0,1,921.58,0]},"scaleX":9.32,"scaleY":10.58,"angle":-90,"path":[["M",447.196,784.68],["c",0.783,-0.43,0.715,-0.862,0.955,-1.292],["l",-5.67,0.224],["c",-0.308,0.343,-0.704,0.64,-0.73,1.123],["z"]]},{"type":"Path","version":"2.4.6","left":195.70884317712697,"top":264.26532049868615,"width":2.99,"height":8.78,"fill":{"type":"linear","coords":{"x1":481.066,"y1":785.465,"x2":480.953,"y2":793.102},"colorStops":[{"offset":1,"color":"rgb(160,137,44)","opacity":1},{"offset":0.9,"color":"rgb(85,68,0)","opacity":1},{"offset":0.78,"color":"rgb(80,68,22)","opacity":1},{"offset":0.607,"color":"rgb(160,137,44)","opacity":1},{"offset":0.467,"color":"rgb(255,255,255)","opacity":1},{"offset":0.299,"color":"rgb(200,171,55)","opacity":1},{"offset":0.24,"color":"rgb(160,137,44)","opacity":1},{"offset":0.096,"color":"rgb(120,103,33)","opacity":1},{"offset":0,"color":"rgb(211,188,95)","opacity":1}],"offsetX":-228.298,"offsetY":-835.244,"gradientTransform":[0.93343,0,0,0.85628,-219.064,163.965]},"scaleX":9.32,"scaleY":10.58,"angle":90,"flipY":true,"path":[["M",228.298,844.02],["l",2.57,-1.083],["c",0.6,-2.048,0.477,-4.285,0.104,-6.587],["l",-2.62,-1.106]]},{"type":"Circle","version":"2.4.6","left":-28.49,"top":-28.49,"width":4.64,"height":4.64,"fill":{"type":"radial","coords":{"x1":193.676,"y1":141.252,"x2":193.676,"y2":141.252,"r1":0,"r2":4.082},"colorStops":[{"offset":1,"color":"rgb(0,0,0)","opacity":1},{"offset":0.969,"color":"rgb(0,0,0)","opacity":1},{"offset":0.904,"color":"rgb(236,236,236)","opacity":1},{"offset":0.874,"color":"rgb(77,77,77)","opacity":1},{"offset":0.837,"color":"rgb(237,237,237)","opacity":1},{"offset":0.817,"color":"rgb(0,0,0)","opacity":1},{"offset":0,"color":"rgb(0,0,0)","opacity":1}],"offsetX":-116.293,"offsetY":-166.167,"gradientTransform":[0.3487,0.40483,-0.40345,0.34752,108.054,40.97]},"scaleX":59.8,"scaleY":59.8,"radius":2.321,"startAngle":0,"endAngle":360},{"type":"Circle","version":"2.4.6","left":32.24,"top":30.43,"width":3.58,"height":3.58,"fill":{"type":"linear","coords":{"x1":195.171,"y1":143.461,"x2":191.574,"y2":138.568},"colorStops":[{"offset":1,"color":"rgb(204,204,204)","opacity":1},{"offset":0.687,"color":"rgb(255,255,255)","opacity":1},{"offset":0,"color":"rgb(255,255,255)","opacity":1}],"offsetX":-116.817,"offsetY":-166.661,"gradientTransform":[0.52872,0,0,0.52872,16.3,93.714]},"stroke":"#b3b3b3","strokeWidth":0.02,"strokeLineCap":"round","scaleX":59.8,"scaleY":59.8,"radius":1.789,"startAngle":0,"endAngle":360},{"type":"Circle","version":"2.4.6","left":125.91,"top":124.11,"width":0.46,"height":0.46,"fill":{"type":"linear","coords":{"x1":656.429,"y1":320.934,"x2":506.429,"y2":131.648},"colorStops":[{"offset":1,"color":"rgb(242,242,242)","opacity":1},{"offset":0,"color":"rgb(102,102,102)","opacity":1}],"offsetX":-118.37599999999999,"offsetY":-168.22,"gradientTransform":[0.0017,0,0,0.0017,117.64,168.082]},"stroke":"#999","strokeWidth":0,"strokeLineCap":"round","scaleX":59.8,"scaleY":59.8,"radius":0.23,"startAngle":0,"endAngle":360}]}';

      await canvas.loadFromJSON(jsonData);
    },
  },
  {
    title: 'Group with opacity and shadow',
    golden: 'group-svg-1.png',
    percentage: 0.06,
    size: [210, 230],
    async renderFunction(canvas, fabric) {
      const jsonData =
        '{"version":"3.1.0","objects":[{"type":"Group","version":"3.1.0","left":3,"top":2,"width":250,"height":250,"scaleX":0.9,"scaleY":0.9,"opacity":0.7,"shadow":{"color":"rgba(0,0,0,0.3)","blur":10,"offsetX":10,"offsetY":10,"affectStroke":false,"nonScaling":false},"objects":[{"type":"Polygon","version":"3.1.0","left":-74.5,"top":67.46,"width":148,"height":54.92,"fill":{"type":"linear","coords":{"x1":175,"y1":111.8719,"x2":175,"y2":-135.0812},"colorStops":[{"offset":1,"color":"rgb(0,38,57)","opacity":1},{"offset":0,"color":"rgb(0,46,59)","opacity":1}],"offsetX":-51,"offsetY":-192.962,"gradientTransform":[1,0,0,-1,-50,111]},"stroke":{"type":"linear","coords":{"x1":175,"y1":111.8719,"x2":175,"y2":-135.0812},"colorStops":[{"offset":1,"color":"rgb(0,38,57)","opacity":1},{"offset":0,"color":"rgb(0,46,59)","opacity":1}],"offsetX":-51,"offsetY":-192.962,"gradientTransform":[1,0,0,-1,-50,111]},"shadow":{"color":"red","blur":10,"offsetX":0,"offsetY":0,"affectStroke":false,"nonScaling":false},"points":[{"x":124.913,"y":210.751},{"x":89.063,"y":193.264},{"x":89.103,"y":193.245},{"x":89.093,"y":193.24},{"x":51,"y":211.82},{"x":124.941,"y":247.884},{"x":199,"y":211.9},{"x":160.771,"y":192.962}]},{"type":"Polygon","version":"3.1.0","left":-74.41,"top":31.4,"width":74.36,"height":55.04,"fill":{"type":"radial","coords":{"x1":63.3041,"y1":235.6129,"x2":63.3041,"y2":235.6129,"r1":0,"r2":219.7985},"colorStops":[{"offset":1,"color":"rgb(20,157,145)","opacity":1},{"offset":0,"color":"rgb(0,188,133)","opacity":1}],"offsetX":-51.091,"offsetY":-156.903},"stroke":{"type":"radial","coords":{"x1":63.3041,"y1":235.6129,"x2":63.3041,"y2":235.6129,"r1":0,"r2":219.7985},"colorStops":[{"offset":1,"color":"rgb(20,157,145)","opacity":1},{"offset":0,"color":"rgb(0,188,133)","opacity":1}],"offsetX":-51.091,"offsetY":-156.903},"opacity":0.2,"points":[{"x":51.091,"y":211.945},{"x":51.091,"y":174.781},{"x":87.749,"y":156.903},{"x":125.455,"y":175.5}]},{"type":"Polygon","version":"3.1.0","left":-0.89,"top":-87.38,"width":74.39,"height":118.38,"fill":{"type":"radial","coords":{"x1":186.8275,"y1":123.7814,"x2":186.8275,"y2":123.7814,"r1":0,"r2":265.5574},"colorStops":[{"offset":1,"color":"rgb(20,157,145)","opacity":1},{"offset":0,"color":"rgb(0,188,133)","opacity":1}],"offsetX":-124.611,"offsetY":-38.123,"gradientTransform":[1,0,0,-1,-50,111]},"stroke":{"type":"radial","coords":{"x1":186.8275,"y1":123.7814,"x2":186.8275,"y2":123.7814,"r1":0,"r2":265.5574},"colorStops":[{"offset":1,"color":"rgb(20,157,145)","opacity":1},{"offset":0,"color":"rgb(0,188,133)","opacity":1}],"offsetX":-124.611,"offsetY":-38.123,"gradientTransform":[1,0,0,-1,-50,111]},"points":[{"x":165.596,"y":58.995},{"x":165.596,"y":117.758},{"x":165.596,"y":117.758},{"x":165.596,"y":117.758},{"x":124.611,"y":137.737},{"x":162.301,"y":156.506},{"x":198.996,"y":138.632},{"x":198.996,"y":38.123}]},{"type":"Polygon","version":"3.1.0","left":-74.4,"top":-87.41,"width":147.9,"height":173.82,"fill":{"type":"radial","coords":{"x1":118.0562,"y1":143.2378,"x2":118.0562,"y2":143.2378,"r1":0,"r2":507.5908},"colorStops":[{"offset":1,"color":"rgb(0,52,95)","opacity":1},{"offset":0,"color":"rgb(0,68,115)","opacity":1}],"offsetX":-51.096,"offsetY":-38.088,"gradientTransform":[1,0,0,-1,-50,111]},"stroke":{"type":"radial","coords":{"x1":118.0562,"y1":143.2378,"x2":118.0562,"y2":143.2378,"r1":0,"r2":507.5908},"colorStops":[{"offset":1,"color":"rgb(0,52,95)","opacity":1},{"offset":0,"color":"rgb(0,68,115)","opacity":1}],"offsetX":-51.096,"offsetY":-38.088,"gradientTransform":[1,0,0,-1,-50,111]},"points":[{"x":199,"y":211.912},{"x":199,"y":211.912},{"x":199,"y":174.746},{"x":84.498,"y":117.723},{"x":84.498,"y":58.96},{"x":51.096,"y":38.088},{"x":51.096,"y":138.597}]},{"type":"Polygon","version":"3.1.0","left":-74.5,"top":-123.52,"width":147.84,"height":56.93,"fill":{"type":"linear","coords":{"x1":174.922,"y1":110.6136,"x2":174.922,"y2":-135.0903},"colorStops":[{"offset":1,"color":"rgb(0,38,57)","opacity":1},{"offset":0,"color":"rgb(0,46,59)","opacity":1}],"offsetX":-51,"offsetY":-1.985,"gradientTransform":[1,0,0,-1,-50,111]},"stroke":{"type":"linear","coords":{"x1":174.922,"y1":110.6136,"x2":174.922,"y2":-135.0903},"colorStops":[{"offset":1,"color":"rgb(0,38,57)","opacity":1},{"offset":0,"color":"rgb(0,46,59)","opacity":1}],"offsetX":-51,"offsetY":-1.985,"gradientTransform":[1,0,0,-1,-50,111]},"points":[{"x":84.396,"y":58.904},{"x":84.396,"y":58.892},{"x":124.939,"y":39.118},{"x":165.485,"y":58.892},{"x":198.844,"y":38.046},{"x":124.912,"y":1.985},{"x":51,"y":38.035},{"x":51,"y":38.067},{"x":84.368,"y":58.918}]}]}]}';

      await canvas.loadFromJSON(jsonData);
    },
  },
  {
    title: 'Multiple gradients import',
    golden: 'multipleGradients.png',
    percentage: 0.06,
    size: [760, 760],
    async renderFunction(canvas, fabric) {
      const asset = await globalThis.getAsset('svg_linear_9.svg');
      const { objects } = await fabric.loadSVGFromString(asset);
      const nonNullObjects = objects.filter((obj) => !!obj);
      const group = fabric.util.groupSVGElements(nonNullObjects);
      canvas.add(group);
      await new Promise((resolve) => {
        toSVGCanvas(canvas, resolve, fabric);
      });
    },
  },
  {
    title: 'Gradient should be applied to path in svg',
    golden: 'pathWithGradientSvg.png',
    percentage: 0.06,
    size: [100, 100],
    async renderFunction(canvas, fabric) {
      const path = new fabric.Path('M 0 0 L 0 100 L 100 100 L 100 0 Z', {
        width: 100,
        height: 100,
        fill: new fabric.Gradient({
          gradientUnits: 'percentage',
          coords: { x1: 0, y1: 0, x2: 0, y2: 1 },
          colorStops: [
            { offset: 0, color: 'red' },
            { offset: 1, color: 'black' },
          ],
        }),
      });
      canvas.add(path);
    },
  },
];
