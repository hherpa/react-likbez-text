import { SiglumCompiler } from '@siglum/engine';
window.SiglumCompiler = SiglumCompiler;
window.dispatchEvent(new Event('siglum-ready'));
