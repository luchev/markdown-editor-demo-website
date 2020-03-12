class Editor {
    constructor(private container: HTMLElement, private theme: EditorTheme = new EditorTheme()) {
        container.contentEditable = "true";
        this.applyTheme();
    }

    private applyTheme(): void {
        let cssString: string = "";
        Object.entries(this.theme.style).forEach(([key, value]: [string, string]) => {
            if (value != "") {
                console.log(key, value);
            }
            cssString += `${key}: ${value}; `;
        });
        this.container.style.cssText = cssString;
    }
}

class CSSManager {
    private styleElement: HTMLStyleElement;

    constructor() {
        this.styleElement = document.createElement('style');
        this.styleElement.type = "text/css";
        document.getElementsByTagName("head")[0].appendChild(this.styleElement);
    }

    public addClass(className: string): void {
        this.styleElement.innerHTML += ` .${className} { color: red; } `;
    }
}

class EditorTheme {
    constructor(public name: string = "", public style: CSSProperties = {}) { }
}

class CSSClass {
    constructor(public name: string, public properties: CSSProperties) { }
}

class MDTheme {
    constructor(public name: string = "", public classes: CSSClass[]) { }
}

// Add editor themes
let editorThemes: EditorTheme[] = new Array<EditorTheme>();

editorThemes.push(new EditorTheme("dark", {
    background: "#202225",
    width: "826px",
    height: "300px",
    padding: "20px 30px 20px 30px",
    "border-radius": "5px",
    cursor: "default",
    overflow: "auto",
    "box-shadow": "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    color: "#dcddde",
    outline: "none",
}));

editorThemes.push(new EditorTheme("light", {
    background: "white",
    width: "826px",
    height: "300px",
    padding: "20px 30px 20px 30px",
    "border-radius": "5px",
    cursor: "default",
    overflow: "auto",
    "box-shadow": "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    color: "black",
    outline: "none",
}));

let s = document.getElementById('editor');
let p = new Editor(<HTMLElement>s, editorThemes[0]);


// import { Properties as style } from 'csstype';

// const style: style<string | number> = {
//     padding: 10,
//     margin: '1rem',
//     color: "red",
//     height: "123",
// };

// class Editor {
//     constructor(private container: HTMLElement, private theme: EditorTheme = new EditorTheme()) {
//         container.contentEditable = "true";
//         this.applyTheme();
//     }

//     private applyTheme(): void {
//         let styleContent: string = "";
//         Object.entries(this.theme).forEach(([key, value]: [string, any]) => {
//             if (value != "") {
//                 // this.container.style.setProperty(key, value);
//                 this.container.style[key] = value;
//                 // styleContent += `${key}: ${value};`;
//             }
//         });
//         // this.container.style.cssText = styleContent;
//     }
// }

// class CSSManager {
//     private styleElement: HTMLStyleElement;

//     constructor() {
//         this.styleElement = document.createElement('style');
//         this.styleElement.type = "text/css";
//         document.getElementsByTagName("head")[0].appendChild(this.styleElement);
//     }

//     public addClass(className: string): void {
//         this.styleElement.innerHTML += ` .${className} { color: red; } `;
//     }
// }

// class EditorTheme {
//     public background: string = "";
//     public fontSize: string = "";
//     public font: string = "";
//     public width: string = "";
//     public height: string = "";
//     public padding: string = "";
//     public color: string = "";
//     public cursor: string = "";
//     public boxShadow: string = "";
//     public margin: string = "";
//     public display: string = "";
//     public border: string = "";
//     public borderRadius: string = "";
//     public overflow: string = "";
//     public outline: string = "";

