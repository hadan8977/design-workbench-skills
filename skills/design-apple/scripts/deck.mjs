#!/usr/bin/env node
/** 宇苹果 v0.1.0 — HTML contract: .viewport > .slide[data-page], window.yuDeck.show/fit. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath, pathToFileURL} from 'node:url';

const VERSION = '0.1.0';
const WIDTH = 1920, HEIGHT = 1080;
const require = createRequire(import.meta.url); // Standard local resolution; NODE_PATH works for managed runtimes.
const help = `宇苹果 ${VERSION}

Usage:
  node scripts/deck.mjs check  --input deck.html --out output
  node scripts/deck.mjs render --input deck.html --out output [--pages 1,3] [--scale 2] [--tile-width 960] [--columns 4]
  node scripts/deck.mjs pdf    --input deck.html --out output [--no-gradient-fix]

check   All pages: geometry, text clipping, image loading, browser errors. Writes check-report.json.
        Visible overflow stays a layout warning; clipped text or canvas escapes fail.
render  PNG pages + overview.png + render-manifest.json. Scale 1 = 1920×1080, scale 2 = 3840×2160.
        --pages uses 1-based page positions. If source/assets changed, all pages render again.
        --tile-width defaults to 960; use 1920 for an easily zoomable overview.
pdf     deck.pdf: 16:9, 2880×1620 pt (3840×2160 when rendered at 96 dpi).
        Native text/vector shapes stay native. Text gradients use local 8K-equivalent captures
        to avoid Chromium clipping-edge artifacts. Original image detail is not invented.

Install dependencies once: npm install && npx playwright install chromium
The tool opens only the requested local HTML. It does not upload or publish anything.
`;

function argsOf(argv) {
  if (!argv.length || argv.includes('--help') || argv.includes('-h')) return {help:true};
  const command = argv[0];
  if (!['check','render','pdf'].includes(command)) throw new Error(`Unknown command: ${command}`);
  const opts = {command, scale:1, tileWidth:960, columns:4, gradientFix:true};
  const names = {'--input':'input','--out':'out','--pages':'pages','--scale':'scale','--tile-width':'tileWidth','--columns':'columns'};
  for (let i=1; i<argv.length; i++) {
    const arg = argv[i];
    if (arg === '--no-gradient-fix') {opts.gradientFix=false; continue;}
    if (!names[arg]) throw new Error(`Unknown option: ${arg}`);
    if (!argv[i+1] || argv[i+1].startsWith('--')) throw new Error(`Missing value for ${arg}`);
    opts[names[arg]] = argv[++i];
  }
  if (!opts.input) throw new Error('--input is required');
  opts.input = path.resolve(opts.input);
  opts.out = path.resolve(opts.out || path.join(path.dirname(opts.input),'output'));
  if (!fs.existsSync(opts.input) || !fs.statSync(opts.input).isFile()) throw new Error('Input HTML does not exist');
  for (const key of ['scale','tileWidth','columns']) opts[key]=Number(opts[key]);
  if (![1,2].includes(opts.scale)) throw new Error('--scale must be 1 or 2');
  if (!Number.isInteger(opts.tileWidth) || opts.tileWidth<320 || opts.tileWidth>3840) throw new Error('--tile-width must be an integer from 320 to 3840');
  if (!Number.isInteger(opts.columns) || opts.columns<1 || opts.columns>8) throw new Error('--columns must be an integer from 1 to 8');
  if (opts.pages) {
    opts.pages=[...new Set(opts.pages.split(',').map(Number))];
    if (opts.pages.some(x=>!Number.isInteger(x)||x<1)) throw new Error('--pages must contain positive 1-based positions, such as 1,3');
    if(command!=='render')throw new Error('--pages only applies to render; check/pdf always include the complete deck');
  }
  return opts;
}
function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file),{recursive:true});
  const temporary = file+'.tmp';
  fs.writeFileSync(temporary,JSON.stringify(data,null,2)+'\n');
  fs.renameSync(temporary,file);
}
function sha(data) { return crypto.createHash('sha256').update(data).digest('hex'); }
function fileName(position) { return `P${String(position).padStart(2,'0')}.png`; }
function escapeXml(s) { return String(s).replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c])); }
function loadDependency(name) {
  try{return require(name);}catch(error){
    if(error.code==='MODULE_NOT_FOUND')throw new Error(`Missing dependency ${name}. Run npm install in the skill folder, then npx playwright install chromium.`);
    throw error;
  }
}

async function openDeck(opts) {
  const {chromium}=loadDependency('playwright');
  const browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:WIDTH,height:HEIGHT},deviceScaleFactor:opts.command==='pdf'?4:opts.scale});
  const state={browser,page,errors:[],failedRequests:[],files:new Set([opts.input]),remote:false};
  page.on('pageerror',e=>state.errors.push(e.message));
  page.on('request',r=>{
    const url=r.url();
    if(url.startsWith('file:')){
      try{state.files.add(fileURLToPath(new URL(url)));}catch{}
    } else if(/^https?:/.test(url)) state.remote=true;
  });
  page.on('requestfailed',r=>state.failedRequests.push({url:r.url(),error:r.failure()?.errorText||'Request failed'}));
  page.on('response',r=>{if(r.status()>=400)state.failedRequests.push({url:r.url(),error:`HTTP ${r.status()}`});});
  try {
    await page.goto(pathToFileURL(opts.input).href,{waitUntil:'load',timeout:30000});
    await page.evaluate(async()=>{
      if(!window.yuDeck || typeof window.yuDeck.show!=='function' || typeof window.yuDeck.fit!=='function')
        throw new Error('Missing window.yuDeck.show(index)/fit(). Start from assets/template.html.');
      document.body.classList.add('capture');window.yuDeck.fit();
      document.querySelectorAll('.slide img').forEach(i=>i.loading='eager');
      await Promise.race([document.fonts.ready,new Promise((_,reject)=>setTimeout(()=>reject(new Error('Font loading timed out')),15000))]);
      await Promise.all([...document.querySelectorAll('.slide img')].map(im=>im.decode().catch(()=>{})));
    });
    await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'});
    const ids=await page.locator('.viewport > .slide').evaluateAll(els=>els.map(e=>e.dataset.page));
    if(!ids.length)throw new Error('No .viewport > .slide pages found');
    if(ids.some(id=>!id)||new Set(ids).size!==ids.length)throw new Error('Every slide must have a unique nonempty data-page');
    if(opts.pages?.some(n=>n>ids.length))throw new Error(`--pages exceeds the page count (${ids.length})`);
    state.ids=ids;
    return state;
  } catch(e){await browser.close();throw e;}
}
async function show(state,index) {
  await state.page.evaluate(i=>window.yuDeck.show(i),index);
  await state.page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
}
async function auditDeck(state) {
  const report=[];
  for(let i=0;i<state.ids.length;i++){
    await show(state,i);
    const item=await state.page.locator('.viewport > .slide').nth(i).evaluate(s=>{
      const b=s.getBoundingClientRect();
      const overflow=[],layoutWarnings=[];
      const candidates=s.querySelectorAll('h1,h2,h3,h4,h5,p,li,td,th,[data-qa]');
      for(const el of candidates){
        if(el.closest('[data-qa-ignore]'))continue;
        const r=el.getBoundingClientRect();
        if(!r.width || !r.height || getComputedStyle(el).visibility==='hidden')continue;
        // Font metrics and negative tracking can extend a line box without hiding text.
        // Check rendered text ranges against the actual clipping ancestors instead of
        // treating every scrollHeight/clientHeight difference as a clipped heading.
        const textRects=[];
        const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
        for(let node=walker.nextNode();node;node=walker.nextNode()){
          if(!node.textContent.trim()||getComputedStyle(node.parentElement).visibility==='hidden')continue;
          const range=document.createRange();range.selectNodeContents(node);
          for(const rect of range.getClientRects())if(rect.width&&rect.height)textRects.push(rect);
        }
        const textBounds=textRects.length?{
          left:Math.min(...textRects.map(t=>t.left)),top:Math.min(...textRects.map(t=>t.top)),
          right:Math.max(...textRects.map(t=>t.right)),bottom:Math.max(...textRects.map(t=>t.bottom))
        }:r;
        const outside=r.left<b.left-1||r.top<b.top-1||r.right>b.right+1||r.bottom>b.bottom+1||
          textBounds.left<b.left-2||textBounds.top<b.top-2||textBounds.right>b.right+2||textBounds.bottom>b.bottom+2;
        const clippedBy=[];
        for(let ancestor=el;ancestor;ancestor=ancestor.parentElement){
          const c=getComputedStyle(ancestor),a=ancestor.getBoundingClientRect();
          const scaleX=ancestor.offsetWidth?a.width/ancestor.offsetWidth:1;
          const scaleY=ancestor.offsetHeight?a.height/ancestor.offsetHeight:1;
          const left=a.left+ancestor.clientLeft*scaleX,top=a.top+ancestor.clientTop*scaleY;
          const right=left+ancestor.clientWidth*scaleX,bottom=top+ancestor.clientHeight*scaleY;
          const clips=value=>['hidden','clip','scroll','auto'].includes(value);
          const x=clips(c.overflowX)&&(textBounds.left<left-2||textBounds.right>right+2);
          const y=clips(c.overflowY)&&(textBounds.top<top-2||textBounds.bottom>bottom+2);
          if(x||y)clippedBy.push({tag:ancestor.tagName,class:ancestor.className,axes:[x?'x':null,y?'y':null].filter(Boolean)});
          if(ancestor===s)break;
        }
        const clipped=clippedBy.length>0;
        const scrollOverflow=(el.clientWidth>0&&el.scrollWidth>el.clientWidth+2)||(el.clientHeight>0&&el.scrollHeight>el.clientHeight+2);
        const detail={text:el.textContent.trim().slice(0,180),tag:el.tagName,class:el.className,outside,clipped,bounds:[r.x-b.x,r.y-b.y,r.width,r.height]};
        if(outside||clipped)overflow.push({...detail,clippedBy});
        else if(scrollOverflow)layoutWarnings.push({...detail,reason:'Text extends its layout box but remains visible inside the canvas. Review spacing; no clipping was detected.'});
      }
      const images=[...s.querySelectorAll('img')];
      const missingImages=images.filter(im=>!im.complete||!im.naturalWidth).map(im=>im.getAttribute('src'));
      const imageDetailWarnings=images.filter(im=>im.naturalWidth&&im.getBoundingClientRect().width*2>im.naturalWidth*1.05).map(im=>({source:im.getAttribute('src')?.slice(0,160),originalWidth:im.naturalWidth,displayWidthAt4K:Math.round(im.getBoundingClientRect().width*2)}));
      return {id:s.dataset.page,canvas:{x:b.x,y:b.y,width:b.width,height:b.height},overflow,layoutWarnings,missingImages,imageDetailWarnings};
    });
    item.position=i+1;report.push(item);
  }
  const issues=report.filter(x=>Math.abs(x.canvas.x)>.01||Math.abs(x.canvas.y)>.01||Math.abs(x.canvas.width-WIDTH)>.01||Math.abs(x.canvas.height-HEIGHT)>.01||x.overflow.length||x.missingImages.length);
  return {version:VERSION,pages:state.ids.length,logicalSize:[WIDTH,HEIGHT],passed:!issues.length&&!state.errors.length&&!state.failedRequests.length,errors:state.errors,failedRequests:state.failedRequests,issues,report,note:'Automatic checks do not replace full-page visual inspection. Visible layout overflow is a review warning; text clipped by overflow rules or escaping the canvas fails. Image-detail warnings describe original asset limits; they do not imply new detail is generated.'};
}
function sourceFingerprint(state) {
  const parts=[['tool',sha(fs.readFileSync(fileURLToPath(import.meta.url)))]];
  for(const file of [...state.files].sort()){
    if(fs.existsSync(file)&&fs.statSync(file).isFile())parts.push([path.relative(path.dirname(state.files.values().next().value),file),sha(fs.readFileSync(file))]);
  }
  return sha(JSON.stringify(parts));
}
async function renderDeck(state,opts,audit) {
  const sharp=loadDependency('sharp');
  const pagesDir=path.join(opts.out,'pages');fs.mkdirSync(pagesDir,{recursive:true});
  const manifestFile=path.join(opts.out,'render-manifest.json');
  let previous;try{previous=JSON.parse(fs.readFileSync(manifestFile,'utf8'));}catch{}
  const fingerprint=sourceFingerprint(state);
  const cacheValid=previous?.fingerprint===fingerprint&&previous?.scale===opts.scale&&JSON.stringify(previous?.ids)===JSON.stringify(state.ids)&&!state.remote;
  const requested=opts.pages||state.ids.map((_,i)=>i+1);
  const jobs=cacheValid?new Set(requested):new Set(state.ids.map((_,i)=>i+1));
  for(let i=0;i<state.ids.length;i++)if(!fs.existsSync(path.join(pagesDir,fileName(i+1))))jobs.add(i+1);
  const invalidation=opts.pages&&!cacheValid?'Source, local assets, scale or page order changed (or remote assets are present): rendering all pages to keep the overview consistent.':null;
  if(invalidation)console.log(invalidation);
  for(const n of [...jobs].sort((a,b)=>a-b)){
    await show(state,n-1);
    await state.page.screenshot({path:path.join(pagesDir,fileName(n))});
  }
  const tileWidth=opts.tileWidth,tileHeight=Math.round(tileWidth*9/16),gap=Math.round(tileWidth/24),label=Math.round(tileWidth/18);
  const cols=Math.min(opts.columns,state.ids.length),rows=Math.ceil(state.ids.length/cols);
  const pieces=[];
  for(let i=0;i<state.ids.length;i++){
    const file=path.join(pagesDir,fileName(i+1));
    const meta=await sharp(file).metadata();
    if(meta.width!==WIDTH*opts.scale||meta.height!==HEIGHT*opts.scale)throw new Error(`Inconsistent cached page size: ${file}`);
    const x=gap+(i%cols)*(tileWidth+gap),y=gap+Math.floor(i/cols)*(tileHeight+gap+label);
    pieces.push({input:await sharp(file).resize(tileWidth,tileHeight).toBuffer(),left:x,top:y});
    const svg=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${tileWidth}" height="${label}"><text x="0" y="${Math.round(label*.76)}" font-family="Arial,sans-serif" font-size="${Math.round(label*.55)}" fill="#73737c">P${escapeXml(String(i+1).padStart(2,'0'))}</text></svg>`);
    pieces.push({input:svg,left:x,top:y+tileHeight});
  }
  const sheetWidth=cols*(tileWidth+gap)+gap,sheetHeight=rows*(tileHeight+gap+label)+gap;
  const sheet=path.join(opts.out,'overview.png');
  await sharp({create:{width:sheetWidth,height:sheetHeight,channels:3,background:'#e9e9ee'}}).composite(pieces).png().toFile(sheet);
  const manifest={version:VERSION,fingerprint,scale:opts.scale,ids:state.ids,pages:state.ids.map((id,i)=>({id,position:i+1,file:`pages/${fileName(i+1)}`})),renderedPositions:[...jobs].sort((a,b)=>a-b),invalidation,overview:{file:'overview.png',width:sheetWidth,height:sheetHeight,tileWidth,tileHeight},auditPassed:audit.passed};
  writeJson(manifestFile,manifest);
  return {pages:state.ids.length,rendered:jobs.size,pagePixels:[WIDTH*opts.scale,HEIGHT*opts.scale],overview:sheet,overviewPixels:[sheetWidth,sheetHeight]};
}
async function fixGradients(state) {
  const records=[];
  for(let i=0;i<state.ids.length;i++){
    await show(state,i);
    const slide=state.page.locator('.viewport > .slide').nth(i),sb=await slide.boundingBox();
    const accents=slide.locator('.accent');
    for(let j=0;j<await accents.count();j++){
      const el=accents.nth(j);
      const isGradient=await el.evaluate(e=>{const c=getComputedStyle(e);return c.backgroundImage.includes('gradient')&&c.backgroundClip.includes('text');});
      if(!isGradient)continue;
      const b=await el.boundingBox();if(!b?.width||!b?.height)continue;
      const clip={x:Math.max(0,Math.floor(b.x)),y:Math.max(0,Math.floor(b.y)),width:Math.min(WIDTH,Math.ceil(b.x+b.width))-Math.max(0,Math.floor(b.x)),height:Math.min(HEIGHT,Math.ceil(b.y+b.height))-Math.max(0,Math.floor(b.y))};
      if(clip.width<=0||clip.height<=0)continue;
      const buffer=await state.page.screenshot({clip});
      records.push({i,j,x:clip.x-sb.x,y:clip.y-sb.y,width:clip.width,height:clip.height,src:'data:image/png;base64,'+buffer.toString('base64')});
    }
  }
  await state.page.evaluate(records=>{
    for(const r of records){
      const s=document.querySelectorAll('.viewport > .slide')[r.i],el=s.querySelectorAll('.accent')[r.j];
      el.style.opacity='0';
      const image=document.createElement('img');image.src=r.src;image.alt='';image.setAttribute('aria-hidden','true');
      Object.assign(image.style,{position:'absolute',left:r.x+'px',top:r.y+'px',width:r.width+'px',height:r.height+'px',maxWidth:'none',maxHeight:'none',objectFit:'fill',zIndex:'100'});
      s.appendChild(image);
    }
  },records);
  return records.length;
}
async function exportPdf(state,opts) {
  const {PDFDocument}=loadDependency('pdf-lib');
  const gradientCount=opts.gradientFix?await fixGradients(state):0;
  await state.page.evaluate(async()=>{
    document.querySelectorAll('.deck-nav,.overview,.controls,[data-deck-ui]').forEach(e=>e.remove());
    await Promise.all([...document.querySelectorAll('.slide img')].map(im=>im.decode()));
  });
  await state.page.emulateMedia({media:'print'});
  await state.page.addStyleTag({content:`@media print {
    @page {size:${WIDTH}px ${HEIGHT}px;margin:0;}
    html,body {margin:0!important;padding:0!important;width:${WIDTH}px!important;height:auto!important;min-height:0!important;overflow:visible!important;display:block!important;background:white!important;}
    *,*::before,*::after {-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;}
    .viewport {margin:0!important;padding:0!important;width:${WIDTH}px!important;height:auto!important;display:block!important;position:relative!important;transform:none!important;}
    .viewport > .slide {display:block!important;position:relative!important;left:0!important;top:0!important;width:${WIDTH}px!important;height:${HEIGHT}px!important;min-height:${HEIGHT}px!important;max-height:${HEIGHT}px!important;margin:0!important;transform:none!important;break-inside:avoid!important;break-after:page!important;page-break-after:always!important;}
    .viewport > .slide:last-child {break-after:auto!important;page-break-after:auto!important;}
    .deck-nav,.overview,.controls,[data-deck-ui] {display:none!important;}
  }`});
  const native=await state.page.pdf({printBackground:true,preferCSSPageSize:true,displayHeaderFooter:false,margin:{top:0,right:0,bottom:0,left:0}});
  const pdf=await PDFDocument.load(native);
  if(pdf.getPageCount()!==state.ids.length)throw new Error(`PDF page count mismatch: expected ${state.ids.length}, got ${pdf.getPageCount()}`);
  for(const p of pdf.getPages()){
    const size=p.getSize();
    if(Math.abs(size.width-1440)>.05||Math.abs(size.height-810)>.05)throw new Error('Unexpected native PDF page dimensions');
    p.scale(2,2);
  }
  pdf.setTitle(await state.page.title());
  pdf.setCreator(`宇苹果 ${VERSION}`);
  const file=path.join(opts.out,'deck.pdf');fs.writeFileSync(file,await pdf.save());
  const verify=await PDFDocument.load(fs.readFileSync(file));
  const pageSizes=verify.getPages().map(p=>p.getSize());
  if(pageSizes.some(s=>s.width!==2880||s.height!==1620))throw new Error('Final PDF size validation failed');
  const report={version:VERSION,pages:verify.getPageCount(),pagePoints:[2880,1620],pixelsAt96Dpi:[3840,2160],gradientPatches:gradientCount,gradientPatchSampling:'4 pixels per logical CSS pixel; twice the 4K canvas sampling',file:'deck.pdf',bytes:fs.statSync(file).size,note:'Native text/vector graphics remain vector except patched gradient text. Photographs retain their original detail. Render the PDF itself for final visual review.'};
  writeJson(path.join(opts.out,'pdf-report.json'),report);
  return {...report,file};
}
async function main(){
  const opts=argsOf(process.argv.slice(2));if(opts.help){console.log(help);return;}
  const [nodeMajor,nodeMinor]=process.versions.node.split('.').map(Number);
  if(nodeMajor<20||(nodeMajor===20&&nodeMinor<9))throw new Error('Node.js 20.9.0 or later is required');
  fs.mkdirSync(opts.out,{recursive:true});
  const state=await openDeck(opts);
  try{
    const audit=await auditDeck(state);writeJson(path.join(opts.out,'check-report.json'),audit);
    if(!audit.passed){console.error(JSON.stringify({passed:false,report:path.join(opts.out,'check-report.json'),issues:audit.issues,errors:audit.errors,failedRequests:audit.failedRequests},null,2));process.exitCode=1;return;}
    let result={passed:true,pages:audit.pages,layoutWarnings:audit.report.reduce((n,p)=>n+p.layoutWarnings.length,0),report:path.join(opts.out,'check-report.json')};
    if(opts.command==='render')result=await renderDeck(state,opts,audit);
    if(opts.command==='pdf')result=await exportPdf(state,opts);
    console.log(JSON.stringify(result,null,2));
  }finally{await state.browser.close();}
}
main().catch(e=>{console.error(`宇苹果: ${e.message}`);process.exitCode=1;});
