if(!self.define){let e,n={};const s=(s,i)=>(s=new URL(s+".js",i).href,n[s]||new Promise((n=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=n,document.head.appendChild(e)}else e=s,importScripts(s),n()})).then((()=>{let e=n[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(i,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(n[o])return;let d={};const l=e=>s(e,o),c={module:{uri:o},exports:d,require:l};n[o]=Promise.all(i.map((e=>c[e]||l(e)))).then((e=>(r(...e),d)))}}define(["./workbox-6716fad7"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"167.5e3d419de14863a9dcc8.js",revision:null},{url:"css/main.713b7145ef3f2ac78ebd.css",revision:null},{url:"index.html",revision:"1cdc76d089e7f30433b1df7570a51248"},{url:"locales/en.json",revision:"fec3f8b44928d406dd42d15e02b30f4c"},{url:"locales/ru.json",revision:"835b431b42d1cf3e44f8c71a5dabe9d6"},{url:"main.fe5d5b93edc6aae17a2d.js",revision:null},{url:"vendors.833c150d248efb7c3ead.js",revision:null}],{})}));
