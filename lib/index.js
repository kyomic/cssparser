"use strict";const e={margin:[["margin-top/margin-right/margin-bottom/margin-left"],["margin-top/margin-bottom","margin-left/margin-right"],["margin-top","margin-left/margin-right","margin-bottom"],["margin-top","margin-right","margin-bottom","margin-left"]],padding:[["padding-top","padding-right","padding-bottom","padding-left"]],border:[["border-width"],["border-width","border-color"],["border-width","border-style","border-color"]]};let t=e,n={};for(let e in t){n[e]=e;const s=(t[e]||[]).flat();console.log("arr",s,e);for(let e=0;e<s.length;e++){s[e].split("/").map((e=>{n[e]=e}))}}console.log("cssMapping",n,e);exports.CSSParser=class{constructor(){this._cssInfo=[],this._option={mergeGroup:!0,mergeCSS:!1},this.parse=(e,t={mergeGroup:!0})=>(this._option=t,this._cssInfo=this.makeArray(e).map(((e,t)=>Object.assign(Object.assign({},e),{mapping:this.mergeCSS(e.css)}))),this._cssInfo)}mergeCSS(t){let s={},r=e;const o=t.length;for(let e=0;e<o;e++){const o=t[e].name,i=t[e].value;if(n[o]){const e=i.split(/[ ]+/);if(r[o]){const t=r[o][e.length-1];t?e.map(((n,r)=>{const o=t[r].split("/");console.log("keyss========",o),o.map((t=>{s[t]=e[r]}))})):console.warn(`解析CSS出现问题：名为：${o}，值为:${i}未配置map`)}else s[o]=i}}return s}makeArray(e){const t=/([^\{]+){([^\}]+)}/gi,n=/([a-z\-]+)\s*\:\s*(([\w -]+)|([\w\s-]+\([^\)]+\)\s*\.*))[;?|\n|$]/gi;let s=null,r={},o=null,i=[];for(;s=t.exec(e),s;){const e=s[1].replace(/\s{2,}/gi,"").replace(/\n/gi,"");this._option.mergeGroup?r[e]?o=r[e]:(o={name:e,css:[]},i.push(o),r[e]=o):(o={name:e,css:[]},i.push(o));const t=s[2];let a=null,l=o.css||[];for(;a=n.exec(t),a;)l.push({name:a[1],value:a[2]})}return i}set(e,t,n=":root"){let s=this._cssInfo.find((e=>e.name==n));s?(s.css||[]).map((n=>(n.name==e&&(n.value=t),n))):(s={name:n,css:[{name:e,value:t}],mapping:{}},this._cssInfo.push(s))}get(e,t=":root"){var n,s;let r=this._cssInfo.find((e=>e.name==t));if(r){const t=r.mapping,o=r.css;return t[e]?t[e]:null!==(s=null===(n=o.find((t=>t.name==e)))||void 0===n?void 0:n.value)&&void 0!==s?s:""}return""}clear(){this._cssInfo=[]}mergeCSSInfo(){let t=e;return JSON.parse(JSON.stringify(this._cssInfo)).map((e=>{let n=e.css||[],s=e.mapping,r={};for(let e of n)if(t[e.name]){const n=e.name;r[n]={},r[n][e.name]=e.name;let o=t[e.name],i=-1,a=-1;for(let e=o.length-1;e>-1;e--){let t={};if(o[e].every((n=>!!n.split("/").every((n=>{let r=!!s[n];return r&&(a=e),r&&(t[n]=s[n]),r}))))){for(let e in t)r[n][e]=t[e];i=e;break}}i>=o.length-1||i>-1&&i==a?r.level={value:i}:r={}}n=n.filter((e=>{let t=!1;for(let n in r)if(e.name in r[n]){t=!0;break}return!t}));for(let e in r)if("level"!=e){let s=r.level.value,o=t[e][s];n.push({name:e,value:o.map((t=>r[e][t])).join(" ")})}return e.css=n,e}))}get css(){return this._cssInfo}get cssText(){const e=this._option.mergeCSS?this.mergeCSSInfo():this._cssInfo,t=[];for(let n=0;n<e.length;n++){const s=e[n],r=s.css;t.push(`${s.name}{`),r.map((e=>{t.push(`    ${e.name}:${e.value};`)})),t.push("}")}return t.join("\n")}};