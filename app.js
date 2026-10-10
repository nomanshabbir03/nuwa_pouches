/*
 * FAQ CONFIG (section #faq). Questions render in this order; FAQPage JSON-LD is generated from the visible ones.
 * An item with an empty answer is hidden. "needs" hides an item until its dependency exists:
 *   'mg'              shown once EXTRA_STRONG_MG (Product range config) is set to the real strength; '[MG]' in the answer is replaced with it
 *   'distributorForm' shown only when the Where to buy distributor form is on the page
 *
 * STILL MISSING:
 *  - "How should I store it?"               storage / shelf life answer
 *  - "How does delivery and returns work?"  delivery / returns answer
 *  - EXTRA_STRONG_MG                         real mg value (also used by Product range)
 *  - faq.eyebrow / faq.headline              optional; defaults 'FAQ' / 'Questions, answered.'
 *
 * @typedef {{q:string, a:string, needs?:'mg'|'distributorForm', link?:{text:string, href:string}}} FaqItem
 * @type {{eyebrow:string, headline:string, items:FaqItem[]}}
 */
const faq={
  eyebrow:'',
  headline:'',
  items:[
    {q:'What is NUWA?',a:'NUWA is a tobacco-free nicotine pouch for adult nicotine users. No smoke, no vapor.'},
    {q:'What strength is NUWA?',a:'NUWA is Extra Strong ([MG] per pouch).',needs:'mg'},
    {q:'Who is NUWA for?',a:'NUWA is for adult nicotine users only. If you do not currently use nicotine, we recommend you do not start.'},
    {q:'How do I use a pouch?',a:'Place one pouch between your upper lip and gum, leave it in place, then dispose of it responsibly when finished. Do not chew or swallow.'},
    {q:'What flavors are available?',a:'Watermelon, Elaichi and Mint.'},
    {q:'How many pouches are in a pack?',a:'Each pack contains 20 Nicopods.'},
    {q:'How should I store it?',a:''}, // CONFIG: storage / shelf life
    {q:'Is NUWA addictive?',a:'Yes. NUWA contains nicotine, which is addictive.'},
    {q:'Who should not use NUWA?',a:'Minors (under 18), non-users of nicotine, and pregnant or breastfeeding women. Speak to a doctor if you have a medical condition.'},
    {q:'How does delivery and returns work?',a:''}, // CONFIG: delivery / returns
    {q:'Can I become a distributor?',a:'Yes. Use the distributor form in the Where to buy section.',needs:'distributorForm',link:{text:'Where to buy',href:'#where-to-buy'}}
  ]
};
/*
 * WHERE TO BUY CONFIG (section #where-to-buy)
 * Only filled options render; a card with empty config is hidden, and the whole section stays hidden until at least one option exists.
 *
 * STILL MISSING (everything below is currently empty):
 *  - buy.online.url          link to the online store (https://...); online.note optional
 *  - buy.whatsapp.number     WhatsApp number with country code, digits only (e.g. 4612345678)
 *  - buy.stores              {name, city, address, mapUrl}; a city filter appears when there is more than one city
 *  - buy.deliveryNote        e.g. delivery areas, payment method (if it mentions delivery, an ID-check note is added)
 *  - buy.distributorEmail    shown as the fallback contact for distributor inquiries
 *  - buy.formEndpoint        URL of the deployed distributor form handler (see api/distributor.js), e.g. '/api/distributor'
 * The distributor form shows when formEndpoint or distributorEmail is set. Without formEndpoint it opens the visitor's email app instead.
 *
 * @typedef {{name:string, city:string, address:string, mapUrl:string}} BuyStore
 * @type {{online:{label:string, url:string, note:string}, whatsapp:{number:string, message:string}, stores:BuyStore[], deliveryNote:string, distributorEmail:string, formEndpoint:string}}
 */
