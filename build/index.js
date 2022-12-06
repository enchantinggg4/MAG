"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gif = void 0;
const phin_1 = __importDefault(require("phin"));
const imagescript_1 = require("imagescript");
const checkTypes_js_1 = require("./utils/checkTypes.js");
class Gif {
    constructor(width, height, quality) {
        if (!width)
            throw new Error('The width of the Gif is required');
        if (!height)
            throw new Error('The height of the Gif is required');
        (0, checkTypes_js_1.checkTypes)(width, 'number', 'width');
        (0, checkTypes_js_1.checkTypes)(height, 'number', 'height');
        (0, checkTypes_js_1.checkNumber)(width, 'width');
        (0, checkTypes_js_1.checkNumber)(height, 'height');
        this.height = height;
        this.width = width;
        this.loops = -1;
        this.quality = quality || 1;
        this.frames = [];
    }
    setLoops(loops) {
        if (!loops)
            throw new Error('The loops are required');
        if (isNaN(loops))
            throw new Error('The loops needs to be a number');
        if (loops <= -1)
            throw new Error('The loops cant be less than -1');
        this.loops = loops;
    }
    setFrames(frames) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!frames)
                throw new Error('The frames are required');
            if (!Array.isArray(frames))
                frames = [frames];
            if (!frames.length)
                throw new Error('The frames are required');
            if (frames.length <= 1)
                throw new Error('You need to add more than one frame');
            for (const frame of frames) {
                yield this.addFrame(frame);
            }
        });
    }
    addFrame(frame) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!frame)
                throw new Error('The frame is required');
            if (!frame.src)
                throw new Error('The src is required');
            const img = new imagescript_1.Image(this.width, this.height);
            if (typeof frame.background === 'string') {
                const imageres = yield (0, phin_1.default)(frame.background);
                const buf = Buffer.from(imageres.body);
                frame.background = new Uint8Array(buf);
            }
            if (typeof frame.src === 'string') {
                const imageres = yield (0, phin_1.default)(frame.src);
                const buf = Buffer.from(imageres.body);
                frame.src = new Uint8Array(buf);
            }
            if (frame.duration && isNaN(frame.duration))
                throw new Error('The duration needs to be a number');
            if (frame.duration && frame.duration <= 0)
                throw new Error('The duration cant be less than 0');
            frame.duration = frame.duration || 1000;
            if (frame.background) {
                const _background = yield (0, imagescript_1.decode)(frame.background, true);
                if (_background instanceof imagescript_1.GIF)
                    throw new Error('Gifs are not supported at this moment, please get the frames of the gif and put them as frames');
                img.composite(_background);
            }
            const _img = yield (0, imagescript_1.decode)(frame.src, true);
            if (_img instanceof imagescript_1.GIF)
                throw new Error('Gifs are not supported at this moment, please get the frames of the gif and put them as frames');
            img.composite(_img);
            this.frames.push(imagescript_1.Frame.from(img, frame.duration, 0, 0, imagescript_1.Frame.DISPOSAL_BACKGROUND));
        });
    }
    encode(arrayBuffer = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const gif = new imagescript_1.GIF(this.frames, this.loops);
            const arrayBuf = yield gif.encode(this.quality);
            return arrayBuffer ? arrayBuf : Buffer.from(arrayBuf);
        });
    }
}
exports.Gif = Gif;