//     constructor(
//         {
//             background,
//             fontSize,
//             font,
//             width,
//             height,
//             padding,
//             color,
//             cursor,
//             boxShadow,
//             margin,
//             display,
//             border,
//             borderRadius,
//             overflow,
//             outline
//         }: {
//             background?: string
//             fontSize?: string,
//             font?: string,
//             width?: string,
//             height?: string,
//             padding?: string,
//             color?: string,
//             cursor?: string,
//             boxShadow?: string,
//             margin?: string,
//             display?: string,
//             border?: string,
//             borderRadius?: string,
//             overflow?: string,
//             outline?: string,
//         } = {}) {
//         if (background) { this.background = background; }
//         if (fontSize) { this.fontSize = fontSize; }
//         if (width) { this.width = width; }
//         if (height) { this.height = height; }
//         if (padding) { this.padding = padding; }
//         if (color) { this.color = color; }
//         if (cursor) { this.cursor = cursor; }
//         if (boxShadow) { this.boxShadow = boxShadow; }
//         if (margin) { this.margin = margin; }
//         if (display) { this.display = display; }
//         if (border) { this.border = border; }
//         if (borderRadius) { this.borderRadius = borderRadius; }
//         if (overflow) { this.overflow = overflow; }
//         if (font) { this.font = font; }
//         if (outline) { this.outline = outline; }
//     }
// }

// let editorThemes: { [name: string]: EditorTheme; } = {};

// editorThemes["dark"] = new EditorTheme({
//     background: "#202225",
//     width: "826px",
//     height: "300px",
//     padding: "20px 30px 20px 30px",
//     borderRadius: "5px",
//     cursor: "default",
//     overflow: "auto",
//     boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
//     color: "#dcddde",
//     outline: "none",
// });

// editorThemes["white"] = new EditorTheme({
//     background: "white",
//     width: "826px",
//     height: "300px",
//     padding: "20px 30px 20px 30px",
//     borderRadius: "5px",
//     cursor: "default",
//     overflow: "auto",
//     boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
//     color: "black",
//     outline: "none",
// });

// let s = document.getElementById('editor');
// let p = new Editor(<HTMLElement>s, editorThemes["white"]);