const buy={
  online:{label:'Shop online',url:'',note:''},
  whatsapp:{number:'',message:"Hi, I'd like to order NUWA."},
  stores:[
    // {name:'', city:'', address:'', mapUrl:''},
  ],
  deliveryNote:'',
  distributorEmail:'',
  formEndpoint:''
};
(b=>{const section=document.querySelector('#where-to-buy');if(!section)return;
const filled=v=>typeof v==='string'&&v.trim()!=='',link=v=>filled(v)&&/^https?:\/\//i.test(v.trim()),email=v=>filled(v)&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(filled(text))e.textContent=text;return e};
const icon=paths=>{const t=document.createElement('template');t.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;return t.content.firstChild};
const external=(a,url)=>{a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a};
const online=b.online||{},wa=b.whatsapp||{},digits=String(wa.number||'').replace(/\D/g,''),stores=(b.stores||[]).filter(s=>s&&filled(s.name));
const endpoint=filled(b.formEndpoint)?b.formEndpoint.trim():'',hasForm=!!endpoint||email(b.distributorEmail);
const options=section.querySelector('#buy-options');let order=0;const card=(cls,title,svg)=>{const c=el('div','wb-card'+(cls?' '+cls:''));c.style.setProperty('--i',order++);c.append(icon(svg),el('h3','',title));options.append(c);return c};
if(link(online.url)){const c=card('','Online store','<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3.5h3l2.6 12h11.4l2-8.5H6.4"/>');if(filled(online.note))c.append(el('p','',online.note));c.append(external(el('a','button blue-button',filled(online.label)?online.label:'Shop online'),online.url.trim()))}
if(digits.length>=7){const c=card('','WhatsApp order','<path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.5-4.3a8.5 8.5 0 1 1 15.5-4.6z"/><path d="M9 9.5c.3 2.4 2.1 4.2 4.5 4.6"/>');c.append(el('p','','Send us a message to place your order.'));c.append(external(el('a','button blue-button','Order on WhatsApp'),`https://wa.me/${digits}`+(filled(wa.message)?`?text=${encodeURIComponent(wa.message.trim())}`:'')))}
if(stores.length){const c=card('wb-stores','Find a store','<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),list=el('ul','wb-store-list');list.id='buy-store-list';
const cities=[...new Set(stores.map(s=>filled(s.city)?s.city.trim():'').filter(Boolean))];
if(cities.length>1){const chips=el('div','wb-chips');chips.setAttribute('role','group');chips.setAttribute('aria-label','Filter stores by city');['All',...cities].forEach((city,i)=>{const btn=el('button','',city);btn.type='button';btn.dataset.city=i?city:'';btn.setAttribute('aria-pressed',String(!i));btn.setAttribute('aria-controls','buy-store-list');chips.append(btn)});c.append(chips)}
stores.forEach(s=>{const li=el('li','wb-store');li.dataset.city=filled(s.city)?s.city.trim():'';li.append(el('strong','',s.name));const where=[s.address,s.city].filter(filled).map(v=>v.trim()).join(', ');if(where)li.append(el('span','',where));if(link(s.mapUrl))li.append(external(el('a','under-link','View on map'),s.mapUrl.trim()));list.append(li)});c.append(list)}
if(filled(b.deliveryNote)){const p=section.querySelector('#buy-delivery');p.append(el('span','',b.deliveryNote.trim()));if(/deliver/i.test(b.deliveryNote)){p.append(document.createTextNode(' '));p.append(el('strong','','18+ only, ID may be checked on delivery.'))}p.hidden=false}
if(hasForm){const panel=section.querySelector('#buy-distributor');panel.hidden=false;panel.dataset.endpoint=endpoint;panel.dataset.email=email(b.distributorEmail)?b.distributorEmail.trim():''}
if(options.children.length||hasForm)section.hidden=false})(buy);
/*
 * SOCIAL PROOF CONFIG (section #proof)
 * VERIFIED, REAL CONTENT ONLY. No placeholder reviews, fake logos or invented numbers.
 * Only filled items render; empty blocks are hidden, and if every block is empty the section is not rendered at all.
 *
 * STILL MISSING (everything below is currently empty):
 *  - proof.stats         {value:number, suffix:'', label:''}, e.g. real retail doors, cities, pouches sold
 *  - proof.testimonials  {quote, name, city, rating?}, real customers who gave permission only
 *  - proof.retailers     {name, logo}, real stockists; logo is a path in assets/ (name alone also works)
 *  - proof.press         {outlet, headline, url}, real coverage only
 *  - proof.community     {handle, url}, social profile; no follower count unless verified
 *  - proof.eyebrow / proof.headline  optional section labels; defaults below
 *
 * REVIEW EVERY TESTIMONIAL before adding it: no health, quit-smoking, cessation or performance claims
 * (nothing like "helped me quit", "healthier", "safer", "more energy/focus"). Star ratings only show if a real rating (1-5) is given.
 *
 * @typedef {{value:number, suffix:string, label:string}} ProofStat
 * @typedef {{quote:string, name:string, city:string, rating?:number}} ProofTestimonial
 * @typedef {{name:string, logo:string}} ProofRetailer
 * @typedef {{outlet:string, headline:string, url:string}} ProofPress
 * @type {{eyebrow:string, headline:string, stats:ProofStat[], testimonials:ProofTestimonial[], retailers:ProofRetailer[], press:ProofPress[], community:{handle:string, url:string}}}
 */
const proof={
  eyebrow:'',   // default: 'IN THE REAL WORLD'
  headline:'',  // default: 'NUWA, out in the world.'
  stats:[
    // {value:0, suffix:'', label:''},
  ],
  testimonials:[
    // {quote:'', name:'', city:'', rating:5},  // review for health/quit/performance claims first
  ],
  retailers:[
    // {name:'', logo:'assets/'},
  ],
  press:[
    // {outlet:'', headline:'', url:''},
  ],
  community:{handle:'',url:''}
};
(p=>{const section=document.querySelector('#proof');if(!section)return;
const filled=v=>typeof v==='string'&&v.trim()!=='',link=v=>filled(v)&&/^https?:\/\//i.test(v.trim());
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(filled(text))e.textContent=text;return e};
const icon=paths=>{const t=document.createElement('template');t.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;return t.content.firstChild};
const stats=(p.stats||[]).filter(s=>s&&Number.isFinite(s.value)&&filled(s.label));
const quotes=(p.testimonials||[]).filter(t=>t&&filled(t.quote));
const retailers=(p.retailers||[]).filter(r=>r&&(filled(r.name)||filled(r.logo)));
const press=(p.press||[]).filter(x=>x&&(filled(x.outlet)||filled(x.headline)));
const community=p.community||{},hasCommunity=filled(community.handle)||link(community.url);
if(!stats.length&&!quotes.length&&!retailers.length&&!press.length&&!hasCommunity)return;
section.querySelector('#proof-eyebrow').textContent=filled(p.eyebrow)?p.eyebrow:'IN THE REAL WORLD';
section.querySelector('#proof-title').textContent=filled(p.headline)?p.headline:'NUWA, out in the world.';
const block=title=>{const b=el('div','pf-block');if(title)b.append(el('h3','',title));section.append(b);return b};
if(stats.length){const list=el('ul','pf-stats');stats.forEach((s,i)=>{const li=el('li'),num=el('strong'),decimals=(String(s.value).split('.')[1]||'').length;li.style.setProperty('--i',i);num.dataset.count=s.value;num.dataset.decimals=decimals;num.dataset.suffix=filled(s.suffix)?s.suffix:'';num.textContent=s.value.toLocaleString('en',{minimumFractionDigits:decimals,maximumFractionDigits:decimals})+num.dataset.suffix;li.append(num,el('span','',s.label));list.append(li)});section.append(list)}
if(quotes.length){const b=block(),top=el('div','pf-carousel-top'),track=el('ul','pf-track');top.append(el('h3','','What customers say'));track.id='proof-track';track.tabIndex=0;track.setAttribute('aria-label','Customer testimonials, scroll horizontally');
if(quotes.length>1){const arrows=el('div','pf-arrows');[['prev','Previous testimonial','<path d="M15 18l-6-6 6-6"/>'],['next','Next testimonial','<path d="M9 18l6-6-6-6"/>']].forEach(([dir,label,path])=>{const btn=el('button');btn.type='button';btn.dataset.dir=dir;btn.setAttribute('aria-label',label);btn.setAttribute('aria-controls','proof-track');btn.append(icon(path));arrows.append(btn)});top.append(arrows)}
b.append(top);quotes.forEach(t=>{const li=el('li'),card=el('figure','pf-quote'),rating=Math.round(Number(t.rating));if(Number.isFinite(rating)&&rating>=1&&rating<=5){const stars=el('div','pf-stars');stars.setAttribute('role','img');stars.setAttribute('aria-label',`Rated ${rating} out of 5`);for(let i=0;i<5;i++){const s=icon('<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>');if(i<rating)s.setAttribute('fill','currentColor');stars.append(s)}card.append(stars)}
const q=el('blockquote','',`“${t.quote.trim()}”`),cap=el('figcaption');if(filled(t.name))cap.append(el('strong','',t.name));if(filled(t.city))cap.append(el('span','',t.city));card.append(q);if(cap.children.length)card.append(cap);li.append(card);track.append(li)});b.append(track)}
if(retailers.length){const b=block('Where to find NUWA'),wrap=el('div','pf-marquee'),trackEl=el('div','pf-marquee-track'),repeat=Math.max(1,Math.ceil(6/retailers.length));wrap.style.setProperty('--pf-duration',Math.max(20,retailers.length*repeat*4)+'s');
for(let copy=0;copy<2;copy++){const list=el('ul','pf-logos');if(copy)list.setAttribute('aria-hidden','true');else list.setAttribute('aria-label','Stockists');for(let r=0;r<repeat;r++)retailers.forEach(x=>{const li=el('li');if(r)li.dataset.repeat='';if(r&&!copy)li.setAttribute('aria-hidden','true');if(filled(x.logo)){const img=el('img');img.src=x.logo.trim();img.alt=filled(x.name)?x.name:'Stockist logo';img.loading='lazy';img.decoding='async';img.height=40;li.append(img)}else li.append(el('span','pf-name',x.name));list.append(li)});trackEl.append(list)}wrap.append(trackEl);b.append(wrap)}
if(press.length){const b=block('In the press'),list=el('ul','pf-press');press.forEach(x=>{const li=el('li'),card=link(x.url)?el('a','pf-press-card'):el('div','pf-press-card');if(card.tagName==='A'){card.href=x.url.trim();card.target='_blank';card.rel='noopener noreferrer'}if(filled(x.outlet))card.append(el('span','',x.outlet));if(filled(x.headline))card.append(el('strong','',x.headline));if(card.tagName==='A')card.append(el('em','','Read article →'));li.append(card);list.append(li)});b.append(list)}
if(hasCommunity){const b=el('p','pf-community'),label=filled(community.handle)?community.handle.trim():community.url.trim();if(link(community.url)){const a=el('a','under-link',`Follow NUWA: ${label}`);a.href=community.url.trim();a.target='_blank';a.rel='noopener noreferrer';b.append(a)}else b.append(el('span','',`Follow NUWA: ${label}`));section.append(b)}
section.hidden=false})(proof);
/*
 * BRAND STORY CONFIG (section #brand-story)
 * Only what is entered here is shown; empty fields and items are never rendered.
 * The whole section stays hidden until at least one of paragraphs, nameMeaning, founders, milestones or values is filled.
 *
 * STILL MISSING (everything below is currently empty):
 *  - story.headline     optional; defaults to "The story behind NUWA." (use \n to set line breaks)
 *  - story.paragraphs   2-3 paragraphs: why NUWA exists, what problem it solves, the philosophy
 *  - story.nameMeaning  meaning of the name NUWA, if any
 *  - story.founders     {name, role, photo, quote}; photo is a path in assets/, optional
 *  - story.milestones   {year, text}, max 5
 *  - story.values       {title, text}, max 3
 *
 * @typedef {{name:string, role:string, photo:string, quote:string}} StoryFounder
 * @typedef {{year:string, text:string}} StoryMilestone
 * @typedef {{title:string, text:string}} StoryValue
 * @type {{headline:string, paragraphs:string[], nameMeaning:string, founders:StoryFounder[], milestones:StoryMilestone[], values:StoryValue[]}}
 */
