(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/hooks/use-stage-size.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "useStageSize": (()=>useStageSize)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useStageSize(ref) {
    _s();
    const [size, setSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        width: 0,
        height: 0
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "useStageSize.useLayoutEffect": ()=>{
            function updateSize() {
                if (ref.current) {
                    const newSize = {
                        width: ref.current.offsetWidth,
                        height: ref.current.offsetHeight
                    };
                    console.log('New stage size:', newSize);
                    setSize(newSize);
                }
            }
            const resizeObserver = new ResizeObserver(updateSize);
            if (ref.current) {
                resizeObserver.observe(ref.current);
            }
            updateSize();
            return ({
                "useStageSize.useLayoutEffect": ()=>{
                    if (ref.current) {
                        resizeObserver.unobserve(ref.current);
                    }
                }
            })["useStageSize.useLayoutEffect"];
        }
    }["useStageSize.useLayoutEffect"], [
        ref
    ]);
    return size;
}
_s(useStageSize, "1eZEGQqCvalHr9Wt4G6t59t17BY=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/storage/whiteboard.implementation.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src\components\storage\whiteboard.implementation.tsx
__turbopack_context__.s({
    "Whiteboard": (()=>Whiteboard)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonva$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/react-konva/es/ReactKonva.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-konva/es/ReactKonvaCore.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/use-toast.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pen.js [app-client] (ecmascript) <export default as Pen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square.js [app-client] (ecmascript) <export default as Square>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eraser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eraser$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eraser.js [app-client] (ecmascript) <export default as Eraser>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$move$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Move$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/move.js [app-client] (ecmascript) <export default as Move>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$type$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Type$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/type.js [app-client] (ecmascript) <export default as Type>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle.js [app-client] (ecmascript) <export default as Circle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [app-client] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$stage$2d$size$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/use-stage-size.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
function Whiteboard({ onSave, disabled }) {
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const [tool, setTool] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('pen');
    const [shapes, setShapes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isDrawing, setIsDrawing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [color, setColor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('#000000');
    const [strokeWidth, setStrokeWidth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(3);
    const stageRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { width, height } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$stage$2d$size$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStageSize"])(containerRef);
    const [currentShape, setCurrentShape] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedShape, setSelectedShape] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const transformerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [text, setText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isTextEditing, setIsTextEditing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [textPosition, setTextPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        x: 0,
        y: 0
    });
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Whiteboard.useEffect": ()=>{
            if (tool !== 'selection') {
                setSelectedShape(null);
                transformerRef.current?.nodes([]);
                transformerRef.current?.getLayer().batchDraw();
            }
        }
    }["Whiteboard.useEffect"], [
        tool
    ]);
    const handleMouseDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Whiteboard.useCallback[handleMouseDown]": (e)=>{
            console.log('handleMouseDown');
            if (tool === 'selection') {
                const clickedOnEmpty = e.target === e.target.getStage();
                if (clickedOnEmpty) {
                    setSelectedShape(null);
                    transformerRef.current?.nodes([]);
                    transformerRef.current?.getLayer().batchDraw();
                } else {
                    const id = e.target.id();
                    setSelectedShape(id);
                    transformerRef.current?.nodes([
                        e.target
                    ]);
                    transformerRef.current?.getLayer().batchDraw();
                }
                return;
            }
            if (tool === 'text') {
                const pos = e.target.getStage().getPointerPosition();
                setTextPosition(pos);
                setIsTextEditing(true);
                return;
            }
            if (tool === 'image') {
                fileInputRef.current?.click();
                return;
            }
            setIsDrawing(true);
            const pos = e.target.getStage().getPointerPosition();
            const id = Date.now().toString();
            if (tool === 'rectangle') {
                const newRect = {
                    id,
                    tool,
                    x: pos.x,
                    y: pos.y,
                    width: 0,
                    height: 0,
                    color: color,
                    strokeWidth: strokeWidth
                };
                setCurrentShape(newRect);
            } else if (tool === 'circle') {
                const newCircle = {
                    id,
                    tool,
                    x: pos.x,
                    y: pos.y,
                    radius: 0,
                    color: color,
                    strokeWidth: strokeWidth
                };
                setCurrentShape(newCircle);
            } else if (tool === 'pen' || tool === 'eraser') {
                const newLine = {
                    id,
                    tool: tool,
                    points: [
                        pos.x,
                        pos.y
                    ],
                    color: tool === 'eraser' ? '#ffffff' : color,
                    strokeWidth: tool === 'eraser' ? strokeWidth * 2 : strokeWidth
                };
                setShapes({
                    "Whiteboard.useCallback[handleMouseDown]": (prevShapes)=>[
                            ...prevShapes,
                            newLine
                        ]
                }["Whiteboard.useCallback[handleMouseDown]"]);
            } else {
                return;
            }
        }
    }["Whiteboard.useCallback[handleMouseDown]"], [
        tool,
        color,
        strokeWidth
    ]);
    const handleMouseMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Whiteboard.useCallback[handleMouseMove]": (e)=>{
            console.log('handleMouseMove');
            if (!isDrawing) return;
            const stage = e.target.getStage();
            const point = stage.getPointerPosition();
            if (tool === 'rectangle' && currentShape) {
                const newRect = {
                    ...currentShape,
                    width: point.x - currentShape.x,
                    height: point.y - currentShape.y
                };
                setCurrentShape(newRect);
            } else if (tool === 'circle' && currentShape) {
                const newCircle = {
                    ...currentShape,
                    radius: Math.sqrt(Math.pow(point.x - (currentShape.x || 0), 2) + Math.pow(point.y - (currentShape.y || 0), 2))
                };
                setCurrentShape(newCircle);
            } else if (tool === 'pen' || tool === 'eraser') {
                const lastShape = shapes[shapes.length - 1];
                if (lastShape) {
                    lastShape.points = lastShape.points.concat([
                        point.x,
                        point.y
                    ]);
                    setShapes(shapes.slice());
                }
            }
        }
    }["Whiteboard.useCallback[handleMouseMove]"], [
        isDrawing,
        tool,
        currentShape,
        shapes
    ]);
    const handleMouseUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Whiteboard.useCallback[handleMouseUp]": ()=>{
            console.log('handleMouseUp');
            setIsDrawing(false);
            if ((tool === 'rectangle' || tool === 'circle') && currentShape) {
                setShapes({
                    "Whiteboard.useCallback[handleMouseUp]": (prev)=>[
                            ...prev,
                            currentShape
                        ]
                }["Whiteboard.useCallback[handleMouseUp]"]);
            }
            setCurrentShape(null);
        }
    }["Whiteboard.useCallback[handleMouseUp]"], [
        tool,
        currentShape
    ]);
    const handleSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Whiteboard.useCallback[handleSave]": async ()=>{
            try {
                if (!stageRef.current) return;
                // Convert stage to image data URL
                const dataURL = stageRef.current.toDataURL({
                    pixelRatio: 2,
                    mimeType: 'image/png'
                });
                // Convert data URL to blob
                const res = await fetch(dataURL);
                const blob = await res.blob();
                const fileName = `whiteboard_${Date.now()}.png`;
                await onSave(blob, fileName);
                setIsOpen(false);
                toast({
                    title: 'Success',
                    description: 'Drawing saved successfully'
                });
            } catch (error) {
                console.error('Failed to save drawing:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to save drawing',
                    variant: 'destructive'
                });
            }
        }
    }["Whiteboard.useCallback[handleSave]"], [
        onSave,
        toast
    ]);
    const clearCanvas = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Whiteboard.useCallback[clearCanvas]": ()=>{
            setShapes([]);
            setCurrentShape(null);
            setSelectedShape(null);
            transformerRef.current?.nodes([]);
        }
    }["Whiteboard.useCallback[clearCanvas]"], []);
    const handleDragEnd = (e)=>{
        const id = e.target.id();
        const newShapes = shapes.slice();
        const shape = newShapes.find((s)=>s.id === id);
        if (shape) {
            shape.x = e.target.x();
            shape.y = e.target.y();
            setShapes(newShapes);
        }
    };
    const onTransformEnd = (e)=>{
        const node = e.target;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        const id = node.id();
        const newShapes = shapes.slice();
        const shape = newShapes.find((s)=>s.id === id);
        if (shape) {
            if (shape.tool === 'rectangle') {
                const rectShape = shape;
                rectShape.width = Math.max(5, rectShape.width * scaleX);
                rectShape.height = Math.max(5, rectShape.height * scaleY);
            } else if (shape.tool === 'text') {
                const textShape = shape;
                textShape.fontSize = Math.max(5, textShape.fontSize * scaleX);
            } else if (shape.tool === 'circle') {
                const circleShape = shape;
                circleShape.radius = Math.max(5, circleShape.radius * scaleX);
            } else if (shape.tool === 'image') {
                const imageShape = shape;
                imageShape.width = Math.max(5, imageShape.width * scaleX);
                imageShape.height = Math.max(5, imageShape.height * scaleY);
            }
            // Reset scale
            node.scaleX(1);
            node.scaleY(1);
            setShapes(newShapes);
        }
    };
    const handleTextChange = (e)=>{
        setText(e.target.value);
    };
    const handleTextKeyDown = (e)=>{
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const newShape = {
                id: Date.now().toString(),
                tool: 'text',
                text,
                x: textPosition.x,
                y: textPosition.y,
                color,
                fontSize: 20
            };
            setShapes((prev)=>[
                    ...prev,
                    newShape
                ]);
            setIsTextEditing(false);
            setText('');
        }
    };
    const deleteSelectedShape = ()=>{
        if (selectedShape) {
            setShapes(shapes.filter((shape)=>shape.id !== selectedShape));
            setSelectedShape(null);
            transformerRef.current?.nodes([]);
        }
    };
    const handleImageUpload = (e)=>{
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = ()=>{
                const img = new window.Image();
                img.src = reader.result;
                img.onload = ()=>{
                    const newShape = {
                        id: Date.now().toString(),
                        tool: 'image',
                        image: img,
                        x: 20,
                        y: 20,
                        width: img.width,
                        height: img.height,
                        color: '#000000'
                    };
                    setShapes((prev)=>[
                            ...prev,
                            newShape
                        ]);
                };
            };
            reader.readAsDataURL(file);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
        open: isOpen,
        onOpenChange: setIsOpen,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTrigger"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "outline",
                    disabled: disabled,
                    className: "gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pen$3e$__["Pen"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                            lineNumber: 333,
                            columnNumber: 11
                        }, this),
                        "Whiteboard"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                    lineNumber: 332,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                lineNumber: 331,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                className: "max-w-6xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                            children: "Whiteboard"
                        }, void 0, false, {
                            fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                            lineNumber: 339,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                        lineNumber: 338,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: tool === 'selection' ? 'default' : 'outline',
                                        size: "sm",
                                        onClick: ()=>setTool('selection'),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$move$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Move$3e$__["Move"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                            lineNumber: 350,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                        lineNumber: 345,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: tool === 'pen' ? 'default' : 'outline',
                                        size: "sm",
                                        onClick: ()=>setTool('pen'),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pen$3e$__["Pen"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                            lineNumber: 357,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                        lineNumber: 352,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: tool === 'eraser' ? 'default' : 'outline',
                                        size: "sm",
                                        onClick: ()=>setTool('eraser'),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eraser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eraser$3e$__["Eraser"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                            lineNumber: 364,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                        lineNumber: 359,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: tool === 'rectangle' ? 'default' : 'outline',
                                        size: "sm",
                                        onClick: ()=>setTool('rectangle'),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__["Square"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                            lineNumber: 371,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                        lineNumber: 366,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: tool === 'circle' ? 'default' : 'outline',
                                        size: "sm",
                                        onClick: ()=>setTool('circle'),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__["Circle"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                            lineNumber: 378,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                        lineNumber: 373,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: tool === 'text' ? 'default' : 'outline',
                                        size: "sm",
                                        onClick: ()=>setTool('text'),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$type$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Type$3e$__["Type"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                            lineNumber: 385,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                        lineNumber: 380,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: tool === 'image' ? 'default' : 'outline',
                                        size: "sm",
                                        onClick: ()=>setTool('image'),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                            lineNumber: 392,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                        lineNumber: 387,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "color",
                                        value: color,
                                        onChange: (e)=>setColor(e.target.value),
                                        className: "h-9 w-9 rounded border p-1"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                        lineNumber: 396,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "range",
                                        min: "1",
                                        max: "20",
                                        value: strokeWidth,
                                        onChange: (e)=>setStrokeWidth(Number(e.target.value)),
                                        className: "w-32"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                        lineNumber: 404,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        size: "sm",
                                        onClick: clearCanvas,
                                        children: "Clear"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                        lineNumber: 414,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        size: "sm",
                                        onClick: deleteSelectedShape,
                                        disabled: !selectedShape,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                            lineNumber: 429,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                        lineNumber: 423,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                lineNumber: 344,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ref: containerRef,
                                className: "h-[600px] w-full border rounded-lg overflow-hidden bg-white relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "file",
                                        ref: fileInputRef,
                                        onChange: handleImageUpload,
                                        style: {
                                            display: 'none'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                        lineNumber: 435,
                                        columnNumber: 13
                                    }, this),
                                    isTextEditing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        value: text,
                                        onChange: handleTextChange,
                                        onKeyDown: handleTextKeyDown,
                                        style: {
                                            position: 'absolute',
                                            top: textPosition.y,
                                            left: textPosition.x,
                                            zIndex: 100,
                                            border: '1px solid #ccc',
                                            padding: '4px',
                                            fontSize: '20px',
                                            fontFamily: 'sans-serif',
                                            color: color,
                                            background: 'white',
                                            outline: 'none',
                                            resize: 'none',
                                            overflow: 'hidden',
                                            whiteSpace: 'pre-wrap'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                        lineNumber: 437,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Stage"], {
                                        ref: stageRef,
                                        width: width,
                                        height: height,
                                        onMouseDown: handleMouseDown,
                                        onMousemove: handleMouseMove,
                                        onMouseup: handleMouseUp,
                                        onTouchstart: handleMouseDown,
                                        onTouchmove: handleMouseMove,
                                        onTouchend: handleMouseUp,
                                        style: {
                                            background: 'white'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Layer"], {
                                            children: [
                                                shapes.map((shape, i)=>{
                                                    if (shape.tool === 'rectangle') {
                                                        const rectShape = shape;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Rect"], {
                                                            id: rectShape.id,
                                                            x: rectShape.x,
                                                            y: rectShape.y,
                                                            width: rectShape.width,
                                                            height: rectShape.height,
                                                            stroke: rectShape.color,
                                                            strokeWidth: rectShape.strokeWidth,
                                                            draggable: tool === 'selection',
                                                            onClick: ()=>{
                                                                if (tool === 'selection') {
                                                                    setSelectedShape(rectShape.id);
                                                                    transformerRef.current.nodes([
                                                                        stageRef.current.findOne(`#${rectShape.id}`)
                                                                    ]);
                                                                    transformerRef.current.getLayer().batchDraw();
                                                                }
                                                            },
                                                            onDragEnd: handleDragEnd,
                                                            onTransformEnd: onTransformEnd
                                                        }, i, false, {
                                                            fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                                            lineNumber: 476,
                                                            columnNumber: 23
                                                        }, this);
                                                    } else if (shape.tool === 'pen' || shape.tool === 'eraser') {
                                                        const lineShape = shape;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                                                            id: lineShape.id,
                                                            points: lineShape.points,
                                                            stroke: lineShape.color,
                                                            strokeWidth: lineShape.strokeWidth,
                                                            tension: 0.5,
                                                            lineCap: "round",
                                                            lineJoin: "round",
                                                            globalCompositeOperation: lineShape.tool === 'eraser' ? 'destination-out' : 'source-over',
                                                            draggable: tool === 'selection',
                                                            onClick: ()=>{
                                                                if (tool === 'selection') {
                                                                    setSelectedShape(lineShape.id);
                                                                    transformerRef.current.nodes([
                                                                        stageRef.current.findOne(`#${lineShape.id}`)
                                                                    ]);
                                                                    transformerRef.current.getLayer().batchDraw();
                                                                }
                                                            },
                                                            onDragEnd: handleDragEnd,
                                                            onTransformEnd: onTransformEnd
                                                        }, i, false, {
                                                            fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                                            lineNumber: 500,
                                                            columnNumber: 23
                                                        }, this);
                                                    } else if (shape.tool === 'text') {
                                                        const textShape = shape;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Text"], {
                                                            id: textShape.id,
                                                            x: textShape.x,
                                                            y: textShape.y,
                                                            text: textShape.text,
                                                            fontSize: textShape.fontSize,
                                                            fill: textShape.color,
                                                            draggable: tool === 'selection',
                                                            onClick: ()=>{
                                                                if (tool === 'selection') {
                                                                    setSelectedShape(textShape.id);
                                                                    transformerRef.current.nodes([
                                                                        stageRef.current.findOne(`#${textShape.id}`)
                                                                    ]);
                                                                    transformerRef.current.getLayer().batchDraw();
                                                                }
                                                            },
                                                            onDragEnd: handleDragEnd,
                                                            onTransformEnd: onTransformEnd
                                                        }, i, false, {
                                                            fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                                            lineNumber: 527,
                                                            columnNumber: 23
                                                        }, this);
                                                    } else if (shape.tool === 'circle') {
                                                        const circleShape = shape;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Circle"], {
                                                            id: circleShape.id,
                                                            x: circleShape.x,
                                                            y: circleShape.y,
                                                            radius: circleShape.radius,
                                                            stroke: circleShape.color,
                                                            strokeWidth: circleShape.strokeWidth,
                                                            draggable: tool === 'selection',
                                                            onClick: ()=>{
                                                                if (tool === 'selection') {
                                                                    setSelectedShape(circleShape.id);
                                                                    transformerRef.current.nodes([
                                                                        stageRef.current.findOne(`#${circleShape.id}`)
                                                                    ]);
                                                                    transformerRef.current.getLayer().batchDraw();
                                                                }
                                                            },
                                                            onDragEnd: handleDragEnd,
                                                            onTransformEnd: onTransformEnd
                                                        }, i, false, {
                                                            fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                                            lineNumber: 550,
                                                            columnNumber: 23
                                                        }, this);
                                                    } else if (shape.tool === 'image') {
                                                        const imageShape = shape;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Image"], {
                                                            id: imageShape.id,
                                                            image: imageShape.image,
                                                            x: imageShape.x,
                                                            y: imageShape.y,
                                                            width: imageShape.width,
                                                            height: imageShape.height,
                                                            draggable: tool === 'selection',
                                                            onClick: ()=>{
                                                                if (tool === 'selection') {
                                                                    setSelectedShape(imageShape.id);
                                                                    transformerRef.current.nodes([
                                                                        stageRef.current.findOne(`#${imageShape.id}`)
                                                                    ]);
                                                                    transformerRef.current.getLayer().batchDraw();
                                                                }
                                                            },
                                                            onDragEnd: handleDragEnd,
                                                            onTransformEnd: onTransformEnd
                                                        }, i, false, {
                                                            fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                                            lineNumber: 573,
                                                            columnNumber: 23
                                                        }, this);
                                                    }
                                                    return null;
                                                }),
                                                currentShape && currentShape.tool === 'rectangle' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Rect"], {
                                                    x: currentShape.x,
                                                    y: currentShape.y,
                                                    width: currentShape.width,
                                                    height: currentShape.height,
                                                    stroke: currentShape.color,
                                                    strokeWidth: currentShape.strokeWidth
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                                    lineNumber: 598,
                                                    columnNumber: 19
                                                }, this),
                                                currentShape && currentShape.tool === 'circle' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Circle"], {
                                                    x: currentShape.x,
                                                    y: currentShape.y,
                                                    radius: currentShape.radius,
                                                    stroke: currentShape.color,
                                                    strokeWidth: currentShape.strokeWidth
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                                    lineNumber: 608,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$konva$2f$es$2f$ReactKonvaCore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Transformer"], {
                                                    ref: transformerRef
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                                    lineNumber: 616,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                            lineNumber: 471,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                        lineNumber: 459,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                lineNumber: 434,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-end gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        onClick: ()=>setIsOpen(false),
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                        lineNumber: 623,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: handleSave,
                                        children: "Save Drawing"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                        lineNumber: 626,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                                lineNumber: 622,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                        lineNumber: 342,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
                lineNumber: 337,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/storage/whiteboard.implementation.tsx",
        lineNumber: 330,
        columnNumber: 5
    }, this);
}
_s(Whiteboard, "GyvS3m5R2Mv7wWawrcNllrDAQ5o=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$stage$2d$size$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStageSize"]
    ];
});
_c = Whiteboard;
var _c;
__turbopack_context__.k.register(_c, "Whiteboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/storage/whiteboard.implementation.tsx [app-client] (ecmascript, next/dynamic entry)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/storage/whiteboard.implementation.tsx [app-client] (ecmascript)"));
}}),
}]);

//# sourceMappingURL=src_8493edba._.js.map