interface Properties extends StandardProperties, SvgProperties { }
interface StandardProperties extends StandardLonghandProperties, StandardShorthandProperties { }
interface StandardLonghandProperties {
    alignContent?: string;
    alignItems?: string;
    alignSelf?: string;
    animationDelay?: string;
    animationDirection?: string;
    animationDuration?: string;
    animationFillMode?: string;
    animationIterationCount?: string;
    animationName?: string;
    animationPlayState?: string;
    animationTimingFunction?: string;
    appearance?: string;
    aspectRatio?: string;
    backdropFilter?: string;
    backfaceVisibility?: string;
    backgroundAttachment?: string;
    backgroundBlendMode?: string;
    backgroundClip?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundOrigin?: string;
    backgroundPosition?: string;
    backgroundPositionX?: string;
    backgroundPositionY?: string;
    backgroundRepeat?: string;
    backgroundSize?: string;
    blockOverflow?: string;
    blockSize?: string;
    borderBlockColor?: string;
    borderBlockEndColor?: string;
    borderBlockEndStyle?: string;
    borderBlockEndWidth?: string;
    borderBlockStartColor?: string;
    borderBlockStartStyle?: string;
    borderBlockStartWidth?: string;
    borderBlockStyle?: string;
    borderBlockWidth?: string;
    borderBottomColor?: string;
    borderBottomLeftRadius?: string;
    borderBottomRightRadius?: string;
    borderBottomStyle?: string;
    borderBottomWidth?: string;
    borderCollapse?: string;
    borderEndEndRadius?: string;
    borderEndStartRadius?: string;
    borderImageOutset?: string;
    borderImageRepeat?: string;
    borderImageSlice?: string;
    borderImageSource?: string;
    borderImageWidth?: string;
    borderInlineColor?: string;
    borderInlineEndColor?: string;
    borderInlineEndStyle?: string;
    borderInlineEndWidth?: string;
    borderInlineStartColor?: string;
    borderInlineStartStyle?: string;
    borderInlineStartWidth?: string;
    borderInlineStyle?: string;
    borderInlineWidth?: string;
    borderLeftColor?: string;
    borderLeftStyle?: string;
    borderLeftWidth?: string;
    borderRightColor?: string;
    borderRightStyle?: string;
    borderRightWidth?: string;
    borderSpacing?: string;
    borderStartEndRadius?: string;
    borderStartStartRadius?: string;
    borderTopColor?: string;
    borderTopLeftRadius?: string;
    borderTopRightRadius?: string;
    borderTopStyle?: string;
    borderTopWidth?: string;
    bottom?: string;
    boxDecorationBreak?: string;
    boxShadow?: string;
    boxSizing?: string;
    breakAfter?: string;
    breakBefore?: string;
    breakInside?: string;
    captionSide?: string;
    caretColor?: string;
    clear?: string;
    clipPath?: string;
    color?: string;
    colorAdjust?: string;
    columnCount?: string;
    columnFill?: string;
    columnGap?: string;
    columnRuleColor?: string;
    columnRuleStyle?: string;
    columnRuleWidth?: string;
    columnSpan?: string;
    columnWidth?: string;
    contain?: string;
    content?: string;
    counterIncrement?: string;
    counterReset?: string;
    counterSet?: string;
    cursor?: string;
    direction?: string;
    display?: string;
    emptyCells?: string;
    filter?: string;
    flexBasis?: string;
    flexDirection?: string;
    flexGrow?: string;
    flexShrink?: string;
    flexWrap?: string;
    float?: string;
    fontFamily?: string;
    fontFeatureSettings?: string;
    fontKerning?: string;
    fontLanguageOverride?: string;
    fontOpticalSizing?: string;
    fontSize?: string;
    fontSizeAdjust?: string;
    fontStretch?: string;
    fontStyle?: string;
    fontSynthesis?: string;
    fontVariant?: string;
    fontVariantCaps?: string;
    fontVariantEastAsian?: string;
    fontVariantLigatures?: string;
    fontVariantNumeric?: string;
    fontVariantPosition?: string;
    fontVariationSettings?: string;
    fontWeight?: string;
    gridAutoColumns?: string;
    gridAutoFlow?: string;
    gridAutoRows?: string;
    gridColumnEnd?: string;
    gridColumnStart?: string;
    gridRowEnd?: string;
    gridRowStart?: string;
    gridTemplateAreas?: string;
    gridTemplateColumns?: string;
    gridTemplateRows?: string;
    hangingPunctuation?: string;
    height?: string;
    hyphens?: string;
    imageOrientation?: string;
    imageRendering?: string;
    imageResolution?: string;
    initialLetter?: string;
    inlineSize?: string;
    inset?: string;
    insetBlock?: string;
    insetBlockEnd?: string;
    insetBlockStart?: string;
    insetInline?: string;
    insetInlineEnd?: string;
    insetInlineStart?: string;
    isolation?: string;
    justifyContent?: string;
    justifyItems?: string;
    justifySelf?: string;
    left?: string;
    letterSpacing?: string;
    lineBreak?: string;
    lineHeight?: string;
    lineHeightStep?: string;
    listStyleImage?: string;
    listStylePosition?: string;
    listStyleType?: string;
    marginBlock?: string;
    marginBlockEnd?: string;
    marginBlockStart?: string;
    marginBottom?: string;
    marginInline?: string;
    marginInlineEnd?: string;
    marginInlineStart?: string;
    marginLeft?: string;
    marginRight?: string;
    marginTop?: string;
    maskBorderMode?: string;
    maskBorderOutset?: string;
    maskBorderRepeat?: string;
    maskBorderSlice?: string;
    maskBorderSource?: string;
    maskBorderWidth?: string;
    maskClip?: string;
    maskComposite?: string;
    maskImage?: string;
    maskMode?: string;
    maskOrigin?: string;
    maskPosition?: string;
    maskRepeat?: string;
    maskSize?: string;
    maskType?: string;
    maxBlockSize?: string;
    maxHeight?: string;
    maxInlineSize?: string;
    maxLines?: string;
    maxWidth?: string;
    minBlockSize?: string;
    minHeight?: string;
    minInlineSize?: string;
    minWidth?: string;
    mixBlendMode?: string;
    motionDistance?: string;
    motionPath?: string;
    motionRotation?: string;
    objectFit?: string;
    objectPosition?: string;
    offsetAnchor?: string;
    offsetDistance?: string;
    offsetPath?: string;
    offsetRotate?: string;
    offsetRotation?: string;
    opacity?: string;
    order?: string;
    orphans?: string;
    outlineColor?: string;
    outlineOffset?: string;
    outlineStyle?: string;
    outlineWidth?: string;
    overflow?: string;
    overflowAnchor?: string;
    overflowBlock?: string;
    overflowClipBox?: string;
    overflowInline?: string;
    overflowWrap?: string;
    overflowX?: string;
    overflowY?: string;
    overscrollBehavior?: string;
    overscrollBehaviorBlock?: string;
    overscrollBehaviorInline?: string;
    overscrollBehaviorX?: string;
    overscrollBehaviorY?: string;
    paddingBlock?: string;
    paddingBlockEnd?: string;
    paddingBlockStart?: string;
    paddingBottom?: string;
    paddingInline?: string;
    paddingInlineEnd?: string;
    paddingInlineStart?: string;
    paddingLeft?: string;
    paddingRight?: string;
    paddingTop?: string;
    pageBreakAfter?: string;
    pageBreakBefore?: string;
    pageBreakInside?: string;
    paintOrder?: string;
    perspective?: string;
    perspectiveOrigin?: string;
    placeContent?: string;
    pointerEvents?: string;
    position?: string;
    quotes?: string;
    resize?: string;
    right?: string;
    rotate?: string;
    rowGap?: string;
    rubyAlign?: string;
    rubyMerge?: string;
    rubyPosition?: string;
    scale?: string;
    scrollBehavior?: string;
    scrollMargin?: string;
    scrollMarginBlock?: string;
    scrollMarginBlockEnd?: string;
    scrollMarginBlockStart?: string;
    scrollMarginBottom?: string;
    scrollMarginInline?: string;
    scrollMarginInlineEnd?: string;
    scrollMarginInlineStart?: string;
    scrollMarginLeft?: string;
    scrollMarginRight?: string;
    scrollMarginTop?: string;
    scrollPadding?: string;
    scrollPaddingBlock?: string;
    scrollPaddingBlockEnd?: string;
    scrollPaddingBlockStart?: string;
    scrollPaddingBottom?: string;
    scrollPaddingInline?: string;
    scrollPaddingInlineEnd?: string;
    scrollPaddingInlineStart?: string;
    scrollPaddingLeft?: string;
    scrollPaddingRight?: string;
    scrollPaddingTop?: string;
    scrollSnapAlign?: string;
    scrollSnapStop?: string;
    scrollSnapType?: string;
    scrollbarColor?: string;
    scrollbarWidth?: string;
    shapeImageThreshold?: string;
    shapeMargin?: string;
    shapeOutside?: string;
    tabSize?: string;
    tableLayout?: string;
    textAlign?: string;
    textAlignLast?: string;
    textCombineUpright?: string;
    textDecorationColor?: string;
    textDecorationLine?: string;
    textDecorationSkip?: string;
    textDecorationSkipInk?: string;
    textDecorationStyle?: string;
    textDecorationThickness?: string;
    textDecorationWidth?: string;
    textEmphasisColor?: string;
    textEmphasisPosition?: string;
    textEmphasisStyle?: string;
    textIndent?: string;
    textJustify?: string;
    textOrientation?: string;
    textOverflow?: string;
    textRendering?: string;
    textShadow?: string;
    textSizeAdjust?: string;
    textTransform?: string;
    textUnderlineOffset?: string;
    textUnderlinePosition?: string;
    top?: string;
    touchAction?: string;
    transform?: string;
    transformBox?: string;
    transformOrigin?: string;
    transformStyle?: string;
    transitionDelay?: string;
    transitionDuration?: string;
    transitionProperty?: string;
    transitionTimingFunction?: string;
    translate?: string;
    unicodeBidi?: string;
    userSelect?: string;
    verticalAlign?: string;
    visibility?: string;
    whiteSpace?: string;
    widows?: string;
    width?: string;
    willChange?: string;
    wordBreak?: string;
    wordSpacing?: string;
    wordWrap?: string;
    writingMode?: string;
    zIndex?: string;
    zoom?: string;
}
interface StandardShorthandProperties {
    all?: string;
    animation?: string;
    background?: string;
    border?: string;
    borderBlock?: string;
    borderBlockEnd?: string;
    borderBlockStart?: string;
    borderBottom?: string;
    borderColor?: string;
    borderImage?: string;
    borderInline?: string;
    borderInlineEnd?: string;
    borderInlineStart?: string;
    borderLeft?: string;
    borderRadius?: string;
    borderRight?: string;
    borderStyle?: string;
    borderTop?: string;
    borderWidth?: string;
    columnRule?: string;
    columns?: string;
    flex?: string;
    flexFlow?: string;
    font?: string;
    gap?: string;
    grid?: string;
    gridArea?: string;
    gridColumn?: string;
    gridRow?: string;
    gridTemplate?: string;
    lineClamp?: string;
    listStyle?: string;
    margin?: string;
    mask?: string;
    maskBorder?: string;
    motion?: string;
    offset?: string;
    outline?: string;
    padding?: string;
    placeItems?: string;
    placeSelf?: string;
    textDecoration?: string;
    textEmphasis?: string;
    transition?: string;
}
interface SvgProperties {
    alignmentBaseline?: string;
    baselineShift?: string;
    clip?: string;
    clipPath?: string;
    clipRule?: string;
    color?: string;
    colorInterpolation?: string;
    colorRendering?: string;
    cursor?: string;
    direction?: string;
    display?: string;
    dominantBaseline?: string;
    fill?: string;
    fillOpacity?: string;
    fillRule?: string;
    filter?: string;
    floodColor?: string;
    floodOpacity?: string;
    font?: string;
    fontFamily?: string;
    fontSize?: string;
    fontSizeAdjust?: string;
    fontStretch?: string;
    fontStyle?: string;
    fontVariant?: string;
    fontWeight?: string;
    glyphOrientationVertical?: string;
    imageRendering?: string;
    letterSpacing?: string;
    lightingColor?: string;
    lineHeight?: string;
    marker?: string;
    markerEnd?: string;
    markerMid?: string;
    markerStart?: string;
    mask?: string;
    opacity?: string;
    overflow?: string;
    paintOrder?: string;
    pointerEvents?: string;
    shapeRendering?: string;
    stopColor?: string;
    stopOpacity?: string;
    stroke?: string;
    strokeDasharray?: string;
    strokeDashoffset?: string;
    strokeLinecap?: string;
    strokeLinejoin?: string;
    strokeMiterlimit?: string;
    strokeOpacity?: string;
    strokeWidth?: string;
    textAnchor?: string;
    textDecoration?: string;
    textRendering?: string;
    unicodeBidi?: string;
    vectorEffect?: string;
    visibility?: string;
    whiteSpace?: string;
    wordSpacing?: string;
    writingMode?: string;
}

