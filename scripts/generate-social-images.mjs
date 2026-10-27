// Optional maintenance task. Uses real page captures, not fabricated screenshots.
// node scripts/generate-social-images.mjs <directory-containing-lab-social-*.png>
import {readFile,readdir,mkdir} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import sharp from "sharp";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const source=process.argv[2]&&path.resolve(process.argv[2]);
if(!source)throw new Error("Provide a directory containing actual Lab page screenshots.");
const output=path.join(root,"public/images/social");
await mkdir(output,{recursive:true});
const slugs=(await readdir(path.join(root,"src/app"),{withFileTypes:true})).filter(item=>item.isDirectory());
const entries=[{slug:"home",title:"The Experiment Lab"}];
for(const entry of slugs){
  try{
    const layout=await readFile(path.join(root,"src/app",entry.name,"layout.tsx"),"utf8");
    const title=layout.match(/const title = "(.+?) \| Ibrahim Hussein";/)?.[1];
    if(title)entries.push({slug:entry.name,title});
  }catch{/* Supporting directories do not have experiment layouts. */}
}
for(const entry of entries){
  const capture=path.join(source,`lab-social-${entry.slug}.png`);
  const metadata=await sharp(capture).metadata();
  if(Math.abs((metadata.width||0)/(metadata.height||1)-1200/630)>.01)throw new Error(`Capture ${entry.slug} at the actual 1200×630 browser viewport first.`);
  // Encode the real webpage exactly as captured: no crops, frames, text or art.
  // Normalize only tiny browser viewport rounding (e.g. 1197×628) to OG size.
  await sharp(capture).resize(1200,630,{fit:"fill"}).jpeg({quality:91,chromaSubsampling:"4:4:4"}).toFile(path.join(output,`lab-${entry.slug}-2026-10.jpg`));
  console.log(`Created ${entry.slug} preview from ${path.basename(capture)}`);
}
