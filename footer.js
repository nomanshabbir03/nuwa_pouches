// Shared footer (main page and /investors/): config + behaviour.
/*
 * FOOTER CONFIG. Static links work without JavaScript; these values only add or override.
 * Only provided values render (no empty contact lines, no empty social icons).
 *
 * STILL MISSING (all empty):
 *  - site.tagline        optional; default "Tobacco-free nicotine pouches for adults."
 *  - site.contactEmail   also turns the footer "Contact" link into an email link
 *  - site.phone          phone / WhatsApp number shown as a tap-to-call link
 *  - site.address        optional
 *  - site.social         full https:// URLs; supported icons: instagram, facebook, tiktok, x, youtube, linkedin (others show as text)
 *  - site.policies       override only if the policy pages live elsewhere; defaults are the draft pages in dist/
 *
 * @type {{tagline:string, contactEmail:string, phone:string, address:string, social:Object<string,string>, policies:{privacy:string, terms:string, refundShipping:string, responsibleUse:string}}}
 */
const site={
  tagline:'',
  contactEmail:'',
  phone:'',
  address:'',
  social:{instagram:'',facebook:'',tiktok:'',x:'',youtube:'',linkedin:''},
  policies:{privacy:'privacy.html',terms:'terms.html',refundShipping:'refund-shipping.html',responsibleUse:'responsible-use.html'}
};
// Footer: config-driven contact/social/policy links, hides links to sections that are not on the page, back-to-top and a one-time reveal.
(s=>{const footer=document.querySelector('.ft');if(!footer)return;const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const filled=v=>typeof v==='string'&&v.trim()!=='',web=v=>filled(v)&&/^https?:\/\//i.test(v.trim()),mailOk=v=>filled(v)&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(filled(text))e.textContent=text;return e};
if(filled(s.tagline))footer.querySelector('#footer-tagline').textContent=s.tagline.trim();
const contact=footer.querySelector('#footer-contact'),contactLink=footer.querySelector('#footer-contact-link');
if(mailOk(s.contactEmail)){const a=el('a','',s.contactEmail.trim());a.href=`mailto:${s.contactEmail.trim()}`;contact.append(a);contactLink.href=`mailto:${s.contactEmail.trim()}`}
const tel=String(s.phone||'').replace(/[^\d+]/g,'');if(tel.replace(/\D/g,'').length>=7){const a=el('a','',s.phone.trim());a.href=`tel:${tel}`;contact.append(a)}
if(filled(s.address))contact.append(el('span','',s.address.trim()));contact.hidden=!contact.children.length;
const icons={instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>',facebook:'<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/>',tiktok:'<path d="M14 3v12.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.5 2.8 2.4 4.6 5 5"/>',x:'<path d="M4 4l16 16"/><path d="M20 4L4 20"/>',youtube:'<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9.5v5l4.5-2.5z" fill="currentColor"/>',linkedin:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/>'};
const names={instagram:'Instagram',facebook:'Facebook',tiktok:'TikTok',x:'X',youtube:'YouTube',linkedin:'LinkedIn'};
const social=footer.querySelector('#footer-social');Object.entries(s.social||{}).forEach(([key,url])=>{if(!web(url))return;const li=el('li'),a=el('a');a.href=url.trim();a.target='_blank';a.rel='noopener noreferrer';
if(icons[key]){a.setAttribute('aria-label',`NUWA on ${names[key]}`);const t=document.createElement('template');t.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${icons[key]}</svg>`;a.append(t.content.firstChild)}else{a.className='ft-social-text';a.textContent=key}li.append(a);social.append(li)});social.hidden=!social.children.length;
footer.querySelectorAll('[data-policy-link]').forEach(a=>{const url=(s.policies||{})[a.dataset.policyLink];if(filled(url))a.href=url.trim()});
footer.querySelectorAll('.ft-col a[href^="#"]').forEach(a=>{const target=document.getElementById(a.getAttribute('href').slice(1));if(!target||target.closest('[hidden]'))a.closest('li').hidden=true});
footer.querySelector('#back-to-top').addEventListener('click',()=>{scrollTo({top:0,behavior:reduceMotion?'auto':'smooth'});const logo=document.querySelector('header .logo');if(logo)logo.focus({preventScroll:true})});
if(!reduceMotion&&'IntersectionObserver' in window){footer.classList.add('ft-ready');const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){footer.classList.add('is-in');io.disconnect()}}),{threshold:.15});io.observe(footer)}
})(site);