interface CSSProperties extends StandardPropertiesHyphen, SvgPropertiesHyphen { }
interface StandardPropertiesHyphen extends StandardLonghandPropertiesHyphen, StandardShorthandPropertiesHyphen { }
interface StandardLonghandPropertiesHyphen {
    "align-content"?: string;
    "align-items"?: string;
    "align-self"?: string;
    "animation-delay"?: string;
    "animation-direction"?: string;
    "animation-duration"?: string;
    "animation-fill-mode"?: string;
    "animation-iteration-count"?: string;
    "animation-name"?: string;
    "animation-play-state"?: string;
    "animation-timing-function"?: string;
    appearance?: string;
    "aspect-ratio"?: string;
    "backdrop-filter"?: string;
    "backface-visibility"?: string;
    "background-attachment"?: string;
    "background-blend-mode"?: string;
    "background-clip"?: string;
    "background-color"?: string;
    "background-image"?: string;
    "background-origin"?: string;
    "background-position"?: string;
    "background-position-x"?: string;
    "background-position-y"?: string;
    "background-repeat"?: string;
    "background-size"?: string;
    "block-overflow"?: string;
    "block-size"?: string;
    "border-block-color"?: string;
    "border-block-end-color"?: string;
    "border-block-end-style"?: string;
    "border-block-end-width"?: string;
    "border-block-start-color"?: string;
    "border-block-start-style"?: string;
    "border-block-start-width"?: string;
    "border-block-style"?: string;
    "border-block-width"?: string;
    "border-bottom-color"?: string;
    "border-bottom-left-radius"?: string;
    "border-bottom-right-radius"?: string;
    "border-bottom-style"?: string;
    "border-bottom-width"?: string;
    "border-collapse"?: string;
    "border-end-end-radius"?: string;
    "border-end-start-radius"?: string;
    "border-image-outset"?: string;
    "border-image-repeat"?: string;
    "border-image-slice"?: string;
    "border-image-source"?: string;
    "border-image-width"?: string;
    "border-inline-color"?: string;
    "border-inline-end-color"?: string;
    "border-inline-end-style"?: string;
    "border-inline-end-width"?: string;
    "border-inline-start-color"?: string;
    "border-inline-start-style"?: string;
    "border-inline-start-width"?: string;
    "border-inline-style"?: string;
    "border-inline-width"?: string;
    "border-left-color"?: string;
    "border-left-style"?: string;
    "border-left-width"?: string;
    "border-right-color"?: string;
    "border-right-style"?: string;
    "border-right-width"?: string;
    "border-spacing"?: string;
    "border-start-end-radius"?: string;
    "border-start-start-radius"?: string;
    "border-top-color"?: string;
    "border-top-left-radius"?: string;
    "border-top-right-radius"?: string;
    "border-top-style"?: string;
    "border-top-width"?: string;
    bottom?: string;
    "box-decoration-break"?: string;
    "box-shadow"?: string;
    "box-sizing"?: string;
    "break-after"?: string;
    "break-before"?: string;
    "break-inside"?: string;
    "caption-side"?: string;
    "caret-color"?: string;
    clear?: string;
    "clip-path"?: string;
    color?: string;
    "color-adjust"?: string;
    "column-count"?: string;
    "column-fill"?: string;
    "column-gap"?: string;
    "column-rule-color"?: string;
    "column-rule-style"?: string;
    "column-rule-width"?: string;
    "column-span"?: string;
    "column-width"?: string;
    contain?: string;
    content?: string;
    "counter-increment"?: string;
    "counter-reset"?: string;
    "counter-set"?: string;
    cursor?: string;
    direction?: string;
    display?: string;
    "empty-cells"?: string;
    filter?: string;
    "flex-basis"?: string;
    "flex-direction"?: string;
    "flex-grow"?: string;
    "flex-shrink"?: string;
    "flex-wrap"?: string;
    float?: string;
    "font-family"?: string;
    "font-feature-settings"?: string;
    "font-kerning"?: string;
    "font-language-override"?: string;
    "font-optical-sizing"?: string;
    "font-size"?: string;
    "font-size-adjust"?: string;
    "font-stretch"?: string;
    "font-style"?: string;
    "font-synthesis"?: string;
    "font-variant"?: string;
    "font-variant-caps"?: string;
    "font-variant-east-asian"?: string;
    "font-variant-ligatures"?: string;
    "font-variant-numeric"?: string;
    "font-variant-position"?: string;
    "font-variation-settings"?: string;
    "font-weight"?: string;
    "grid-auto-columns"?: string;
    "grid-auto-flow"?: string;
    "grid-auto-rows"?: string;
    "grid-column-end"?: string;
    "grid-column-start"?: string;
    "grid-row-end"?: string;
    "grid-row-start"?: string;
    "grid-template-areas"?: string;
    "grid-template-columns"?: string;
    "grid-template-rows"?: string;
    "hanging-punctuation"?: string;
    height?: string;
    hyphens?: string;
    "image-orientation"?: string;
    "image-rendering"?: string;
    "image-resolution"?: string;
    "initial-letter"?: string;
    "inline-size"?: string;
    inset?: string;
    "inset-block"?: string;
    "inset-block-end"?: string;
    "inset-block-start"?: string;
    "inset-inline"?: string;
    "inset-inline-end"?: string;
    "inset-inline-start"?: string;
    isolation?: string;
    "justify-content"?: string;
    "justify-items"?: string;
    "justify-self"?: string;
    left?: string;
    "letter-spacing"?: string;
    "line-break"?: string;
    "line-height"?: string;
    "line-height-step"?: string;
    "list-style-image"?: string;
    "list-style-position"?: string;
    "list-style-type"?: string;
    "margin-block"?: string;
    "margin-block-end"?: string;
    "margin-block-start"?: string;
    "margin-bottom"?: string;
    "margin-inline"?: string;
    "margin-inline-end"?: string;
    "margin-inline-start"?: string;
    "margin-left"?: string;
    "margin-right"?: string;
    "margin-top"?: string;
    "mask-border-mode"?: string;
    "mask-border-outset"?: string;
    "mask-border-repeat"?: string;
    "mask-border-slice"?: string;
    "mask-border-source"?: string;
    "mask-border-width"?: string;
    "mask-clip"?: string;
    "mask-composite"?: string;
    "mask-image"?: string;
    "mask-mode"?: string;
    "mask-origin"?: string;
    "mask-position"?: string;
    "mask-repeat"?: string;
    "mask-size"?: string;
    "mask-type"?: string;
    "max-block-size"?: string;
    "max-height"?: string;
    "max-inline-size"?: string;
    "max-lines"?: string;
    "max-width"?: string;
    "min-block-size"?: string;
    "min-height"?: string;
    "min-inline-size"?: string;
    "min-width"?: string;
    "mix-blend-mode"?: string;
    "motion-distance"?: string;
    "motion-path"?: string;
    "motion-rotation"?: string;
    "object-fit"?: string;
    "object-position"?: string;
    "offset-anchor"?: string;
    "offset-distance"?: string;
    "offset-path"?: string;
    "offset-rotate"?: string;
    "offset-rotation"?: string;
    opacity?: string;
    order?: string;
    orphans?: string;
    "outline-color"?: string;
    "outline-offset"?: string;
    "outline-style"?: string;
    "outline-width"?: string;
    overflow?: string;
    "overflow-anchor"?: string;
    "overflow-block"?: string;
    "overflow-clip-box"?: string;
    "overflow-inline"?: string;
    "overflow-wrap"?: string;
    "overflow-x"?: string;
    "overflow-y"?: string;
    "overscroll-behavior"?: string;
    "overscroll-behavior-block"?: string;
    "overscroll-behavior-inline"?: string;
    "overscroll-behavior-x"?: string;
    "overscroll-behavior-y"?: string;
    "padding-block"?: string;
    "padding-block-end"?: string;
    "padding-block-start"?: string;
    "padding-bottom"?: string;
    "padding-inline"?: string;
    "padding-inline-end"?: string;
    "padding-inline-start"?: string;
    "padding-left"?: string;
    "padding-right"?: string;
    "padding-top"?: string;
    "page-break-after"?: string;
    "page-break-before"?: string;
    "page-break-inside"?: string;
    "paint-order"?: string;
    perspective?: string;
    "perspective-origin"?: string;
    "place-content"?: string;
    "pointer-events"?: string;
    position?: string;
    quotes?: string;
    resize?: string;
    right?: string;
    rotate?: string;
    "row-gap"?: string;
    "ruby-align"?: string;
    "ruby-merge"?: string;
    "ruby-position"?: string;
    scale?: string;
    "scroll-behavior"?: string;
    "scroll-margin"?: string;
    "scroll-margin-block"?: string;
    "scroll-margin-block-end"?: string;
    "scroll-margin-block-start"?: string;
    "scroll-margin-bottom"?: string;
    "scroll-margin-inline"?: string;
    "scroll-margin-inline-end"?: string;
    "scroll-margin-inline-start"?: string;
    "scroll-margin-left"?: string;
    "scroll-margin-right"?: string;
    "scroll-margin-top"?: string;
    "scroll-padding"?: string;
    "scroll-padding-block"?: string;
    "scroll-padding-block-end"?: string;
    "scroll-padding-block-start"?: string;
    "scroll-padding-bottom"?: string;
    "scroll-padding-inline"?: string;
    "scroll-padding-inline-end"?: string;
    "scroll-padding-inline-start"?: string;
    "scroll-padding-left"?: string;
    "scroll-padding-right"?: string;
    "scroll-padding-top"?: string;
    "scroll-snap-align"?: string;
    "scroll-snap-stop"?: string;
    "scroll-snap-type"?: string;
    "scrollbar-color"?: string;
    "scrollbar-width"?: string;
    "shape-image-threshold"?: string;
    "shape-margin"?: string;
    "shape-outside"?: string;
    "tab-size"?: string;
    "table-layout"?: string;
    "text-align"?: string;
    "text-align-last"?: string;
    "text-combine-upright"?: string;
    "text-decoration-color"?: string;
    "text-decoration-line"?: string;
    "text-decoration-skip"?: string;
    "text-decoration-skip-ink"?: string;
    "text-decoration-style"?: string;
    "text-decoration-thickness"?: string;
    "text-decoration-width"?: string;
    "text-emphasis-color"?: string;
    "text-emphasis-position"?: string;
    "text-emphasis-style"?: string;
    "text-indent"?: string;
    "text-justify"?: string;
    "text-orientation"?: string;
    "text-overflow"?: string;
    "text-rendering"?: string;
    "text-shadow"?: string;
    "text-size-adjust"?: string;
    "text-transform"?: string;
    "text-underline-offset"?: string;
    "text-underline-position"?: string;
    top?: string;
    "touch-action"?: string;
    transform?: string;
    "transform-box"?: string;
    "transform-origin"?: string;
    "transform-style"?: string;
    "transition-delay"?: string;
    "transition-duration"?: string;
    "transition-property"?: string;
    "transition-timing-function"?: string;
    translate?: string;
    "unicode-bidi"?: string;
    "user-select"?: string;
    "vertical-align"?: string;
    visibility?: string;
    "white-space"?: string;
    widows?: string;
    width?: string;
    "will-change"?: string;
    "word-break"?: string;
    "word-spacing"?: string;
    "word-wrap"?: string;
    "writing-mode"?: string;
    "z-index"?: string;
    zoom?: string;
}
interface StandardShorthandPropertiesHyphen {
    all?: string;
    animation?: string;
    background?: string;
    border?: string;
    "border-block"?: string;
    "border-block-end"?: string;
    "border-block-start"?: string;
    "border-bottom"?: string;
    "border-color"?: string;
    "border-image"?: string;
    "border-inline"?: string;
    "border-inline-end"?: string;
    "border-inline-start"?: string;
    "border-left"?: string;
    "border-radius"?: string;
    "border-right"?: string;
    "border-style"?: string;
    "border-top"?: string;
    "border-width"?: string;
    "column-rule"?: string;
    columns?: string;
    flex?: string;
    "flex-flow"?: string;
    font?: string;
    gap?: string;
    grid?: string;
    "grid-area"?: string;
    "grid-column"?: string;
    "grid-row"?: string;
    "grid-template"?: string;
    "line-clamp"?: string;
    "list-style"?: string;
    margin?: string;
    mask?: string;
    "mask-border"?: string;
    motion?: string;
    offset?: string;
    outline?: string;
    padding?: string;
    "place-items"?: string;
    "place-self"?: string;
    "text-decoration"?: string;
    "text-emphasis"?: string;
    transition?: string;
}
interface SvgPropertiesHyphen {
    "alignment-baseline"?: string;
    "baseline-shift"?: string;
    clip?: string;
    "clip-path"?: string;
    "clip-rule"?: string;
    color?: string;
    "color-interpolation"?: string;
    "color-rendering"?: string;
    cursor?: string;
    direction?: string;
    display?: string;
    "dominant-baseline"?: string;
    fill?: string;
    "fill-opacity"?: string;
    "fill-rule"?: string;
    filter?: string;
    "flood-color"?: string;
    "flood-opacity"?: string;
    font?: string;
    "font-family"?: string;
    "font-size"?: string;
    "font-size-adjust"?: string;
    "font-stretch"?: string;
    "font-style"?: string;
    "font-variant"?: string;
    "font-weight"?: string;
    "glyph-orientation-vertical"?: string;
    "image-rendering"?: string;
    "letter-spacing"?: string;
    "lighting-color"?: string;
    "line-height"?: string;
    marker?: string;
    "marker-end"?: string;
    "marker-mid"?: string;
    "marker-start"?: string;
    mask?: string;
    opacity?: string;
    overflow?: string;
    "paint-order"?: string;
    "pointer-events"?: string;
    "shape-rendering"?: string;
    "stop-color"?: string;
    "stop-opacity"?: string;
    stroke?: string;
    "stroke-dasharray"?: string;
    "stroke-dashoffset"?: string;
    "stroke-linecap"?: string;
    "stroke-linejoin"?: string;
    "stroke-miterlimit"?: string;
    "stroke-opacity"?: string;
    "stroke-width"?: string;
    "text-anchor"?: string;
    "text-decoration"?: string;
    "text-rendering"?: string;
    "unicode-bidi"?: string;
    "vector-effect"?: string;
    visibility?: string;
    "white-space"?: string;
    "word-spacing"?: string;
    "writing-mode"?: string;
}
