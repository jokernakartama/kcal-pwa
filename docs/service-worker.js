if(!self.define){let e,n={};const s=(s,i)=>(s=new URL(s+".js",i).href,n[s]||new Promise((n=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=n,document.head.appendChild(e)}else e=s,importScripts(s),n()})).then((()=>{let e=n[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(i,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(n[o])return;let l={};const c=e=>s(e,o),d={module:{uri:o},exports:l,require:c};n[o]=Promise.all(i.map((e=>d[e]||c(e)))).then((e=>(r(...e),l)))}}define(["./workbox-873c5e43"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"94.c94779309cb882530314.js",revision:null},{url:"css/main.7be6ed90b451f04be4b1.css",revision:null},{url:"index.html",revision:"df08a06c0253bf4b4cd0d7de59d49a05"},{url:"locales/en.json",revision:"fec3f8b44928d406dd42d15e02b30f4c"},{url:"locales/ru.json",revision:"835b431b42d1cf3e44f8c71a5dabe9d6"},{url:"main.e4814ed7c22d4783c1c5.js",revision:null},{url:"vendors.872975071f46daadaecf.js",revision:null}],{})}));
