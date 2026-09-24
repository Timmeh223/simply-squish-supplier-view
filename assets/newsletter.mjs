import {newsletterConsentVersion} from './newsletter-copy.mjs';
export async function saveSignup(input,send=fetch){
 let response;try{response=await send('/simply-squish-supplier-view/api/newsletter',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...input,consentVersion:newsletterConsentVersion})})}catch{throw Error('We couldn’t save your signup. Please check your connection and try again.')}
 let result;try{result=await response.json()}catch{throw Error('We couldn’t save your signup. Please try again.')}
 if(!response.ok||result?.saved!==true)throw Error(response.status===429?'Please wait a little before trying again.':response.status===400?result.error||'Check your email and consent box.':'We couldn’t save your signup. Please try again.');
 return 'Your signup is saved. Thanks for joining Simply Squish!';
}
export function bindNewsletter(form){
 const status=form.querySelector('[role="status"]'),button=form.querySelector('button[type="submit"]');
 let busy=false;
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(busy||!form.reportValidity())return;
  busy=true;button.disabled=true;form.setAttribute('aria-busy','true');status.textContent='Saving your signup…';status.dataset.state='saving';
  try{
   status.textContent=await saveSignup({email:form.elements.email.value,consent:form.elements.consent.checked,sourcePath:location.pathname,website:form.elements.website.value});
   status.dataset.state='success';form.reset();
  }catch(error){status.textContent=error.message||'We couldn’t save your signup. Please try again.';status.dataset.state='error'}
  finally{busy=false;button.disabled=false;form.setAttribute('aria-busy','false')}
 });
}
if(typeof document!=='undefined')document.querySelectorAll('[data-newsletter]').forEach(bindNewsletter);