const story={
  headline:'',
  paragraphs:[],
  nameMeaning:'',
  founders:[
    // {name:'', role:'', photo:'assets/', quote:''},
  ],
  milestones:[
    // {year:'', text:''},
  ],
  values:[
    // {title:'', text:''},
  ]
};
(s=>{const section=document.querySelector('#brand-story');if(!section)return;
const filled=v=>typeof v==='string'&&v.trim()!=='';
const keep=(list,keys)=>(list||[]).filter(item=>item&&keys.some(k=>filled(item[k])));
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(filled(text))e.textContent=text;return e};
const paragraphs=(s.paragraphs||[]).filter(filled),founders=keep(s.founders,['name','role','quote']),milestones=keep(s.milestones,['year','text']).slice(0,5),values=keep(s.values,['title','text']).slice(0,3);
if(!paragraphs.length&&!filled(s.nameMeaning)&&!founders.length&&!milestones.length&&!values.length)return;
const top=section.querySelector('.st-top'),text=section.querySelector('.st-text'),title=section.querySelector('.st-title');
(filled(s.headline)?s.headline:'The story behind NUWA.').split('\n').filter(filled).forEach((line,i)=>{const outer=el('span','st-line'),inner=el('span','',line.trim());outer.style.setProperty('--i',i);outer.append(inner);title.append(outer)});
let order=0;paragraphs.forEach(p=>{const para=el('p','st-p',p);para.style.setProperty('--i',order++);text.append(para)});
if(filled(s.nameMeaning)){const callout=el('aside','st-callout');callout.style.setProperty('--i',order++);callout.append(el('span','','What the name means'),el('p','',s.nameMeaning));text.append(callout)}
if(founders.length){const list=el('ul','st-founders');founders.forEach(f=>{const li=el('li'),card=el('article','st-founder');if(filled(f.photo)){const frame=el('div','st-photo'),img=el('img');img.src=f.photo.trim();img.alt=[f.name,f.role].filter(filled).join(', ')||'NUWA founder';img.width=112;img.height=140;img.loading='lazy';img.decoding='async';frame.append(img);card.append(frame)}else card.classList.add('st-no-photo');const body=el('div');if(filled(f.name))body.append(el('h3','',f.name));if(filled(f.role))body.append(el('span','st-role',f.role));if(filled(f.quote))body.append(el('blockquote','',`“${f.quote.trim()}”`));card.append(body);li.append(card);list.append(li)});top.append(list)}else top.classList.add('st-solo');
if(milestones.length){const list=el('ol','st-miles');list.setAttribute('aria-label','Milestones');list.style.setProperty('--n',milestones.length);milestones.forEach((m,i)=>{const li=el('li');li.style.setProperty('--t',(milestones.length>1?i/(milestones.length-1)*1.2:0).toFixed(2)+'s');const node=el('span','st-node');node.setAttribute('aria-hidden','true');li.append(node);if(filled(m.year))li.append(el('strong','',m.year));if(filled(m.text))li.append(el('p','',m.text));list.append(li)});section.append(list)}
if(values.length){const list=el('ul','st-values');values.forEach((v,i)=>{const li=el('li','st-value');li.style.setProperty('--i',i);if(filled(v.title))li.append(el('h3','',v.title));if(filled(v.text))li.append(el('p','',v.text));list.append(li)});section.append(list)}
section.hidden=false})(story);
/*
 * QUALITY & INGREDIENTS CONFIG (section #quality)
 * Only facts entered here are shown. Empty strings and empty items are never rendered,
 * and a block with no filled items is hidden.
 *
 * STILL MISSING (everything below is currently empty):
 *  - quality.ingredients   name + note per ingredient (e.g. nicotine source, plant fibre, sweeteners, flavourings, pH adjusters)
 *  - quality.standards     label + detail (e.g. manufacturing standard, lab testing, certifications)
 *  - quality.process       3-4 steps, title + text (e.g. sourcing, production, testing, packing)
 *  - quality.origin        e.g. "Made in ..." (only if verified)
 *  - quality.documentsUrl  link to a lab report / spec sheet / certificate PDF
 *
 * @typedef {{name:string, note:string}} QualityIngredient
 * @typedef {{label:string, detail:string}} QualityStandard
 * @typedef {{title:string, text:string}} QualityStep
 * @type {{ingredients:QualityIngredient[], standards:QualityStandard[], process:QualityStep[], origin:string, documentsUrl:string}}
 */
