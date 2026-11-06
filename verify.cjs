const assert=require('node:assert/strict');
const fs=require('node:fs');const vm=require('node:vm');
const html=fs.readFileSync('dist/index.html','utf8');
assert.equal((html.match(/class="gift-text"/g)||[]).length,18);
assert.equal((html.match(/<section /g)||[]).length,6);
assert(!/<(?:script|link|img)[^>]+(?:src|href)="https?:/i.test(html));
async function scenario(denied){
const field={value:'',focus(){this.focused=true},select(){this.selected=true}};
const dialog={querySelector:()=>field,showModal(){this.open=true}};
const toast={classList:{add(){},remove(){}}};
const text={querySelector:s=>({textContent:s==='h3'?'Геродот · «История»':'Полное издание.'})};
let button;let copied;
const item={querySelector:()=>text,append:b=>button=b};
const document={querySelector:s=>s==='.toast'?toast:dialog,querySelectorAll:()=>[item],createElement:()=>({dataset:{},setAttribute(){},addEventListener(type,cb){this.click=cb}})};
vm.runInNewContext(fs.readFileSync('dist/app.js','utf8'),{document,navigator:{clipboard:{writeText:async value=>{if(denied)throw Error('denied');copied=value}}},setTimeout:()=>1,clearTimeout(){}});
await button.click();if(denied){assert(dialog.open);assert(field.selected);assert.equal(field.value,'Геродот · «История» — Полное издание.');assert(!Object.hasOwn(button.dataset,'copied'));}else{assert.equal(copied,'Геродот · «История» — Полное издание.');assert.equal(button.textContent,'Скопировано');}
}
(async()=>{await scenario(false);await scenario(true);console.log('PASS: content, section counts, local assets, clipboard success and denial fallback.');})().catch(e=>{console.error(e);process.exitCode=1});