const quality={
  ingredients:[
    // {name:'', note:''},
  ],
  standards:[
    // {label:'', detail:''},
  ],
  process:[
    // {title:'', text:''},
  ],
  origin:'',
  documentsUrl:''
};
(q=>{const section=document.querySelector('#quality');if(!section)return;
const filled=v=>typeof v==='string'&&v.trim()!=='';
const keep=(list,keys)=>(list||[]).filter(item=>item&&keys.some(k=>filled(item[k])));
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(filled(text))e.textContent=text;return e};
const svg=paths=>{const t=document.createElement('template');t.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;return t.content.firstChild};
const ingredients=keep(q.ingredients,['name','note']),steps=keep(q.process,['title','text']),standards=keep(q.standards,['label','detail']);
const meta=section.querySelector('#quality-meta'),badge=section.querySelector('#quality-badge'),body=section.querySelector('#quality-body'),strip=section.querySelector('#quality-standards');
if(filled(q.origin))meta.append(el('span','ql-pill',q.origin));
if(ingredients.length){const panel=el('div','ql-panel');panel.append(badge,el('h3','',"What's inside"));const list=el('ul','ql-ingredients');ingredients.forEach((it,i)=>{const li=el('li');li.style.setProperty('--i',i);if(filled(it.name))li.append(el('strong','',it.name));if(filled(it.note))li.append(el('span','',it.note));list.append(li)});panel.append(list);body.append(panel)}
if(steps.length){const wrap=el('div','ql-timeline'),list=el('ol','ql-steps');wrap.append(el('h3','','How we make it'));steps.forEach((s,i)=>{const li=el('li');li.style.setProperty('--t',(steps.length>1?i/(steps.length-1)*1.2:0).toFixed(2)+'s');const node=el('span','ql-node',String(i+1));node.setAttribute('aria-hidden','true');const text=el('div','ql-step');if(filled(s.title))text.append(el('strong','',s.title));if(filled(s.text))text.append(el('p','',s.text));li.append(node,text);list.append(li)});wrap.append(list);body.append(wrap)}
if(body.children.length){if(body.children.length===1)body.firstChild.classList.add('ql-solo');body.hidden=false}
meta.hidden=!meta.children.length;
const docs=filled(q.documentsUrl)&&!/^\s*javascript:/i.test(q.documentsUrl)?q.documentsUrl.trim():'';
if(standards.length||docs){const top=el('div','ql-standards-top');top.append(el('h3','','Standards'));if(docs){const a=el('a','button ql-docs','View lab reports');a.href=docs;a.target='_blank';a.rel='noopener';top.append(a)}strip.append(top);
if(standards.length){const grid=el('ul','ql-standard-grid');standards.forEach((s,i)=>{const li=el('li','ql-standard-item'),card=el('div','ql-standard');li.style.setProperty('--i',i);card.append(svg('<path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z"/><path d="M8.8 12.2l2.2 2.2 4.3-4.6"/>'));if(filled(s.label))card.append(el('strong','',s.label));if(filled(s.detail))card.append(el('span','',s.detail));li.append(card);grid.append(li)});strip.append(grid)}
strip.hidden=false}
})(quality);
// NUWA product range: edit products and the strength guide here.
const EXTRA_STRONG_MG='[MG]'; // TODO: replace with the confirmed nicotine strength
const products=[
  {name:'Watermelon',flavorNote:'Juicy, sweet summer fruit with a smooth, refreshing finish.',strength:`Extra Strong, ${EXTRA_STRONG_MG}`,packSize:'20 Nicopods per pack',image:'assets/nuwa-watermelon.webp',badge:`EXTRA STRONG · ${EXTRA_STRONG_MG}`,tint:'#c52b45'},
  {name:'Elaichi',flavorNote:'Warm, aromatic cardamom with a rich, comforting taste.',strength:`Extra Strong, ${EXTRA_STRONG_MG}`,packSize:'20 Nicopods per pack',image:'assets/nuwa-elaichi.webp',badge:`EXTRA STRONG · ${EXTRA_STRONG_MG}`,tint:'#789341'},
  {name:'Mint',flavorNote:'Cool and crisp, a classic for a reason.',strength:`Extra Strong, ${EXTRA_STRONG_MG}`,packSize:'20 Nicopods per pack',image:'assets/nuwa-mint.webp',badge:`EXTRA STRONG · ${EXTRA_STRONG_MG}`,tint:'#135d86'}
];
const shopLink='#distribution';
const strengthGuide=[
  {icon:'check',text:`Already use strong nicotine products? Extra Strong (${EXTRA_STRONG_MG}) is built for you.`},
  {icon:'alert',text:'New to nicotine pouches or nicotine? NUWA Extra Strong may be too strong. If you are not a current nicotine user, we recommend you do not start.'},
  {icon:'clock',text:'Start slow: use one pouch at a time and wait before using another.'}
];
const guideIcons={check:'<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.8"/>',alert:'<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><path d="M12 16.5h.01"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/>'};
document.querySelector('#product-grid').innerHTML=products.map((p,i)=>`<li class="product-item" style="--i:${i}"><article class="product-card" style="--tint:${p.tint}" aria-labelledby="product-${i}"><div class="product-art"><img src="${p.image}" alt="NUWA ${p.name} ${p.strength.split(',')[0]} nicotine pouches, ${p.packSize.replace(' per pack','')}" width="480" height="480" loading="lazy" decoding="async"></div><div class="product-body"><h3 id="product-${i}">${p.name}</h3><p class="product-note">${p.flavorNote}</p><span class="product-strength">${p.badge}</span><p class="product-pack">${p.packSize}</p><a class="button blue-button" href="${shopLink}">Shop ${p.name}</a></div></article></li>`).join('');
document.querySelector('#strength-guide').innerHTML=strengthGuide.map(r=>`<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${guideIcons[r.icon]}</svg><span>${r.text}</span></li>`).join('');
const menu=document.querySelector('.menu');menu.onclick=()=>{let expanded=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',!expanded);document.querySelector('nav').classList.toggle('open',!expanded)};document.querySelectorAll('nav a').forEach(a=>a.onclick=()=>{menu.setAttribute('aria-expanded',false);document.querySelector('nav').classList.remove('open')});document.querySelectorAll('[data-interest]').forEach(a=>a.addEventListener('click',()=>document.querySelector('#interest').value=a.dataset.interest));let enquiryUrl;document.querySelector('#enquiry').onsubmit=e=>{e.preventDefault();const data=new FormData(e.target);const text=`NUWA — ${data.get('interest')} enquiry\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}\n\nPrepared locally. This enquiry has not been sent.\n`;if(enquiryUrl)URL.revokeObjectURL(enquiryUrl);enquiryUrl=URL.createObjectURL(new Blob([text],{type:'text/plain'}));const result=document.querySelector('#form-result');result.replaceChildren();const p=document.createElement('p');p.textContent='Your enquiry is ready. It has not been sent.';const a=document.createElement('a');a.href=enquiryUrl;a.download='NUWA-enquiry.txt';a.textContent='Download your enquiry';result.append(p,a)};document.querySelector('#year').textContent=new Date().getFullYear();if(!matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.product-item,.about-copy,.about-media,.section-heading,.intro-grid,.story-grid,.partner-grid article,.vision h2').forEach(el=>{el.classList.add('reveal');observer.observe(el)})}
// Why NUWA: reveal-on-scroll, stat count-up and desktop card tilt. Content is static HTML, so it stays visible if this never runs.
(()=>{const section=document.querySelector('#why-nuwa');if(!section)return;
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const countUp=root=>root.querySelectorAll('[data-count]').forEach(el=>{const target=+el.dataset.count,duration=1500,start=performance.now();const tick=now=>{const p=Math.min((now-start)/duration,1);el.textContent=Math.round(target*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(tick)};el.textContent='0';requestAnimationFrame(tick)});
if(!reduceMotion&&'IntersectionObserver' in window){section.classList.add('wn-ready');const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('is-in');io.unobserve(e.target);if(e.target.classList.contains('wn-stats'))countUp(e.target)}),{threshold:.2});section.querySelectorAll('.wn-head,.wn-item,.wn-stats').forEach(el=>io.observe(el))}
if(!reduceMotion&&matchMedia('(hover: hover) and (pointer: fine)').matches)section.querySelectorAll('.wn-card').forEach(card=>{const maxTilt=6;card.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.setProperty('--ry',(x*2*maxTilt).toFixed(2)+'deg');card.style.setProperty('--rx',(-y*2*maxTilt).toFixed(2)+'deg')});card.addEventListener('pointerleave',()=>{card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg')})})})();
// Quality & Ingredients: one-time reveal. Hidden states only apply after .ql-ready is added here.
(()=>{const section=document.querySelector('#quality');if(!section||matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;section.classList.add('ql-ready');const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}}),{threshold:.2});section.querySelectorAll('.ql-head,.ql-panel,.ql-timeline,.ql-standards').forEach(el=>io.observe(el))})();
// Brand story: one-time reveals and a gentle founder-photo parallax (transform only, max 12px). Hidden states only apply after .st-ready.
(()=>{const section=document.querySelector('#brand-story');if(!section||section.hidden||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
if('IntersectionObserver' in window){section.classList.add('st-ready');const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}}),{threshold:.2});section.querySelectorAll('.st-title,.st-text,.st-founders li,.st-miles,.st-values').forEach(el=>io.observe(el))}
const photos=[...section.querySelectorAll('.st-photo img')];if(!photos.length)return;const maxDrift=12;let queued=false;
const update=()=>{queued=false;const vh=innerHeight;photos.forEach(img=>{const r=img.parentElement.getBoundingClientRect();if(r.bottom<0||r.top>vh)return;const p=Math.max(-1,Math.min(1,(r.top+r.height/2-vh/2)/(vh/2+r.height/2)));img.style.setProperty('--py',(-p*maxDrift).toFixed(1)+'px')})};
addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update)}},{passive:true});update()})();
// Social proof: one-time reveals, stat count-up and the testimonial carousel. Autoplay is intentionally off.
(()=>{const section=document.querySelector('#proof');if(!section||section.hidden)return;const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const countUp=root=>root.querySelectorAll('[data-count]').forEach(n=>{const target=+n.dataset.count,dec=+n.dataset.decimals,suffix=n.dataset.suffix,start=performance.now(),fmt=v=>v.toLocaleString('en',{minimumFractionDigits:dec,maximumFractionDigits:dec})+suffix;const tick=now=>{const t=Math.min((now-start)/1500,1);n.textContent=fmt(target*(1-Math.pow(1-t,3)));if(t<1)requestAnimationFrame(tick)};n.textContent=fmt(0);requestAnimationFrame(tick)});
if(!reduceMotion&&'IntersectionObserver' in window){section.classList.add('pf-ready');const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('is-in');io.unobserve(e.target);if(e.target.classList.contains('pf-stats'))countUp(e.target)}),{threshold:.2});section.querySelectorAll('.pf-head,.pf-stats,.pf-block').forEach(el=>io.observe(el))}
const track=section.querySelector('.pf-track');if(!track)return;const cards=[...track.querySelectorAll('.pf-quote')],prev=section.querySelector('[data-dir=prev]'),next=section.querySelector('[data-dir=next]');
const step=()=>(track.querySelector('li')?.getBoundingClientRect().width||track.clientWidth)+22;
const updateArrows=()=>{if(!prev)return;prev.disabled=track.scrollLeft<=2;next.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-2};
[prev,next].forEach(btn=>btn&&btn.addEventListener('click',()=>track.scrollBy({left:(btn===next?1:-1)*step(),behavior:reduceMotion?'auto':'smooth'})));
track.addEventListener('scroll',()=>requestAnimationFrame(updateArrows),{passive:true});addEventListener('resize',updateArrows);updateArrows();
if('IntersectionObserver' in window){const active=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('is-active',e.intersectionRatio>=.6)),{root:track,threshold:[0,.6,1]});cards.forEach(c=>active.observe(c))}else cards.forEach(c=>c.classList.add('is-active'))})();
// Where to buy: reveals, store city filter and the distributor form (validation, honeypot, loading and success states). No personal data is logged.
(()=>{const section=document.querySelector('#where-to-buy');if(!section||section.hidden)return;const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduceMotion&&'IntersectionObserver' in window){section.classList.add('wb-ready');const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}}),{threshold:.2});section.querySelectorAll('.wb-head,.wb-options,.wb-distributor:not([hidden])').forEach(el=>io.observe(el))}
const chips=section.querySelector('.wb-chips');if(chips)chips.addEventListener('click',e=>{const btn=e.target.closest('button');if(!btn)return;chips.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));let i=0;section.querySelectorAll('.wb-store').forEach(li=>{const show=!btn.dataset.city||li.dataset.city===btn.dataset.city;li.hidden=!show;li.classList.remove('wb-in');if(show&&!reduceMotion){li.style.setProperty('--i',i++);void li.offsetWidth;li.classList.add('wb-in')}})});
const panel=section.querySelector('#buy-distributor');if(!panel||panel.hidden)return;const form=panel.querySelector('#distributor-form'),status=panel.querySelector('#distributor-status'),success=panel.querySelector('#distributor-success'),successText=panel.querySelector('#distributor-success-text');
const rules={name:v=>v.length>=2||'Please enter your name.',business:v=>v.length>=2||'Please enter your business name.',city:v=>v.length>=2||'Please enter your city.',phone:v=>/^\+?[\d\s()-]{7,20}$/.test(v)||'Please enter a valid phone or WhatsApp number.',email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)||'Please enter a valid email address.',message:v=>v.length<=2000||'Please keep your message under 2000 characters.'};
let submitted=false;const check=input=>{const rule=rules[input.name];if(!rule)return true;const result=rule(input.value.trim()),err=panel.querySelector(`#${input.id}-err`);const ok=result===true;input.setAttribute('aria-invalid',String(!ok));err.textContent=ok?'':result;return ok};
form.addEventListener('blur',e=>{if(submitted&&e.target.name)check(e.target)},true);form.addEventListener('input',e=>{if(submitted&&e.target.getAttribute('aria-invalid')==='true')check(e.target)});
const done=text=>{successText.textContent=text;form.hidden=true;success.hidden=false;if(!reduceMotion)success.classList.add('is-drawing');success.focus()};
form.addEventListener('submit',async e=>{e.preventDefault();submitted=true;status.textContent='';const fields=[...form.querySelectorAll('.wb-field input,.wb-field textarea')];const invalid=fields.filter(f=>!check(f));if(invalid.length){invalid[0].focus();return}
const data=Object.fromEntries(new FormData(form));if(data.website){done('Your inquiry has been sent.');return}
const endpoint=panel.dataset.endpoint,to=panel.dataset.email;
if(!endpoint){const body=`Name: ${data.name}\nBusiness: ${data.business}\nCity: ${data.city}\nPhone/WhatsApp: ${data.phone}\nEmail: ${data.email}\n\n${data.message||''}`;location.href=`mailto:${to}?subject=${encodeURIComponent('Distributor inquiry: '+data.business)}&body=${encodeURIComponent(body)}`;done('Your email app should open with your inquiry ready to send.');return}
form.classList.add('is-loading');form.setAttribute('aria-busy','true');
try{const res=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const json=await res.json().catch(()=>({}));
if(res.ok&&json.ok){done('Your inquiry has been sent. We will be in touch.');return}
if(json.errors)Object.entries(json.errors).forEach(([name,msg])=>{const input=form.elements[name];if(input){input.setAttribute('aria-invalid','true');panel.querySelector(`#${input.id}-err`).textContent=msg}});
status.textContent='Something went wrong sending your inquiry. Please try again'+(to?` or email ${to}.`:'.')}catch(err){status.textContent='Could not send right now. Please check your connection and try again'+(to?` or email ${to}.`:'.')}
finally{form.classList.remove('is-loading');form.removeAttribute('aria-busy')}})})();
// FAQ: renders visible items (after all other configs are loaded), emits FAQPage JSON-LD, accessible single-open accordion, optional search.
(f=>{const section=document.querySelector('#faq');if(!section)return;
const filled=v=>typeof v==='string'&&v.trim()!=='';const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(filled(text))e.textContent=text;return e};
const mg=typeof EXTRA_STRONG_MG==='string'&&filled(EXTRA_STRONG_MG)&&EXTRA_STRONG_MG.trim()!=='[MG]'?EXTRA_STRONG_MG.trim():'';
const hasDistributorForm=!!document.querySelector('#where-to-buy:not([hidden]) #buy-distributor:not([hidden])');
const items=(f.items||[]).filter(it=>it&&filled(it.q)&&filled(it.a)&&(it.needs!=='mg'||mg)&&(it.needs!=='distributorForm'||hasDistributorForm)).map(it=>({...it,a:it.a.replace('[MG]',mg)}));
if(!items.length)return;
section.querySelector('#faq-eyebrow').textContent=filled(f.eyebrow)?f.eyebrow:'FAQ';
section.querySelector('#faq-title').textContent=filled(f.headline)?f.headline:'Questions, answered.';
const list=section.querySelector('#faq-list');
items.forEach((it,i)=>{const li=el('li','fq-item'),h=el('h3'),btn=el('button','fq-q'),panel=el('div','fq-panel'),inner=el('div'),answer=el('p','fq-answer');li.style.setProperty('--i',i);
btn.type='button';btn.id=`faq-q-${i}`;btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-controls',`faq-a-${i}`);btn.append(el('span','',it.q));const ic=el('span','fq-icon');ic.setAttribute('aria-hidden','true');btn.append(ic);h.append(btn);
panel.id=`faq-a-${i}`;panel.setAttribute('role','region');panel.setAttribute('aria-labelledby',btn.id);panel.inert=true;
if(it.link&&filled(it.link.text)&&it.a.includes(it.link.text)){const [before,after]=it.a.split(it.link.text);const a=el('a','under-link',it.link.text);a.href=it.link.href;answer.append(document.createTextNode(before),a,document.createTextNode(after))}else answer.textContent=it.a;
inner.append(answer);panel.append(inner);li.dataset.search=(it.q+' '+it.a).toLowerCase();li.append(h,panel);list.append(li)});
const ld=document.createElement('script');ld.type='application/ld+json';ld.id='faq-jsonld';ld.textContent=JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',mainEntity:items.map(it=>({'@type':'Question',name:it.q,acceptedAnswer:{'@type':'Answer',text:it.a}}))});document.head.append(ld);
const contact=typeof buy!=='undefined'?buy:{},mail=filled(contact.distributorEmail)&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.distributorEmail.trim())?contact.distributorEmail.trim():'',wa=String((contact.whatsapp||{}).number||'').replace(/\D/g,'');
if(mail||wa.length>=7){const card=section.querySelector('#faq-contact'),links=card.querySelector('.fq-contact-links');if(mail){const a=el('a','under-link',mail);a.href=`mailto:${mail}`;links.append(a)}if(wa.length>=7){const a=el('a','under-link','Message us on WhatsApp');a.href=`https://wa.me/${wa}`;a.target='_blank';a.rel='noopener noreferrer';links.append(a)}card.hidden=false}
const buttons=()=>[...list.querySelectorAll('.fq-item:not([hidden]) .fq-q')];
const setOpen=(li,open)=>{li.classList.toggle('is-open',open);li.querySelector('.fq-q').setAttribute('aria-expanded',String(open));li.querySelector('.fq-panel').inert=!open};
list.addEventListener('click',e=>{const btn=e.target.closest('.fq-q');if(!btn)return;const li=btn.closest('.fq-item'),open=!li.classList.contains('is-open');list.querySelectorAll('.fq-item.is-open').forEach(o=>o!==li&&setOpen(o,false));setOpen(li,open)});
list.addEventListener('keydown',e=>{const all=buttons(),i=all.indexOf(document.activeElement);if(i<0)return;const to={ArrowDown:all[(i+1)%all.length],ArrowUp:all[(i-1+all.length)%all.length],Home:all[0],End:all[all.length-1]}[e.key];if(to){e.preventDefault();to.focus()}});
if(items.length>=8){const box=section.querySelector('#faq-search'),input=box.querySelector('input'),empty=box.querySelector('#faq-empty');box.hidden=false;input.addEventListener('input',()=>{const term=input.value.trim().toLowerCase();let shown=0;list.querySelectorAll('.fq-item').forEach(li=>{const match=!term||li.dataset.search.includes(term);li.hidden=!match;if(!match&&li.classList.contains('is-open'))setOpen(li,false);if(match)shown++});empty.textContent=shown?'':'No matching questions.'})}
section.hidden=false;
if(!reduceMotion&&'IntersectionObserver' in window){section.classList.add('fq-ready');const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}}),{threshold:.2});[section.querySelector('.fq-side'),list].forEach(el=>io.observe(el))}
})(faq);
